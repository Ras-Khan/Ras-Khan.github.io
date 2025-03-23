function initializeCube() {
    document.addEventListener('DOMContentLoaded', () => {
        const cubeFaceBack = document.querySelector('.glass_face.back');

        cubeFaceBack.addEventListener('wheel', (event) => {
            const canScrollInside = cubeFaceBack.scrollHeight > cubeFaceBack.clientHeight;

            if (canScrollInside) {
                const atTop = cubeFaceBack.scrollTop === 0;
                const atBottom =
                    cubeFaceBack.scrollTop + cubeFaceBack.clientHeight >= cubeFaceBack.scrollHeight;

                if ((event.deltaY < 0 && atTop) || (event.deltaY > 0 && atBottom)) {
                    // Only scroll the page if the cube can't scroll anymore
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
    let rotationInterval = null; 

    const leftButton = document.querySelector(".nav_button.left");
    const rightButton = document.querySelector(".nav_button.right");

    let rotationX = 0;
    let rotationY = 0;
    let rotationDirection = 1; // 1 for clockwise, -1 for counter-clockwise
    const minRotation = -15;
    const maxRotation = 15;
    const cubeElement = document.querySelector('.glass_cube');
    const closeButton = document.querySelector(".close_button");

    function startRotation() {
        cubeElement.style.transition = "top 1.6s"; // This fixes the rotation speed at the start for some reason
        if (!rotationInterval) {
            rotationInterval = setInterval(rotateCube, 50);
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
            stopRotation();
            cubeElement.style.transition = "top 1.6s cubic-bezier(0.25, 1.5, 0.5, 1)";
            cube.style.cursor = "auto";

            rotationX = 0;
            rotationY = 0;
            cubeElement.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;

            cube.style.transition = "top 0.8s cubic-bezier(0.25, 1.5, 0.25, 2)";
            cube.style.top = "80%";
            cube.style.left = "50%";

            setTimeout(() => {
                cube.style.zIndex = "9";
                cube.style.top = "85%"; 
            }, 600);

            setTimeout(() => {
                cube.style.top = "60%"; 
            }, 800);

            setTimeout(() => {
                cube.style.transition = "top 0.5s cubic-bezier(0.25, 1.5, 0.5, 1)";
                cube.style.top = "65%"; 
            }, 1500);

            setTimeout(() => {
                root.style.setProperty("--cube-width", "1400px");
                root.style.setProperty("--cube-height", "700px");
                closeButton.style.display = "block";
                leftButton.style.display = "block"; 
                rightButton.style.display = "block"; 
            }, 900);

            currentProjectIndex = 0;
            updateProjectContent(currentProjectIndex);
            backFace.appendChild(closeButton);
        }
        isExpanded = true;
    });


    closeButton.addEventListener("click", function (e) {
        e.stopPropagation(); // No clicking while its being closed

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
            cube.style.top = "105%"; 
        }, 700);

        setTimeout(() => {
            cube.style.zIndex = "4";
        }, 500);

        setTimeout(() => {
            isExpanded = false; // Prevents expanding while its still shrinking
        }, 1500);


        startRotation();

        backFace.innerHTML = originalContent; 
        backFace.className = originalClasses;
        if (originalStyle) {
            backFace.setAttribute("style", originalStyle);
        } else {
            backFace.removeAttribute("style");
        }

        backFace.appendChild(closeButton);
        closeButton.style.display = "none";
        leftButton.style.display = "none"; 
        rightButton.style.display = "none";
        cube.style.cursor = "pointer";
    });


    leftButton.addEventListener("click", () => {
        currentProjectIndex = (currentProjectIndex - 1 + projects.length) % projects.length;
        nextProject("right"); 
    });

    rightButton.addEventListener("click", () => {
        currentProjectIndex = (currentProjectIndex + 1) % projects.length;
        nextProject("left"); 
    });

    // Project data, still W.I.P.
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

    let currentProjectIndex = 0;
    const backFace = document.querySelector(".glass_face.back");
    const originalContent = backFace.innerHTML; 
    const originalClasses = backFace.className; 
    const originalStyle = backFace.getAttribute("style"); 


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

        // Disable Buttons Temporarily
        leftButton.disabled = true;
        rightButton.disabled = true;

        currentProject.style.animation = `slide_out_${direction} 1.00s forwards`;

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
            leftButton.disabled = false; 
            rightButton.disabled = false;
        }, 500);
    }

    startRotation();
}




/* // To move the cube with the mouse
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
    
}*/