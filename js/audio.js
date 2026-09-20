// KotoQuest Retro Web Audio SFX Engine
// 100% offline, zero-asset procedural sound generator using Web Audio API

(function () {
    let audioCtx = null;
    let isMuted = false;

    // Load initial mute state from localStorage
    if (typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function') {
        isMuted = localStorage.getItem('kotoquest_muted') === 'true';
    }

    function getAudioContext() {
        if (typeof window === 'undefined') return null;
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume().catch(() => {});
        }
        return audioCtx;
    }

    const sfx = {
        // Subtle UI mechanical click
        click: function () {
            if (isMuted) return;
            const ctx = getAudioContext();
            if (!ctx) return;
            try {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.03);
                gain.gain.setValueAtTime(0.12, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.03);
            } catch (e) {}
        },

        // Crunchy 8-bit sword slash on correct battle attack
        sword: function () {
            if (isMuted) return;
            const ctx = getAudioContext();
            if (!ctx) return;
            try {
                // White noise burst with bandpass filter sweep
                const bufferSize = ctx.sampleRate * 0.12;
                const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
                const noise = ctx.createBufferSource();
                noise.buffer = buffer;

                const filter = ctx.createBiquadFilter();
                filter.type = 'bandpass';
                filter.frequency.setValueAtTime(1800, ctx.currentTime);
                filter.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.12);
                filter.Q.setValueAtTime(3, ctx.currentTime);

                const gain = ctx.createGain();
                gain.gain.setValueAtTime(0.35, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

                noise.connect(filter);
                filter.connect(gain);
                gain.connect(ctx.destination);
                noise.start();
                noise.stop(ctx.currentTime + 0.12);
            } catch (e) {}
        },

        // Impact punch when player takes monster damage
        hit: function () {
            if (isMuted) return;
            const ctx = getAudioContext();
            if (!ctx) return;
            try {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'square';
                osc.frequency.setValueAtTime(160, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.18);

                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 0.18);
            } catch (e) {}
        },

        // Ascending major fanfare when player levels up
        levelUp: function () {
            if (isMuted) return;
            const ctx = getAudioContext();
            if (!ctx) return;
            try {
                // Notes: C5 (523.25), E5 (659.25), G5 (783.99), C6 (1046.50)
                const notes = [523.25, 659.25, 783.99, 1046.50];
                notes.forEach((freq, idx) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);

                    gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.1);
                    gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + idx * 0.1 + 0.02);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.25);

                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(ctx.currentTime + idx * 0.1);
                    osc.stop(ctx.currentTime + idx * 0.1 + 0.28);
                });
            } catch (e) {}
        },

        // Coin clink for gold gained or shop purchases
        coin: function () {
            if (isMuted) return;
            const ctx = getAudioContext();
            if (!ctx) return;
            try {
                // Two quick high tones: B5 (987.77Hz) -> E6 (1318.51Hz)
                const t = ctx.currentTime;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(987.77, t);
                osc.frequency.setValueAtTime(1318.51, t + 0.08);

                gain.gain.setValueAtTime(0.25, t);
                gain.gain.setValueAtTime(0.25, t + 0.08);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(t);
                osc.stop(t + 0.36);
            } catch (e) {}
        },

        // Cheerful chime on correct answer
        correct: function () {
            if (isMuted) return;
            const ctx = getAudioContext();
            if (!ctx) return;
            try {
                // C5 -> G5 chime
                const t = ctx.currentTime;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(523.25, t);
                osc.frequency.setValueAtTime(783.99, t + 0.1);

                gain.gain.setValueAtTime(0.2, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(t);
                osc.stop(t + 0.32);
            } catch (e) {}
        },

        // Low buzz on wrong answer
        wrong: function () {
            if (isMuted) return;
            const ctx = getAudioContext();
            if (!ctx) return;
            try {
                const t = ctx.currentTime;
                const osc1 = ctx.createOscillator();
                const osc2 = ctx.createOscillator();
                const gain = ctx.createGain();

                osc1.type = 'sawtooth';
                osc2.type = 'sawtooth';
                osc1.frequency.setValueAtTime(140, t);
                osc2.frequency.setValueAtTime(148, t);

                gain.gain.setValueAtTime(0.18, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

                osc1.connect(gain);
                osc2.connect(gain);
                gain.connect(ctx.destination);

                osc1.start(t);
                osc2.start(t);
                osc1.stop(t + 0.26);
                osc2.stop(t + 0.26);
            } catch (e) {}
        },

        // Healing sound for potions
        heal: function () {
            if (isMuted) return;
            const ctx = getAudioContext();
            if (!ctx) return;
            try {
                const t = ctx.currentTime;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(350, t);
                osc.frequency.linearRampToValueAtTime(800, t + 0.3);

                gain.gain.setValueAtTime(0.2, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(t);
                osc.stop(t + 0.36);
            } catch (e) {}
        }
    };

    function toggleMute() {
        isMuted = !isMuted;
        if (typeof localStorage !== 'undefined' && typeof localStorage.setItem === 'function') {
            localStorage.setItem('kotoquest_muted', isMuted ? 'true' : 'false');
        }
        return isMuted;
    }

    function setMuted(muted) {
        isMuted = !!muted;
        if (typeof localStorage !== 'undefined' && typeof localStorage.setItem === 'function') {
            localStorage.setItem('kotoquest_muted', isMuted ? 'true' : 'false');
        }
        return isMuted;
    }

    function getMuted() {
        return isMuted;
    }

    const KotoAudio = {
        sfx: sfx,
        toggleMute: toggleMute,
        setMuted: setMuted,
        isMuted: getMuted,
        init: getAudioContext
    };

    if (typeof window !== 'undefined') {
        window.KotoAudio = KotoAudio;
        // User gesture unlock listener
        ['click', 'keydown', 'touchstart'].forEach(evt => {
            window.addEventListener(evt, function unlock() {
                getAudioContext();
                window.removeEventListener(evt, unlock);
            }, { once: true });
        });
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = KotoAudio;
    }
})();
