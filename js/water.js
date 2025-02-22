function initializeWater() {
    const canvas = document.getElementById("waterCanvas");
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight * 0.5;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let time = 0;

    const nightSky = document.getElementById("nightSky");
    const skyCanvas = document.createElement("canvas");
    const skyCtx = skyCanvas.getContext("2d");

    function captureNightSky() {
        skyCanvas.width = nightSky.clientWidth;
        skyCanvas.height = nightSky.clientHeight;
        const skyContext = nightSky.getContext("2d");
        skyCtx.drawImage(skyContext.canvas, 0, 0);
    }


    function waveDistortion(x, y) {
        return (
            Math.sin((x + time * 2) * 0.025) * 15 +  // Larger waves
            Math.sin((y + time * 1.5) * 0.018) * 8 +  // Mid-level detail
            Math.sin((x * 0.01 + y * 0.01 + time * 3) * 12) * 4  // Small ripples 
        );
    }
    
    function drawWater() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        // Water gradient
        let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, "rgba(58, 112, 183, 0.80)");   // #3a70b7
        gradient.addColorStop(0.1, "rgba(47, 94, 155, 0.90)");  // #2f5e9b
        gradient.addColorStop(0.3, "rgba(47, 94, 155, 0.99)");  // #2f5e9b
        gradient.addColorStop(0.6, "rgba(35, 76, 128, 0.99)");  // #234c80
        gradient.addColorStop(0.85, "rgba(26, 58, 102, 0.99)"); // #1a3a66
        gradient.addColorStop(1, "rgba(16, 41, 73, 1.00)");     // #102949
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Reflection of the nightsky
        captureNightSky();
            
        let reflectionOpacity = 0.15;
        ctx.save();
        ctx.globalAlpha = reflectionOpacity;
        ctx.scale(1, -1);

        for (let y = 0; y < canvas.height; y += 3) {
            let depthFactor = y / canvas.height; // More distortion at the bottom
            let distortion = waveDistortion(0, y) * (0.3 + depthFactor * 1.2); // Increases gradually
            ctx.drawImage(skyCanvas, 0, y, canvas.width, 3, distortion * depthFactor, -canvas.height + y, canvas.width * (1 + depthFactor * 0.2), 3);
        }
        ctx.restore();

        // Making waves more visible
        ctx.save();
        ctx.globalAlpha = 0.15;

        for (let x = 0; x < canvas.width; x += Math.random() * 6 + 10) { 
            for (let y = 0; y < canvas.height; y += Math.random() * 6 + 10) {
                let distortionX = waveDistortion(x, y) * 1.5; 
                let distortionY = waveDistortion(y, x) * 1.2; 

                ctx.fillStyle = "rgba(255, 255, 255, 0.04)"; 
                ctx.beginPath();
                ctx.arc(x + distortionX, y + distortionY, 8 + Math.sin(time * 0.5 + y * 0.015) * 4, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.restore();

        time += 0.0075; // Speed of the waves
        requestAnimationFrame(drawWater);
    }

    
    drawWater();
}

