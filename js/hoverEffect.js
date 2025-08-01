function attachHighlightEffect(targetElement) {
    const beam = document.createElement("div");
    beam.classList.add("hover_highlight_beam");
    
    const direction = Math.random() < 0.5 ? -1 : 1;
    const rotationDegrees = 6 * direction;
    
    beam.dataset.diagonalDirection = direction;
    beam.style.transform = `translate(-50%, 0) rotate(${rotationDegrees}deg)`;
    
    document.body.appendChild(beam);
    
    for (let i = 0; i < 3; i++) {
        const ray = document.createElement("div");
        ray.classList.add("hover_ray");
        ray.style.left = `${60 + i * 80}px`;
        ray.style.animationDuration = `${2 + i}s`;
        beam.appendChild(ray);
    }

    let fadeOutTimeout;

    function updateBeamPosition() {
        const rect = targetElement.getBoundingClientRect();
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        const scrollX = window.scrollX || document.documentElement.scrollLeft;
        const direction = parseInt(beam.dataset.diagonalDirection);
    
        const shiftScale = Math.min(1, 200 / rect.width);
        const shiftX = direction * (rect.width * 0.16 * shiftScale);
    
        const heightScale = Math.min(1, 220 / rect.height);
        const centerX = rect.left + rect.width / 2 + scrollX + shiftX;
        const beamBottom = rect.top + scrollY + rect.height * 0.64 * heightScale + (150 - rect.height * 0.25);
    
        const topOffset = -300; // Start the beam further up so it looks like its coming down from the heavens
        beam.style.left = `${centerX}px`;
        beam.style.top = `${topOffset}px`;
        beam.style.height = `${beamBottom - topOffset}px`; // Adjust height to compensate
    }
        
    
    function showBeam() {
        updateBeamPosition();
        clearTimeout(fadeOutTimeout);
        beam.style.opacity = "1";
    }

    function hideBeam() {
        fadeOutTimeout = setTimeout(() => {
            beam.style.opacity = "0";
        }, 150);
    }

    targetElement.addEventListener("mouseenter", showBeam);
    targetElement.addEventListener("mousemove", updateBeamPosition);
    targetElement.addEventListener("mouseleave", hideBeam);
}

window.attachHighlightEffect = attachHighlightEffect;