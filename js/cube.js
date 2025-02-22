document.addEventListener('DOMContentLoaded', () => {
    const cubeFaceBack = document.querySelector('.glass_face.back');

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

const cube = document.querySelector(".glass_container");
const root = document.documentElement;
let isExpanded = false;
let rotationInterval = null; // Hasn't started yet

let rotationX = 0;
let rotationY = 0;
let rotationDirection = 1; // 1 for clockwise, -1 for counter-clockwise
const minRotation = -15;
const maxRotation = 15;
const cubeElement = document.querySelector('.glass_cube');

function startRotation() {
    cubeElement.style.transition = "top 1.6s"; // This fixes the rotation speed at the start for some reason
    if (!rotationInterval) {
        rotationInterval = setInterval(rotateCube, 20);
    }
}

function stopRotation() {
    clearInterval(rotationInterval);
    rotationY = 0;
    rotationX = 0;
    rotationInterval = null;
}

function rotateCube() {
    if (!cubeElement) return;

    rotationY += 0.5 * rotationDirection; 
    if (rotationY >= maxRotation || rotationY <= minRotation) { rotationDirection *= -1; }
    
    cubeElement.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
}


cube.addEventListener("click", () => {
    if (!isExpanded) {
        stopRotation(); // Stop rotation before expansion
        cubeElement.style.transition = "top 1.6s cubic-bezier(0.25, 1.5, 0.5, 1)";

        // Reset rotation values
        rotationX = 0;
        rotationY = 0;
        cubeElement.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;

        cube.style.transition = "top 0.8s cubic-bezier(0.25, 1.5, 0.25, 2)";
        cube.style.top = "80%"; // Initial jump out of the water
        cube.style.left = "50%"; // Keeps it centered

        setTimeout(() => {
            cube.style.zIndex = "6";
            cube.style.top = "85%"; 
        }, 600);

        // First bounce + partial expansion
        setTimeout(() => {
            cube.style.top = "60%"; 
        }, 800);

        // Second bounce 
        setTimeout(() => {
            cube.style.transition = "top 0.5s cubic-bezier(0.25, 1.5, 0.5, 1)";
            cube.style.top = "65%"; 
        }, 1500);

        // Final size increase
        setTimeout(() => {
            root.style.setProperty("--cube-width", "1400px");
            root.style.setProperty("--cube-height", "700px");
        }, 900);

        // Immediately show the first project
        currentProjectIndex = 0;
        updateProjectContent(currentProjectIndex);
        projectSlideshow = setInterval(() => nextProject("left"), 5000);

    } else {
        // Shrinking Sequence 
        cubeElement.style.transition = "top 1.6s cubic-bezier(0.25, 1.5, 0.5, 1)";
        cube.style.top = "75%"; 

        setTimeout(() => {
            cubeElement.style.transition = "top 1.6s cubic-bezier(0.25, 1.5, 0.5, 1)";
            cube.style.top = "60%"; 
            root.style.setProperty("--cube-width", "900px");
            root.style.setProperty("--cube-height", "450px");
        }, 100);

        setTimeout(() => {
            root.style.setProperty("--cube-width", "700px");
            root.style.setProperty("--cube-height", "350px");
        }, 800);

        setTimeout(() => {
            cubeElement.style.transition = "top 0.8s cubic-bezier(0.25, 1.2, 0.5, 1)";
            cube.style.top = "100%"; 
        }, 700);

        setTimeout(() => {
            cube.style.zIndex = "4"; // Reset z-index after shrinking
        }, 500);
        startRotation(); 

        // Stop the project slideshow and restore the original content
        clearInterval(projectSlideshow);
        backFace.innerHTML = originalContent;
        backFace.className = originalClasses; 
        if (originalStyle) {
            backFace.setAttribute("style", originalStyle); 
        } else {
            backFace.removeAttribute("style"); 
        }
    }
    isExpanded = !isExpanded;
});








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
const backFace = document.querySelector(".glass_face.back");
const originalContent = backFace.innerHTML; // Store initial content
const originalClasses = backFace.className; // Store initial classes
const originalStyle = backFace.getAttribute("style"); // Store inline styles (if any)




function updateProjectContent(index) {
    const project = projects[index];
    backFace.innerHTML = `
        <div class="project_content project_type_1">
            <h1>${project.title}</h1>
            <img src="${project.image}" alt="${project.title}">
            <p>${project.description}</p>
            <a href="${project.link}" target="_blank">View More</a>
        </div>
    `;
}

function nextProject(dir) {
    const currentProject = backFace.querySelector(".project_content");
    const direction = dir; 

    // Add animation to slide
    currentProject.style.animation = `slide_out_${direction} 1.00s forwards`;

    currentProjectIndex = dir === "left" ? (currentProjectIndex + 1) % projects.length : 
        (currentProjectIndex - 1 + projects.length) % projects.length;

    // Prepare the new project and slide it in
    const newProject = document.createElement("div");
    newProject.classList.add("project_content", "project_type_1");
    const project = projects[currentProjectIndex];

    newProject.innerHTML = `
        <h1>${project.title}</h1>
        <img src="${project.image}" alt="${project.title}">
        <p>${project.description}</p>
        <a href="${project.link}" target="_blank">View More</a>
    `;

    newProject.style.animation = `slide_in_${direction} 1.00s forwards`;
    
    backFace.appendChild(newProject);

    setTimeout(() => {
        backFace.removeChild(currentProject);
    }, 500); 
}

// Init with the first project, then go in a rotation
//updateProjectContent(currentProjectIndex);
//setInterval(nextProject, 15000, "left"); // Switch projects every 5 seconds
startRotation();








function initializeCube() {
    const cube = document.querySelector('.glass_cube');

    // Start the rotation
    //setInterval(rotateCube, 20);

    // let isDragging = false;
    // let previousMouseX = 0;
    // let previousMouseY = 0;

    // Enable drag-to-rotate
    // const onMouseMove = (event) => {
    //     if (!isDragging) return;

    //     const deltaX = event.clientX - previousMouseX;
    //     const deltaY = event.clientY - previousMouseY;

    //     rotationX -= deltaY * 0.5;
    //     rotationY += deltaX * 0.5;

    //     cube.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;

    //     previousMouseX = event.clientX;
    //     previousMouseY = event.clientY;
    // };

    // const onMouseDown = (event) => {
    //     isDragging = true;
    //     previousMouseX = event.clientX;
    //     previousMouseY = event.clientY;
    // };

    // const onMouseUp = () => {
    //     isDragging = false;
    // };

    // cube.addEventListener('mousedown', onMouseDown);
    // window.addEventListener('mousemove', onMouseMove);
    // window.addEventListener('mouseup', onMouseUp);
    
}