
function initializeWater() {
    const canvas = document.getElementById("waterCanvas");
    const ctx = canvas.getContext("2d");

    const waveHeight = 15;
    const cols = 80;
    const rows = 60;
    const inc = 0.01;
    let offsetX = 0;
    let offsetY = 0;
    let mesh = [];

    const nightSky = document.getElementById("nightSky");
    const skyCanvas = document.createElement("canvas");
    const skyCtx = skyCanvas.getContext("2d");

    function noise(x, y) {
        return (Math.sin(x * 2.1 + y * 0.7) + Math.sin(x * 0.3 - y * 1.3)) * 0.5;
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight * 0.5;
    }

    function captureNightSky() {
        if (!nightSky) return;
        const skyContext = nightSky.getContext("2d");
        if (!skyContext) return;

        skyCanvas.width = nightSky.clientWidth;
        skyCanvas.height = nightSky.clientHeight;
        skyCtx.drawImage(skyContext.canvas, 0, 0);
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    function generateMesh() {
        mesh = [];
        const gridWidth = canvas.width / cols;
        const gridHeight = canvas.height / rows;

        for (let col = 0; col < cols; col++) {
            for (let row = 0; row < rows; row++) {
                mesh.push([
                    { x: col * gridWidth, y: row * gridHeight + gridHeight },
                    { x: col * gridWidth, y: row * gridHeight },
                    { x: col * gridWidth + gridWidth, y: row * gridHeight },
                ]);
                mesh.push([
                    { x: col * gridWidth + gridWidth, y: row * gridHeight },
                    { x: col * gridWidth + gridWidth, y: row * gridHeight + gridHeight },
                    { x: col * gridWidth, y: row * gridHeight + gridHeight },
                ]);
            }
        }
    }

    function addNoise() {
        for (let m = 0; m < mesh.length; m++) {
            const poly = mesh[m];
            for (let p = 0; p < poly.length; p++) {
                const point = poly[p];
                point.y += waveHeight * noise((point.x / 50) + offsetX, (point.y / 50) + offsetY);
            }
        }
    }

    

    

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
                skyCanvas,
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
        const waveResolution = 10; // larger blocks for performance
    
        ctx.save();
    
        for (let y = 0; y < canvas.height; y += waveResolution) {
            const noiseY = (y / 60) + offsetY;
    
            for (let x = 0; x < canvas.width; x += waveResolution) {
                const displacement = noise((x / 60) + offsetX, noiseY);
    
                // Stronger effect: higher brightness shift
                const brightness = Math.floor(80 + displacement * 100); // ↑ stronger curve
                const r = 40 + brightness * 0.5;
                const g = 120 + brightness * 0.6;
                const b = 180 + brightness * 0.4;
    
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.12)`; // ↑ stronger opacity
                ctx.fillRect(x, y, waveResolution, waveResolution);
            }
        }
    
        ctx.restore();
    }
    
    function drawReflectionRipples() {
        ctx.save();
        ctx.globalAlpha = 0.08; // Soft overlay
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


        requestAnimationFrame(animate);
    }

    animate();
}