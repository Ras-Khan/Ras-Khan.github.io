
var cameraX, cameraY, cameraZ;
var rotationX, rotationY;
var userInteracted, interactionTimeout;
var driftTarget; 

var starCount;
var stars; 
var visibleCount; 

var galaxies;

var ringOrbitRadiusFactor;
var planets; 

var isPlanetFocusMode;
var focusedPlanetIndex;
var navigatablePlanets;
var focusTarget;

var canvas, ctx, width, height;
var lastTime; 
var isDragging, lastMouseX, lastMouseY; 

function initializeSpace() {
    canvas = document.getElementById("universeSky");
    if (!canvas) {
        console.error("universeSky canvas not found!");
        return;
    }
    ctx = canvas.getContext("2d", { alpha: true });
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    width = canvas.width;
    height = canvas.height;

    cameraX = 0; cameraY = 0; cameraZ = 0;
    rotationX = 0; rotationY = 5.0; 
    userInteracted = false;
    driftTarget = { x: 0, y: 0, rotX: 0, rotY: 0 };
    interactionTimeout = null;

    starCount = 1000;
    stars = [];
    visibleCount = 0;

    galaxies = [];

    ringOrbitRadiusFactor = 1.25;
    planets = [];
    
    isPlanetFocusMode = false;
    focusedPlanetIndex = -1;
    focusTarget = { x: 0, y: 0, z: 0, rotX: 0, rotY: 0 };

    isDragging = false;
    lastMouseX = 0;
    lastMouseY = 0;
    lastTime = performance.now();

    initializeStarsArray();
    initializeGalaxiesArray();
    initializePlanetsArrayAndDOM();

    // Filter the placeholder planets
    navigatablePlanets = planets
        .filter(p => !p.id.startsWith('placeholder_'))
        .sort((a, b) => a.position.x - b.position.x);

    attachCameraEventListeners(canvas);
    attachPlanetOverlayEventListeners();

    // Attach the planet navigation listener
    document.getElementById("nav_planet_next")?.addEventListener("click", () => navigateToPlanet(1));

    requestAnimationFrame(animate);
    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        width = canvas.width;
        height = canvas.height;
    });
}

function navigateToPlanet(direction) {
    userInteracted = true;
    isPlanetFocusMode = true;
    resetIdleTimer();

    if (navigatablePlanets.length === 0) return;

    // Update focused planet
    focusedPlanetIndex += direction;
    if (focusedPlanetIndex >= navigatablePlanets.length) {
        focusedPlanetIndex = 0;
    } else if (focusedPlanetIndex < 0) {
        focusedPlanetIndex = navigatablePlanets.length - 1;
    }

    const targetPlanet = navigatablePlanets[focusedPlanetIndex];

    focusTarget.x = cameraX;
    focusTarget.y = cameraY;
    focusTarget.z = cameraZ;

    // Calculate target camera rotation to look at the planet from the current position.
    const dx = targetPlanet.position.x - cameraX;
    const dy = targetPlanet.position.y - cameraY;
    const dz = targetPlanet.position.z - cameraZ;
    
    // Not really sure how this math works, I had help with this
    focusTarget.rotY = Math.atan2(dx, dz) * (180 / Math.PI);
    focusTarget.rotX = Math.atan2(dy, Math.hypot(dx, dz)) * (180 / Math.PI);
    
    // Close any open overlay and focus
    closePlanetOverlay();
    
    // Highlight the new planet
    if (targetPlanet._htmlElement) {
        targetPlanet._htmlElement.classList.add("focusedPlanet");
    }
}

// Not really used anymore
function updateDebugHUD() {
    const hud = document.getElementById("debugHUD");
    if (hud) {
        hud.textContent =
            `CameraX: ${cameraX.toFixed(0)}\n` +
            `CameraY: ${cameraY.toFixed(0)}\n` +
            `CameraZ: ${cameraZ.toFixed(0)}\n` +
            `RotationX: ${rotationX.toFixed(1)}°\n` +
            `RotationY: ${rotationY.toFixed(1)}°\n` +
            `Visible Stars: ${visibleCount}`;
    }
}

function animate(currentTime) {
    const delta = (currentTime - lastTime) / 1000; 
    lastTime = currentTime;

    galaxies.forEach(galaxy => {
        galaxy.rotation += galaxy.rotationSpeed * 1000 * delta; 
    });

    // Updating parallax background
    const rotFactor = 40;
    const offsetX = -cameraX * 0.02 + Math.sin(rotationY * Math.PI / 180) * rotFactor;
    const offsetY = -cameraY * 0.02 + Math.sin(rotationX * Math.PI / 180) * rotFactor;
    document.querySelector(".stars_far").style.backgroundPosition = `${offsetX * 0.75}px ${offsetY * 0.75}px`;
    document.querySelector(".stars_mid").style.backgroundPosition = `${offsetX}px ${offsetY}px`;
    document.querySelector(".stars_near").style.backgroundPosition = `${offsetX * 2}px ${offsetY * 2}px`;

    cinematicCamera(currentTime); 

    if (isPlanetFocusMode) {
        const focusBlend = 0.04; 
        
        let deltaRotX = focusTarget.rotX - rotationX;
        let deltaRotY = focusTarget.rotY - rotationY;

        if (deltaRotY > 180) deltaRotY -= 360;
        if (deltaRotY < -180) deltaRotY += 360;

        rotationX += deltaRotX * focusBlend;
        rotationY += deltaRotY * focusBlend;

    } else if (!userInteracted) {
        const blend = 0.02;
        cameraX += (driftTarget.x - cameraX) * blend;
        cameraY += (driftTarget.y - cameraY) * blend;
        
        let deltaRotX = driftTarget.rotX - rotationX;
        let deltaRotY = driftTarget.rotY - rotationY;

        if (deltaRotY > 180) deltaRotY -= 360;
        if (deltaRotY < -180) deltaRotY += 360;

        rotationX += deltaRotX * blend;
        rotationY += deltaRotY * blend;
    }

    planets.forEach(planet => {
        if (planet._letterRingContainer) {
            planet._ringRotationAngle = planet._ringRotationAngle || 0;
            const ringSpeedDegreesPerSecond = planet.ringSpeed === undefined ? 10 : planet.ringSpeed;
            planet._ringRotationAngle += ringSpeedDegreesPerSecond * delta;
            planet._ringRotationAngle %= 360;
        }
    });

    ctx.clearRect(0, 0, width, height);

    renderGalaxies(); 
    drawStars();      
    drawPlanets();    
    
    updateDebugHUD();
    requestAnimationFrame(animate);
}
