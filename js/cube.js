document.addEventListener('DOMContentLoaded', () => {
    const cubeFaceBack = document.querySelector('.glass-face.back');

    cubeFaceBack.addEventListener('wheel', (event) => {
        const canScrollInside = cubeFaceBack.scrollHeight > cubeFaceBack.clientHeight;

        if (canScrollInside) {
            const atTop = cubeFaceBack.scrollTop === 0;
            const atBottom =
                cubeFaceBack.scrollTop + cubeFaceBack.clientHeight >= cubeFaceBack.scrollHeight;

            if ((event.deltaY < 0 && atTop) || (event.deltaY > 0 && atBottom)) {
                // Allow page scrolling if the cube is fully scrolled to the top or bottom
                return;
            }

            // Prevent page scrolling and scroll only inside the cube
            event.preventDefault();
            cubeFaceBack.scrollTop += event.deltaY;
        }
    });
});

function initializeCube() {
    const cube = document.querySelector('.glass-cube');

    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;
    let rotationX = 0;
    let rotationY = 0;

    function rotateCube() {
        //rotationX += 0.5; 
        rotationY += 0.5;   

        cube.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
    }

    setInterval(rotateCube, 5); // Time in milliseconds
    
    // Testing mouse events to drag cube around
    /*const onMouseMove = (event) => {
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
    window.addEventListener('mouseup', onMouseUp);*/
    
}

// Project data
const projects = [
    {
        "title": "Example project 1",
        "description": "This is example project 1.",
        "image": "img/Astroblast.png",
        "link": "https://example.com/astroblast"
    },
    {
        "title": "Example project 2",
        "description": "This is example project 2.",
        "image": "img/placeholder_1920x1080.png",
        "link": "https://example.com/ecoquest"
    },
    {
        "title": "Example project 3",
        "description": "This is example project 3.",
        "image": "img/test.png",
        "link": "https://example.com/circuitcrafter"
    }
];

// Move to next or previous project
let currentProjectIndex = 0;
const backFace = document.querySelector(".glass-face.back");

function updateProjectContent(index) {
    const project = projects[index];
    backFace.innerHTML = `
        <div class="project-content project-type-1">
            <h1>${project.title}</h1>
            <img src="${project.image}" alt="${project.title}">
            <p>${project.description}</p>
            <a href="${project.link}" target="_blank">View More</a>
        </div>
    `;
}

function nextProject(dir) {
    const currentProject = backFace.querySelector(".project-content");
    const direction = dir; 

    // Add animation to slide
    currentProject.style.animation = `slide-out-${direction} 1.00s forwards`;

    currentProjectIndex = dir === "left" ? (currentProjectIndex + 1) % projects.length : 
        (currentProjectIndex - 1 + projects.length) % projects.length;

    // Prepare the new project and slide it in
    const newProject = document.createElement("div");
    newProject.classList.add("project-content", "project-type-1");
    const project = projects[currentProjectIndex];

    newProject.innerHTML = `
        <h1>${project.title}</h1>
        <img src="${project.image}" alt="${project.title}">
        <p>${project.description}</p>
        <a href="${project.link}" target="_blank">View More</a>
    `;

    newProject.style.animation = `slide-in-${direction} 1.00s forwards`;
    
    backFace.appendChild(newProject);

    setTimeout(() => {
        backFace.removeChild(currentProject);
    }, 500); 
}

// Init with the first project, then go in a rotation
updateProjectContent(currentProjectIndex);
setInterval(nextProject, 5000, "left"); // Switch projects every 5 seconds
