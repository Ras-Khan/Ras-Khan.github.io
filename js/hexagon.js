function initializeHexagon(containerElement) {
    const words = ["Laravel", "React", "PHP", "SQL", "UI/UX Design", "TailwindCSS"];
    if (!containerElement) return null;

    // Is it in the showroom?
    const isCockpit = !!containerElement.closest('.component_view');
    const hexagonSize = isCockpit ? 52 : 80; // 80 is the old size for the older version of the website

    const hexagon = containerElement.querySelector('.hexagon');
    if (!hexagon) return null;

    const speedHexagon = 1200;
    let currentIndex = 0;

    hexagon.innerHTML = '';

    words.forEach((word, index) => {
        const face = document.createElement('div');
        face.classList.add('face');
        face.style.transform = `rotateX(${(index * 360) / words.length}deg) translateZ(${hexagonSize}px)`;
        face.textContent = word;
        hexagon.appendChild(face);
    });

    // Initial transform
    hexagon.style.transform = `rotateX(0deg)`;

    const intervalId = setInterval(() => {
        currentIndex++;
        hexagon.style.transition = 'transform 0.5s';
        hexagon.style.transform = `rotateX(${(currentIndex * -360) / words.length}deg)`;
    }, speedHexagon);

    return intervalId;
}