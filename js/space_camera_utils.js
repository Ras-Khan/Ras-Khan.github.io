const idleTimer = 5000; 

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

    const fov = 1200; 
    const scale = Math.max(Math.min(fov / zRot, 5), 0.05);
    const x2d = (x1 * scale) + width / 2;
    const y2d = (y1 * scale) + height / 2;

    return { x: x2d, y: y2d, scale, zRot };
}

function cinematicCamera(time) {
    if (userInteracted) return; 

    const panRadius = 5000;
    const rotRadius = 3;
    const panSpeedX = 0.00004;
    const panSpeedY = 0.00004;
    const horizontalOffset = 5.0;

    driftTarget.x = Math.sin(time * panSpeedX) * panRadius;
    driftTarget.y = Math.cos(time * panSpeedY) * panRadius;
    driftTarget.rotX = Math.sin(time * 0.00015) * rotRadius;
    driftTarget.rotY = Math.cos(time * 0.0001) * rotRadius + horizontalOffset;
}

function resetIdleTimer() {
    clearTimeout(interactionTimeout);
    interactionTimeout = setTimeout(() => {
        userInteracted = false;
    }, idleTimer);
}

function attachCameraEventListeners(canvasElement) {
    // MOUSE EVENTS
    canvasElement.addEventListener("mousedown", (e) => {
        userInteracted = true;
        isPlanetFocusMode = false; // Break out of planet focus nav
        resetIdleTimer();
        isDragging = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    });

    canvasElement.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        userInteracted = true; 
        resetIdleTimer(); 
        const dx = e.clientX - lastMouseX;
        const dy = e.clientY - lastMouseY;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;

        rotationY += dx * 0.2;
        rotationX += dy * 0.2;
        rotationX = Math.max(-90, Math.min(90, rotationX));
    });

    canvasElement.addEventListener("mouseup", () => {
        isDragging = false;
    });

    canvasElement.addEventListener("mouseleave", () => {
        isDragging = false;
    });

    // TOUCH EVENTS
    canvasElement.addEventListener("touchstart", (e) => {
        if (e.touches.length === 1) {
            e.preventDefault(); // Prevent default touch actions like scrolling
            userInteracted = true;
            isPlanetFocusMode = false; // Break out of planet focus nav
            resetIdleTimer();
            isDragging = true;
            lastMouseX = e.touches[0].clientX;
            lastMouseY = e.touches[0].clientY;
        }
    }, { passive: false });

    canvasElement.addEventListener("touchmove", (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        e.preventDefault(); // Prevent scrolling if dragging
        userInteracted = true;
        resetIdleTimer();
        const dx = e.touches[0].clientX - lastMouseX;
        const dy = e.touches[0].clientY - lastMouseY;
        lastMouseX = e.touches[0].clientX;
        lastMouseY = e.touches[0].clientY;

        rotationY += dx * 0.2;
        rotationX += dy * 0.2;
        rotationX = Math.max(-90, Math.min(90, rotationX));
    }, { passive: false });

    canvasElement.addEventListener("touchend", () => {
        isDragging = false;
    });

    canvasElement.addEventListener("touchcancel", () => {
        isDragging = false;
    });

    window.addEventListener("keydown", (e) => {
        userInteracted = true;
        resetIdleTimer();
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
}
