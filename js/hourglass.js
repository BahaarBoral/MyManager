// ===== CANVAS HOURGLASS — Minimalist Sleek Design & Physics =====
// Scroll-Linked Flip with Audio playing ONLY during active scrolling

(function () {
    var canvas = document.getElementById("hourglassCanvas");
    if (!canvas) return;

    var ctx = canvas.getContext("2d");

    // Canvas sizing
    canvas.width = 300;
    canvas.height = 420;
    var W = canvas.width;
    var H = canvas.height;

    // Hourglass sleek geometry
    var centerX = W / 2;
    var centerY = H / 2;
    var glassWidth = 120;
    var glassHeight = 160;
    var neckWidth = 6;

    // Theme colors (dynamic)
    var style = getComputedStyle(document.documentElement);
    var accentColor = style.getPropertyValue('--accent').trim() || '#34d399';
    var bgColor = style.getPropertyValue('--bg-main').trim() || '#0f172a';

    // Sand particles
    var particles = [];
    var maxParticles = 60; // Fewer particles for sleeker look
    var sandLevelTop = 1.0; // 1 = full, 0 = empty
    var sandLevelBottom = 0.0;
    var rotation = 0;

    // Audio context & timeout
    var audioCtx = null;
    var noiseNode = null;
    var gainNode = null;
    var isSoundPlaying = false;
    var scrollTimeout = null;

    function initAudio() {
        if (audioCtx) return;
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn("Web Audio API not supported");
        }
    }

    function startSandSound() {
        if (!audioCtx) initAudio();
        if (!audioCtx || isSoundPlaying) return;
        if (audioCtx.state === 'suspended') audioCtx.resume();

        isSoundPlaying = true;

        var bufferSize = 4096;
        noiseNode = audioCtx.createScriptProcessor(bufferSize, 1, 1);
        var lastOut = 0;
        noiseNode.onaudioprocess = function (e) {
            var output = e.outputBuffer.getChannelData(0);
            for (var i = 0; i < bufferSize; i++) {
                var white = Math.random() * 2 - 1;
                output[i] = (lastOut + (0.02 * white)) / 1.02;
                lastOut = output[i];
                output[i] *= 3.5;
            }
        };

        gainNode = audioCtx.createGain();
        gainNode.gain.value = 0.05; // very subtle

        var filter = audioCtx.createBiquadFilter();
        filter.type = "highpass";
        filter.frequency.value = 1200;

        noiseNode.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);
    }

    function stopSandSound() {
        if (!isSoundPlaying) return;
        isSoundPlaying = false;

        if (gainNode) {
            gainNode.gain.setTargetAtTime(0, audioCtx.currentTime, 0.05);
            setTimeout(function () {
                if (noiseNode) {
                    try { noiseNode.disconnect(); } catch (e) { }
                    noiseNode = null;
                }
                if (gainNode) {
                    try { gainNode.disconnect(); } catch (e) { }
                    gainNode = null;
                }
            }, 100);
        }
    }

    function spawnParticle() {
        if (particles.length >= maxParticles) return;
        particles.push({
            x: centerX + (Math.random() - 0.5) * neckWidth * 0.8,
            y: centerY,
            vx: (Math.random() - 0.5) * 0.4,
            vy: Math.random() * 2 + 1,
            radius: Math.random() * 1.5 + 0.5,
            alpha: 1
        });
    }

    function updateParticles() {
        for (var i = particles.length - 1; i >= 0; i--) {
            var p = particles[i];
            p.vy += 0.2; // gravity
            p.x += p.vx;
            p.y += p.vy;

            // Bounce slightly inside bottom bulb
            var distFromCenter = p.y - centerY;
            if (distFromCenter > 0) {
                var maxW = neckWidth + (distFromCenter / glassHeight) * (glassWidth - neckWidth);
                if (Math.abs(p.x - centerX) > maxW / 2) {
                    p.vx *= -0.5;
                    p.x = centerX + (p.x > centerX ? 1 : -1) * (maxW / 2 - 2);
                }
            }

            // Ground collision
            if (p.y > centerY + glassHeight - sandLevelBottom * glassHeight * 0.8 - 10) {
                p.alpha -= 0.1;
                if (p.alpha <= 0) particles.splice(i, 1);
            }
        }
    }

    // Modern sleek minimalist hourglass drawing
    function drawHourglass() {
        // Refresh accent color dynamically for themes
        accentColor = style.getPropertyValue('--accent').trim() || '#34d399';
        var isDark = style.getPropertyValue('--bg-main').trim() === '#0f172a' || style.getPropertyValue('--bg-main').trim() === '#0a0a0a';
        var glassColor = isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.15)";

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);
        ctx.translate(-centerX, -centerY);

        ctx.clearRect(0, 0, W, H);

        // Frame Top & Bottom Lines
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        ctx.beginPath();
        // Top cap
        ctx.moveTo(centerX - glassWidth / 2 - 20, centerY - glassHeight);
        ctx.lineTo(centerX + glassWidth / 2 + 20, centerY - glassHeight);
        // Bottom cap
        ctx.moveTo(centerX - glassWidth / 2 - 20, centerY + glassHeight);
        ctx.lineTo(centerX + glassWidth / 2 + 20, centerY + glassHeight);
        ctx.stroke();

        // Draw Sand (Solid, sleek geometric fills)
        ctx.fillStyle = accentColor;

        // Top Sand
        if (sandLevelTop > 0) {
            var topH = sandLevelTop * glassHeight * 0.8;
            ctx.beginPath();
            var topY = centerY - 5;
            var fillTopY = topY - topH;
            var wAtFillTop = neckWidth + (topH / glassHeight) * (glassWidth - neckWidth);

            ctx.moveTo(centerX - neckWidth / 2 + 2, topY);
            ctx.lineTo(centerX - wAtFillTop / 2, fillTopY);
            ctx.lineTo(centerX + wAtFillTop / 2, fillTopY);
            ctx.lineTo(centerX + neckWidth / 2 - 2, topY);
            ctx.fill();
        }

        // Bottom Sand
        if (sandLevelBottom > 0) {
            var botH = sandLevelBottom * glassHeight * 0.8;
            ctx.beginPath();
            var baseY = centerY + glassHeight - 5;
            var fillBotY = baseY - botH;
            var wAtFillBot = neckWidth + (botH / glassHeight) * (glassWidth - neckWidth);

            ctx.moveTo(centerX - glassWidth / 2 + 5, baseY);
            ctx.lineTo(centerX + glassWidth / 2 - 5, baseY);
            ctx.lineTo(centerX + wAtFillBot / 2, fillBotY);
            ctx.lineTo(centerX - wAtFillBot / 2, fillBotY);
            ctx.fill();
        }

        // Draw falling stream
        if (isSoundPlaying && sandLevelTop > 0) {
            ctx.strokeStyle = accentColor;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX, centerY + glassHeight - sandLevelBottom * glassHeight * 0.8 - 5);
            ctx.stroke();

            // Draw particles
            for (var i = 0; i < particles.length; i++) {
                ctx.fillStyle = accentColor;
                ctx.globalAlpha = particles[i].alpha;
                ctx.beginPath();
                ctx.arc(particles[i].x, particles[i].y, particles[i].radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        }

        // Modern Glass Outline (Sharp angles)
        ctx.strokeStyle = glassColor;
        ctx.lineWidth = 2;
        ctx.lineJoin = "round";
        ctx.beginPath();
        // Top triangle
        ctx.moveTo(centerX - glassWidth / 2, centerY - glassHeight);
        ctx.lineTo(centerX - neckWidth / 2, centerY);
        ctx.lineTo(centerX + neckWidth / 2, centerY);
        ctx.lineTo(centerX + glassWidth / 2, centerY - glassHeight);
        // Bottom triangle
        ctx.moveTo(centerX - glassWidth / 2, centerY + glassHeight);
        ctx.lineTo(centerX - neckWidth / 2, centerY);
        ctx.lineTo(centerX + neckWidth / 2, centerY);
        ctx.lineTo(centerX + glassWidth / 2, centerY + glassHeight);
        ctx.stroke();

        ctx.restore();
    }

    var requestID;
    function animate() {
        if (isSoundPlaying && sandLevelTop > 0) {
            spawnParticle();
            sandLevelTop -= 0.001;
            sandLevelBottom += 0.001;
            if (sandLevelTop < 0) sandLevelTop = 0;
            if (sandLevelBottom > 1) sandLevelBottom = 1;
        }
        updateParticles();
        drawHourglass();
        requestID = requestAnimationFrame(animate);
    }

    animate();

    // Scroll Logic - Sound & Sand flow ONLY when actively scrolling
    window.addEventListener("scroll", function () {
        initAudio(); // Initialize on user scroll gesture

        var maxScroll = 600;
        var scrollProgress = Math.min(window.scrollY / maxScroll, 1);
        rotation = scrollProgress * Math.PI; // flip completely

        // Reset sand gracefully if user scrolls all the way back up
        if (scrollProgress < 0.05) {
            sandLevelTop = 1.0;
            sandLevelBottom = 0.0;
        }

        // Start sound/sand animation
        if (scrollProgress > 0.05 && scrollProgress < 0.95 && sandLevelTop > 0) {
            startSandSound();

            // Clear timeout if scrolling continues
            if (scrollTimeout) clearTimeout(scrollTimeout);

            // Set timeout to explicitly stop sound when scrolling STOPS
            scrollTimeout = setTimeout(function () {
                stopSandSound();
            }, 150); // 150ms after scroll halts, sound dies and sand stops
        } else {
            stopSandSound();
        }
    });

})();
