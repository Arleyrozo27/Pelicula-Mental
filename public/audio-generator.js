// ===================================
// Audio Generator Module
// Generates music using Web Audio API
// ===================================
const audioGenerator = {
    audioContext: null,
    currentSource: null,
    
    // Initialize Audio Context
    init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        return this.audioContext;
    },
    
    // Stop current playback
    stop() {
        if (this.currentSource) {
            try {
                this.currentSource.stop();
            } catch (e) {
                // Already stopped
            }
            this.currentSource = null;
        }
    },
    
    // Generate music based on style
    async generate(style, duration) {
        this.init();
        
        switch (style) {
            case 'motivational':
                return this.generateMotivational(duration);
            case 'epic':
                return this.generateEpic(duration);
            case 'relaxing':
                return this.generateRelaxing(duration);
            case 'inspiring':
                return this.generateInspiring(duration);
            case 'energetic':
                return this.generateEnergetic(duration);
            case 'peaceful':
                return this.generatePeaceful(duration);
            default:
                return this.generateMotivational(duration);
        }
    },
    
    // Motivational - Upbeat with strong rhythm
    generateMotivational(duration) {
        const ctx = this.audioContext;
        const destination = ctx.createMediaStreamDestination();
        const masterGain = ctx.createGain();
        masterGain.gain.value = 0.3;
        masterGain.connect(destination);
        
        // Bass drum pattern
        this.createDrumPattern(ctx, masterGain, duration, 0.5, [0, 0.5, 1, 1.5]);
        
        // Synth melody
        this.createMelody(ctx, masterGain, duration, [
            { freq: 523.25, time: 0 },    // C5
            { freq: 587.33, time: 0.25 },  // D5
            { freq: 659.25, time: 0.5 },   // E5
            { freq: 783.99, time: 0.75 },  // G5
            { freq: 659.25, time: 1 },     // E5
            { freq: 587.33, time: 1.25 },  // D5
            { freq: 523.25, time: 1.5 }    // C5
        ], 'sawtooth');
        
        return { stream: destination.stream, context: ctx };
    },
    
    // Epic - Powerful orchestral feel
    generateEpic(duration) {
        const ctx = this.audioContext;
        const destination = ctx.createMediaStreamDestination();
        const masterGain = ctx.createGain();
        masterGain.gain.value = 0.3;
        masterGain.connect(destination);
        
        // Deep bass
        this.createBass(ctx, masterGain, duration, [130.81, 164.81, 196.00]);
        
        // Epic melody
        this.createMelody(ctx, masterGain, duration, [
            { freq: 261.63, time: 0 },     // C4
            { freq: 329.63, time: 0.5 },   // E4
            { freq: 392.00, time: 1 },     // G4
            { freq: 523.25, time: 1.5 }    // C5
        ], 'triangle');
        
        // Cymbal crashes
        this.createCrashes(ctx, masterGain, duration);
        
        return { stream: destination.stream, context: ctx };
    },
    
    // Relaxing - Soft ambient sounds
    generateRelaxing(duration) {
        const ctx = this.audioContext;
        const destination = ctx.createMediaStreamDestination();
        const masterGain = ctx.createGain();
        masterGain.gain.value = 0.2;
        masterGain.connect(destination);
        
        // Ambient pad
        this.createPad(ctx, masterGain, duration, [261.63, 329.63, 392.00]);
        
        // Soft bell tones
        this.createBells(ctx, masterGain, duration);
        
        return { stream: destination.stream, context: ctx };
    },
    
    // Inspiring - Uplifting piano-like tones
    generateInspiring(duration) {
        const ctx = this.audioContext;
        const destination = ctx.createMediaStreamDestination();
        const masterGain = ctx.createGain();
        masterGain.gain.value = 0.3;
        masterGain.connect(destination);
        
        // Piano-like melody
        this.createMelody(ctx, masterGain, duration, [
            { freq: 523.25, time: 0 },     // C5
            { freq: 659.25, time: 0.3 },   // E5
            { freq: 783.99, time: 0.6 },   // G5
            { freq: 1046.50, time: 0.9 },  // C6
            { freq: 783.99, time: 1.2 },   // G5
            { freq: 659.25, time: 1.5 }    // E5
        ], 'sine');
        
        // Soft strings
        this.createPad(ctx, masterGain, duration, [523.25, 659.25, 783.99]);
        
        return { stream: destination.stream, context: ctx };
    },
    
    // Energetic - Fast-paced electronic
    generateEnergetic(duration) {
        const ctx = this.audioContext;
        const destination = ctx.createMediaStreamDestination();
        const masterGain = ctx.createGain();
        masterGain.gain.value = 0.3;
        masterGain.connect(destination);
        
        // Fast drum pattern
        this.createDrumPattern(ctx, masterGain, duration, 0.25, [0, 0.25, 0.5, 0.75]);
        
        // Synth bass
        this.createBass(ctx, masterGain, duration, [65.41, 82.41, 98.00]);
        
        // Lead synth
        this.createMelody(ctx, masterGain, duration, [
            { freq: 1046.50, time: 0 },
            { freq: 1174.66, time: 0.125 },
            { freq: 1318.51, time: 0.25 },
            { freq: 1567.98, time: 0.375 },
            { freq: 1318.51, time: 0.5 },
            { freq: 1174.66, time: 0.625 }
        ], 'square');
        
        return { stream: destination.stream, context: ctx };
    },
    
    // Peaceful - Gentle nature-inspired
    generatePeaceful(duration) {
        const ctx = this.audioContext;
        const destination = ctx.createMediaStreamDestination();
        const masterGain = ctx.createGain();
        masterGain.gain.value = 0.2;
        masterGain.connect(destination);
        
        // Gentle pad
        this.createPad(ctx, masterGain, duration, [220.00, 277.18, 329.63]);
        
        // Wind chimes
        this.createChimes(ctx, masterGain, duration);
        
        return { stream: destination.stream, context: ctx };
    },
    
    // Helper: Create drum pattern
    createDrumPattern(ctx, destination, duration, interval, pattern) {
        const now = ctx.currentTime;
        const loops = Math.ceil(duration / (pattern.length * interval));
        
        for (let i = 0; i < loops; i++) {
            pattern.forEach((offset) => {
                const time = now + (i * pattern.length * interval) + offset;
                if (time - now < duration) {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    
                    osc.frequency.value = 80;
                    osc.type = 'sine';
                    gain.gain.setValueAtTime(0.5, time);
                    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
                    
                    osc.connect(gain);
                    gain.connect(destination);
                    osc.start(time);
                    osc.stop(time + 0.1);
                }
            });
        }
    },
    
    // Helper: Create melody
    createMelody(ctx, destination, duration, notes, waveType = 'sine') {
        const now = ctx.currentTime;
        const patternDuration = notes[notes.length - 1].time + 0.5;
        const loops = Math.ceil(duration / patternDuration);
        
        for (let i = 0; i < loops; i++) {
            notes.forEach(note => {
                const time = now + (i * patternDuration) + note.time;
                if (time - now < duration) {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    
                    osc.frequency.value = note.freq;
                    osc.type = waveType;
                    gain.gain.setValueAtTime(0.2, time);
                    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.4);
                    
                    osc.connect(gain);
                    gain.connect(destination);
                    osc.start(time);
                    osc.stop(time + 0.5);
                }
            });
        }
    },
    
    // Helper: Create bass line
    createBass(ctx, destination, duration, frequencies) {
        const now = ctx.currentTime;
        const interval = 1;
        const beats = Math.ceil(duration / interval);
        
        for (let i = 0; i < beats; i++) {
            const time = now + (i * interval);
            const freq = frequencies[i % frequencies.length];
            
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.frequency.value = freq;
            osc.type = 'sawtooth';
            gain.gain.setValueAtTime(0.3, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.8);
            
            osc.connect(gain);
            gain.connect(destination);
            osc.start(time);
            osc.stop(time + 1);
        }
    },
    
    // Helper: Create ambient pad
    createPad(ctx, destination, duration, frequencies) {
        const now = ctx.currentTime;
        
        frequencies.forEach((freq, index) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.frequency.value = freq;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.1, now + 2);
            gain.gain.setValueAtTime(0.1, now + duration - 2);
            gain.gain.linearRampToValueAtTime(0, now + duration);
            
            osc.connect(gain);
            gain.connect(destination);
            osc.start(now);
            osc.stop(now + duration);
        });
    },
    
    // Helper: Create bell sounds
    createBells(ctx, destination, duration) {
        const now = ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50];
        const interval = 2;
        const bells = Math.ceil(duration / interval);
        
        for (let i = 0; i < bells; i++) {
            const time = now + (i * interval);
            const freq = notes[i % notes.length];
            
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.frequency.value = freq;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.15, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 1.5);
            
            osc.connect(gain);
            gain.connect(destination);
            osc.start(time);
            osc.stop(time + 2);
        }
    },
    
    // Helper: Create chimes
    createChimes(ctx, destination, duration) {
        const now = ctx.currentTime;
        const notes = [1046.50, 1174.66, 1318.51, 1567.98];
        const interval = 3;
        const chimes = Math.ceil(duration / interval);
        
        for (let i = 0; i < chimes; i++) {
            const time = now + (i * interval) + Math.random() * 0.5;
            const freq = notes[Math.floor(Math.random() * notes.length)];
            
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.frequency.value = freq;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.1, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 2);
            
            osc.connect(gain);
            gain.connect(destination);
            osc.start(time);
            osc.stop(time + 2.5);
        }
    },
    
    // Helper: Create crash sounds
    createCrashes(ctx, destination, duration) {
        const now = ctx.currentTime;
        const interval = 4;
        const crashes = Math.ceil(duration / interval);
        
        for (let i = 0; i < crashes; i++) {
            const time = now + (i * interval);
            
            // White noise for crash
            const bufferSize = ctx.sampleRate * 2;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            
            for (let j = 0; j < bufferSize; j++) {
                data[j] = Math.random() * 2 - 1;
            }
            
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            
            const filter = ctx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 5000;
            
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.2, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 1.5);
            
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(destination);
            noise.start(time);
            noise.stop(time + 2);
        }
    }
};

// Make available globally
window.audioGenerator = audioGenerator;
