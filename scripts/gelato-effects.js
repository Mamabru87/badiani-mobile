(function() {
    // Gelato Effects: Fluid Animation & Sound
    // Adds a "creamy" feel to the cockpit carousel

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx;

    // Initialize Audio Context on first interaction
    function initAudio() {
        if (!audioCtx) {
            audioCtx = new AudioContext();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    // Sound: Soft "Pop" (Bubble)
    function playGelatoPop() {
        if (!audioCtx) return;
        
        const t = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        // Bubble sound: Sine wave sweeping up quickly
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, t);
        osc.frequency.exponentialRampToValueAtTime(400, t + 0.1);
        
        // Envelope: Attack -> Decay
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.15, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

        osc.start(t);
        osc.stop(t + 0.3);
    }

    // Sound: Soft "Whoosh" (Slide)
    function playGelatoSlide() {
        if (!audioCtx) return;

        const t = audioCtx.currentTime;
        const noiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.2, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < noiseBuffer.length; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const noise = audioCtx.createBufferSource();
        noise.buffer = noiseBuffer;
        
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, t);
        filter.frequency.linearRampToValueAtTime(100, t + 0.2);

        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.05, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);

        noise.start(t);
    }

    // Animation: Intersection Observer for "Focus" effect
    function initGelatoObserver() {
        const track = document.querySelector('.cockpit-track');
        if (!track) return;

        // Ensure we have the right styles for the transition
        const cards = track.querySelectorAll('.summary-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const card = entry.target;
                if (entry.isIntersecting) {
                    // Active State
                    card.style.transform = 'scale(1.05) translateY(-5px)';
                    card.style.opacity = '1';
                    card.style.zIndex = '10';
                    card.style.filter = 'brightness(1.05)';
                    // Optional: Add a class for CSS to handle if preferred
                    card.classList.add('is-gelato-active');
                } else {
                    // Inactive State
                    card.style.transform = 'scale(0.92)';
                    card.style.opacity = '0.6';
                    card.style.zIndex = '1';
                    card.style.filter = 'brightness(0.95) blur(1px)';
                    card.classList.remove('is-gelato-active');
                }
            });
        }, {
            root: track,
            threshold: 0.6, // 60% visibility triggers the "snap" visual
            rootMargin: '-10% 0px -10% 0px' // Narrow the active area
        });

        cards.forEach(card => {
            // Set initial state
            card.style.transition = 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1.2)'; // Springy
            observer.observe(card);
        });

        // Scroll Interaction for Sound
        let isScrolling;
        let lastScrollX = track.scrollLeft;

        track.addEventListener('scroll', () => {
            initAudio();
            
            // Detect significant movement for "slide" sound
            const currentScrollX = track.scrollLeft;
            if (Math.abs(currentScrollX - lastScrollX) > 50) {
                // playGelatoSlide(); // Maybe too noisy? Let's keep it subtle.
                lastScrollX = currentScrollX;
            }

            window.clearTimeout(isScrolling);
            isScrolling = setTimeout(() => {
                // Scroll stopped (snap occurred)
                playGelatoPop();
            }, 100);
        }, { passive: true });

        // Add click feedback to buttons inside cards
        track.querySelectorAll('.btn, .stat').forEach(btn => {
            btn.addEventListener('click', () => {
                initAudio();
                playGelatoPop();
            });
        });
    }

    // Boot
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGelatoObserver);
    } else {
        initGelatoObserver();
    }

})();
