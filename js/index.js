document.addEventListener('DOMContentLoaded', () => {
    const words = ["Laravel", "UI/UX Design", "TailwindCSS", "React", "PHP", "C/C++", "Java", "SQL"];
    const hexagon = document.querySelector('.hexagon');

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

    setInterval(updateHexagon, 1000);
});
