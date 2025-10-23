// ===================================
// Video Generator Module
// Uses HTML5 Canvas and MediaRecorder API
// ===================================
const videoGenerator = {
    canvas: null,
    ctx: null,
    mediaRecorder: null,
    recordedChunks: [],
    
    // Available transition effects
    transitionTypes: ['crossfade', 'zoom', 'slide-left', 'slide-right', 'slide-up', 'slide-down', 'rotate', 'blur'],
    
    // ===================================
    // Main Generation Method
    // ===================================
    async generate({ images, quotes, duration, musicUrl, audioStream, audioContext, onProgress }) {
        return new Promise(async (resolve, reject) => {
            try {
                // 🖼️ Inicializa el canvas
                this.initCanvas();
                onProgress(25, 'Preparando canvas...');

                // 📸 Carga las imágenes
                onProgress(35, 'Cargando imágenes...');
                const loadedImages = await this.loadImages(images);

                onProgress(45, 'Configurando renderizado...');

                // 🎬 Cálculo de tiempo y frames
                const fps = 5; // menos FPS = más fluido y ligero para celular
                const totalFrames = Math.floor(duration * fps);
                const framesPerImage = Math.floor(totalFrames / images.length);

                // 🧩 Configurar MediaRecorder
                onProgress(55, 'Iniciando grabación...');
                const stream = this.canvas.captureStream(fps);
                let audioAdded = false;

                // 🎵 Intentar agregar música personalizada
                if (musicUrl && typeof musicUrl === 'string' && musicUrl.trim() !== '') {
                    try {
                        const customAudioStream = await this.loadAudio(musicUrl);
                        if (customAudioStream && customAudioStream.getAudioTracks().length > 0) {
                            stream.addTrack(customAudioStream.getAudioTracks()[0]);
                            audioAdded = true;
                            console.log('🎧 Música personalizada agregada');
                        }
                    } catch (err) {
                        console.warn('No se pudo agregar la música personalizada:', err);
                    }
                }

                // 🎶 Si no hay música personalizada, intenta usar la generada
                if (!audioAdded && audioStream) {
                    try {
                        const audioTracks = audioStream.getAudioTracks();
                        if (audioTracks.length > 0) {
                            stream.addTrack(audioTracks[0]);
                            audioAdded = true;
                            console.log('🎵 Música generada agregada');
                        }
                    } catch (err) {
                        console.warn('No se pudo agregar música generada:', err);
                    }
                }

                if (!audioAdded) console.log('⚠️ El video se generará sin audio');

                // 🎥 Configuración del MediaRecorder
                this.recordedChunks = [];
                const hasAudio = stream.getAudioTracks().length > 0;
                let mimeType = hasAudio ? 'video/webm;codecs=vp8,opus' : 'video/webm;codecs=vp8';
                if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/webm';

                this.mediaRecorder = new MediaRecorder(stream, {
                    mimeType,
                    videoBitsPerSecond: 1500000 // menor bitrate = más fluido en móvil
                });

                this.mediaRecorder.ondataavailable = (e) => {
                    if (e.data.size > 0) this.recordedChunks.push(e.data);
                };

                this.mediaRecorder.onstop = () => {
                    const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
                    console.log('✅ Video completado. Tamaño:', blob.size);
                    resolve(blob);
                };

                this.mediaRecorder.onerror = (err) => {
                    console.error('MediaRecorder error:', err);
                    reject(err);
                };

                // 🎬 Iniciar grabación
                this.mediaRecorder.start();
                await new Promise(r => setTimeout(r, 100));

                // 🖌️ Renderizar los frames
                onProgress(60, 'Renderizando video...');
                await this.renderFrames(loadedImages, quotes, framesPerImage, fps, onProgress);

                // ⏹️ Detener grabación tras terminar los frames
                onProgress(95, 'Finalizando video...');
                await new Promise(r => setTimeout(r, 500)); // deja respirar el último frame
                this.mediaRecorder.stop();

                onProgress(100, '¡Video completado!');
            } catch (error) {
                console.error('Error en generate():', error);
                reject(error);
            }
        });
    },
    
    // ===================================
    // Canvas Initialization
    // ===================================
    initCanvas() {
        this.canvas = document.getElementById('video-canvas');
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'video-canvas';
            this.canvas.style.display = 'none';
            document.body.appendChild(this.canvas);
        }
        
        // Set canvas size (16:9 aspect ratio)
        this.canvas.width = 1920;
        this.canvas.height = 1080;
        
        this.ctx = this.canvas.getContext('2d');
        
        // Set high-quality rendering
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
    },
    
    // ===================================
    // Image Loading
    // ===================================
    async loadImages(imagePaths) {
        const promises = imagePaths.map(path => this.loadImage(path));
        return Promise.all(promises);
    },
    
    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = () => {
                console.error(`Failed to load image: ${src}`);
                // Create a placeholder colored rectangle
                const placeholder = document.createElement('canvas');
                placeholder.width = 1920;
                placeholder.height = 1080;
                const ctx = placeholder.getContext('2d');
                
                // Gradient background
                const gradient = ctx.createLinearGradient(0, 0, 1920, 1080);
                gradient.addColorStop(0, '#9333ea');
                gradient.addColorStop(1, '#06b6d4');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, 1920, 1080);
                
                resolve(placeholder);
            };
            img.src = src;
        });
    },
    
    // ===================================
    // Audio Loading
    // ===================================
    async loadAudio(audioUrl) {
        try {
            const audio = new Audio(audioUrl);
            audio.volume = 0.7;
            
            // Create AudioContext and resume it (required for autoplay policies)
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Resume AudioContext if it's suspended (autoplay policy)
            if (audioContext.state === 'suspended') {
                await audioContext.resume();
            }
            
            // Create audio graph BEFORE calling play()
            const source = audioContext.createMediaElementSource(audio);
            const destination = audioContext.createMediaStreamDestination();
            source.connect(destination);
            source.connect(audioContext.destination);
            
            // Now try to play (handle autoplay rejection gracefully)
            try {
                await audio.play();
            } catch (playError) {
                console.warn('Autoplay blocked, video will be generated without audio:', playError);
                return null;
            }
            
            return destination.stream;
        } catch (error) {
            console.error('Error loading audio:', error);
            return null;
        }
    },
    
    // ===================================
    // Frame Rendering
    // ===================================
    async renderFrames(images, quotes, framesPerImage, fps, onProgress) {
        return new Promise(async (resolve) => {
            let currentFrame = 0;
            const totalFrames = framesPerImage * images.length;
            const frameDelay = 1000 / fps; // Tiempo real por frame
            const transitions = [];

            // Generar transiciones aleatorias
            for (let i = 0; i < images.length - 1; i++) {
                const randomIndex = Math.floor(Math.random() * this.transitionTypes.length);
                transitions.push(this.transitionTypes[randomIndex]);
            }

            // 🧠 Función que dibuja un solo frame
            const drawFrame = (currentFrame) => {
                const currentImageIndex = Math.floor(currentFrame / framesPerImage);
                const frameInCurrentImage = currentFrame % framesPerImage;

                const currentImage = images[currentImageIndex];
                const nextImage = images[Math.min(currentImageIndex + 1, images.length - 1)];
                const currentQuote = quotes[currentImageIndex % quotes.length];

                // Calcular transición
                const transitionDuration = Math.floor(framesPerImage * 0.3);
                const transitionStart = framesPerImage - transitionDuration;
                let transitionProgress = 0;

                if (frameInCurrentImage >= transitionStart && currentImageIndex < images.length - 1) {
                    transitionProgress = (frameInCurrentImage - transitionStart) / transitionDuration;
                }

                // Limpiar canvas
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

                // Dibujar imágenes con transición
                if (transitionProgress > 0 && currentImageIndex < images.length - 1) {
                    const transitionType = transitions[currentImageIndex];
                    this.applyTransition(currentImage, nextImage, transitionProgress, transitionType);
                } else {
                    this.drawImageCover(currentImage, 1);
                }

                // Gradiente y texto
                this.drawOverlay();
                const quoteProgress = Math.min(frameInCurrentImage / (fps * 1), 1); // fade-in suave
                this.drawQuote(currentQuote, quoteProgress);

                // Actualizar progreso
                const progressPercent = 60 + (currentFrame / totalFrames) * 35;
                onProgress(progressPercent, `Renderizando frame ${currentFrame + 1}/${totalFrames}...`);
            };

            // 🎬 Renderizar todos los frames de forma precisa
            for (let frame = 0; frame < totalFrames; frame++) {
                drawFrame(frame);
                await new Promise((r) => setTimeout(r, frameDelay)); // Espera exacta entre frames
            }

            // 🕒 Esperar 0.5 seg antes de finalizar para no cortar el último frame
            await new Promise((r) => setTimeout(r, 500));

            resolve();
        });
    },

    // ===================================
    // Drawing Methods
    // ===================================
    
    // Apply transition effect between two images
    applyTransition(currentImage, nextImage, progress, type) {
        switch(type) {
            case 'crossfade':
                this.drawImageCover(currentImage, 1 - progress);
                this.drawImageCover(nextImage, progress);
                break;
            
            case 'zoom':
                this.transitionZoom(currentImage, nextImage, progress);
                break;
            
            case 'slide-left':
                this.transitionSlide(currentImage, nextImage, progress, 'left');
                break;
            
            case 'slide-right':
                this.transitionSlide(currentImage, nextImage, progress, 'right');
                break;
            
            case 'slide-up':
                this.transitionSlide(currentImage, nextImage, progress, 'up');
                break;
            
            case 'slide-down':
                this.transitionSlide(currentImage, nextImage, progress, 'down');
                break;
            
            case 'rotate':
                this.transitionRotate(currentImage, nextImage, progress);
                break;
            
            case 'blur':
                this.transitionBlur(currentImage, nextImage, progress);
                break;
            
            default:
                this.drawImageCover(currentImage, 1 - progress);
                this.drawImageCover(nextImage, progress);
        }
    },
    
    // Zoom transition - zoom out current, zoom in next
    transitionZoom(currentImage, nextImage, progress) {
        const easeProgress = this.easeInOutCubic(progress);
        
        // Current image zooms out and fades
        this.ctx.save();
        this.ctx.globalAlpha = 1 - easeProgress;
        const currentScale = 1 + (easeProgress * 0.3); // Zoom out by 30%
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.scale(currentScale, currentScale);
        this.ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2);
        this.drawImageCover(currentImage, 1);
        this.ctx.restore();
        
        // Next image zooms in and fades in
        this.ctx.save();
        this.ctx.globalAlpha = easeProgress;
        const nextScale = 1.3 - (easeProgress * 0.3); // Zoom in from 130% to 100%
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.scale(nextScale, nextScale);
        this.ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2);
        this.drawImageCover(nextImage, 1);
        this.ctx.restore();
        
        this.ctx.globalAlpha = 1;
    },
    
    // Slide transition - slide in from specified direction
    transitionSlide(currentImage, nextImage, progress, direction) {
        const easeProgress = this.easeInOutCubic(progress);
        
        this.ctx.save();
        
        // Calculate offsets based on direction
        let currentOffsetX = 0, currentOffsetY = 0;
        let nextOffsetX = 0, nextOffsetY = 0;
        
        switch(direction) {
            case 'left':
                currentOffsetX = -this.canvas.width * easeProgress;
                nextOffsetX = this.canvas.width * (1 - easeProgress);
                break;
            case 'right':
                currentOffsetX = this.canvas.width * easeProgress;
                nextOffsetX = -this.canvas.width * (1 - easeProgress);
                break;
            case 'up':
                currentOffsetY = -this.canvas.height * easeProgress;
                nextOffsetY = this.canvas.height * (1 - easeProgress);
                break;
            case 'down':
                currentOffsetY = this.canvas.height * easeProgress;
                nextOffsetY = -this.canvas.height * (1 - easeProgress);
                break;
        }
        
        // Draw current image sliding out
        this.ctx.save();
        this.ctx.translate(currentOffsetX, currentOffsetY);
        this.drawImageCover(currentImage, 1);
        this.ctx.restore();
        
        // Draw next image sliding in
        this.ctx.save();
        this.ctx.translate(nextOffsetX, nextOffsetY);
        this.drawImageCover(nextImage, 1);
        this.ctx.restore();
        
        this.ctx.restore();
    },
    
    // Rotate transition - subtle rotation while fading
    transitionRotate(currentImage, nextImage, progress) {
        const easeProgress = this.easeInOutCubic(progress);
        
        // Current image rotates slightly and fades out
        this.ctx.save();
        this.ctx.globalAlpha = 1 - easeProgress;
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.rotate((easeProgress * Math.PI) / 12); // Rotate up to 15 degrees
        this.ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2);
        this.drawImageCover(currentImage, 1);
        this.ctx.restore();
        
        // Next image rotates in from opposite direction
        this.ctx.save();
        this.ctx.globalAlpha = easeProgress;
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.rotate(((1 - easeProgress) * -Math.PI) / 12); // Counter rotation
        this.ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2);
        this.drawImageCover(nextImage, 1);
        this.ctx.restore();
        
        this.ctx.globalAlpha = 1;
    },
    
    // Blur transition - fade through blur
    transitionBlur(currentImage, nextImage, progress) {
        const easeProgress = this.easeInOutCubic(progress);
        
        // Blur amount peaks at 50% progress
        const blurAmount = Math.sin(easeProgress * Math.PI) * 10;
        
        // Current image fades out
        this.ctx.save();
        this.ctx.globalAlpha = 1 - easeProgress;
        if (blurAmount > 0 && easeProgress < 0.5) {
            this.ctx.filter = `blur(${blurAmount}px)`;
        }
        this.drawImageCover(currentImage, 1);
        this.ctx.restore();
        
        // Next image fades in
        this.ctx.save();
        this.ctx.globalAlpha = easeProgress;
        if (blurAmount > 0 && easeProgress >= 0.5) {
            this.ctx.filter = `blur(${blurAmount}px)`;
        }
        this.drawImageCover(nextImage, 1);
        this.ctx.restore();
        
        this.ctx.filter = 'none';
        this.ctx.globalAlpha = 1;
    },
    
    // Easing function for smooth transitions
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    },
    
    drawImageCover(image, opacity = 1) {
        const canvasRatio = this.canvas.width / this.canvas.height;
        const imageRatio = image.width / image.height;
        
        let drawWidth, drawHeight, offsetX, offsetY;
        
        if (imageRatio > canvasRatio) {
            // Image is wider than canvas
            drawHeight = this.canvas.height;
            drawWidth = image.width * (drawHeight / image.height);
            offsetX = (this.canvas.width - drawWidth) / 2;
            offsetY = 0;
        } else {
            // Image is taller than canvas
            drawWidth = this.canvas.width;
            drawHeight = image.height * (drawWidth / image.width);
            offsetX = 0;
            offsetY = (this.canvas.height - drawHeight) / 2;
        }
        
        // Apply opacity
        this.ctx.globalAlpha = opacity;
        
        // Add subtle Ken Burns effect (zoom)
        const scale = 1 + (opacity * 0.05); // Slight zoom based on opacity
        const scaledWidth = drawWidth * scale;
        const scaledHeight = drawHeight * scale;
        const scaledOffsetX = offsetX - (scaledWidth - drawWidth) / 2;
        const scaledOffsetY = offsetY - (scaledHeight - drawHeight) / 2;
        
        this.ctx.drawImage(image, scaledOffsetX, scaledOffsetY, scaledWidth, scaledHeight);
        
        // Reset opacity
        this.ctx.globalAlpha = 1;
    },
    
    drawOverlay() {
        // Dark gradient overlay for text readability
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    },
    
    drawQuote(text, progress = 1) {
        if (progress <= 0) return;
        
        // Apply fade-in animation
        this.ctx.globalAlpha = progress;
        
        // Configure text style
        this.ctx.font = 'italic 600 80px "Playfair Display", serif';
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        this.ctx.shadowBlur = 20;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 4;
        
        // Word wrap
        const maxWidth = this.canvas.width * 0.8;
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];
        
        for (let i = 1; i < words.length; i++) {
            const testLine = currentLine + ' ' + words[i];
            const metrics = this.ctx.measureText(testLine);
            
            if (metrics.width > maxWidth) {
                lines.push(currentLine);
                currentLine = words[i];
            } else {
                currentLine = testLine;
            }
        }
        lines.push(currentLine);
        
        // Draw lines
        const lineHeight = 100;
        const startY = (this.canvas.height / 2) - ((lines.length - 1) * lineHeight / 2);
        
        lines.forEach((line, index) => {
            const y = startY + (index * lineHeight);
            
            // Apply slide-up animation
            const slideOffset = (1 - progress) * 50;
            this.ctx.fillText(line, this.canvas.width / 2, y + slideOffset);
        });
        
        // Reset shadow and alpha
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.globalAlpha = 1;
    }
};

// Make videoGenerator globally available
window.videoGenerator = videoGenerator;
