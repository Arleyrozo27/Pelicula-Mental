// ===================================
// Application State Management
// ===================================
const app = {
    state: {
        currentSection: window.location.pathname.includes('app.html') ? 'dream-selection' : 'hero-section',
        selectedDreams: [], // Array of selected dream categories
        customDream: '',
        selectedDuration: 30,
        selectedMusic: null,
        customMusicFile: null,
        customMusicUrl: null,
        isGenerating: false,
        generatedVideoBlob: null,
        audioContext: null,
        currentAudioSource: null,
        videoElement: null,
        emojiInterval: null,
        globalEmojiInterval: null,
        globalEmojiTimeouts: [], // Track timeouts for proper cleanup
        customPhrases: null, // Array of 5 custom phrases or null for defaults
    },
    
    // Image paths for each dream category
    dreamImages: {
        career: [
            '/attached_assets/generated_images/Career_start_office_lobby_fd70d175.png',
            '/attached_assets/generated_images/Career_focused_work_desk_e0f7c362.png',
            '/attached_assets/generated_images/Career_team_collaboration_meeting_5ea08abb.png',
            '/attached_assets/generated_images/Career_leadership_presentation_stage_f938acce.png',
            '/attached_assets/generated_images/Career_success_city_skyline_3fe510f4.png'
        ],
        travel: [
            '/attached_assets/generated_images/Travel_airport_departure_beginning_382c455b.png',
            '/attached_assets/generated_images/Travel_scenic_train_mountains_e7e0cd35.png',
            '/attached_assets/generated_images/Travel_tropical_beach_sunset_97304732.png',
            '/attached_assets/generated_images/Travel_mountain_summit_achievement_774a30d0.png',
            '/attached_assets/generated_images/Travel_world_map_memories_9b21d4b8.png'
        ],
        health: [
            '/attached_assets/generated_images/Health_fitness_journey_beginning_c50f00af.png',
            '/attached_assets/generated_images/Health_running_park_sunrise_4a074398.png',
            '/attached_assets/generated_images/Health_nutrition_meal_prep_8932a1e8.png',
            '/attached_assets/generated_images/Health_yoga_mountain_peace_901b0b4e.png',
            '/attached_assets/generated_images/Health_fitness_achievement_celebration_50319e15.png'
        ],
        family: [
            '/attached_assets/generated_images/Family_picnic_preparation_together_754922fa.png',
            '/attached_assets/generated_images/Family_park_walk_autumn_6a6130cb.png',
            '/attached_assets/generated_images/Family_dinner_table_gathering_cc47c428.png',
            '/attached_assets/generated_images/Family_celebration_multi-generation_reunion_6576f59a.png',
            '/attached_assets/generated_images/Family_beach_sunset_silhouette_57d5cc79.png'
        ],
        education: [
            '/attached_assets/generated_images/Education_library_student_beginning_04718a82.png',
            '/attached_assets/generated_images/Education_focused_study_session_2b3897e9.png',
            '/attached_assets/generated_images/Education_classroom_collaboration_project_d2db5f6a.png',
            '/attached_assets/generated_images/Education_graduation_achievement_diploma_f9a4b53a.png',
            '/attached_assets/generated_images/Education_mentoring_sharing_knowledge_6c719d44.png'
        ],
        entrepreneurship: [
            '/attached_assets/generated_images/Entrepreneurship_home_office_startup_30aca9a0.png',
            '/attached_assets/generated_images/Entrepreneurship_team_brainstorming_coworking_1dabd714.png',
            '/attached_assets/generated_images/Entrepreneurship_investor_pitch_presentation_8a5b8111.png',
            '/attached_assets/generated_images/Entrepreneurship_growing_startup_office_65a8e314.png',
            '/attached_assets/generated_images/Entrepreneurship_success_milestone_celebration_709f7a20.png'
        ],
        love: [
            '/attached_assets/generated_images/First_coffee_date_romantic_5b88115d.png',
            '/attached_assets/generated_images/Couple_walking_park_sunset_6a2b603f.png',
            '/attached_assets/generated_images/Couple_cooking_together_kitchen_e90a6b97.png',
            '/attached_assets/generated_images/Beach_proposal_sunset_romantic_3a4c5060.png',
            '/attached_assets/generated_images/Wedding_celebration_happy_couple_72ad4d76.png'
        ],
        finance: [
            '/attached_assets/generated_images/First_job_professional_desk_b829e699.png',
            '/attached_assets/generated_images/Investment_planning_financial_charts_c0a4bdb9.png',
            '/attached_assets/generated_images/Signing_business_deal_documents_5689ac48.png',
            '/attached_assets/generated_images/New_homeowner_house_keys_11c5a733.png',
            '/attached_assets/generated_images/Luxury_penthouse_success_achieved_e43344ab.png'
        ],
        creativity: [
            '/attached_assets/generated_images/Artist_sketching_creative_beginning_ff3fec42.png',
            '/attached_assets/generated_images/Artist_painting_studio_canvas_8a2d7c53.png',
            '/attached_assets/generated_images/Artist_portfolio_gallery_presentation_a5f2d8f7.png',
            '/attached_assets/generated_images/Art_exhibition_opening_night_9900b749.png',
            '/attached_assets/generated_images/Master_artist_studio_success_a00e446e.png'
        ]
    },
    
    // Motivational quotes for each category
    quotes: {
        career: [
            'Tu futuro se crea con lo que haces hoy',
            'El éxito es la suma de pequeños esfuerzos',
            'Cree en ti mismo y todo será posible',
            'Tu carrera es tu obra maestra',
            'Cada día es una nueva oportunidad'
        ],
        travel: [
            'El mundo es un libro esperando ser leído',
            'Viajar es descubrir quién realmente eres',
            'La aventura te espera',
            'Colecciona momentos, no cosas',
            'El viaje de mil millas comienza con un paso'
        ],
        health: [
            'Tu salud es tu mayor riqueza',
            'Un cuerpo fuerte alberga una mente fuerte',
            'Cada paso cuenta hacia tu bienestar',
            'Tú eres tu mejor inversión',
            'La transformación comienza hoy'
        ],
        family: [
            'La familia es donde comienza la vida',
            'Los mejores momentos se viven juntos',
            'El amor familiar es eterno',
            'Juntos somos más fuertes',
            'La familia es el tesoro más grande'
        ],
        education: [
            'El conocimiento es poder',
            'Nunca dejes de aprender',
            'La educación abre todas las puertas',
            'Invierte en tu mente',
            'El aprendizaje es un viaje, no un destino'
        ],
        entrepreneurship: [
            'Tu idea puede cambiar el mundo',
            'Los sueños no funcionan sin acción',
            'Crea el futuro que imaginas',
            'El único límite es tu imaginación',
            'Emprende con pasión y propósito'
        ],
        love: [
            'El amor verdadero comienza contigo',
            'Las mejores relaciones se construyen día a día',
            'Mereces un amor que te haga brillar',
            'El amor es la fuerza más poderosa',
            'Juntos son imparables'
        ],
        finance: [
            'Tu libertad financiera está al alcance',
            'Invierte en ti mismo primero',
            'La riqueza comienza con una decisión',
            'El dinero es una herramienta para tus sueños',
            'Abundancia y prosperidad te esperan'
        ],
        creativity: [
            'Tu creatividad no tiene límites',
            'El arte es tu voz única en el mundo',
            'Crea sin miedo, expresa sin límites',
            'Tu talento merece ser compartido',
            'La creatividad es tu superpoder'
        ],
        general: [
            'Visualiza tu éxito',
            'Tus sueños son válidos',
            'Manifiesta tu realidad',
            'El poder está dentro de ti',
            'Haz que suceda'
        ]
    },
    
    // Emojis for each category (for rain animation)
    categoryEmojis: {
        career: ['💼', '👔', '📊', '💻', '🎯', '📈', '🏆', '⭐', '💪', '🚀'],
        travel: ['✈️', '🌍', '🗺️', '🏝️', '🏔️', '🌄', '🎒', '📸', '🌟', '🧳'],
        health: ['💪', '🏃', '🧘', '🥗', '💚', '⚡', '🌟', '💖', '🏋️', '🌿'],
        family: ['❤️', '👨‍👩‍👧‍👦', '🏡', '💕', '🌟', '🎉', '😊', '🤗', '💖', '👶'],
        education: ['📚', '🎓', '✏️', '📖', '🧠', '💡', '🌟', '📝', '🎯', '🔬'],
        entrepreneurship: ['💡', '🚀', '💰', '📊', '💼', '🎯', '⚡', '🌟', '💻', '📈'],
        love: ['💕', '❤️', '💖', '💗', '💝', '🌹', '💑', '😍', '💘', '✨'],
        finance: ['💰', '💵', '💎', '📈', '🏦', '💳', '🏠', '💸', '⭐', '🌟'],
        creativity: ['🎨', '✨', '🖌️', '🎭', '🖼️', '🌈', '💫', '🎪', '🎬', '🎵'],
        general: ['✨', '⭐', '💫', '🌟', '💖', '🎯', '🚀', '💪', '🌈', '🎉']
    },
    
    categoryMessages: {
        career: {
            title: '💼 Tu Carrera Profesional 💼',
            subtitle: 'Visualiza el éxito que mereces alcanzar'
        },
        travel: {
            title: '✈️ Tu Viaje Soñado ✈️',
            subtitle: 'El mundo espera para ser descubierto'
        },
        health: {
            title: '💪 Tu Transformación 💪',
            subtitle: 'Un cuerpo y mente saludables'
        },
        family: {
            title: '❤️ Tu Familia ❤️',
            subtitle: 'Los momentos que más importan'
        },
        education: {
            title: '🎓 Tu Educación 🎓',
            subtitle: 'El conocimiento es tu poder'
        },
        entrepreneurship: {
            title: '🚀 Tu Emprendimiento 🚀',
            subtitle: 'Construye el negocio de tus sueños'
        },
        love: {
            title: '💕 Tu Amor Verdadero 💕',
            subtitle: 'El amor que mereces encontrar'
        },
        finance: {
            title: '💰 Tu Libertad Financiera 💰',
            subtitle: 'La abundancia está a tu alcance'
        },
        creativity: {
            title: '🎨 Tu Arte y Creatividad 🎨',
            subtitle: 'Expresa tu talento único'
        },
        general: {
            title: '✨ Tu Sueño Personalizado ✨',
            subtitle: 'Manifiesta tu realidad'
        }
    },
    
    // ===================================
    // Initialization
    // ===================================
    init() {
        this.setupEventListeners();
        this.updateUI();
        this.checkBrowserCompatibility();
        console.log('App initialized');
    },
    
    checkBrowserCompatibility() {
        // Check MediaRecorder support
        if (!window.MediaRecorder) {
            this.showCompatibilityWarning('Tu navegador no soporta la grabación de video. Por favor usa Chrome, Firefox o Edge para la mejor experiencia.');
            return;
        }
        
        // Check for VP8/WebM support
        const types = [
            'video/webm;codecs=vp8,opus',
            'video/webm;codecs=vp8',
            'video/webm'
        ];
        
        const supported = types.some(type => MediaRecorder.isTypeSupported(type));
        
        if (!supported) {
            this.showCompatibilityWarning('Tu navegador tiene soporte limitado para grabación de video. La generación de video podría no funcionar correctamente. Recomendamos usar Chrome o Firefox.');
        }
    },
    
    showCompatibilityWarning(message) {
        // Create a warning banner
        const banner = document.createElement('div');
        banner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
            color: white;
            padding: 1rem;
            text-align: center;
            z-index: 10000;
            font-family: var(--font-body);
            font-size: 0.875rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;
        banner.textContent = `⚠️ ${message}`;
        document.body.insertBefore(banner, document.body.firstChild);
        
        console.warn('Browser compatibility:', message);
    },
    
    setupEventListeners() {
        // Custom dream textarea
        const customDreamText = document.getElementById('custom-dream-text');
        if (customDreamText) {
            customDreamText.addEventListener('input', (e) => {
                this.state.customDream = e.target.value;
                const charCount = document.getElementById('char-count');
                if (charCount) {
                    charCount.textContent = e.target.value.length;
                }
                this.updateNavigationButtons();
                
                // Start emoji rain if user writes at least 5 characters
                if (e.target.value.trim().length >= 5 && !this.state.globalEmojiInterval) {
                    this.startGlobalEmojiRain();
                }
            });
        }
        
        // Video element events
        const videoElement = document.getElementById('generated-video');
        if (videoElement) {
            this.state.videoElement = videoElement;
            
            videoElement.addEventListener('timeupdate', () => {
                this.updateVideoTimeline();
            });
            
            videoElement.addEventListener('play', () => {
                this.updatePlayPauseIcon(true);
            });
            
            videoElement.addEventListener('pause', () => {
                this.updatePlayPauseIcon(false);
            });
            
            videoElement.addEventListener('ended', () => {
                this.updatePlayPauseIcon(false);
            });
        }
        
        // Video timeline
        const timeline = document.getElementById('video-timeline');
        if (timeline) {
            timeline.addEventListener('input', (e) => {
                if (videoElement) {
                    const time = (e.target.value / 100) * videoElement.duration;
                    videoElement.currentTime = time;
                }
            });
        }
    },
    
    // ===================================
    // Navigation
    // ===================================
    navigateToSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            this.state.currentSection = sectionId;
            
            // If navigating to dream animation, start emoji rain
            if (sectionId === 'dream-animation') {
                this.startEmojiRain();
                this.updateAnimationMessages();
            }
            
            // If navigating to gallery, load videos
            if (sectionId === 'gallery') {
                this.loadGallery();
            }
            
            // Reinitialize icons after section change
            setTimeout(() => {
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }, 100);
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    },
    
    // ===================================
    // Dream Selection
    // ===================================
    selectDream(category) {
        const selectedCard = document.querySelector(`[data-category="${category}"]`);
        if (!selectedCard) return;
        
        // Toggle selection
        const index = this.state.selectedDreams.indexOf(category);
        if (index > -1) {
            // Remove from selection
            this.state.selectedDreams.splice(index, 1);
            selectedCard.classList.remove('selected');
        } else {
            // Add to selection
            this.state.selectedDreams.push(category);
            selectedCard.classList.add('selected');
        }
        
        // Clear custom dream text if categories are selected
        if (this.state.selectedDreams.length > 0) {
            const customDreamText = document.getElementById('custom-dream-text');
            if (customDreamText) {
                customDreamText.value = '';
                this.state.customDream = '';
                document.getElementById('char-count').textContent = '0';
            }
        }
        
        this.updateNavigationButtons();
        
        // Start or update emoji rain with selected categories
        if (this.state.selectedDreams.length > 0) {
            this.startGlobalEmojiRain();
        } else {
            this.stopGlobalEmojiRain();
        }
    },
    
    updateNavigationButtons() {
        const nextBtn = document.getElementById('next-to-animation');
        if (nextBtn) {
            // Enable button if either dream categories are selected or custom dream is entered
            const hasSelection = this.state.selectedDreams.length > 0 || this.state.customDream.trim().length > 0;
            nextBtn.disabled = !hasSelection;
        }
    },
    
    // ===================================
    // Emoji Rain Animation
    // ===================================
    startGlobalEmojiRain() {
        console.log('startGlobalEmojiRain called');
        
        // Clear any existing rain first
        this.stopGlobalEmojiRain();
        
        const container = document.getElementById('emoji-rain-global');
        
        if (!container) {
            console.error('emoji-rain-global container not found');
            return;
        }
        
        // Combine emojis from all selected categories
        let combinedEmojis = [];
        if (this.state.selectedDreams.length > 0) {
            this.state.selectedDreams.forEach(category => {
                const categoryEmojis = this.categoryEmojis[category] || [];
                combinedEmojis = combinedEmojis.concat(categoryEmojis);
            });
        } else {
            // Use general emojis if custom dream
            combinedEmojis = this.categoryEmojis.general;
        }
        
        console.log('Creating global emoji rain for categories:', this.state.selectedDreams, 'with', combinedEmojis.length, 'emojis');
        
        // Initialize timeout tracking arrays
        this.state.globalEmojiTimeouts = [];
        
        // Create emojis continuously
        const createEmoji = () => {
            if (combinedEmojis.length === 0) return;
            if (!this.state.globalEmojiInterval) return; // Stop if interval was cleared
            
            const emoji = document.createElement('div');
            emoji.className = 'emoji';
            emoji.textContent = combinedEmojis[Math.floor(Math.random() * combinedEmojis.length)];
            
            // Random horizontal position
            emoji.style.left = Math.random() * 100 + '%';
            
            // Random animation duration (slower = 3-6 seconds)
            const duration = 3 + Math.random() * 3;
            emoji.style.animationDuration = duration + 's';
            
            // Random delay
            emoji.style.animationDelay = Math.random() * 0.5 + 's';
            
            container.appendChild(emoji);
            
            // Remove emoji after animation completes and track timeout
            const timeoutId = setTimeout(() => {
                if (emoji.parentNode) {
                    emoji.remove();
                }
            }, (duration + 0.5) * 1000);
            
            if (this.state.globalEmojiTimeouts) {
                this.state.globalEmojiTimeouts.push(timeoutId);
            }
        };
        
        // Create initial batch of emojis
        for (let i = 0; i < 15; i++) {
            const timeoutId = setTimeout(createEmoji, i * 200);
            this.state.globalEmojiTimeouts.push(timeoutId);
        }
        
        // Continue creating emojis indefinitely
        this.state.globalEmojiInterval = setInterval(createEmoji, 400);
    },
    
    stopGlobalEmojiRain() {
        // Clear the interval
        if (this.state.globalEmojiInterval) {
            clearInterval(this.state.globalEmojiInterval);
            this.state.globalEmojiInterval = null;
        }
        
        // Clear all pending timeouts
        if (this.state.globalEmojiTimeouts) {
            this.state.globalEmojiTimeouts.forEach(timeoutId => {
                clearTimeout(timeoutId);
            });
            this.state.globalEmojiTimeouts = [];
        }
        
        // Clear the container
        const container = document.getElementById('emoji-rain-global');
        if (container) {
            container.innerHTML = '';
        }
    },
    
    startEmojiRain() {
        console.log('startEmojiRain called');
        
        // Use setTimeout to ensure DOM is ready
        setTimeout(() => {
            const container = document.getElementById('emoji-rain');
            console.log('emoji container found:', !!container);
            
            if (!container) {
                console.error('emoji-rain container not found');
                return;
            }
            
            // Clear any existing emojis and interval
            container.innerHTML = '';
            if (this.state.emojiInterval) {
                clearInterval(this.state.emojiInterval);
            }
            
            // Combine emojis from all selected categories
            let combinedEmojis = [];
            if (this.state.selectedDreams.length > 0) {
                this.state.selectedDreams.forEach(category => {
                    const categoryEmojis = this.categoryEmojis[category] || [];
                    combinedEmojis = combinedEmojis.concat(categoryEmojis);
                });
            } else {
                combinedEmojis = this.categoryEmojis.general;
            }
            console.log('Creating emoji rain for categories:', this.state.selectedDreams, 'with', combinedEmojis.length, 'emojis');
            
            // Create emojis continuously
            const createEmoji = () => {
                if (combinedEmojis.length === 0) return;
                
                const emoji = document.createElement('div');
                emoji.className = 'emoji';
                emoji.textContent = combinedEmojis[Math.floor(Math.random() * combinedEmojis.length)];
                
                // Random horizontal position
                emoji.style.left = Math.random() * 100 + '%';
                
                // Random animation duration (slower = 3-6 seconds)
                const duration = 3 + Math.random() * 3;
                emoji.style.animationDuration = duration + 's';
                
                // Random delay
                emoji.style.animationDelay = Math.random() * 0.5 + 's';
                
                container.appendChild(emoji);
                
                // Remove emoji after animation completes
                setTimeout(() => {
                    if (emoji.parentNode) {
                        emoji.remove();
                    }
                }, (duration + 0.5) * 1000);
            };
            
            // Create initial batch of emojis
            for (let i = 0; i < 15; i++) {
                setTimeout(createEmoji, i * 200);
            }
            
            // Continue creating emojis
            this.state.emojiInterval = setInterval(createEmoji, 400);
            
            // Stop after 10 seconds (user should continue by then)
            setTimeout(() => {
                if (this.state.emojiInterval) {
                    clearInterval(this.state.emojiInterval);
                    this.state.emojiInterval = null;
                }
            }, 10000);
        }, 200);
    },
    
    updateAnimationMessages() {
        // Use first selected category or general
        const category = this.state.selectedDreams[0] || 'general';
        const messages = this.categoryMessages[category] || this.categoryMessages.general;
        
        const titleEl = document.getElementById('animation-title');
        const subtitleEl = document.getElementById('animation-subtitle');
        
        if (titleEl) titleEl.textContent = messages.title;
        if (subtitleEl) subtitleEl.textContent = messages.subtitle;
    },
    
    // ===================================
    // Configuration
    // ===================================
    selectDuration(seconds) {
        this.state.selectedDuration = seconds;
        
        // Update UI
        document.querySelectorAll('.duration-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const selectedBtn = document.querySelector(`[data-duration="${seconds}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('active');
        }
    },
    
    selectMusic(musicType) {
        // Stop any currently playing preview
        this.stopAudioPreview();
        
        this.state.selectedMusic = musicType;
        this.state.customMusicFile = null;
        this.state.customMusicUrl = null;
        
        // Update UI
        document.querySelectorAll('.music-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        const selectedOption = document.querySelector(`[data-music="${musicType}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }
        
        // Clear custom music display
        const customMusicName = document.getElementById('custom-music-name');
        if (customMusicName) {
            customMusicName.textContent = '';
        }
    },
    
    async previewMusic(musicType) {
        console.log(`Previewing music: ${musicType}`);
        
        // Stop any current preview
        this.stopAudioPreview();
        
        try {
            // Generate 5 seconds of preview audio
            const audioData = await window.audioGenerator.generate(musicType, 5);
            
            // Create audio element for preview
            const audio = new Audio();
            const mediaSource = audioData.context.createMediaElementSource(audio);
            audio.srcObject = audioData.stream;
            
            // Store reference to stop later
            this.state.currentAudioPreview = audio;
            this.state.currentAudioContext = audioData.context;
            
            // Play preview
            await audio.play();
            
            // Auto-stop after 5 seconds
            setTimeout(() => {
                this.stopAudioPreview();
            }, 5000);
            
        } catch (error) {
            console.error('Error previewing music:', error);
            notifications.error('No se pudo reproducir la vista previa de la música.');
        }
    },
    
    stopAudioPreview() {
        if (this.state.currentAudioPreview) {
            try {
                this.state.currentAudioPreview.pause();
                this.state.currentAudioPreview.srcObject = null;
            } catch (e) {
                console.log('Audio preview already stopped');
            }
            this.state.currentAudioPreview = null;
        }
        
        if (window.audioGenerator) {
            window.audioGenerator.stop();
        }
    },
    
    handleCustomMusic(event) {
        const file = event.target.files[0];
        if (file) {
            this.state.customMusicFile = file;
            this.state.customMusicUrl = URL.createObjectURL(file);
            this.state.selectedMusic = 'custom';
            
            // Clear pre-selected music
            document.querySelectorAll('.music-option').forEach(option => {
                option.classList.remove('selected');
            });
            
            // Display file name
            const customMusicName = document.getElementById('custom-music-name');
            if (customMusicName) {
                customMusicName.textContent = `🎵 ${file.name}`;
            }
        }
    },
    
    // ===================================
    // Video Generation
    // ===================================
    async generateVideo() {
        if (this.state.isGenerating) return;
        
        // Validate configuration
        if (this.state.selectedDreams.length === 0 && !this.state.customDream) {
            notifications.warning('Por favor selecciona uno o más sueños o describe tu meta personalizada.');
            return;
        }
        
        if (!this.state.selectedMusic) {
            notifications.warning('Por favor selecciona una música de fondo.');
            return;
        }
        
        this.state.isGenerating = true;
        
        // Navigate to generation section
        this.navigateToSection('video-generation');
        
        // Show generation status
        document.getElementById('generation-status').style.display = 'block';
        document.getElementById('video-player-container').style.display = 'none';
        
        // Start motivational phrases rotation
        this.startMotivationalPhrases();
        
        try {
            // Combine images from all selected categories
            let combinedImages = [];
            if (this.state.selectedDreams.length > 0) {
                this.state.selectedDreams.forEach(category => {
                    const categoryImages = this.dreamImages[category] || [];
                    combinedImages = combinedImages.concat(categoryImages);
                });
                // Shuffle combined images for variety
                combinedImages = combinedImages.sort(() => Math.random() - 0.5);
                // Limit to 5 images per video for consistency
                combinedImages = combinedImages.slice(0, 5);
            } else {
                combinedImages = this.dreamImages.career;
            }
            const images = combinedImages;
            
            // Use custom phrases if available, otherwise use category defaults  
            const firstCategory = this.state.selectedDreams[0] || 'general';
            let quotes = this.quotes[firstCategory] || this.quotes.general;
            if (this.state.customPhrases && this.state.customPhrases.some(p => p.trim())) {
                // Use custom phrases, filling empty ones with defaults
                quotes = this.state.customPhrases.map((phrase, index) => {
                    return phrase.trim() || quotes[index] || 'Tus sueños se hacen realidad';
                });
            }
            
            const duration = this.state.selectedDuration;
            
            // Prepare audio
            let audioStream = null;
            let audioContext = null;
            
            // If custom music file is provided, use it
            if (this.state.customMusicUrl) {
                // Custom music will be loaded by video generator
                audioStream = null;
            } 
            // If predefined music is selected, generate it
            else if (this.state.selectedMusic) {
                this.updateGenerationProgress(15, 'Generando música...');
                const audioData = await window.audioGenerator.generate(
                    this.state.selectedMusic, 
                    duration
                );
                audioStream = audioData.stream;
                audioContext = audioData.context;
            }
            
            // Update progress
            this.updateGenerationProgress(20, 'Cargando imágenes...');
            
            // Generate video using VideoGenerator
            const videoBlob = await window.videoGenerator.generate({
                images,
                quotes,
                duration,
                musicUrl: this.state.customMusicUrl,
                audioStream: audioStream,
                audioContext: audioContext,
                onProgress: (progress, message) => {
                    this.updateGenerationProgress(progress, message);
                }
            });
            
            this.state.generatedVideoBlob = videoBlob;
            
            // Display video
            this.displayGeneratedVideo(videoBlob);
            
        } catch (error) {
            console.error('Error generating video:', error);
            notifications.error('Hubo un error al generar tu video. Por favor intenta nuevamente.');
            // Stop motivational phrases on error
            this.stopMotivationalPhrases();
            this.navigateToSection('configuration');
        } finally {
            this.state.isGenerating = false;
            // Ensure phrases are stopped in all cases
            this.stopMotivationalPhrases();
        }
    },
    
    motivationalPhrases: [
        'Tu futuro se está creando ahora mismo...',
        'Cada imagen cuenta una historia de éxito',
        'Visualiza tus sueños, materializa tu realidad',
        'El poder de la visualización está en acción',
        'Tus metas están tomando forma',
        'La energía de tus sueños se multiplica',
        'Cada segundo te acerca a tu objetivo',
        'Tu película mental está cobrando vida',
        'El universo conspira a tu favor',
        'Tus sueños merecen ser visualizados'
    ],
    
    currentPhraseIndex: 0,
    phraseInterval: null,
    
    startMotivationalPhrases() {
        // Clear any existing interval first to prevent leaks
        this.stopMotivationalPhrases();
        
        this.currentPhraseIndex = 0;
        this.updateMotivationalPhrase();
        
        // Rotate phrases every 3 seconds
        this.phraseInterval = setInterval(() => {
            this.currentPhraseIndex = (this.currentPhraseIndex + 1) % this.motivationalPhrases.length;
            this.updateMotivationalPhrase();
        }, 3000);
    },
    
    stopMotivationalPhrases() {
        if (this.phraseInterval) {
            clearInterval(this.phraseInterval);
            this.phraseInterval = null;
        }
    },
    
    updateMotivationalPhrase() {
        const phraseText = document.getElementById('phrase-text');
        if (phraseText) {
            // Fade out
            phraseText.style.opacity = '0';
            
            setTimeout(() => {
                phraseText.textContent = this.motivationalPhrases[this.currentPhraseIndex];
                // Fade in
                phraseText.style.opacity = '1';
            }, 300);
        }
    },
    
    updateGenerationProgress(percentage, message) {
        // Update circular progress
        const progressCircle = document.getElementById('progress-circle');
        const progressPercentage = document.getElementById('progress-percentage');
        const generationMessage = document.getElementById('generation-message');
        
        if (progressCircle) {
            // Calculate stroke dash offset (565.48 is circumference for radius 90)
            const circumference = 565.48;
            const offset = circumference - (percentage / 100) * circumference;
            progressCircle.style.strokeDashoffset = offset;
        }
        
        if (progressPercentage) {
            progressPercentage.textContent = `${Math.round(percentage)}%`;
        }
        
        if (generationMessage) {
            generationMessage.textContent = message;
        }
    },
    
    displayGeneratedVideo(videoBlob) {
        // Stop motivational phrases
        this.stopMotivationalPhrases();
        
        // Hide generation status
        document.getElementById('generation-status').style.display = 'none';
        document.getElementById('video-player-container').style.display = 'block';
        
        // Create video URL
        const videoUrl = URL.createObjectURL(videoBlob);
        
        // Set video source
        const videoElement = document.getElementById('generated-video');
        if (videoElement) {
            // Update state reference to video element
            this.state.videoElement = videoElement;
            
            // Remove old event listeners if any
            videoElement.onloadedmetadata = null;
            videoElement.onerror = null;
            
            // Add metadata load handler
            videoElement.onloadedmetadata = () => {
                console.log('Video metadata loaded successfully');
                console.log('Duration:', videoElement.duration, 'seconds');
                console.log('Has audio tracks:', videoElement.audioTracks?.length || 'N/A');
            };
            
            // Add error handler
            videoElement.onerror = (e) => {
                console.error('Video playback error:', e);
                console.error('Error code:', videoElement.error?.code);
                console.error('Error message:', videoElement.error?.message);
            };
            
            // Set source and load
            videoElement.src = videoUrl;
            videoElement.preload = 'metadata';
            videoElement.load();
        }
        
        // Reinitialize icons
        setTimeout(() => {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }, 100);
    },
    
    // ===================================
    // Video Controls
    // ===================================
    toggleVideoPlayback() {
        const video = this.state.videoElement;
        if (!video) return;
        
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    },
    
    restartVideo() {
        const video = this.state.videoElement;
        if (!video) return;
        
        video.currentTime = 0;
        video.play();
    },
    
    toggleMute() {
        const video = this.state.videoElement;
        if (!video) return;
        
        video.muted = !video.muted;
        
        const volumeIcon = document.getElementById('volume-icon');
        if (volumeIcon) {
            volumeIcon.setAttribute('data-lucide', video.muted ? 'volume-x' : 'volume-2');
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    },
    
    updateVideoTimeline() {
        const video = this.state.videoElement;
        if (!video) return;
        
        const timeline = document.getElementById('video-timeline');
        const timeDisplay = document.getElementById('video-time');
        
        if (timeline && !isNaN(video.duration)) {
            const progress = (video.currentTime / video.duration) * 100;
            timeline.value = progress;
        }
        
        if (timeDisplay) {
            const current = this.formatTime(video.currentTime);
            const total = this.formatTime(video.duration);
            timeDisplay.textContent = `${current} / ${total}`;
        }
    },
    
    updatePlayPauseIcon(isPlaying) {
        const icon = document.getElementById('play-pause-icon');
        if (icon) {
            icon.setAttribute('data-lucide', isPlaying ? 'pause' : 'play');
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    },
    
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },
    
    // ===================================
    // Download & Share
    // ===================================
    downloadVideo() {
        if (!this.state.generatedVideoBlob) {
            notifications.warning('No hay video para descargar.');
            return;
        }
        
        const url = URL.createObjectURL(this.state.generatedVideoBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pelicula-mental-${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('Video downloaded');
    },
    
    shareVideo() {
        console.log('shareVideo() called');
        console.trace('Share modal open trace');
        const modal = document.getElementById('share-modal');
        if (modal) {
            modal.classList.add('active');
        }
    },
    
    closeShareModal() {
        const modal = document.getElementById('share-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    },
    
    async shareToWhatsApp() {
        const text = encodeURIComponent('¡Mira mi Película Mental! He visualizado mis sueños y metas.');
        const url = `https://wa.me/?text=${text}`;
        window.open(url, '_blank');
    },
    
    async shareToFacebook() {
        const text = encodeURIComponent('¡Acabo de crear mi Película Mental y visualizar mis sueños!');
        const url = `https://www.facebook.com/sharer/sharer.php?quote=${text}`;
        window.open(url, '_blank');
    },
    
    async shareToTwitter() {
        const text = encodeURIComponent('¡Acabo de crear mi Película Mental y visualizar mis sueños! #PeliculaMental #Visualización #Sueños');
        const url = `https://twitter.com/intent/tweet?text=${text}`;
        window.open(url, '_blank');
    },
    
    async copyVideoLink() {
        // Since this is a local app, we'll copy a message instead
        const message = '¡He creado mi Película Mental! Una experiencia de visualización de sueños y metas.';
        
        try {
            await navigator.clipboard.writeText(message);
            notifications.success('¡Mensaje copiado al portapapeles!');
        } catch (err) {
            console.error('Failed to copy:', err);
            notifications.error('No se pudo copiar el mensaje.');
        }
    },
    
    createNewVideo() {
        // Redirect to homepage to start fresh
        window.location.href = '/';
    },
    
    // ===================================
    // Gallery Management
    // ===================================
    async saveToGallery() {
        if (!this.state.generatedVideoBlob) {
            notifications.warning('No hay video para guardar.');
            return;
        }

        try {
            const saveBtn = document.getElementById('save-gallery-btn');
            if (saveBtn) {
                saveBtn.disabled = true;
                saveBtn.innerHTML = '<i data-lucide="loader"></i> Guardando...';
                lucide.createIcons();
            }

            // Generate thumbnail
            const thumbnail = await videoStorage.generateThumbnail(this.state.generatedVideoBlob);

            // Prepare video data
            const categories = this.state.selectedDreams.join(', ') || 'custom';
            const firstCategory = this.state.selectedDreams[0] || 'custom';
            const videoData = {
                title: this.getCategoryTitle(firstCategory) || 'Mi Video',
                category: categories,
                blob: this.state.generatedVideoBlob,
                duration: this.state.selectedDuration,
                musicName: this.getCurrentMusicName(),
                thumbnail: thumbnail
            };

            // Save to IndexedDB
            const videoId = await videoStorage.saveVideo(videoData);
            
            if (saveBtn) {
                saveBtn.innerHTML = '<i data-lucide="check"></i> Guardado';
                lucide.createIcons();
                
                setTimeout(() => {
                    saveBtn.innerHTML = '<i data-lucide="bookmark-plus"></i> Guardar en Galería';
                    saveBtn.disabled = false;
                    lucide.createIcons();
                }, 2000);
            }

            notifications.success('¡Video guardado en tu galería!');
            console.log('Video saved to gallery with ID:', videoId);
        } catch (error) {
            console.error('Error saving to gallery:', error);
            notifications.error('Error al guardar el video en la galería.');
            
            const saveBtn = document.getElementById('save-gallery-btn');
            if (saveBtn) {
                saveBtn.innerHTML = '<i data-lucide="bookmark-plus"></i> Guardar en Galería';
                saveBtn.disabled = false;
                lucide.createIcons();
            }
        }
    },

    async loadGallery() {
        try {
            const videos = await videoStorage.getAllVideos();
            const galleryGrid = document.getElementById('gallery-grid');
            const galleryEmpty = document.getElementById('gallery-empty');
            const galleryCount = document.getElementById('gallery-count');
            const clearBtn = document.getElementById('clear-gallery-btn');

            if (!galleryGrid) return;

            // Update count
            if (galleryCount) {
                galleryCount.textContent = videos.length === 1 ? '1 video guardado' : `${videos.length} videos guardados`;
            }

            // Show/hide clear button
            if (clearBtn) {
                clearBtn.style.display = videos.length > 0 ? 'block' : 'none';
            }

            // Show empty state if no videos
            if (videos.length === 0) {
                galleryGrid.style.display = 'none';
                if (galleryEmpty) {
                    galleryEmpty.style.display = 'flex';
                }
                return;
            }

            // Hide empty state
            galleryGrid.style.display = 'grid';
            if (galleryEmpty) {
                galleryEmpty.style.display = 'none';
            }

            // Clear existing content
            galleryGrid.innerHTML = '';

            // Create video cards
            videos.forEach(video => {
                const card = this.createGalleryCard(video);
                galleryGrid.appendChild(card);
            });

            // Reinitialize icons
            lucide.createIcons();
        } catch (error) {
            console.error('Error loading gallery:', error);
        }
    },

    createGalleryCard(video) {
        const card = document.createElement('div');
        card.className = 'gallery-card';
        card.setAttribute('data-testid', `gallery-card-${video.id}`);

        const date = new Date(video.timestamp);
        const dateStr = date.toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });

        // Create thumbnail or placeholder
        let thumbnailHTML = '';
        if (video.thumbnail) {
            const thumbnailUrl = URL.createObjectURL(video.thumbnail);
            thumbnailHTML = `<img src="${thumbnailUrl}" alt="${video.title}">`;
        } else {
            thumbnailHTML = '<div class="gallery-card-placeholder"><i data-lucide="film"></i></div>';
        }

        card.innerHTML = `
            ${thumbnailHTML}
            <div class="gallery-card-overlay"></div>
            <div class="gallery-card-content">
                <h4 class="gallery-card-title">${video.title}</h4>
                <div class="gallery-card-meta">
                    <span><i data-lucide="clock"></i> ${video.duration}s</span>
                    <span><i data-lucide="calendar"></i> ${dateStr}</span>
                </div>
                <div class="gallery-card-actions">
                    <button class="btn btn-icon btn-sm" data-testid="button-play-gallery-${video.id}" onclick="app.playGalleryVideo(${video.id})" title="Reproducir">
                        <i data-lucide="play"></i>
                    </button>
                    <button class="btn btn-icon btn-sm" data-testid="button-download-gallery-${video.id}" onclick="app.downloadGalleryVideo(${video.id})" title="Descargar">
                        <i data-lucide="download"></i>
                    </button>
                    <button class="btn btn-icon btn-sm btn-danger" data-testid="button-delete-gallery-${video.id}" onclick="app.deleteGalleryVideo(${video.id})" title="Eliminar">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </div>
        `;

        return card;
    },

    async playGalleryVideo(id) {
        try {
            const video = await videoStorage.getVideo(id);
            if (!video) {
                notifications.error('No se pudo encontrar el video.');
                return;
            }

            // Set the video as current
            this.state.generatedVideoBlob = video.blob;
            // Parse category (could be single or comma-separated)
            this.state.selectedDreams = video.category ? video.category.split(', ').filter(c => c !== 'custom') : [];
            this.state.selectedDuration = video.duration;

            // Navigate to video player
            this.navigateToSection('video-generation');

            // Show video player
            const generationStatus = document.getElementById('generation-status');
            const videoPlayerContainer = document.getElementById('video-player-container');
            const videoElement = document.getElementById('generated-video');

            if (generationStatus) generationStatus.style.display = 'none';
            if (videoPlayerContainer) videoPlayerContainer.style.display = 'block';

            if (videoElement) {
                // Update state reference to video element
                this.state.videoElement = videoElement;
                
                const url = URL.createObjectURL(video.blob);
                videoElement.src = url;
                videoElement.load();
                
                // Update save button to show "already saved"
                const saveBtn = document.getElementById('save-gallery-btn');
                if (saveBtn) {
                    saveBtn.innerHTML = '<i data-lucide="check"></i> Ya Guardado';
                    saveBtn.disabled = true;
                    lucide.createIcons();
                }
            }
        } catch (error) {
            console.error('Error playing gallery video:', error);
            notifications.error('Error al reproducir el video.');
        }
    },

    async downloadGalleryVideo(id) {
        try {
            const video = await videoStorage.getVideo(id);
            if (!video) {
                notifications.error('No se pudo encontrar el video.');
                return;
            }

            const url = URL.createObjectURL(video.blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${video.title.replace(/\s+/g, '_')}_${Date.now()}.webm`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading gallery video:', error);
            notifications.error('Error al descargar el video.');
        }
    },

    async deleteGalleryVideo(id) {
        const confirmed = await notifications.confirm(
            '¿Estás seguro de que quieres eliminar este video?',
            'Eliminar Video'
        );
        
        if (!confirmed) {
            return;
        }

        try {
            await videoStorage.deleteVideo(id);
            await this.loadGallery();
            notifications.success('Video eliminado exitosamente.');
        } catch (error) {
            console.error('Error deleting video:', error);
            notifications.error('Error al eliminar el video.');
        }
    },

    async clearGallery() {
        const confirmed = await notifications.confirm(
            '¿Estás seguro de que quieres borrar TODOS los videos de tu galería? Esta acción no se puede deshacer.',
            'Vaciar Galería'
        );
        
        if (!confirmed) {
            return;
        }

        try {
            await videoStorage.clearAll();
            await this.loadGallery();
            notifications.success('Galería vaciada exitosamente.');
        } catch (error) {
            console.error('Error clearing gallery:', error);
            notifications.error('Error al vaciar la galería.');
        }
    },

    getCategoryTitle(category) {
        const titles = {
            career: 'Carrera Profesional',
            travel: 'Viajes',
            health: 'Salud y Bienestar',
            family: 'Familia',
            education: 'Educación',
            entrepreneurship: 'Emprendimiento',
            love: 'Amor y Relaciones',
            finance: 'Finanzas y Riqueza',
            creativity: 'Creatividad y Arte',
            custom: 'Mi Sueño'
        };
        return titles[category] || 'Mi Video';
    },

    getCurrentMusicName() {
        if (this.state.customMusicFile) {
            return this.state.customMusicFile.name;
        } else if (this.state.selectedMusic) {
            const musicOptions = {
                music1: 'Inspiración',
                music2: 'Motivación',
                music3: 'Tranquilidad',
                music4: 'Energía',
                music5: 'Enfoque',
                music6: 'Celebración'
            };
            return musicOptions[this.state.selectedMusic] || 'Sin música';
        }
        return 'Sin música';
    },
    
    // ===================================
    // Phrase Editor
    // ===================================
    openPhraseEditor() {
        console.log('openPhraseEditor() called');
        const modal = document.getElementById('phrase-editor-modal');
        if (!modal) {
            console.error('phrase-editor-modal not found');
            return;
        }
        console.log('phrase-editor-modal found, adding active class');
        
        // Load current phrases or defaults
        const category = this.state.selectedDreams[0] || 'general';
        const defaultPhrases = this.quotes[category] || this.quotes.general;
        
        // Populate inputs and set up listeners (only once)
        for (let i = 1; i <= 5; i++) {
            const input = document.getElementById(`phrase-${i}`);
            const counter = document.getElementById(`phrase-${i}-count`);
            if (input) {
                const phraseValue = this.state.customPhrases ? this.state.customPhrases[i - 1] : '';
                input.value = phraseValue;
                input.placeholder = defaultPhrases[i - 1];
                
                // Update counter immediately
                this.updatePhraseCounter(i);
                
                // Remove old listener if exists to prevent duplicates
                input.removeEventListener('input', input._counterHandler);
                
                // Create new handler and store reference
                input._counterHandler = () => this.updatePhraseCounter(i);
                input.addEventListener('input', input._counterHandler);
            }
        }
        
        modal.classList.add('active');
        
        // Reinitialize icons
        setTimeout(() => {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }, 100);
    },
    
    updatePhraseCounter(phraseNumber) {
        const input = document.getElementById(`phrase-${phraseNumber}`);
        const counter = document.getElementById(`phrase-${phraseNumber}-count`);
        if (input && counter) {
            counter.textContent = `${input.value.length}/100`;
        }
    },
    
    closePhraseEditor() {
        const modal = document.getElementById('phrase-editor-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    },
    
    savePhrases() {
        const phrases = [];
        let hasCustomPhrases = false;
        
        // Collect phrases from inputs
        for (let i = 1; i <= 5; i++) {
            const input = document.getElementById(`phrase-${i}`);
            if (input) {
                const value = input.value.trim();
                phrases.push(value);
                if (value) {
                    hasCustomPhrases = true;
                }
            }
        }
        
        // Save to state (null if all empty, otherwise save the array)
        this.state.customPhrases = hasCustomPhrases ? phrases : null;
        
        console.log('Custom phrases saved:', this.state.customPhrases);
        
        // Close modal first
        this.closePhraseEditor();
        
        // Show confirmation after modal closes
        setTimeout(() => {
            notifications.success(hasCustomPhrases ? 
                '¡Frases guardadas! Se usarán en tu próximo video.' : 
                'Frases restauradas a predeterminadas.'
            );
        }, 100);
    },
    
    resetPhrases() {
        // Clear all inputs
        for (let i = 1; i <= 5; i++) {
            const input = document.getElementById(`phrase-${i}`);
            const counter = document.getElementById(`phrase-${i}-count`);
            if (input) {
                input.value = '';
                if (counter) {
                    counter.textContent = '0/100';
                }
            }
        }
        
        // Clear from state
        this.state.customPhrases = null;
        
        console.log('Phrases reset to defaults');
    },
    
    // ===================================
    // Utility Methods
    // ===================================
    updateUI() {
        this.updateNavigationButtons();
    }
};

// Make app globally available
window.app = app;
