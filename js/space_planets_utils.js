let activePlanetForOverlay = null;

function initializePlanetsArrayAndDOM() {
    const planetData = [{
            id: 'project_portfolio', name: 'This portfolio', description: 'The design of this portfolio website and its process.',
            radius: 1250, position: { x: -15000, y: -2000, z: 50000 }, color: 'rgba(83, 60, 0, 0.89)',
            textureUrl: 'img/planetTextures/rocks.png', textureSpeed: 12, textureOpacity: 0.3,
            tooltip: { type: "Web design", languages: "HTML, CSS, JS", timeline: "Ongoing", image: "img/portfolioExample.jpg" },
            ringText: "PORTFOLIO", ringColor: "gold", ringSpeed: 60, isEnteringAnimation: false,
            url: 'pages/portfolio_design.html'
        }, {
            id: 'project_logo', name: 'My logo', description: 'The design of my logo and how it came to be.',
            radius: 1250, position: { x: 5000, y: 25000, z: 50000 }, color: 'rgba(109, 31, 0, 0.89)',
            textureUrl: 'img/planetTextures/lava.png', textureSpeed: 15, textureOpacity: 0.1,
            tooltip: { type: "Graphic design", languages: "-", timeline: "2 days", image: "img/placeholder_1280x720.png" },
            ringText: "LOGO DESIGN", ringColor: "#FF69B4", ringSpeed: 40, isEnteringAnimation: false,
            url: 'pages/logo_design.html'
        }, {
            id: 'project_godot', name: '2D platformer game', description: 'A 2D platformer game made in Godot for a school project.',
            radius: 1700, position: { x: 8000, y: 5000, z: 50000 }, color: 'rgba(2, 160, 172, 0.9)',
            textureUrl: 'img/planetTextures/water_dark.png', textureSpeed: 6, textureOpacity: 0.5,
            tooltip: { type: "Game development", languages: "C++", timeline: "8 weeks", image: "img/Astroblast.png" },
            ringText: "GAME DESIGN", ringColor: "#00FFFF", ringSpeed: 60, isEnteringAnimation: false,
            url: 'pages/game_design.html'
        }
    ];

    const PLACEHOLDER_COUNT = 10;
    for (let i = 0; i < PLACEHOLDER_COUNT; i++) {
        const x = Math.random() * (60000) - 30000;
        const y = Math.random() * (80000) - 40000;
        const z = -Math.random() * (29000) - 1000;
        const radius = Math.random() * 1000 + 750;
        planetData.push({
            id: `placeholder_planet${i}`, name: 'Future project', description: 'A placeholder for a future project.',
            radius: radius, position: { x, y, z }, color: 'transparent',
            textureSpeed: 10, textureOpacity: 0.25,
            tooltip: { type: "N.A.", languages: "N.A.", timeline: "N.A.", image: "img/NA.png" },
            ringText: "PLACEHOLDER", ringColor: "#FFFFFF", ringSpeed: 100, isEnteringAnimation: false,
        });
    }
    
    planets.push(...planetData);

    const planetOverlayContainer = document.getElementById("planetOverlayContainer");
    const tooltipElement = document.getElementById("planetTooltip");
    const tooltipImage = document.getElementById("tooltipImage");
    const tooltipName = document.getElementById("tooltipName");
    const tooltipType = document.getElementById("tooltipType");
    const tooltipLanguages = document.getElementById("tooltipLanguages");
    const tooltipTimeline = document.getElementById("tooltipTimeline");

    planets.forEach(planet => {
        planet.isEnteringAnimation = false; 

        const wrapper = document.createElement("div");
        wrapper.className = "planetWrapper";
        wrapper.style.position = "absolute";
        wrapper.style.pointerEvents = "auto";
        wrapper.style.zIndex = "100";
        wrapper.style.transformStyle = "preserve-3d";

        const sphere = document.createElement("div");
        sphere.className = "planet";
        sphere.style.pointerEvents = "none";
        sphere.style.transform = "translateZ(0px)";
        
        const highlight = document.createElement("div");
        highlight.className = "planetHighlight";
        sphere.appendChild(highlight);
        
        wrapper.appendChild(sphere);
        planet._htmlElement = wrapper;

        if (planet.ringText && planet.ringText.length > 0) {
            const letterRingContainer = document.createElement('div');
            letterRingContainer.className = 'planet-letter-ring';
            letterRingContainer.style.transformStyle = 'preserve-3d';
            wrapper.appendChild(letterRingContainer);
            planet._letterRingContainer = letterRingContainer;
            planet._letterElements = [];
            planet._ringRotationAngle = -90;

            const letters = planet.ringText.split('');
            const numLetters = letters.length;
            const targetWordArcRadians = planet.ringTextArcRadians || (Math.PI * 0.75); 
            let angleIncrement = numLetters > 1 ? targetWordArcRadians / (numLetters - 1) : 0;
            const firstLetterAngle = -targetWordArcRadians / 2;

            for (let i = 0; i < numLetters; i++) {
                const letterDiv = document.createElement('div');
                letterDiv.className = 'planet-ring-letter';
                letterDiv.textContent = letters[i];
                letterDiv.style.position = 'absolute';
                letterDiv.style.color = planet.ringColor || 'white';
                const letterAngleRad = firstLetterAngle + ((numLetters - 1 - i) * angleIncrement);
                letterDiv.dataset.initialAngleRad = letterAngleRad.toString();
                letterRingContainer.appendChild(letterDiv);
                planet._letterElements.push(letterDiv);
            }
        }

        wrapper.addEventListener("click", () => {
            document.querySelectorAll('.planetWrapper.focusedPlanet').forEach(p => p.classList.remove('focusedPlanet'));
            wrapper.classList.add("focusedPlanet");
            openPlanetOverlay(planet);
        });

        planetOverlayContainer.appendChild(wrapper);

        wrapper.addEventListener("mouseenter", () => {
            const { name, tooltip: tip } = planet;
            tooltipElement.style.display = "block";
            tooltipName.textContent = name;
            tooltipType.textContent = `${tip?.type || "Unknown"}`;
            tooltipLanguages.textContent = `${tip?.languages || "Unknown"}`;
            tooltipTimeline.textContent = `${tip?.timeline || "--"}`;
            tooltipImage.src = tip?.image || "img/NA.png"; // Default image if none
        });

        wrapper.addEventListener("mouseleave", () => {
            tooltipElement.style.display = "none";
        });

        wrapper.addEventListener("mousemove", (e) => {
            const tooltipWidth = 300; const tooltipHeight = 225;
            const screenWidth = window.innerWidth; const screenHeight = window.innerHeight;
            const padding = 20;
            let left = e.clientX + 40; let top = e.clientY + 50;
            if (left + tooltipWidth + padding > screenWidth) left = e.clientX - tooltipWidth - 20;
            if (top + tooltipHeight + padding > screenHeight) top = e.clientY - tooltipHeight - 20;
            tooltipElement.style.left = `${left}px`;
            tooltipElement.style.top = `${top}px`;
        });
    });
}

function drawPlanets() {
    planets.forEach(planet => {
        const el = planet._htmlElement;
        if (!el) return;

        if (planet.isEnteringAnimation) {
            el.style.display = "block"; 
            if (planet._letterRingContainer) {
                planet._letterRingContainer.style.display = "none"; 
            }
            return; 
        }

        const projected = project3DTo2D(planet.position);
        if (!projected) {
            el.style.display = "none";
            if (planet._letterRingContainer) planet._letterRingContainer.style.display = "none";
            return;
        }

        el.style.display = "block";
        const radiusOnScreen = planet.radius * projected.scale;
        el.style.left = `${projected.x}px`;
        el.style.top = `${projected.y}px`;
        el.style.width = `${radiusOnScreen * 2}px`;
        el.style.height = `${radiusOnScreen * 2}px`;
        el.style.transform = `translate(-50%, -50%)`;

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
        texture.style.width = `${radiusOnScreen * 6}px`;
        texture.style.height = `${radiusOnScreen * 2}px`;


        if (planet._letterRingContainer) {
            const ringContainer = planet._letterRingContainer;
            ringContainer.style.display = "block";
            const actualRingOrbitRadiusPixels = planet.radius * ringOrbitRadiusFactor * projected.scale;
            
            const baseLetterFontSize = planet.radius * 0.3; 
            const scaledFontSize = baseLetterFontSize * projected.scale;
            const finalFontSize = Math.max(24, Math.min(scaledFontSize, 150)); 
            
            const verticalRingOffset = finalFontSize * 0.50; 
            ringContainer.style.transform = `translateY(-${verticalRingOffset}px) rotateY(${planet._ringRotationAngle}deg)`;
            const ringRotationRad = planet._ringRotationAngle * Math.PI / 180;

            planet._letterElements.forEach((letterDiv) => {
                const letterAngleRad = parseFloat(letterDiv.dataset.initialAngleRad);
                const xPos = Math.cos(letterAngleRad) * actualRingOrbitRadiusPixels;
                const zPos = Math.sin(letterAngleRad) * actualRingOrbitRadiusPixels;
                const yRotationDeg = (Math.PI / 2 - letterAngleRad) * (180 / Math.PI); 
                letterDiv.style.transform = `translateX(${xPos}px) translateZ(${zPos}px) rotateY(${yRotationDeg}deg)`;
                letterDiv.style.fontSize = `${finalFontSize}px`;
                const letterViewZ = xPos * Math.sin(ringRotationRad) + zPos * Math.cos(ringRotationRad);
                letterDiv.style.opacity = letterViewZ > 0 ? '0.6' : '1'; 
            });
        } else if (planet._letterRingContainer) {
             planet._letterRingContainer.style.display = "none";
        }
    });
}

function openPlanetOverlay(planet) {
    activePlanetForOverlay = planet; 
    const overlay = document.getElementById("planetOverlay");
    if (!overlay) return;

    overlay.classList.remove("exiting");
    overlay.style.display = "flex";
    requestAnimationFrame(() => overlay.classList.add("visible"));

    overlay.querySelector("h2").textContent = planet.name;
    overlay.querySelector("p").textContent = planet.description;
    const imgEl = document.getElementById("planetOverlayImage");
    imgEl.src = planet.tooltip?.image || "img/NA.png";
    imgEl.style.display = planet.tooltip?.image ? "block" : "none";

    const enterBtn = document.getElementById("enterPlanetBtn");
    enterBtn.style.display = planet.url ? "block" : "none";
}

function closePlanetOverlay() {
    activePlanetForOverlay = null; 
    const overlay = document.getElementById("planetOverlay");
    if (!overlay) return;
    
    // This was to fix some flickering bug
    if (overlay.classList.contains("visible")) {
        overlay.classList.remove("visible");
        overlay.classList.add("exiting");
    }
    
    // Always clear any focused planet class
    document.querySelectorAll('.planetWrapper.focusedPlanet').forEach(p => p.classList.remove('focusedPlanet'));
}

function attachPlanetOverlayEventListeners() {
    const overlay = document.getElementById("planetOverlay");
    if (overlay) {
        overlay.addEventListener("animationend", () => {
            // Hide the overlay if its exiting just in case
            if (overlay.classList.contains("exiting")) {
                overlay.style.display = "none";
                overlay.classList.remove("exiting");
            }
        });
    }

    document.getElementById("closePlanetOverlay").addEventListener("click", closePlanetOverlay);

    const enterBtn = document.getElementById("enterPlanetBtn");
    const transitionOverlay = document.getElementById("transitionOverlaySpace");
    if (enterBtn && transitionOverlay) {
        enterBtn.addEventListener("click", () => {
            if (!activePlanetForOverlay || !activePlanetForOverlay._htmlElement) {
                console.warn("No active planet found for transition or its HTML element is missing.");
                return;
            }

            if (!activePlanetForOverlay.url) {
                console.warn("No URL is defined for the selected planet:", activePlanetForOverlay.id);
                return;
            }
            
            const focusedPlanetElement = activePlanetForOverlay._htmlElement;
            activePlanetForOverlay.isEnteringAnimation = true; 

            const rect = focusedPlanetElement.getBoundingClientRect();
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const offsetX = centerX - (rect.left + rect.width / 2);
            const offsetY = centerY - (rect.top + rect.height / 2);
            
            focusedPlanetElement.style.transition = "transform 1s ease-in-out, z-index 0s 0s";
            focusedPlanetElement.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) scale(8)`;
            focusedPlanetElement.style.zIndex = "99998";

            transitionOverlay.style.pointerEvents = "auto";
            transitionOverlay.style.opacity = "1";

            setTimeout(() => {
                window.location.href = activePlanetForOverlay.url; 
            }, 1000);
        });
    }
}
