function initializeStarsArray() {
    for (let i = 0; i < starCount; i++) {
        let hue;
        const rand = Math.random();
        if (rand < 0.1) hue = 220;
        else if (rand < 0.25) hue = 200;
        else if (rand < 0.5) hue = 55;
        else if (rand < 0.75) hue = 40;
        else hue = 10;

        const minRadius = 5000;
        const maxRadius = 25000;
        const t = Math.pow(Math.random(), 1.5);
        const radius = minRadius + (1 - t) * (maxRadius - minRadius);

        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        const rarity = Math.random();
        let size;
        let starClass;
        if (rarity < 0.30) {
            size = Math.pow(Math.random(), 2) * 2 + 1.5;
            starClass = "small";
        } else if (rarity < 0.85) {
            size = Math.pow(Math.random(), 1.5) * 3 + 3;
            starClass = "medium";
        } else {
            size = Math.random() * 6 + 4;
            starClass = "large";
        }
        
        stars.push({
            x: x, y: y, z: z,
            size: size, hue: hue,
            baseAlpha: 0.6 + Math.random() * 0.4,
            twinklePhase: Math.random() * Math.PI * 2,
            twinkleSpeed: Math.random() * 0.02 + 0.005,
            flareScale: Math.random() < 0.15 ? 2.5 : 1.0,
            fadeProgress: 1,
            fadingIn: false,
            recycleDistance: 8000 + Math.random() * 4000,
            shape: Math.random() < 0.5 ? "flare" : "soft",
            class: starClass 
        });
    }
}

function drawStar(currentCtx, x, y, radius, hue, alpha, flareScale = 1.0, shape = "flare", starClass = "medium") {
    const glowRadius = radius * 4;

    const gradient = currentCtx.createRadialGradient(x, y, 0, x, y, glowRadius);
    gradient.addColorStop(0, `hsla(${hue}, 100%, 95%, ${alpha})`);
    gradient.addColorStop(0.3, `hsla(${hue}, 100%, 85%, ${alpha * 0.5})`);
    gradient.addColorStop(1, `hsla(${hue}, 100%, 85%, 0)`);

    currentCtx.beginPath();
    currentCtx.fillStyle = gradient;
    currentCtx.arc(x, y, glowRadius, 0, Math.PI * 2);
    currentCtx.fill();

    if (shape === "flare" && starClass !== "small") {
        currentCtx.save();
        currentCtx.translate(x, y);

        let flareAlpha = starClass === "large" ? alpha * 0.4 : alpha * 0.2;
        let flareWidth = starClass === "large" ? 0.7 : 0.4;

        currentCtx.strokeStyle = `hsla(${hue}, 100%, 90%, ${flareAlpha})`;
        currentCtx.lineWidth = flareWidth;

        const flareLen = radius * (starClass === "large" ? 5 : 2.5) * flareScale;
        const diagLen = radius * (starClass === "large" ? 3.5 : 1.8) * flareScale;

        currentCtx.beginPath(); currentCtx.moveTo(0, -flareLen); currentCtx.lineTo(0, flareLen); currentCtx.stroke();
        currentCtx.beginPath(); currentCtx.moveTo(-flareLen, 0); currentCtx.lineTo(flareLen, 0); currentCtx.stroke();

        currentCtx.beginPath();
        currentCtx.moveTo(-diagLen, -diagLen); currentCtx.lineTo(diagLen, diagLen);
        currentCtx.moveTo(diagLen, -diagLen); currentCtx.lineTo(-diagLen, diagLen);
        currentCtx.stroke();

        currentCtx.restore();
    }
}

function drawStars() {
    visibleCount = 0;

    // Don't know how this math works, but it does
    stars.forEach(star => {
        star.twinklePhase += star.twinkleSpeed;

        if (star.fadingIn) {
            star.fadeProgress = Math.min(star.fadeProgress + 0.02, 1);
            if (star.fadeProgress >= 1) star.fadingIn = false;
        } else if (star.fadeProgress < 1) {
            star.fadeProgress = Math.max(star.fadeProgress - 0.02, 0);
        }

        if (star.fadeProgress <= 0) return;

        const projected = project3DTo2D(star);
        if (!projected) return;

        const distanceBoost = projected.zRot > 30000 ? 1.3 : 1.0;
        const alpha = star.baseAlpha * (0.6 + 0.4 * Math.sin(star.twinklePhase)) * star.fadeProgress * distanceBoost;
        const x2d = projected.x;
        const y2d = projected.y;
        const scale = projected.scale;
        const radius = Math.max(star.size * scale, 0.2);

        if (x2d < -200 || x2d > width + 200 || y2d < -200 || y2d > height + 200) return;

        visibleCount++;
        drawStar(ctx, x2d, y2d, radius, star.hue, alpha, star.flareScale, star.shape, star.class);

        if (star.z - cameraZ > star.recycleDistance) {
            const angle = Math.random() * Math.PI * 2;
            const r = Math.random() * 8000 + 2000; 
            star.x = cameraX + Math.cos(angle) * r;
            star.y = cameraY + Math.sin(angle) * r;
            star.z = cameraZ - (5000 + Math.random() * 2000); 
            star.recycleDistance = 8000 + Math.random() * 4000;
            star.fadeProgress = 0;
            star.fadingIn = true;
        }

        if (cameraZ - star.z > star.recycleDistance) {
            const angle = Math.random() * Math.PI * 2;
            const r = Math.random() * 8000 + 2000; 
            star.x = cameraX + Math.cos(angle) * r;
            star.y = cameraY + Math.sin(angle) * r;
            star.z = cameraZ + (5000 + Math.random() * 2000); 
            star.recycleDistance = 8000 + Math.random() * 4000;
            star.fadeProgress = 0;
            star.fadingIn = true;
        }
    });
}
