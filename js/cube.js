function initializeCube() {
    const cubeEl = document.querySelector(".glass_container") || document.querySelector(".glass_cube");
    if (!cubeEl) return null;

    // Check if the cube is inside the cockpit's component viewer
    const isContainedInCockpit = !!cubeEl.closest('.component_view');

    const cube = document.querySelector(".glass_container") ? document.querySelector(".glass_container") : document.querySelector(".glass_cube");
    if (!cube) return null;
    const root = document.documentElement;
    let isExpanded = false;
    let rotationInterval = null;
    let projectSlideshowInterval = null;
    let currentShowroomProjectIndex = 0;

    const leftButton = document.querySelector(".nav_button_control.left");
    const rightButton = document.querySelector(".nav_button_control.right");

    let rotationX = 0;
    let rotationY = 0;
    const cubeElement = document.querySelector('.glass_cube');
    const closeButton = document.querySelector(".close_button");

    const frontFace = document.querySelector(".glass_face.front");
    const backFace = document.querySelector(".glass_face.back");

    function startRotation() {
        if (!rotationInterval) {
            rotationInterval = setInterval(rotateCube, 33);
        }

        if (isContainedInCockpit) {
            if (projectSlideshowInterval) clearInterval(projectSlideshowInterval);
            
            // Clear previous content and set initial slide
            frontFace.innerHTML = '';
            showroomNextProject(); // Place first slide immediately
            
            projectSlideshowInterval = setInterval(showroomNextProject, 2800);
        }
    }

    function pauseRotation() {
        if (rotationInterval) {
            clearInterval(rotationInterval);
            rotationInterval = null;
        }
        if (projectSlideshowInterval) {
            clearInterval(projectSlideshowInterval);
            projectSlideshowInterval = null;
        }
    }

    function stopRotation() {
        clearInterval(rotationInterval);
        if (projectSlideshowInterval) clearInterval(projectSlideshowInterval);
        rotationY = 0;
        rotationX = 0;
        rotationInterval = null;
        projectSlideshowInterval = null;
    }

    function rotateCube() {
        if (!cubeElement) return;

        if (isContainedInCockpit) {
            rotationY += 4.0; // Faster speed if its in the 'showroom'
            cubeElement.style.transform = `rotateX(0deg) rotateY(${rotationY}deg) scale(0.8)`;
        } else {
            rotationY += 1.0; // Faster and constant rotation
            cubeElement.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
        }
    }


    cube.addEventListener("click", () => {
        // Remove the expansion functionality if its in the showroom
        if (isContainedInCockpit) {
            return;
        }

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
                
                // So it can be clicked and scrolled
                frontFace.style.pointerEvents = 'all';
                frontFace.style.overflowY = 'auto';
            }, 900);

            currentProjectIndex = 0;
            updateProjectContent(currentProjectIndex);
        }
        isExpanded = true;
    });

    /* Older function used in the first version, redundant now */
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

        // Clear project content from the front
        frontFace.innerHTML = '';
        frontFace.style.pointerEvents = 'none';
        frontFace.style.overflowY = 'hidden';

        // Hide buttons and reset cursor
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

    cube.addEventListener("mouseenter", () => {
        if (!isExpanded && !isContainedInCockpit) pauseRotation();
    });

    cube.addEventListener("mouseleave", () => {
        if (!isExpanded && !isContainedInCockpit) startRotation();
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
            "link": "https://example.com/project2"
        },
        {
            "title": "Example project 3",
            "description": "This is example project 3.",
            "image": "img/test.png",
            "link": "https://example.com/project3"
        }
    ];

    let currentProjectIndex = 0;

    function updateProjectContent(index) {
        const project = projects[index];
        const imagePath = project.image;
        if (!frontFace) return;
        
        frontFace.innerHTML = `
            <div class="project_content">
                <div class="project_type_1">
                    <h1>${project.title}</h1>
                    <img src="${imagePath}" alt="${project.title}">
                    <p>${project.description}</p>
                    <a href="${project.link}" target="_blank">View More</a>
                </div>
            </div>
        `;
    }

    function showroomNextProject() {
        if (!frontFace) return;
        const projectsToRemove = frontFace.querySelectorAll(".project_content");
    
        // Add the new project in
        currentShowroomProjectIndex = (currentShowroomProjectIndex + 1) % projects.length;
        const project = projects[currentShowroomProjectIndex];
        const imagePath = `../${project.image}`;
    
        const newProject = document.createElement("div");
        newProject.classList.add("project_content");
        newProject.innerHTML = `
            <div class="project_type_1">
                <h1>${project.title}</h1>
                <img src="${imagePath}" alt="${project.title}">
                <p>${project.description}</p>
                <a href="${project.link}" target="_blank">View More</a>
            </div>
        `;
        newProject.style.animation = `slide_in_left 0.5s forwards`;
        frontFace.appendChild(newProject);
    
        // Remove old projects, don't want them to stack on top
        if (projectsToRemove.length > 0) {
            projectsToRemove.forEach(p => {
                p.style.animation = `slide_out_left 0.5s forwards`;
                p.addEventListener('animationend', () => p.remove(), { once: true });
            });
        }
    }

    function nextProject(dir) {
        const projectsToRemove = frontFace.querySelectorAll(".project_content");
        if (projectsToRemove.length === 0) {
            // Failsafe?
            updateProjectContent(currentProjectIndex);
            return;
        }

        const direction = dir;
        leftButton.disabled = true;
        rightButton.disabled = true;
    
        projectsToRemove.forEach(p => {
            p.style.animation = `slide_out_${direction} 1.00s forwards`;
            p.addEventListener('animationend', () => p.remove(), { once: true });
        });
    
        // Add a new project in
        const project = projects[currentProjectIndex];
        const newProject = document.createElement("div");
        newProject.classList.add("project_content");
        newProject.innerHTML = `
            <div class="project_type_1">
                <h1>${project.title}</h1>
                <img src="${project.image}" alt="${project.title}">
                <p>${project.description}</p>
                <a href="${project.link}" target="_blank">View More</a>
            </div>
        `;
        newProject.style.animation = `slide_in_${direction} 1.00s forwards`;
        
        newProject.firstElementChild.addEventListener('animationend', () => {
            leftButton.disabled = false;
            rightButton.disabled = false;
        }, { once: true });

        frontFace.appendChild(newProject);
    }

    // Returning a controller so I can control it from other files
    return {
        start: startRotation,
        stop: pauseRotation
    };
}