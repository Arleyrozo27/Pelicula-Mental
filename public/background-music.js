// ===================================
// Background Music Module
// Plays relaxing ambient music throughout the application
// ===================================
const backgroundMusic = {
    audio: null,
    audioContext: null,
    gainNode: null,
    isPlaying: false,
    currentVolume: 0.3,
    
    // Initialize background music
    async init() {
        // Get saved settings from localStorage
        const savedVolume = localStorage.getItem('bgMusicVolume');
        const savedMuted = localStorage.getItem('bgMusicMuted');
        
        if (savedVolume !== null) {
            this.currentVolume = parseFloat(savedVolume);
        }
        
        const isMuted = savedMuted === 'true';
        
        // Setup UI
        this.setupUI();
        
        // Start music if not muted
        if (!isMuted) {
            await this.start();
        }
    },
    
    // Setup volume control UI
    setupUI() {
        const volumeBtn = document.getElementById('volume-btn');
        const volumeSlider = document.getElementById('volume-slider');
        const volumeSliderContainer = document.getElementById('volume-slider-container');
        const volumeIcon = document.getElementById('volume-icon');
        
        if (!volumeBtn || !volumeSlider) {
            console.warn('Volume controls not found in DOM');
            return;
        }
        
        // Set initial values
        volumeSlider.value = this.currentVolume * 100;
        this.updateIcon();
        
        // Toggle volume slider
        volumeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            volumeSliderContainer.classList.toggle('active');
        });
        
        // Volume slider change
        volumeSlider.addEventListener('input', (e) => {
            const volume = parseFloat(e.target.value) / 100;
            this.setVolume(volume);
        });
        
        // Close slider when clicking outside
        document.addEventListener('click', (e) => {
            if (!volumeSliderContainer.contains(e.target) && !volumeBtn.contains(e.target)) {
                volumeSliderContainer.classList.remove('active');
            }
        });
    },
    
    // Start background music
    async start() {
        if (this.isPlaying) return;
        
        try {
            console.log('Starting background music...');
            
            // Use audio generator to create peaceful ambient music
            const audioData = await window.audioGenerator.generate('peaceful', 60);
            
            // Create audio element
            this.audioContext = audioData.context;
            this.audio = new Audio();
            
            // Create gain node for volume control
            const source = this.audioContext.createMediaElementSource(this.audio);
            this.gainNode = this.audioContext.createGain();
            this.gainNode.gain.value = this.currentVolume;
            
            // Connect audio graph
            source.connect(this.gainNode);
            this.gainNode.connect(this.audioContext.destination);
            
            // Set audio stream
            this.audio.srcObject = audioData.stream;
            this.audio.loop = true; // Will restart after 60 seconds
            
            // Handle audio ending (regenerate for continuous playback)
            this.audio.addEventListener('ended', async () => {
                if (this.isPlaying) {
                    console.log('Background music ended, restarting...');
                    await this.start();
                }
            });
            
            // Play audio
            await this.audio.play();
            this.isPlaying = true;
            
            this.updateIcon();
            localStorage.setItem('bgMusicMuted', 'false');
            
            console.log('Background music started successfully');
            
        } catch (error) {
            console.error('Error starting background music:', error);
            // If autoplay is blocked, show a subtle notification
            if (error.name === 'NotAllowedError') {
                console.log('Autoplay blocked - user interaction required');
                // User can manually start by clicking the volume button
            }
        }
    },
    
    // Stop background music
    stop() {
        if (!this.isPlaying) return;
        
        console.log('Stopping background music...');
        
        if (this.audio) {
            this.audio.pause();
            this.audio.srcObject = null;
            this.audio = null;
        }
        
        if (this.audioContext) {
            // Don't close context, just disconnect
            this.audioContext = null;
        }
        
        this.isPlaying = false;
        this.updateIcon();
        localStorage.setItem('bgMusicMuted', 'true');
        
        console.log('Background music stopped');
    },
    
    // Set volume
    setVolume(volume) {
        this.currentVolume = Math.max(0, Math.min(1, volume));
        
        if (this.gainNode) {
            this.gainNode.gain.value = this.currentVolume;
        }
        
        // Update slider
        const slider = document.getElementById('volume-slider');
        if (slider) {
            slider.value = this.currentVolume * 100;
        }
        
        this.updateIcon();
        localStorage.setItem('bgMusicVolume', this.currentVolume.toString());
        
        // If volume is set to 0, stop the music
        if (this.currentVolume === 0 && this.isPlaying) {
            this.stop();
        }
        // If volume is increased from 0, start the music
        else if (this.currentVolume > 0 && !this.isPlaying) {
            this.start();
        }
    },
    
    // Update volume icon based on state
    updateIcon() {
        const volumeIcon = document.getElementById('volume-icon');
        if (!volumeIcon) return;
        
        const iconName = volumeIcon.getAttribute('data-lucide');
        let newIcon = 'volume-2';
        
        if (!this.isPlaying || this.currentVolume === 0) {
            newIcon = 'volume-x';
        } else if (this.currentVolume < 0.3) {
            newIcon = 'volume';
        } else if (this.currentVolume < 0.7) {
            newIcon = 'volume-1';
        } else {
            newIcon = 'volume-2';
        }
        
        if (iconName !== newIcon) {
            volumeIcon.setAttribute('data-lucide', newIcon);
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }
};

// Make available globally
window.backgroundMusic = backgroundMusic;
