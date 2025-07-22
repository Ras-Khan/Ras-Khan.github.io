
function initializeCockpit() {
    const navButtons = document.querySelectorAll('#controlPanel .nav_button_control[data-view]');
    const modelButtons = document.querySelectorAll('#bottomControlPanel .model_button[data-view]');
    const views = document.querySelectorAll('#mainViewscreen .view_panel');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const controlPanel = document.getElementById('controlPanel');
    const bottomPanel = document.getElementById('bottomControlPanel');
    const toggleBottomPanelBtn = document.getElementById('toggleBottomPanel');

    const componentState = {
        cube: { initialized: false, controller: null },
        hexagon: { initialized: false, animationInterval: null }
    };

    function closeMobileMenu() {
        if (window.innerWidth <= 768 && controlPanel.classList.contains('open')) {
            controlPanel.classList.remove('open');
        }
    }

    function stopActiveAnimations() {
        if (componentState.cube.controller) {
            componentState.cube.controller.stop();
        }
        if (componentState.hexagon.animationInterval) {
            clearInterval(componentState.hexagon.animationInterval);
            componentState.hexagon.animationInterval = null;
        }
    }

    function setActiveView(targetViewId) {
        stopActiveAnimations();
        views.forEach(view => view.classList.remove('active'));
        const targetView = document.getElementById(targetViewId);
        if (targetView) {
            targetView.classList.add('active');
            const componentName = targetViewId.replace('_view', '');

            if (componentName === 'cube') {
                if (!componentState.cube.initialized) {
                    if (typeof initializeCube === 'function') {
                        componentState.cube.controller = initializeCube();
                        componentState.cube.initialized = true;
                    }
                }
                if (componentState.cube.controller) {
                    componentState.cube.controller.start();
                }

            } else if (componentName === 'hexagon') {
                const container = targetView.querySelector('.component_container');
                if (typeof initializeHexagon === 'function') {
                    componentState.hexagon.animationInterval = initializeHexagon(container);
                    componentState.hexagon.initialized = true;
                }
            }
        }
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