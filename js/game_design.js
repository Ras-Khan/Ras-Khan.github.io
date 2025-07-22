
function initializeGameDesignPage() {
    const screenElement = document.getElementById('console_screen');
    const headerText = document.querySelector('#screen_header h1');
    const views = document.querySelectorAll('.view');
    const menuButtons = document.querySelectorAll('.menu_button');
    const backButtons = document.querySelectorAll('.back_button');
    const dPadLeftButton = document.querySelector('.d_pad .left');
    const aButton = document.getElementById('button_a');
    const levelDesignView = document.getElementById('level_design_view');
    const leftController = document.getElementById('left_controller');
    const rightController = document.getElementById('right_controller');
    const leftAnalogStickGrip = leftController ? leftController.querySelector('.analog_stick .stick_grip') : null;
    const rightAnalogStickGrip = rightController ? rightController.querySelector('.analog_stick .stick_grip') : null;

    function showView(viewId) {
        let newTitle = 'MAIN MENU';

        views.forEach(view => {
            view.classList.toggle('active', view.id === viewId);
        });

        // The main menu has a background image, other views don't
        if (screenElement) {
            screenElement.classList.toggle('main_menu_bg', viewId === 'main_menu_view');
        }

        if (viewId !== 'main_menu_view') {
            const triggeringButton = document.querySelector(`.menu_button[data-view="${viewId}"]`);
            if (triggeringButton) {
                newTitle = triggeringButton.textContent.replace(/\[|\]/g, '').trim();
            }
        }
        
        if (headerText) {
            headerText.textContent = newTitle;
        }
    }

    function goBackToMenu() {
        if (aButton) {
            aButton.classList.add('pressed');
            setTimeout(() => aButton.classList.remove('pressed'), 150);
        }
        showView('main_menu_view');
    }

    menuButtons.forEach(button => {
        button.addEventListener('click', () => showView(button.dataset.view));
    });

    backButtons.forEach(button => {
        button.addEventListener('click', goBackToMenu);
    });

    if (dPadLeftButton) {
        dPadLeftButton.addEventListener('click', goBackToMenu);
    }
    
    // Make the A button "press" on any click inside the screen because that's pretty neat
    if (screenElement && aButton) {
        screenElement.addEventListener('click', (event) => {
            if (event.target.tagName === 'BUTTON') return;
            
            aButton.classList.add('pressed');
            setTimeout(() => aButton.classList.remove('pressed'), 150);
        });
    }

    if (levelDesignView) {
        setupLevelDesignTabs(levelDesignView);
    }

    function setupLevelDesignTabs(container) {
        const tabButtons = container.querySelectorAll('.tab_button_gd');
        const tabContents = container.querySelectorAll('.tab_content_gd');
        const thumbnails = container.querySelectorAll('.level_thumbnail');
        const previewImage = container.querySelector('#level_preview_image');
        const previewCaption = container.querySelector('#level_preview_caption');

        const levelData = [
            { image: '../img/game_design_img/level_1.png', caption: 'Level 1: For this level, I planned a more horizontal progression with an easier difficulty.' },
            { image: '../img/game_design_img/level_2.png', caption: 'Level 2: Here I added a decent difficulty spike by adding more enemies and obstacles, along with some verticality.' },
            { image: '../img/game_design_img/level_3.png', caption: 'Test Level: This was used as a testing playground for new mechanics and powers.' }
        ];

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTabId = button.dataset.tab;
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                button.classList.add('active');
                container.querySelector(`#${targetTabId}`).classList.add('active');
            });
        });
        
        thumbnails.forEach((thumb) => {
            thumb.addEventListener('click', () => {
                const index = parseInt(thumb.dataset.levelIndex);
                if (!previewImage || !previewCaption || !levelData[index]) return;
            
                previewImage.src = levelData[index].image;
                previewCaption.textContent = levelData[index].caption;

                thumbnails.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });
        });

        // Show the first level by default
        if (thumbnails.length > 0) {
            thumbnails[0].click();
        }
    }

    if (screenElement && leftAnalogStickGrip) {
        screenElement.addEventListener('mousemove', (e) => {
            const screenRect = screenElement.getBoundingClientRect();
            // Calculate mouse position relative to the screen, from -1 to 1
            const normalizedX = (e.clientX - screenRect.left) / screenRect.width * 2 - 1;
            const normalizedY = (e.clientY - screenRect.top) / screenRect.height * 2 - 1;
            const maxMove = 15;
            
            leftAnalogStickGrip.style.transition = 'transform 0.05s linear';
            leftAnalogStickGrip.style.transform = `translate(${normalizedX * maxMove}px, ${normalizedY * maxMove}px)`;
        });

        screenElement.addEventListener('mouseleave', () => {
            leftAnalogStickGrip.style.transition = 'transform 0.3s ease-out';
            leftAnalogStickGrip.style.transform = 'translate(0, 0)';
        });
    }

    if (rightAnalogStickGrip) {
        const contentViews = document.querySelectorAll('.content_view');
        contentViews.forEach(view => {
            let scrollTimeout;
            let lastScrollTop = 0;

            const handleScroll = () => {
                clearTimeout(scrollTimeout);
                const currentScrollTop = view.scrollTop;
                const maxMove = 15;
                let moveY = 0;

                // Figure out if we're scrolling up or down
                if (currentScrollTop > lastScrollTop) {
                    moveY = maxMove; // Down
                } else if (currentScrollTop < lastScrollTop) {
                    moveY = -maxMove; // Up
                }
                
                lastScrollTop = Math.max(0, currentScrollTop);
                
                rightAnalogStickGrip.style.transition = 'transform 0.1s ease-out';
                rightAnalogStickGrip.style.transform = `translateY(${moveY}px)`;
                
                // After a short delay, move it back to the center
                scrollTimeout = setTimeout(() => {
                    rightAnalogStickGrip.style.transition = 'transform 0.3s ease-out';
                    rightAnalogStickGrip.style.transform = 'translateY(0px)';
                }, 150);
            };

            view.addEventListener('scroll', handleScroll);
            
            // Touch controls for touchscreens
            let touchStartY = 0;
            view.addEventListener('touchstart', (e) => {
                touchStartY = e.touches[0].clientY;
            }, { passive: true });
            
            view.addEventListener('touchmove', (e) => {
                const deltaY = e.touches[0].clientY - touchStartY;
                view.scrollTop -= deltaY;
                touchStartY = e.touches[0].clientY;
            }, { passive: true });
        });
    }

    function handleResponsiveLayout() {
        if (!leftController || !rightController) return;

        const isMobile = window.innerWidth < 900;
        const dPad = leftController.querySelector('.d_pad') || rightController.querySelector('.d_pad');
        const exitButton = leftController.querySelector('.exit_button_game') || rightController.querySelector('.exit_button_game');

        if (isMobile) {
            if (dPad && dPad.parentElement !== rightController) rightController.appendChild(dPad);
            if (exitButton && exitButton.parentElement !== rightController) rightController.appendChild(exitButton);
            
            leftController.style.display = 'none';
            rightController.classList.add('condensed');
        } else {
            const analogStick = leftController.querySelector('.analog_stick');
            if (dPad && dPad.parentElement !== leftController) {
                if (analogStick) {
                     leftController.insertBefore(dPad, analogStick.nextSibling);
                } else {
                     leftController.prepend(dPad);
                }
            }
            if (exitButton && exitButton.parentElement !== leftController) {
                leftController.appendChild(exitButton);
            }
            
            leftController.style.display = 'flex';
            rightController.classList.remove('condensed');
        }
    }

    showView('main_menu_view');
    handleResponsiveLayout();
    window.addEventListener('resize', handleResponsiveLayout);
}
