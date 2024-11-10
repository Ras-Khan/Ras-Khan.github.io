function initializeCube() {
    const cube = document.querySelector('.glass-cube');
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;
    let rotationX = 0;
    let rotationY = 0;

    const onMouseMove = (event) => {
        if (!isDragging) return;

        const deltaX = event.clientX - previousMouseX;
        const deltaY = event.clientY - previousMouseY;

        rotationX -= deltaY * 0.5;
        rotationY += deltaX * 0.5;

        cube.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;

        previousMouseX = event.clientX;
        previousMouseY = event.clientY;
    };

    const onMouseDown = (event) => {
        isDragging = true;
        previousMouseX = event.clientX;
        previousMouseY = event.clientY;
    };

    const onMouseUp = () => {
        isDragging = false;
    };

    cube.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
}
