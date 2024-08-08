document.addEventListener('DOMContentLoaded', () => {
    const words = ["Laravel", "UI/UX Design", "TailwindCSS", "React", "PHP", "C/C++", "Java", "SQL"];
    const hexagon = document.querySelector('.hexagon');
    const speedHexagon = 1000; // in ms

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

    // Canvas for night sky
    const canvas = document.getElementById('nightSky');
    const overlay = document.getElementById('canvasOverlay');
    const context = canvas.getContext('2d');
    let stars = [];
    let animationFrameId;
    let mouseX = null;
    let mouseY = null;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight / 2; // Cover only the upper half
        createStars();
    }

    function getRandomColor() {
        const colors = [
            'rgba(255, 255, 255, ', // white
            'rgba(255, 204, 203, ', // light red
            'rgba(255, 255, 153, ', // yellow
            'rgba(153, 204, 255, ', // light blue
            'rgba(204, 153, 255, ', // light purple
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function createStars() {
        stars = [];
        for (let i = 0; i < (window.innerWidth / 5); i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2.0,
                alpha: Math.random(),
                alphaChange: (Math.random() * 0.025) - 0.01,
                color: getRandomColor()
            });
        }
    }

    function drawNightSky() {
        context.clearRect(0, 0, canvas.width, canvas.height); // Clear only the canvas area

        const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#000');
        gradient.addColorStop(0.30, '#000');
        gradient.addColorStop(1, '#000913');
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        let connectedStars = [];

        if (mouseX !== null && mouseY !== null) {
            connectedStars = findNearestStars(mouseX, mouseY, 4); // Find 4 nearest stars
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

        stars.forEach(star => {
            star.alpha += star.alphaChange;
            if (star.alpha <= 0 || star.alpha >= 1) {
                star.alphaChange = -star.alphaChange;
            }

            const isConnected = connectedStars.includes(star);
            const starAlpha = isConnected ? Math.min(3, 3) : star.alpha; // Brighten the connected stars
            const starRadius = isConnected ? star.radius + 1.5 : star.radius; // Enlarge the connected stars
            context.fillStyle = `${star.color}${starAlpha})`;
            context.shadowBlur = isConnected ? 12 : 8; // Increase blur for connected stars
            context.shadowColor = `${star.color}1)`;
            context.beginPath();
            context.arc(star.x, star.y, starRadius, 0, Math.PI * 2, false);
            context.fill();
        });

        animationFrameId = requestAnimationFrame(drawNightSky);
    }

    function findNearestStars(x, y, count) {
        const nearestStars = [];
        const usedStars = new Set();

        stars.forEach(star => {
            const distance = Math.hypot(star.x - x, star.y - y);
            nearestStars.push({ star, distance });
        });

        nearestStars.sort((a, b) => a.distance - b.distance);

        const selectedStars = [];
        let starIndex = 0;

        while (selectedStars.length < count && starIndex < nearestStars.length) {
            const currentStar = nearestStars[starIndex].star;
            if (!usedStars.has(currentStar)) {
                selectedStars.push(currentStar);
                usedStars.add(currentStar);
            }
            starIndex++;
        }

        return selectedStars;
    }

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    overlay.addEventListener('mousemove', debounce((event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    }, 20));

    overlay.addEventListener('mouseleave', () => {
        mouseX = null;
        mouseY = null;
    });

    window.addEventListener('resize', () => {
        cancelAnimationFrame(animationFrameId); // Cancel the previous animation frame
        resizeCanvas();
        drawNightSky(); // Restart the animation
    });

    resizeCanvas();
    drawNightSky();
});
