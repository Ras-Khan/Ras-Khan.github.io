function initializeSpace() {
    const canvas = document.getElementById("universeSky");
    const ctx = canvas.getContext("2d", { alpha: true });
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let width = canvas.width;
    let height = canvas.height;

    const starCount = 1000;
    const stars = [];
    let visibleCount;

    // Cinematic camera stuffs
    let cinematicEnabled = true;
    let userInteracted = false;
    let interactionTimeout;
    let driftTarget = { x: 0, y: 0, rotX: 0, rotY: 0 };

    function project3DTo2D(pos) {
        const dx = pos.x - cameraX;
        const dy = pos.y - cameraY;
        const dz = pos.z - cameraZ;

        const radY = rotationY * Math.PI / 180;
        const radX = rotationX * Math.PI / 180;
        const cosY = Math.cos(radY);
        const sinY = Math.sin(radY);
        const cosX = Math.cos(radX);
        const sinX = Math.sin(radX);

        const x1 = dx * cosY - dz * sinY;
        const z1 = dx * sinY + dz * cosY;
        const y1 = dy * cosX - z1 * sinX;
        const zRot = dy * sinX + z1 * cosX;

        if (zRot < 50 || zRot > 80000) return null;

        const scale = Math.max(Math.min(1000 / zRot, 5), 0.05);
        const x2d = (x1 * scale) + width / 2;
        const y2d = (y1 * scale) + height / 2;

        return { x: x2d, y: y2d, scale, zRot };
    }

    for (let i = 0; i < starCount; i++) {
        let hue;
        const rand = Math.random();
        if (rand < 0.1) hue = 220;
        else if (rand < 0.25) hue = 200;
        else if (rand < 0.5) hue = 55;
        else if (rand < 0.75) hue = 40;
        else hue = 10;

        // Sphere of stars
        const minRadius = 5000;
        const maxRadius = 25000;
        const t = Math.pow(Math.random(), 1.5); 
        const radius = minRadius + (1 - t) * (maxRadius - minRadius);

        const theta = Math.random() * Math.PI * 2;     // longitude
        const phi = Math.acos(2 * Math.random() - 1);  // latitude

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        const rarity = Math.random();
        let size;
        
        let starClass;
        // Distributing sizes of stars with rng
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
            x: x,
            y: y,
            z: z,
            size: size,
            hue: hue,
            baseAlpha: 0.6 + Math.random() * 0.4,
            twinklePhase: Math.random() * Math.PI * 2,
            twinkleSpeed: Math.random() * 0.02 + 0.005,
            flareScale: Math.random() < 0.15 ? 2.5 : 1.0,
            fadeProgress: 1,
            fadingIn: false,
            recycleDistance: 8000 + Math.random() * 4000,
            shape: Math.random() < 0.5 ? "flare" : "soft" 
        });
    }

    /* Galaxy stuff */
    const galaxies = [
        {
            x: -10000,
            y: 5000,
            z: 15000,
            arms: 2,
            particles: 500,
            coreSize: 600,
            spiralSpread: 1500,
            rotation: 0.1,
            rotationSpeed: -0.0007,
            tiltX: 0.5,     
            tiltY: 0.3,     
            tiltZ: 0.5,
            color: "rgba(91, 150, 226, 0.95)",
            coreColor: "rgba(255, 245, 107, 0.8)"
        },
        {
            x: -1000,
            y: -3000,
            z: 45000,
            arms: 2,
            particles: 150,
            coreSize: 200,
            spiralSpread: 600,
            rotation: 1.2,
            rotationSpeed: -0.0004,
            tiltX: 0.0,     
            tiltY: 0.2,
            tiltZ: 0.5,
            color: "rgba(233, 21, 21, 0.41)",
            coreColor: "rgba(255, 0, 0, 0.53)"
        },
        {
            x: 20000,
            y: -4000,
            z: 14000,
            arms: 2, 
            particles: 500,
            coreSize: 400,
            spiralSpread: 750,
            rotation: 2.4,
            rotationSpeed: 0.0001,
            tiltX: -0.2,
            tiltY: 0.7,    
            tiltZ: 0.4,
            color: "rgba(255, 180, 255, 0.95)",
            coreColor: "rgba(235, 208, 227, 0.77)"
        }
    ];
    
    galaxies.forEach(galaxy => {
        galaxy.points = [];

        for (let i = 0; i < galaxy.particles; i++) {
            const arm = i % galaxy.arms;
            const baseAngle = (i / galaxy.particles) * Math.PI * 4 + (arm * Math.PI * 2 / galaxy.arms);
            const dist = (i / galaxy.particles) * galaxy.spiralSpread;
            const randomY = (Math.random() - 0.5) * 150;  

            galaxy.points.push({
                baseAngle,
                dist,
                y: randomY
            });
        }
    });

    const planets = [{
            id: 'project_portfolio',
            name: 'This portfolio',
            description: 'The design of this portfolio website and its process.',
            radius: 600,
            position: { x: -15000, y: -2000, z: 50000 },
            color: 'rgba(83, 60, 0, 0.89)',
            textureUrl: 'img/planetTextures/rocks.png',
            textureSpeed: 12, 
            textureOpacity: 0.3,
            tooltip: {
                type: "Web design",
                languages: "HTML, CSS, JS",
                timeline: "Ongoing",
                image: "img/portfolioExample.jpg"
            }
        }, {
            id: 'project_logo',
            name: 'My logo',
            description: 'The design of my logo and how it came to be.',
            radius: 600,
            position: { x: 5000, y: 25000, z: 50000 },
            color: 'rgba(109, 31, 0, 0.89)',
            textureUrl: 'img/planetTextures/lava.png',
            textureSpeed: 15, 
            textureOpacity: 0.1,
            tooltip: {
                type: "Graphic design",
                languages: "-",
                timeline: "2 days",
                image: "img/placeholder_1280x720.png"
            }
        }, {
            id: 'project_godot',
            name: '2D platformer game',
            description: 'A 2D platformer game made in Godot for a school project.',
            radius: 1000,
            position: { x: 8000, y: 5000, z: 50000 },
            color: 'rgba(2, 160, 172, 0.9)',
            textureUrl: 'img/planetTextures/water.png',
            textureSpeed: 6, 
            textureOpacity: 0.35,
            tooltip: {
                type: "Game development",
                languages: "C++",
                timeline: "8 weeks",
                image: "img/Astroblast.png"
            }
        }
    ];

    // Add placeholder planets to the back for future projects
    const PLACEHOLDER_COUNT = 10;
    for (let i = 0; i < PLACEHOLDER_COUNT; i++) {
        const x = Math.random() * (30000 + 10000) - 10000;    
        const y = Math.random() * (20000 + 20000) - 20000;    
        const z = -Math.random() * (30000 - 1000) - 1000;     

        const radius = Math.random() * 500 + 300;

        planets.push({
            id: `placeholder_planet${i}`,
            name: 'Future project',
            description: 'A placeholder for a future project.',
            radius: radius,
            position: { x, y, z },
            color: 'transparent',
            textureSpeed: 10,
            textureOpacity: 0.25,
            tooltip: {
                type: "N.A.",
                languages: "N.A.",
                timeline: "N.A.",
                image: "img/NA.png"
            }
        });
    }


    planets.forEach(planet => {
        const wrapper = document.createElement("div");
        wrapper.className = "planetWrapper";
        wrapper.style.position = "absolute";
        wrapper.style.transform = "translate(-50%, -50%)";
        wrapper.style.pointerEvents = "auto";
        wrapper.style.zIndex = "100";

        const sphere = document.createElement("div");
        sphere.className = "planet";
        sphere.style.pointerEvents = "none"; // So wrapper stays clickable

        
        const highlight = document.createElement("div");
        highlight.className = "planetHighlight";
        sphere.appendChild(highlight);
        
        wrapper.appendChild(sphere);

        wrapper.addEventListener("click", () => {
            document.querySelectorAll('.planetWrapper.focusedPlanet').forEach(p => p.classList.remove('focusedPlanet'));
            wrapper.classList.add("focusedPlanet");
            openPlanetOverlay(planet);
        });


        document.getElementById("planetOverlayContainer").appendChild(wrapper);
        planet._htmlElement = wrapper;


        const tooltip = document.getElementById("planetTooltip");
        const tooltipImage = document.getElementById("tooltipImage");
        planet._htmlElement.addEventListener("mouseenter", () => {
            const { name, tooltip: tip } = planet;
            tooltip.style.display = "block";
            document.getElementById("tooltipName").textContent = name;
            document.getElementById("tooltipType").textContent = `${tip?.type || "Unknown"}`;
            document.getElementById("tooltipLanguages").textContent = `${tip?.languages || "Unknown"}`;
            document.getElementById("tooltipTimeline").textContent = `${tip?.timeline || "--"}`;

            if (tip?.image) {
                tooltipImage.src = tip.image;
            } else {
                tooltipImage.src = "";
            }
        });

        planet._htmlElement.addEventListener("mouseleave", () => {
            tooltip.style.display = "none";
        });

        planet._htmlElement.addEventListener("mousemove", (e) => {
            const tooltipWidth = 300;
            const tooltipHeight = 225;
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const padding = 20;

            let left = e.clientX + 40;
            let top = e.clientY + 50;

            // Flip to left if it would overflow the right edge
            if (left + tooltipWidth + padding > screenWidth) {
                left = e.clientX - tooltipWidth - 20;
            }

            // Flip above if it would overflow the bottom edge
            if (top + tooltipHeight + padding > screenHeight) {
                top = e.clientY - tooltipHeight - 20;
            }

            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${top}px`;
        });
    });


    function drawPlanets() {
        planets.forEach(planet => {
            const el = planet._htmlElement;
            if (!el) return;

            const projected = project3DTo2D(planet.position);
            if (!projected) {
                el.style.display = "none";
                return;
            }

            const radius = planet.radius * projected.scale;
            el.style.display = "block";
            el.style.left = `${projected.x}px`;
            el.style.top = `${projected.y}px`;
            el.style.width = `${radius * 2}px`;
            el.style.height = `${radius * 2}px`;

            const sphere = el.querySelector(".planet");
            sphere.style.background = `radial-gradient(circle at 30% 30%, ${planet.color}, #000)`;

            let texture = sphere.querySelector(".planetTexture");
            if (!texture) {
                texture = document.createElement("div");
                texture.className = "planetTexture";
                sphere.appendChild(texture);
            }

            texture.style.backgroundImage = `url(${planet.textureUrl || ''})`;
            texture.style.animationDuration = `${planet.textureSpeed || 20}s`;
            texture.style.opacity = planet.textureOpacity || 0.3;
            texture.style.width = `${radius * 6}px`;
            texture.style.height = `${radius * 2}px`;
        });
    }




    function drawGalaxy(galaxy) {
        galaxy.rotation += galaxy.rotationSpeed;
    
        const dx = galaxy.x - cameraX;
        const dy = galaxy.y - cameraY;
        const dz = galaxy.z - cameraZ;
    
        const radY = rotationY * Math.PI / 180;
        const radX = rotationX * Math.PI / 180;
        const cosY = Math.cos(radY);
        const sinY = Math.sin(radY);
        const cosX = Math.cos(radX);
        const sinX = Math.sin(radX);
    
        const x1 = dx * cosY - dz * sinY;
        const z1 = dx * sinY + dz * cosY;
        const y1 = dy * cosX - z1 * sinX;
        const zRot = dy * sinX + z1 * cosX;
    
        if (zRot < 50 || zRot > 80000) return;
    
        const scale = Math.max(Math.min(1000 / zRot, 5), 0.05);
        const x2d = (x1 * scale) + width / 2;
        const y2d = (y1 * scale) + height / 2;
        const coreRadius = galaxy.coreSize * scale;
    
        const centerX = x2d;
        const centerY = y2d;
    
        // Draw spiral arms
        for (let i = 0; i < galaxy.points.length; i++) {
            const { baseAngle, dist, y: baseY } = galaxy.points[i];
            const angle = baseAngle + galaxy.rotation;
    
            let x = Math.cos(angle) * dist;
            let z = Math.sin(angle) * dist;
            let y = baseY;
    
            let tx = x * Math.cos(galaxy.tiltZ) - y * Math.sin(galaxy.tiltZ);
            let ty = x * Math.sin(galaxy.tiltZ) + y * Math.cos(galaxy.tiltZ);
            x = tx; y = ty;
    
            tx = x * Math.cos(galaxy.tiltY) + z * Math.sin(galaxy.tiltY);
            let tz = -x * Math.sin(galaxy.tiltY) + z * Math.cos(galaxy.tiltY);
            x = tx; z = tz;
    
            ty = y * Math.cos(galaxy.tiltX) - z * Math.sin(galaxy.tiltX);
            tz = y * Math.sin(galaxy.tiltX) + z * Math.cos(galaxy.tiltX);
            y = ty; z = tz;
    
            const px = galaxy.x + x;
            const py = galaxy.y + y;
            const pz = galaxy.z + z;
    
            const projected = project3DTo2D({ x: px, y: py, z: pz });
            if (!projected) continue;

            const x2d = projected.x;
            const y2d = projected.y;
            const scale = projected.scale;
            const size = Math.max(0.3 * scale, 0.75);
    
            // Skip particles that fall inside the projected core
            const dxC = x2d - centerX;
            const dyC = y2d - centerY;
            if ((dxC * dxC + dyC * dyC) < coreRadius * coreRadius/2) continue;
    
            ctx.beginPath();
            ctx.fillStyle = galaxy.color || "rgba(180, 220, 255, 0.95)";
            ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
            ctx.fill();
        }
    
        // Draw the glowing core on top
        const baseCore = galaxy.coreColor || "rgba(255,255,255,0.8)";
        const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreRadius);
        grad.addColorStop(0, baseCore);
        grad.addColorStop(1, baseCore.replace(/[\d.]+\)$/, "0)"));
        
    
        ctx.beginPath();
        ctx.fillStyle = grad;
        ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    
    






    let cameraX = 0, cameraY = 0, cameraZ = 0;
    let rotationY = 0;
    let rotationX = 0;

    function drawStar(ctx, x, y, radius, hue, alpha, flareScale = 1.0, shape = "flare", starClass = "medium") {
        const glowRadius = radius * 4;
    
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
        gradient.addColorStop(0, `hsla(${hue}, 100%, 95%, ${alpha})`);
        gradient.addColorStop(0.3, `hsla(${hue}, 100%, 85%, ${alpha * 0.5})`);
        gradient.addColorStop(1, `hsla(${hue}, 100%, 85%, 0)`);
    
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
    
        if (shape === "flare" && starClass !== "small") {
            ctx.save();
            ctx.translate(x, y);
    
            // Brighter/larger flares for the larger stars
            let flareAlpha = starClass === "large" ? alpha * 0.4 : alpha * 0.2;
            let flareWidth = starClass === "large" ? 0.7 : 0.4;
    
            ctx.strokeStyle = `hsla(${hue}, 100%, 90%, ${flareAlpha})`;
            ctx.lineWidth = flareWidth;
    
            const flareLen = radius * (starClass === "large" ? 5 : 2.5) * flareScale;
            const diagLen = radius * (starClass === "large" ? 3.5 : 1.8) * flareScale;
    
            ctx.beginPath(); ctx.moveTo(0, -flareLen); ctx.lineTo(0, flareLen); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(-flareLen, 0); ctx.lineTo(flareLen, 0); ctx.stroke();
    
            ctx.beginPath();
            ctx.moveTo(-diagLen, -diagLen); ctx.lineTo(diagLen, diagLen);
            ctx.moveTo(diagLen, -diagLen); ctx.lineTo(-diagLen, diagLen);
            ctx.stroke();
    
            ctx.restore();
        }
    }

    function drawStars() {
        visibleCount = 0;
        ctx.clearRect(0, 0, width, height);

        galaxies.forEach(drawGalaxy);

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

            const radY = rotationY * Math.PI / 180;
            const radX = rotationX * Math.PI / 180;
            const cosY = Math.cos(radY);
            const sinY = Math.sin(radY);
            const cosX = Math.cos(radX);
            const sinX = Math.sin(radX);


            const distanceBoost = projected.zRot > 30000 ? 1.3 : 1.0;
            const alpha = star.baseAlpha * (0.6 + 0.4 * Math.sin(star.twinklePhase)) * star.fadeProgress /** depthFade */* distanceBoost;
            const x2d = projected.x;
            const y2d = projected.y;
            const scale = projected.scale;
            const radius = Math.max(star.size * scale, 0.2);

            if (x2d < -200 || x2d > width + 200 || y2d < -200 || y2d > height + 200) return;

            visibleCount++;
            drawStar(ctx, x2d, y2d, radius, star.hue, alpha, star.flareScale, star.shape, star.class);


            // Recycle stars behind
            if (star.z - cameraZ > star.recycleDistance) {
                const angle = Math.random() * Math.PI * 2;
                const r = Math.random() * 8000 + 2000;
                star.x = Math.cos(angle) * r;
                star.y = Math.sin(angle) * r;
                star.z = cameraZ - 5000;
                star.recycleDistance = 8000 + Math.random() * 4000;
                star.fadeProgress = 0;
                star.fadingIn = true;
            }

            // Recycle stars ahead (not working)
            if (cameraZ - star.z > star.recycleDistance) {
                const angle = Math.random() * Math.PI * 2;
                const r = Math.random() * 8000 + 2000;
                star.x = Math.cos(angle) * r;
                star.y = Math.sin(angle) * r;
                star.z = cameraZ + 5000;
                star.recycleDistance = 8000 + Math.random() * 4000;
                star.fadeProgress = 0;
                star.fadingIn = true;
            }
        });
    }

    let lastTime = performance.now();

    function animate(currentTime) {
        const delta = (currentTime - lastTime) / 1000; // seconds
        lastTime = currentTime;
    
        galaxies.forEach(galaxy => {
            galaxy.rotation += galaxy.rotationSpeed * delta;
        });
    
        const rotFactor = 40; 
        const offsetX =
          -cameraX * 0.02 + Math.sin(rotationY * Math.PI / 180) * rotFactor;
        const offsetY =
          -cameraY * 0.02 + Math.sin(rotationX * Math.PI / 180) * rotFactor;
        
        document.querySelector(".stars_far").style.backgroundPosition =
          `${offsetX * 0.75}px ${offsetY * 0.75}px`;
        
        document.querySelector(".stars_mid").style.backgroundPosition =
          `${offsetX}px ${offsetY}px`;
        
        document.querySelector(".stars_near").style.backgroundPosition =
          `${offsetX * 2}px ${offsetY * 2}px`;
        
      
        cinematicCamera(currentTime);
        const blend = cinematicEnabled ? 0.02 : 0.05; 

        userInteracted ? null : cameraX += (driftTarget.x - cameraX) * blend;
        userInteracted ? null : cameraY += (driftTarget.y - cameraY) * blend;
        userInteracted ? null : rotationX += (driftTarget.rotX - rotationX) * blend;
        userInteracted ? null : rotationY += (driftTarget.rotY - rotationY) * blend;

        drawStars();
        drawPlanets(ctx);
        updateDebugHUD();
        requestAnimationFrame(animate);
    }
    
    function cinematicCamera(time) {
        if (!cinematicEnabled) return;
    
        const panRadius = 5000;
        const rotRadius = 3;
        const panSpeedX = 0.00004;
        const panSpeedY = 0.00004;
    
        driftTarget.x = Math.sin(time * panSpeedX) * panRadius;
        driftTarget.y = Math.cos(time * panSpeedY) * panRadius;
        driftTarget.rotX = Math.sin(time * 0.00015) * rotRadius;
        driftTarget.rotY = Math.cos(time * 0.0001) * rotRadius;
    }
    
    
    function pauseCinematicCamera() {
        cinematicEnabled = false;
        clearTimeout(interactionTimeout);
        interactionTimeout = setTimeout(() => {
            cinematicEnabled = true;
            userInteracted = false;
        }, 5000); // Resume after 5 seconds of no input
    }
    
    
    function updateDebugHUD() {
        const hud = document.getElementById("debugHUD");
        hud.textContent =
            `CameraX: ${cameraX.toFixed(0)}\n` +
            `CameraY: ${cameraY.toFixed(0)}\n` +
            `CameraZ: ${cameraZ.toFixed(0)}\n` +
            `RotationX: ${rotationX.toFixed(1)}°\n` +
            `RotationY: ${rotationY.toFixed(1)}°\n` +
            `Visible Stars: ${visibleCount}`;
    }

    canvas.addEventListener("click", (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        for (const planet of planets) {
            const dx = planet._screenX - mouseX;
            const dy = planet._screenY - mouseY;
            if (dx * dx + dy * dy < planet._screenRadius * planet._screenRadius) {
                openPlanetOverlay(planet);
                break;
            }
        }
    });

    document.getElementById("closePlanetOverlay").addEventListener("click", closePlanetOverlay);



    function openPlanetOverlay(planet) {
        const overlay = document.getElementById("planetOverlay");
        if (!overlay) return;

        overlay.classList.remove("exiting");
        overlay.style.display = "flex";
        requestAnimationFrame(() => overlay.classList.add("visible"));

        overlay.querySelector("h2").textContent = planet.name;
        overlay.querySelector("p").textContent = planet.description;

        const imgEl = document.getElementById("planetOverlayImage");
        imgEl.src = planet.tooltip?.image || "";
        imgEl.style.display = planet.tooltip?.image ? "block" : "none";
    }

    function closePlanetOverlay() {
        const overlay = document.getElementById("planetOverlay");
        if (!overlay) return;
        overlay.classList.remove("visible");
        overlay.classList.add("exiting");
    }

    requestAnimationFrame(() => {
        const enterBtn = document.getElementById("enterPlanetBtn");
        const overlay = document.getElementById("transitionOverlaySpace");

        if (!enterBtn) return;

        enterBtn.addEventListener("click", () => {
            const focused = document.querySelector(".planetWrapper.focusedPlanet");
            if (!focused) {
            console.warn("No focused planet found");
            return;
            }

            // Get position difference to center the planet
            const rect = focused.getBoundingClientRect();
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const offsetX = centerX - (rect.left + rect.width / 2);
            const offsetY = centerY - (rect.top + rect.height / 2);

            // Apply transform immediately
            focused.style.transition = "transform 1s ease-in-out";
            focused.style.transform += ` translate(${offsetX}px, ${offsetY}px) scale(8)`;
            focused.style.zIndex = "99998";

            // Start fade to black right away
            if (overlay) {
            overlay.style.pointerEvents = "auto";
            overlay.style.opacity = "1";
            }

            // Navigate after both animations finish (safe buffer)
            setTimeout(() => {
            window.location.href = "planet.html";
            }, 1000);
    });
    });




    window.addEventListener("keydown", (e) => {
        pauseCinematicCamera();
        userInteracted = true;
        const step = 300;
        const rotationStep = 5;

        switch (e.key) {
            case "w": cameraY -= step; break;
            case "s": cameraY += step; break;
            case "a": cameraX -= step; break;
            case "d": cameraX += step; break;
            case "q": cameraZ += step; break;
            case "e": cameraZ -= step; break;
            case "z": rotationY -= rotationStep; break;
            case "x": rotationY += rotationStep; break;
        }
    });

    // Mouse drag to rotate camera
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    canvas.addEventListener("mousedown", (e) => {
        userInteracted = true;
        pauseCinematicCamera();
        isDragging = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    });

    canvas.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        userInteracted = true;
        pauseCinematicCamera();
        const dx = e.clientX - lastMouseX;
        const dy = e.clientY - lastMouseY;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;

        rotationY += dx * 0.2;
        rotationX += dy * 0.2;
        rotationX = Math.max(-90, Math.min(90, rotationX));
    });

    canvas.addEventListener("mouseup", () => isDragging = false);
    canvas.addEventListener("mouseleave", () => isDragging = false);

    requestAnimationFrame(animate);

    window.addEventListener("resize", () => {
        canvas.width = width = window.innerWidth;
        canvas.height = height = window.innerHeight;
    });
}
