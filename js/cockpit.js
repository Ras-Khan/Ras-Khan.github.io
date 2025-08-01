function initializeCockpit() {
    const navButtons = document.querySelectorAll('#controlPanel .nav_button_control[data-view]');
    const modelButtons = document.querySelectorAll('#bottomControlPanel .model_button[data-view]');
    const views = document.querySelectorAll('#mainViewscreen .view_panel');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const controlPanel = document.getElementById('controlPanel');
    const bottomPanel = document.getElementById('bottomControlPanel');
    const toggleBottomPanelBtn = document.getElementById('toggleBottomPanel');
    const architectureView = document.getElementById('architecture_view');

    const componentState = {
        cube: { initialized: false, controller: null },
        hexagon: { initialized: false, animationInterval: null },
        floater: { initialized: false, controller: null },
        loader: { initialized: false },
        hover: { initialized: false },
        constellation: { initialized: false, controller: null }
    };

    function setupArchitectureView(view) {
        const modules = view.querySelectorAll('.blueprint_module');
        const titleEl = view.querySelector('#module_info_title');
        const descEl = view.querySelector('#module_info_desc');
        const codeEl = view.querySelector('#module_info_code code');
        const connectorsSvg = view.querySelector('#blueprint_connectors');
    
        const moduleData = {
            core: {
                title: 'space_core.js',
                description: 'This script is the core for the homepage\'s 3D space. It initializes the scene and manages the main animation loop. In each frame, it controls the camera, stars, planets, and galaxies.',
                code: `function animate(currentTime) {
    // Main animation loop, called every frame
    const delta = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    // Handle camera logic (cinematic drift, user input)
    cinematicCamera(currentTime);

    // Update and draw all scene objects
    ctx.clearRect(0, 0, width, height);
    renderGalaxies();
    drawStars();
    drawPlanets();

    // Request the next frame
    requestAnimationFrame(animate);
}`
            },
            camera: {
                title: 'space_camera_utils.js',
                description: 'This utility script manages the camera and perspective. It handles the 3D-to-2D projection, which turns the 3D coordinates of objects into 2D positions. It also creates the control for the camera, including the cinematic drift, manual mouse/keyboard movement, and the logic for focusing on a planet.',
                code: `function project3DTo2D(pos) {
    // Subtract camera position from object position
    const dx = pos.x - cameraX;
    const dy = pos.y - cameraY;
    const dz = pos.z - cameraZ;

    // Rotate around camera's orientation (simplified)
    const x1 = dx * cosY - dz * sinY;
    const z1 = dx * sinY + dz * cosY;
    const y1 = dy * cosX - z1 * sinX;
    const zRot = dy * sinX + z1 * cosX;

    // Project onto 2D plane with perspective
    const fov = 1200;
    const scale = fov / zRot;
    const x2d = (x1 * scale) + width / 2;
    const y2d = (y1 * scale) + height / 2;

    return { x: x2d, y: y2d, scale };
}`
            },
            stars: {
                title: 'space_stars_utils.js',
                description: 'This script populates the space with stars. It generates hundreds of them with random sizes and colors. To not make the website lagg by adding too many stars, I\'ve made it so any stars off-screen are not rendered, similar to how games do this. ',
                code: `visibleCount++;
drawStar(ctx, x2d, y2d, radius, star.hue, alpha, star.flareScale, star.shape, star.class);

if (star.z - cameraZ > star.recycleDistance) {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * 8000 + 2000; 
    star.x = cameraX + Math.cos(angle) * r;
    star.y = cameraY + Math.sin(angle) * r;
    star.z = cameraZ - (5000 + Math.random() * 2000); 
    star.recycleDistance = 8000 + Math.random() * 4000;
    star.fadeProgress = 0;
    star.fadingIn = true;
}`
            },
            planets: {
                title: 'space_planets_utils.js',
                description: 'This script takes my project data and turns each one into an interactive planet in the 3D space. I designed it to generate everything dynamically, including the unique textures, orbiting text rings, tooltips that appear on hover and the project\'s detail page when clicked on a planet.',
                code: `function drawPlanets() {
    planets.forEach(planet => {
        // Project 3D position to 2D screen coordinates
        const projected = project3DTo2D(planet.position);
        if (!projected) {
            planet._htmlElement.style.display = "none";
            return;
        }

        // Update the planet's DOM element style
        const el = planet._htmlElement;
        el.style.display = "block";
        const radiusOnScreen = planet.radius * projected.scale;
        el.style.left = \`\${projected.x}px\`;
        el.style.top = \`\${projected.y}px\`;
        el.style.width = \`\${radiusOnScreen * 2}px\`;
        el.style.height = \`\${radiusOnScreen * 2}px\`;
    });
}`
            },
            galaxies: {
                title: 'space_galaxies_utils.js',
                description: 'To make the universe feel less empty, I wanted to add some galaxies too. Each one is built from particles arranged in a spiral, with its own color and rotation speed. It uses no textures, just simple shapes.',
                code: `function drawGalaxy(galaxy) {
    // Project the galaxy's center to the screen
    const projectedCenter = project3DTo2D({ x: galaxy.x, y: galaxy.y, z: galaxy.z });
    if (!projectedCenter) return;

    // Draw each star particle in the spiral arms
    for (let i = 0; i < galaxy.points.length; i++) {
        // ... complex math to find particle's 3D position ...
        const projectedParticle = project3DTo2D({ x: px, y: py, z: pz });
        if (!projectedParticle) continue;

        // Draw the particle on the canvas
        ctx.fillStyle = galaxy.color;
        ctx.beginPath();
        ctx.arc(projectedParticle.x, projectedParticle.y, size, 0, Math.PI * 2);
        ctx.fill();
    }
}`
            },
            loader: {
                title: 'loader.js',
                description: 'This script handles the loading screen animation you see when you first visit the site. It\'s not a real loader; it just plays a quick animation to make the entry feel smoother. It controls the progress bar and the final \'lift\' effect that reveals the main page.',
                code: `function initializeLoader() {
  const overlay = document.getElementById("loadingOverlay");
  const bar = document.getElementById("loadingBar");
  const duration = 750;
  const start = performance.now();

  function update(now) {
    const t = Math.min((now - start) / duration, 1);
    bar.style.width = \`\${t * 100}%\`;

    if (t < 1) {
      requestAnimationFrame(update);
    } else {
      // Animation finished, lift the overlay
      overlay.classList.add("lift");
    }
  }
  requestAnimationFrame(update);
}`
            },
            logo: {
                title: '3Dlogo.js',
                description: 'I created this component to render a 3D version of my logo using just HTML and CSS. It takes the 2D shape and adds depth and shading to create the 3D effect. This module is reused for the loader animation and the model shown below this page.',
                code: `function addExtrudeFaces(points, offsetX) {
    for (let i = 0; i < points.length; i++) {
        // ... math to calculate length & angle between points ...

        const side = document.createElement("div");
        side.className = "logo_extrude_face";
        side.style.width = \`\${length}px\`;
        side.style.height = \`\${depth}px\`;

        // Apply 3D transform to position and rotate the face
        side.style.transform = \`
            translate3d(\${x1 + offsetX}px, \${y1}px, 0)
            rotate(\${angle}deg)
            rotateX(-90deg)
        \`;
        logo.appendChild(side);
    }
}`
            },
            main: {
                title: 'main.js',
                description: 'This is the main script loader for the project pages. To keep things tidy, it detects which page is active and only loads those specific JavaScript files needed for that page. I originally created this to load each file in sequence so that I\'m in control of what modules are loaded first and not get errors.',
                code: `// Check for an element unique to the portfolio page
if (document.getElementById('cockpitContainer')) {
    // Load scripts needed for the cockpit
    loadScript('js/cockpit.js', () => {
        if (typeof initializeCockpit === 'function') {
            initializeCockpit();
        }
    });
}
// Check for a class unique to the logo page
if (document.body.classList.contains('logo_design_page')) {
    // Load scripts for the logo design page
    loadScript('js/logo_design.js', () => { /* ... */ });
}`
            },
            game_page: {
                title: 'game_design.html',
                description: 'This is the HTML file for my \'Astro Blast\' game project page. I made it look like a knock off Nintendo Switch in desktop mode, and a sort of Game Boy in mobile mode. This file sets up all the elements, like the screen and controllers.',
                code: `<body class="game_design_page">
  <div id="handheld_console">
    <div id="left_controller">...</div>
    
    <div id="screen_bezel">
      <div id="console_screen">
        <header><h1>ASTRO BLAST</h1></header>
        <main id="screen_content_area">
          <!-- Views are loaded here -->
        </main>
      </div>
    </div>
    
    <div id="right_controller">...</div>
  </div>
</body>`
            },
            logo_page: {
                title: 'logo_design.html',
                description: 'This HTML file creates the \'sketchbook\' layout for my logo design process. I chose this theme here as the initial logo design was also made in a sketchbook.',
                code: `<body class="logo_design_page">
  <div id="drawingTable">
    <div id="sketchbookArea">
      <nav id="bookmarksNav"></nav>
      <main class="sketchbook_container">
        <!-- Desktop: Two-page spread -->
        <div class="sketchbook_page sketchbook_left"></div>
        <div class="sketchbook_binding"></div>
        <div class="sketchbook_page sketchbook_right"></div>
        
        <!-- Mobile: Single page -->
        <div class="sketchbook_page_single"></div>
      </main>
    </div>
  </div>
</body>`
            },
            game_js: {
                title: 'game_design.js',
                description: 'This script handles all things in the game design page, such as switching between the \'About\', \'Features\', and other views. I\'ve also added little details such as lighting up a button when the user clicks and moving the joysticks based on mouse actions.',
                code: `function initializeGameDesignPage() {
    const menuButtons = document.querySelectorAll('.menu_button');
    const backButtons = document.querySelectorAll('.back_button');

    function showView(viewId) {
        // Logic to hide current view and show the new one
    }

    menuButtons.forEach(button => {
        button.addEventListener('click', () => {
            showView(button.dataset.view)
        });
    });

    backButtons.forEach(button => {
        button.addEventListener('click', () => showView('main_menu_view'));
    });
}`
            },
            logo_js: {
                title: 'logo_design.js',
                description: 'This script controls the interactive sketchbook on the logo design page. It\'s main job is to load the right content for each bookmark section.',
                code: `function initializeLogoDesignPage() {
    // A map holds all the HTML content for each section
    const contentMap = {
        motivation: { left: '...', right: '...' },
        inspiration: { left: '...', right: '...' }
        /* ... etc ... */
    };
    
    function setContent(contentKey) {
        const content = contentMap[contentKey];
        // Injects HTML into the correct page elements
        // based on screen size (single vs. double page)
    }

    // Create bookmarks and add click listeners
    createBookmarks();
}`
            },
            cockpit: {
                title: 'cockpit.js',
                description: 'This script runs all the logic for the current page. It handles navigation between the main views, like this \'Architecture\' schematic and the \'Summary\' page. It\'s also responsible for the models down below on this page.',
                code: `function initializeCockpit() {
    const navButtons = document.querySelectorAll('.nav_button_control');

    function setActiveView(targetViewId) {
        // Hide all views
        views.forEach(view => view.classList.remove('active'));
        // Show the target view
        document.getElementById(targetViewId).classList.add('active');
        // Stop/start component animations based on the view
        // ...
    }

    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            setActiveView(button.dataset.view);
        });
    });
}`
            },
            universe_entry: {
                title: 'main_universe.js',
                description: 'This is the starting point for the homepage. Its job is to load all the scripts for the 3D universe in the right order, similar to the main.js file.',
                code: `// Sequentially load scripts to ensure dependencies are met
loadScript('js/loader.js', () => {
  loadScript('js/space_camera_utils.js', () => {
    loadScript('js/space_core.js', () => { 
      // ... After all scripts are loaded ...
      // Initialize all systems
      initializeSpace();
      initializePlanets(); 
      initializeNebula();
    });
  });
});`
            },
            styles: {
                title: 'load_styles.js',
                description: 'After separating my one big CSS file, I created this small utility script that loads all the site\'s CSS files for me because I really didn\'t want to manually include every CSS file on every page.',
                code: `(function() {
    // Check if we are in a subdirectory (like /pages/)
    const isPagesDir = window.location.pathname.includes('/pages/');
    const pathPrefix = isPagesDir ? '../' : './';

    const stylesheets = [
        "styling/style.css",
        "styling/animations.css",
        "styling/loader.css",
        /* ... all other CSS files ... */
    ];

    stylesheets.forEach(href => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = pathPrefix + href;
        document.head.appendChild(link);
    });
})();`
            },
        };
    
        function drawConnectors() {
            if (!connectorsSvg) return;

            if (getComputedStyle(connectorsSvg).display === 'none') {
                connectorsSvg.innerHTML = '';
                return;
            }

            connectorsSvg.innerHTML = '';

            const connections = [
                // Loaders to Entry Points/Pages
                { from: 'main', to: 'cockpit' },
                { from: 'main', to: 'game_js' },
                { from: 'main', to: 'logo_js' },
                { from: 'universe_entry', to: 'core' },
                { from: 'styles', to: 'main' }, 

                // Page Logic to HTML
                { from: 'game_js', to: 'game_page' },
                { from: 'logo_js', to: 'logo_page' },
                
                // Core Engine dependencies
                { from: 'core', to: 'planets' },
                { from: 'core', to: 'galaxies' },
                { from: 'core', to: 'camera' },
                { from: 'core', to: 'stars' },
                
                // Universe dependencies on components
                { from: 'universe_entry', to: 'loader' },
                { from: 'universe_entry', to: 'logo' },
            ];

            const containerRect = connectorsSvg.getBoundingClientRect();

            connections.forEach(conn => {
                const fromEl = view.querySelector(`.blueprint_module[data-module-id="${conn.from}"]`);
                const toEl = view.querySelector(`.blueprint_module[data-module-id="${conn.to}"]`);

                if (!fromEl || !toEl) return;

                const fromRect = fromEl.getBoundingClientRect();
                const toRect = toEl.getBoundingClientRect();

                const fromX = fromRect.left + fromRect.width / 2 - containerRect.left;
                const fromY = fromRect.top + fromRect.height / 2 - containerRect.top;
                const toX = toRect.left + toRect.width / 2 - containerRect.left;
                const toY = toRect.top + toRect.height / 2 - containerRect.top;

                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', fromX);
                line.setAttribute('y1', fromY);
                line.setAttribute('x2', toX);
                line.setAttribute('y2', toY);
                line.dataset.from = conn.from;
                line.dataset.to = conn.to;
                
                connectorsSvg.appendChild(line);
            });
        }
    
        modules.forEach(module => {
            module.addEventListener('click', () => {
                const moduleId = module.dataset.moduleId;
                const data = moduleData[moduleId];
    
                if (data && titleEl && descEl && codeEl) {
                    titleEl.textContent = data.title;
                    descEl.textContent = data.description;
                    codeEl.textContent = data.code;
    
                    modules.forEach(m => m.classList.remove('active'));
                    module.classList.add('active');

                    // Highlight the connectors
                    const allLines = connectorsSvg.querySelectorAll('line');
                    allLines.forEach(l => l.classList.remove('highlighted'));

                    const connectedLines = connectorsSvg.querySelectorAll(`line[data-from="${moduleId}"], line[data-to="${moduleId}"]`);
                    connectedLines.forEach(l => l.classList.add('highlighted'));
                }
            });
        });
    
        const blueprintContainer = view.querySelector('#blueprint_container');
        if (blueprintContainer) {
            const resizeObserver = new ResizeObserver(entries => {
                drawConnectors();
            });
            resizeObserver.observe(blueprintContainer);
        }
    
        drawConnectors();
    }


    function closeMobileMenu() {
        if (window.innerWidth <= 968 && controlPanel.classList.contains('open')) {
            controlPanel.classList.remove('open');
        }
    }

    // To not make it lagg
    function stopActiveAnimations() {
        if (componentState.cube.controller) {
            componentState.cube.controller.stop();
        }
        if (componentState.hexagon.animationInterval) {
            clearInterval(componentState.hexagon.animationInterval);
            componentState.hexagon.animationInterval = null;
        }
        if (componentState.floater.controller) {
            componentState.floater.controller.stop();
        }
        if (componentState.constellation.controller) {
            componentState.constellation.controller.stop();
        }
    }

    // Which model is picked?
    function setActiveView(targetViewId) {
        stopActiveAnimations();
        views.forEach(view => view.classList.remove('active'));
        const targetView = document.getElementById(targetViewId);
    
        if (targetView) {
            targetView.classList.add('active');
            const componentName = targetViewId.replace('_view', '');
    
            switch (componentName) {
                case 'cube':
                    if (!componentState.cube.initialized) {
                        if (typeof initializeCube === 'function') {
                            componentState.cube.controller = initializeCube();
                            componentState.cube.initialized = true;
                        }
                    }
                    if (componentState.cube.controller) {
                        componentState.cube.controller.start();
                    }
                    break;
    
                case 'hexagon':
                    if (!componentState.hexagon.initialized) {
                        const container = targetView.querySelector('.component_model_viewer');
                        if (typeof initializeHexagon === 'function') {
                            componentState.hexagon.animationInterval = initializeHexagon(container);
                            componentState.hexagon.initialized = true;
                        }
                    }
                    break;
    
                case 'floater':
                    if (!componentState.floater.initialized) {
                        if (typeof initializeFloaters === 'function') {
                            const viewer = targetView.querySelector('.component_model_viewer');
                            const placeholder = viewer.querySelector('.placeholder_model');
                            if (placeholder) {
                                placeholder.remove();
                            }
                            initializeFloaters(viewer);
                            componentState.floater.initialized = true;
                        }
                    }
                    break;
    
                case 'loader':
                    if (!componentState.loader.initialized) {
                        if (typeof initialize3DLogo === 'function') {
                            initialize3DLogo('logo3d_loader_preview', { wireframe: true });
                            componentState.loader.initialized = true;
                        }
                    }
                    break;
    
                case 'hover':
                    if (!componentState.hover.initialized) {
                        if (typeof attachHighlightEffect === 'function') {
                            const target = document.getElementById('hover_effect_target');
                            if (target) {
                                attachHighlightEffect(target);
                                componentState.hover.initialized = true;
                            }
                        }
                    }
                    break;
    
                case 'constellation':
                    if (!componentState.constellation.initialized) {
                        if (typeof initializeConstellationModel === 'function') {
                            const container = document.getElementById('constellation_model_container');
                            if (container) {
                                componentState.constellation.controller = initializeConstellationModel(container);
                                componentState.constellation.initialized = true;
                            }
                        }
                    }
                    if (componentState.constellation.controller) {
                        componentState.constellation.controller.start();
                    }
                    break;
            }
        }
    }

    if (architectureView) {
        setupArchitectureView(architectureView);
    }

    if (hamburgerMenu && controlPanel) {
        hamburgerMenu.addEventListener('click', () => {
            controlPanel.classList.toggle('open');
        });
    }

    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); 
            const targetViewId = button.dataset.view;
            
            navButtons.forEach(btn => btn.classList.remove('active'));
            modelButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            setActiveView(targetViewId);
            closeMobileMenu();
        });
    });

    modelButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('disabled')) return;
            const targetViewId = button.dataset.view;

            navButtons.forEach(btn => btn.classList.remove('active'));
            modelButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            setActiveView(targetViewId);
            closeMobileMenu();
        });
    });

    if (toggleBottomPanelBtn && bottomPanel) {
        toggleBottomPanelBtn.addEventListener('click', () => {
            bottomPanel.classList.toggle('minimized');
        });
    }

    const initialActiveButton = document.querySelector('#controlPanel .nav_button_control.active');
    if (initialActiveButton) {
        setActiveView(initialActiveButton.dataset.view);
    } else if (navButtons.length > 0) {
        navButtons[0].classList.add('active');
        setActiveView(navButtons[0].dataset.view);
    }
}