document.addEventListener('DOMContentLoaded', () => {
    const words = ["Laravel", "UI/UX Design", "TailwindCSS", "React", "PHP", "C/C++", "Java", "SQL"];
    const hexagon = document.querySelector('.hexagon');
    const speedHexagon = 1000;
    const overshootValue = 100;

    words.forEach((word, index) => {
        const face = document.createElement('div');
        face.classList.add('face');
        face.style.transform = `rotateX(${index * 360 / words.length}deg) translateZ(80px)`;
        face.textContent = word;
        hexagon.appendChild(face);
    });

    let currentIndex = 0;

    function updateHexagon() {
        currentIndex++;
        hexagon.style.transition = 'transform 0.5s';
        hexagon.style.transform = `rotateX(${currentIndex * -360 / words.length}deg)`;
    }

    setInterval(updateHexagon, speedHexagon);

    const canvas = document.getElementById('nightSky');
    const overlay = document.getElementById('canvasOverlay');
    const projectCanvas = document.getElementById('projectCanvas');
    const context = canvas.getContext('2d');
    const projectContext = projectCanvas.getContext('2d');

    let stars = [];
    let supernovaParticles = [];
    let animationFrameId;
    let mouseX = null;
    let mouseY = null;
    let supernovaTimer = 0;

    const projects = ['img/logoRS.svg', 'img/placeholder_1920x1080.png'];
    let currentProjectIndex = 0;
    const projectImages = [];

    function loadProjectImages() {
        projects.forEach((src, index) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                projectImages[index] = img;
                if (index === 0) drawNightSky();
            };
        });
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        projectCanvas.width = canvas.width;
        projectCanvas.height = canvas.height;
        createStars();
    }

    function getRandomColor() {
        const colors = [
            'rgba(255, 255, 255, ',
            'rgba(255, 204, 203, ',
            'rgba(255, 255, 153, ',
            'rgba(153, 204, 255, ',
            'rgba(204, 153, 255, ',
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function createStars() {
        stars = [];
        for (let i = 0; i < (window.innerWidth / 10); i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2.0,
                alpha: Math.random(),
                alphaChange: (Math.random() * 0.025) - 0.01,
                color: getRandomColor(),
                exploding: false,
                remove: false
            });
        }
    }

    function createSupernova(star) {
        const particles = [];
        const numParticles = Math.random() * 10 + 10; 
        for (let j = 0; j < numParticles; j++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 0.2 + 0.1; 
            particles.push({
                x: star.x,
                y: star.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                alpha: 1,
                radius: Math.random() * 0.5 + 0.5 
            });
        }
        supernovaParticles.push(...particles);
        star.remove = true; 
    }

    function drawNightSky() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#000');
        gradient.addColorStop(0.30, '#000');
        gradient.addColorStop(1, '#000913');
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        let connectedStars = [];

        if (mouseX !== null && mouseY !== null) {
            connectedStars = findNearestStars(mouseX, mouseY, 4);
            context.strokeStyle = 'rgba(255, 255, 255, 0.90)';
            context.lineWidth = 0.6;

            if (connectedStars.length > 1) {
                context.beginPath();
                context.moveTo(connectedStars[0].x, connectedStars[0].y);
                for (let i = 1; i < connectedStars.length; i++) {
                    context.lineTo(connectedStars[i].x, connectedStars[i].y);
                }
                context.stroke();
            }
        }

        stars = stars.filter(star => !star.remove); 

        stars.forEach(star => {
            if (!star.exploding) {
                star.alpha += star.alphaChange;
                if (star.alpha <= 0 || star.alpha >= 1) {
                    star.alphaChange = -star.alphaChange;
                }

                const isConnected = connectedStars.includes(star);
                const starAlpha = isConnected ? Math.min(3, 3) : star.alpha; 
                const starRadius = isConnected ? star.radius + 1.5 : star.radius; 
                context.fillStyle = `${star.color}${starAlpha})`;
                context.shadowBlur = isConnected ? 12 : 8; 
                context.shadowColor = `${star.color}1)`;
                context.beginPath();
                context.arc(star.x, star.y, starRadius, 0, Math.PI * 2, false);
                context.fill();
            } else {
                star.radius += 0.05; 
                context.fillStyle = `${star.color}1)`;
                context.shadowBlur = 15;
                context.shadowColor = `${star.color}1)`;
                context.beginPath();
                context.arc(star.x, star.y, star.radius, 0, Math.PI * 2, false);
                context.fill();

                if (star.radius > 3) { 
                    createSupernova(star);
                }
            }
        });

        supernovaParticles.forEach((particle, index) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.alpha -= 0.005; 
            if (particle.alpha > 0) {
                context.fillStyle = `rgba(255, 255, 255, ${particle.alpha})`;
                context.beginPath();
                context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2, false);
                context.fill();
            } else {
                supernovaParticles.splice(index, 1);
            }
        });

        drawProjectDisplay();

        if (supernovaTimer <= 0) {
            const randomStar = stars[Math.floor(Math.random() * stars.length)];
            randomStar.exploding = true;
            supernovaTimer = Math.random() * 20000 + 30000;
        } else {
            supernovaTimer -= 16; 
        }

        animationFrameId = requestAnimationFrame(drawNightSky);
    }

    let imageNeedsRedraw = true;
    let constellationPoints = null;

    function drawProjectDisplay() {
        projectContext.clearRect(0, 0, projectCanvas.width, projectCanvas.height);
    
        const displayWidth = projectCanvas.width * 0.55;
        const displayHeight = displayWidth * 9 / 16; 
        const displayX = (projectCanvas.width - displayWidth) / 2;
        const displayY = (projectCanvas.height - displayHeight) / 1.5;
    
        if (!constellationPoints) {
            constellationPoints = calculateConstellationPoints(displayX, displayY, displayWidth, displayHeight);
        }
    
        const { stars } = constellationPoints;
    
        projectContext.save();
        projectContext.beginPath();
        projectContext.moveTo(stars[0].x, stars[0].y);
        stars.forEach(star => {
            projectContext.lineTo(star.x, star.y);
        });
        projectContext.closePath();
        projectContext.clip();
    
        const img = projectImages[currentProjectIndex];
        if (img) {
            let imgWidth = img.width;
            let imgHeight = img.height;
    
            const widthScale = displayWidth * 1.2 / imgWidth;
            const heightScale = displayHeight * 1.2 / imgHeight;
            const scaleFactor = Math.min(widthScale, heightScale);
    
            const scaledWidth = imgWidth * scaleFactor;
            const scaledHeight = imgHeight * scaleFactor;
    
            const imgX = displayX + (displayWidth - scaledWidth) / 2;
            const imgY = displayY + (displayHeight - scaledHeight) / 2;
    
            projectContext.shadowColor = 'rgba(0, 0, 0, 0.3)';
            projectContext.shadowBlur = 15;
            projectContext.shadowOffsetX = 0;
            projectContext.shadowOffsetY = 10;
            projectContext.drawImage(img, imgX, imgY, scaledWidth, scaledHeight);
    
            projectContext.shadowColor = 'rgba(255, 255, 255, 0.5)';
            projectContext.shadowBlur = 10;
            projectContext.shadowOffsetX = 0;
            projectContext.shadowOffsetY = -10;
            projectContext.drawImage(img, imgX, imgY, scaledWidth, scaledHeight);
        }
    
        const reflectionGradient = projectContext.createLinearGradient(displayX/2, displayY/2, displayX + displayWidth*2, displayY + displayHeight*2);
        reflectionGradient.addColorStop(0, 'rgba(200, 200, 200, 0.05)');
        reflectionGradient.addColorStop(0.5, 'rgba(200, 200, 200, 0.025)');
        reflectionGradient.addColorStop(1, 'rgba(200, 200, 200, 0)');
        projectContext.fillStyle = reflectionGradient;
    
        projectContext.beginPath();
        projectContext.moveTo(displayX/2, displayY/2);
        projectContext.lineTo(displayX + displayWidth * 0.7, displayY);
        projectContext.lineTo(displayX + overshootValue + displayWidth, overshootValue + displayY + displayHeight * 0.7);
        projectContext.lineTo(displayX + overshootValue + displayWidth, overshootValue + displayY + displayHeight);
        projectContext.lineTo(displayX + overshootValue + displayWidth * 0.3, overshootValue + displayY + displayHeight);
        projectContext.lineTo(displayX, displayY + displayHeight * 0.3);
        projectContext.closePath();
        projectContext.fill();
    
        const glossGradient = projectContext.createLinearGradient(displayX, displayY, displayX, displayY + displayHeight);
        glossGradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
        glossGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
        glossGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        projectContext.fillStyle = glossGradient;
        projectContext.fillRect(displayX/2, displayY/2, displayWidth*2, displayHeight*2);
    
        projectContext.restore();
    
        drawConstellationBorder(projectContext, constellationPoints);
    }

    function calculateConstellationPoints(x, y, width, height) {
        const randomOffset = () => Math.random() * 30 - 15;

        const points = [
            { x: x + randomOffset(), y: y + randomOffset() },
            { x: x + width + randomOffset(), y: y + randomOffset() },
            { x: x + width + randomOffset(), y: y + height + randomOffset() },
            { x: x + randomOffset(), y: y + height + randomOffset() }
        ];

        const stars = [];

        for (let i = 0; i < points.length; i++) {
            const startPoint = points[i];
            const endPoint = points[(i + 1) % points.length];

            stars.push(startPoint);

            const numStars = Math.floor(Math.random() * 3) + 2;
            for (let j = 1; j <= numStars; j++) {
                const t = j / (numStars + 1);
                const starX = startPoint.x + t * (endPoint.x - startPoint.x) + randomOffset();
                const starY = startPoint.y + t * (endPoint.y - startPoint.y) + randomOffset();
                stars.push({ x: starX, y: starY });
            }
        }

        return { points, stars };
    }

    function drawConstellationBorder(ctx, constellation) {
        const { stars } = constellation;

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(stars[0].x, stars[0].y);

        for (let i = 1; i < stars.length; i++) {
            ctx.lineTo(stars[i].x, stars[i].y);
        }
        ctx.closePath();
        ctx.stroke();

        stars.forEach(star => {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.beginPath();
            ctx.arc(star.x, star.y, 3, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function findNearestStars(x, y, count) {
        const nearestStars = stars.map(star => ({
            star,
            distance: Math.hypot(star.x - x, star.y - y)
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, count)
        .map(item => item.star);

        return nearestStars;
    }

    function throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function(...args) {
            if (!lastRan) {
                func.apply(this, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(() => {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(this, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }

    overlay.addEventListener('mousemove', throttle((event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    }, 50));

    overlay.addEventListener('mouseleave', () => {
        mouseX = null;
        mouseY = null;
    });

    window.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') {
            currentProjectIndex = (currentProjectIndex + 1) % projects.length;
            imageNeedsRedraw = true;
        } else if (event.key === 'ArrowLeft') {
            currentProjectIndex = (currentProjectIndex - 1 + projects.length) % projects.length;
            imageNeedsRedraw = true;
        }
    });

    window.addEventListener('resize', () => {
        cancelAnimationFrame(animationFrameId);
        resizeCanvas();
        imageNeedsRedraw = true;
        drawNightSky();
    });

    loadProjectImages();
    resizeCanvas();
    drawNightSky();
});
