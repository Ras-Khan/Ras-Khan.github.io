/* Redundant function, not used anymore. Might use it as a future model to showcase it */

function initializeWater(options = {}) {
    const canvas = options.canvasElement || document.getElementById("waterCanvas");
    if (!canvas) {
        console.error("Water canvas element could not be found.");
        return null;
    }
    const ctx = canvas.getContext("2d");

    const inc = 0.01;
    let offsetX = 0;
    let offsetY = 0;

    const skyCanvasSource = options.skyCanvasElement || document.getElementById("nightSky");
    const hasSkySource = !!skyCanvasSource;
    
    const skyReflectionCanvas = document.createElement("canvas");
    const skyReflectionCtx = skyReflectionCanvas.getContext("2d");
    let animationFrameId = null;

    function noise(x, y) {
        return (
            Math.sin(x * 2.1 + y * 0.7) +
            Math.sin(x * 0.3 - y * 1.3 + Math.cos(x * 0.02 + y * 0.01)) +
            Math.sin(x * 0.5 + y * 0.6)
        ) * 0.33;
    }
    
    function createStaticSkyReflection() {
        const parent = canvas.parentElement;
        if (!parent || parent.clientWidth === 0) return; // If there is nothing to reflect, just skip it

        skyReflectionCanvas.width = parent.clientWidth;
        skyReflectionCanvas.height = parent.clientHeight * 2; // Taller for reflection
        skyReflectionCtx.fillStyle = '#000913';
        skyReflectionCtx.fillRect(0, 0, skyReflectionCanvas.width, skyReflectionCanvas.height);
        for (let i = 0; i < 200; i++) {
            skyReflectionCtx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`;
            skyReflectionCtx.beginPath();
            skyReflectionCtx.arc(Math.random() * skyReflectionCanvas.width, Math.random() * skyReflectionCanvas.height, Math.random() * 1.5, 0, Math.PI * 2);
            skyReflectionCtx.fill();
        }
    }

    function resizeCanvas() {
        if (options.canvasElement) {
            const parent = options.canvasElement.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
            }
        } else {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight * 0.5;
        }

        if (!hasSkySource) {
            createStaticSkyReflection();
        }
    }

    function captureNightSky() {
        if (!hasSkySource) return;

        if (skyCanvasSource && skyCanvasSource.getContext) {
            const skyContext = skyCanvasSource.getContext("2d");
            if (!skyContext) return;

            skyReflectionCanvas.width = skyCanvasSource.clientWidth;
            skyReflectionCanvas.height = skyCanvasSource.clientHeight;
            skyReflectionCtx.drawImage(skyContext.canvas, 0, 0);
        }
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

     function drawReflection() {
        captureNightSky();

        const stripHeight = 3;
        ctx.save();
        ctx.globalAlpha = 0.15;
        ctx.scale(1, -1);

        for (let y = 0; y < canvas.height; y += stripHeight) {
            const depthFactor = y / canvas.height;
            const distortion = noise((y + offsetX * 100) * 0.01, offsetY * 10) * 20 * (0.3 + depthFactor * 1.2);
            ctx.drawImage(
                skyReflectionCanvas,
                0, y, canvas.width, stripHeight,
                distortion * depthFactor, -canvas.height + y,
                canvas.width * (1 + depthFactor * 0.2),
                stripHeight
            );
        }
        ctx.restore();
    }

    function drawWaterSurface() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, "rgba(58, 112, 183, 0.80)");
        gradient.addColorStop(1, "rgba(16, 41, 73, 1.00)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    
    function drawWaves() {
        const waveResolution = 10; 
        ctx.save();
    
        for (let y = 0; y < canvas.height; y += waveResolution) {
            const noiseY = (y / 60) + offsetY;
    
            for (let x = 0; x < canvas.width; x += waveResolution) {
                const displacement = noise((x / 60) + offsetX, noiseY);
    
                const brightness = Math.floor(80 + displacement * 100); 
                const r = 40 + brightness * 0.5;
                const g = 120 + brightness * 0.6;
                const b = 180 + brightness * 0.4;
    
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.12)`; 
                ctx.fillRect(x, y, waveResolution, waveResolution);
            }
        }
        ctx.restore();
    }
    
    function drawReflectionRipples() {
        ctx.save();
        ctx.globalAlpha = 0.08;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 1.2;
    
        const rippleSpacing = 8;
        for (let y = 0; y < canvas.height; y += rippleSpacing) {
            ctx.beginPath();
            for (let x = 0; x <= canvas.width; x += 10) {
                const displacement = noise((x / 50) + offsetX, (y / 50) + offsetY);
                const rippleY = y + displacement * 6;
    
                if (x === 0) ctx.moveTo(x, rippleY);
                else ctx.lineTo(x, rippleY);
            }
            ctx.stroke();
        }
    
        ctx.restore();
    }
    
    function animate() {
        offsetX += inc;
        offsetY -= inc;
        drawWaterSurface();
        drawReflection();
        drawWaves();
        drawReflectionRipples();

        animationFrameId = requestAnimationFrame(animate);
    }
    
    const start = () => {
        if (!animationFrameId) {
            animate();
        }
    };

    const stop = () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        // Not removing resize listener, as it might be needed if component is resized while hidden
    };

    return { start, stop };
}