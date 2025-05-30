function initializeNightSky() {
    const canvas = document.getElementById('nightSky');
    const overlay = document.getElementById('canvasOverlay');
    const context = canvas.getContext('2d');

    let stars = [];
    let supernovaParticles = [];
    let mouseX = null, mouseY = null;
    let shootingStars = [];

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = document.getElementById('nightSky').clientHeight;
        createStars();
    };

    const getRandomColor = () => {
        const colors = [
            'rgba(255, 255, 255, ', 'rgba(255, 204, 203, ',
            'rgba(255, 255, 153, ', 'rgba(153, 204, 255, ',
            'rgba(204, 153, 255, '
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const createStars = () => {
        stars = Array.from({ length: window.innerWidth / 10 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2.0,
            alpha: Math.random(),
            alphaChange: (Math.random() * 0.025) - 0.01,
            color: getRandomColor(),
            exploding: false,
            remove: false
        }));
    };

    // Redundant function, might use in the future
    const createSupernova = (star) => {
        const initialRadius = star.radius; // Base radius
    
        const baseParticles = 5 + Math.random() * 5; // Reduce particles count
        const numParticles = Math.floor(baseParticles + initialRadius * 2.5); 
    
        const particles = Array.from({ length: numParticles }, () => {
            const angle = Math.random() * Math.PI * 2;
            const speed = (Math.random() * 0.1 + 0.05) * (2.5 / initialRadius); // Make smaller stars explode faster
    
            return {
                x: star.x, 
                y: star.y, 
                vx: Math.cos(angle) * speed, 
                vy: Math.sin(angle) * speed, 
                alpha: 1, 
                radius: Math.random() * 0.3 + initialRadius * 0.2,
            };
        });
    
        supernovaParticles.push(...particles);
        star.remove = true;
    };

    const createShootingStar = () => {
        if (stars.length === 0) return;
        let randomStar = stars[Math.floor(Math.random() * stars.length)];
        let direction = Math.random() < 0.5 ? -1 : 1;
        shootingStars.push({
            x: randomStar.x,
            y: randomStar.y,
            radius: randomStar.radius,
            vx: direction * (4 + Math.random() * 4),
            vy: (Math.random() - 0.5) * 2,
            alpha: 1,
            color: randomStar.color
        });

        console.log("Shooting star: ", shootingStars);
    };

   
    const drawNightSky = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#000');
        gradient.addColorStop(0.3, '#000');
        gradient.addColorStop(1, '#000913');
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        let connectedStars = mouseX !== null && mouseY !== null ? findNearestStars(mouseX, mouseY, 4) : [];

        if (connectedStars.length > 1) {
            context.strokeStyle = 'rgba(255, 255, 255, 0.9)';
            context.lineWidth = 0.6;
            context.beginPath();
            context.moveTo(connectedStars[0].x, connectedStars[0].y);
            connectedStars.slice(1).forEach(star => context.lineTo(star.x, star.y));
            context.stroke();
        }

        stars = stars.filter(star => !star.remove);

        stars.forEach(star => {
            star.alpha += star.alphaChange;
            if (star.alpha <= 0 || star.alpha >= 1) star.alphaChange *= -1;
    
            const isConnected = connectedStars.includes(star);
            context.fillStyle = `${star.color}${isConnected ? 3 : star.alpha})`;
            context.shadowBlur = isConnected ? 12 : 8;
            context.shadowColor = `${star.color}1)`;
            context.beginPath();
            context.arc(star.x, star.y, isConnected ? star.radius + 1.5 : star.radius, 0, Math.PI * 2);
            context.fill();
        });

        shootingStars.forEach((star, index) => {
            // Moving the shooting star
            star.x += star.vx;
            star.y += star.vy;
            star.alpha -= 0.005;  

            // Add a trail on the shooting star
            if (star.alpha > 0) {
                const gradient = context.createLinearGradient(star.x, star.y, star.x - star.vx * 10, star.y - star.vy * 10);
                gradient.addColorStop(0, `${star.color}${star.alpha})`);
                gradient.addColorStop(1, `${star.color}0)`);

                context.strokeStyle = gradient;
                context.lineWidth = star.radius + 0.8;
                context.lineCap = 'round';

                context.beginPath();
                context.moveTo(star.x, star.y);
                context.lineTo(star.x - star.vx * 10, star.y - star.vy * 10);
                context.stroke();
            } else {
                shootingStars.splice(index, 1); // Remove it again
            }
        });

        // Chance to trigger shooting star
        if (Math.random() < 0.002 && stars.length > 0) {
            createShootingStar();
        }

        requestAnimationFrame(drawNightSky);
    };

    const findNearestStars = (x, y, count) =>
        stars.map(star => ({ star, distance: Math.hypot(star.x - x, star.y - y) }))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, count)
            .map(item => item.star);

    // Throttle for better performance
    const throttle = (func, limit) => {
        let lastFunc, lastRan;
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
    };

    overlay.addEventListener('mousemove', throttle((event) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = event.clientX - rect.left;
        mouseY = event.clientY - rect.top;
    }, 50));

    overlay.addEventListener('mouseleave', () => {
        mouseX = null;
        mouseY = null;
    });

    /* 
    // Not a good solution yet, makes everything lagg when resizing too much
    window.addEventListener('resize', () => {
        resizeCanvas();
        drawNightSky();
    });
    */
    // Reloads page as temp solution 
    window.addEventListener("resize", () => location.reload());


    resizeCanvas();
    drawNightSky();
}
