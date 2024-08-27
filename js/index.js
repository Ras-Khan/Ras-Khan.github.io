document.addEventListener('DOMContentLoaded', () => {
    const words = ["Laravel", "UI/UX Design", "TailwindCSS", "React", "PHP", "C/C++", "Java", "SQL"];
    const hexagon = document.querySelector('.hexagon');
    const speedHexagon = 1000;

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
    const context = canvas.getContext('2d');

    let stars = [];
    let supernovaParticles = [];
    let animationFrameId;
    let mouseX = null;
    let mouseY = null;
    let supernovaTimer = 0;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight / 2;  // Adjust the height to cover only half
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

        if (supernovaTimer <= 0) {
            const randomStar = stars[Math.floor(Math.random() * stars.length)];
            randomStar.exploding = true;
            supernovaTimer = Math.random() * 20000 + 30000;
        } else {
            supernovaTimer -= 16; 
        }

        animationFrameId = requestAnimationFrame(drawNightSky);
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

    window.addEventListener('resize', () => {
        cancelAnimationFrame(animationFrameId);
        resizeCanvas();
        drawNightSky();
    });

    resizeCanvas();
    drawNightSky();
});
