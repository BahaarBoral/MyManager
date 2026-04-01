// ===== PAGE LOADER — Pixel Ghost Jumping Animation =====

(function () {
    // Create loader overlay
    var overlay = document.createElement("div");
    overlay.id = "pageLoader";
    // Inline styles to prevent FOUC shifting
    overlay.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: var(--bg-main); z-index: 999999; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: opacity 0.3s ease;";
    overlay.innerHTML = '<canvas id="loaderCanvas" width="300" height="200"></canvas>' +
        '<p class="loader-text" style="margin-top: 15px; font-size: 16px; font-weight: 600; color: var(--text-secondary); letter-spacing: 1px;">Loading<span class="loader-dots">...</span></p>';
    document.body.insertBefore(overlay, document.body.firstChild);

    var canvas = document.getElementById("loaderCanvas");
    var ctx = canvas.getContext("2d");

    // Ghost properties
    var ghost = {
        x: 150,
        y: 120,
        vy: 0,
        width: 24,
        height: 28,
        grounded: true,
        frame: 0
    };

    var gravity = 0.6;
    var jumpForce = -8;
    var groundY = 150;
    var obstacles = [];
    var gameFrame = 0;

    // Create obstacles
    function spawnObstacle() {
        obstacles.push({
            x: canvas.width + 20,
            width: 16,
            height: 12 + Math.random() * 16
        });
    }

    // Draw pixel ghost
    function drawGhost(x, y) {
        var s = 3; // pixel scale

        // Body
        ctx.fillStyle = "#c084fc";
        // Main body (8 wide x 7 tall in pixels)
        ctx.fillRect(x - 4 * s, y - 7 * s, 8 * s, 6 * s);
        // Bottom wavy part
        ctx.fillRect(x - 4 * s, y - 1 * s, 2 * s, 2 * s);
        ctx.fillRect(x, y - 1 * s, 2 * s, 2 * s);
        ctx.fillRect(x + 2 * s, y - 1 * s, 2 * s, 2 * s);
        // Head bump
        ctx.fillRect(x - 3 * s, y - 8 * s, 6 * s, 1 * s);
        ctx.fillRect(x - 2 * s, y - 9 * s, 4 * s, 1 * s);

        // Eyes
        ctx.fillStyle = "#f1f5f9";
        ctx.fillRect(x - 2 * s, y - 5 * s, 2 * s, 2 * s);
        ctx.fillRect(x + 1 * s, y - 5 * s, 2 * s, 2 * s);

        // Pupils
        ctx.fillStyle = "#1e293b";
        var eyeOffset = Math.sin(gameFrame * 0.1) > 0 ? s : 0;
        ctx.fillRect(x - 1 * s + eyeOffset, y - 4 * s, 1 * s, 1 * s);
        ctx.fillRect(x + 2 * s + eyeOffset, y - 4 * s, 1 * s, 1 * s);

        // Blush
        ctx.fillStyle = "rgba(244, 114, 182, 0.5)";
        ctx.fillRect(x - 3 * s, y - 3 * s, 2 * s, 1 * s);
        ctx.fillRect(x + 2 * s, y - 3 * s, 2 * s, 1 * s);
    }

    // Draw obstacle (pixel style)
    function drawObstacle(ob) {
        ctx.fillStyle = "#34d399";
        ctx.fillRect(ob.x, groundY - ob.height, ob.width, ob.height);
        // Pixel detail
        ctx.fillStyle = "#10b981";
        ctx.fillRect(ob.x + 2, groundY - ob.height, 4, 3);
        ctx.fillRect(ob.x + ob.width - 6, groundY - ob.height + 3, 4, 3);
    }

    // Auto-jump
    function autoJump() {
        for (var i = 0; i < obstacles.length; i++) {
            var ob = obstacles[i];
            if (ob.x > ghost.x - 30 && ob.x < ghost.x + 40 && ghost.grounded) {
                ghost.vy = jumpForce;
                ghost.grounded = false;
                break;
            }
        }
    }

    function update() {
        gameFrame++;

        // Ghost physics
        ghost.vy += gravity;
        ghost.y += ghost.vy;

        if (ghost.y >= groundY) {
            ghost.y = groundY;
            ghost.vy = 0;
            ghost.grounded = true;
        }

        // Move obstacles
        for (var i = obstacles.length - 1; i >= 0; i--) {
            obstacles[i].x -= 3;
            if (obstacles[i].x < -30) {
                obstacles.splice(i, 1);
            }
        }

        // Spawn obstacles
        if (gameFrame % 60 === 0) {
            spawnObstacle();
        }

        autoJump();
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Ground
        ctx.fillStyle = "#2a3448";
        ctx.fillRect(0, groundY, canvas.width, 2);

        // Ground dots
        ctx.fillStyle = "#1e293b";
        for (var i = 0; i < canvas.width; i += 12) {
            ctx.fillRect(i + ((gameFrame * 3) % 12), groundY + 5, 2, 2);
        }

        // Obstacles
        for (var i = 0; i < obstacles.length; i++) {
            drawObstacle(obstacles[i]);
        }

        // Ghost (with slight float animation)
        var floatY = ghost.grounded ? Math.sin(gameFrame * 0.08) * 2 : 0;
        drawGhost(ghost.x, ghost.y + floatY);
    }

    var loaderTimer;

    function animateLoader() {
        update();
        draw();
        loaderTimer = requestAnimationFrame(animateLoader);
    }

    // Start animation
    animateLoader();

    // Animate dots
    var dotCount = 0;
    var dotInterval = setInterval(function () {
        dotCount = (dotCount + 1) % 4;
        var dots = document.querySelector(".loader-dots");
        if (dots) {
            var dotStr = "";
            for (var i = 0; i < dotCount + 1; i++) dotStr += ".";
            dots.innerText = dotStr;
        }
    }, 400);

    // Hide loader when page is ready
    window.addEventListener("load", function () {
        setTimeout(function () {
            overlay.style.opacity = "0";
            setTimeout(function () {
                overlay.style.display = "none";
                cancelAnimationFrame(loaderTimer);
                clearInterval(dotInterval);
            }, 500);
        }, 800); // Minimum display time
    });
})();
