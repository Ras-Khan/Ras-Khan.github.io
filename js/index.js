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
        canvas.height = window.innerHeight;
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
        for (let i = 0; i < (window.innerWidth / 3); i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5,
                alpha: Math.random(),
                alphaChange: (Math.random() * 0.020) - 0.005,
                color: getRandomColor()
            });
        }
    }

    function drawNightSky() {
        const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#000');
        gradient.addColorStop(0.30, '#000');
        gradient.addColorStop(1, '#001328');
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        stars.forEach(star => {
            star.alpha += star.alphaChange;
            if (star.alpha <= 0 || star.alpha >= 1) {
                star.alphaChange = -star.alphaChange;
            }
            context.fillStyle = `${star.color}${star.alpha})`;
            context.shadowBlur = 8;
            context.shadowColor = `${star.color}1)`;
            context.beginPath();
            context.arc(star.x, star.y, star.radius, 0, Math.PI * 2, false);
            context.fill();
        });

        if (mouseX !== null && mouseY !== null) {
            const nearestStars = findNearestStars(mouseX, mouseY, 5); // Find 5 nearest stars
            context.strokeStyle = 'rgba(255, 255, 255, 0.7)';
            context.lineWidth = 1;

            context.beginPath();
            context.moveTo(mouseX, mouseY);
            nearestStars.forEach(star => {
                context.lineTo(star.x, star.y);
            });
            context.stroke();
        }

        animationFrameId = requestAnimationFrame(drawNightSky);
    }

    function findNearestStars(x, y, count) {
        return stars
            .map(star => ({
                star,
                distance: Math.hypot(star.x - x, star.y - y)
            }))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, count)
            .map(item => item.star);
    }

    let smoothMouseX = null;
    let smoothMouseY = null;

    overlay.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    overlay.addEventListener('mouseleave', () => {
        mouseX = null;
        mouseY = null;
    });

    function interpolateMousePosition() {
        if (mouseX !== null && mouseY !== null) {
            if (smoothMouseX === null || smoothMouseY === null) {
                smoothMouseX = mouseX;
                smoothMouseY = mouseY;
            } else {
                smoothMouseX += (mouseX - smoothMouseX) * 0.1;
                smoothMouseY += (mouseY - smoothMouseY) * 0.1;
            }
        }
        requestAnimationFrame(interpolateMousePosition);
    }

    window.addEventListener('resize', () => {
        cancelAnimationFrame(animationFrameId); // Cancel the previous animation frame
        resizeCanvas();
        drawNightSky(); // Restart the animation
    });

    resizeCanvas();
    drawNightSky();
    interpolateMousePosition();
});
