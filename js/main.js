// Execute the function immediately
(function() {
    const isPagesDir = window.location.pathname.includes('/pages/');
    const pathPrefix = isPagesDir ? '../' : './';

    function loadScript(url, callback) {
        const script = document.createElement('script');
        script.src = pathPrefix + url;
        if (callback) {
            script.onload = () => callback();
        }
        document.head.appendChild(script);
    }

    // Check for specific elements to load the right scripts
    // Showroom = #cockpitContainer 
    // Logo design = #logo_design_page
    // Game design = #game_design_page
    // ^ Used elements just in case they're changed in the future ^
    if (document.getElementById('cockpitContainer')) {
        loadScript('js/cube.js', () => {
            loadScript('js/hexagon.js', () => {
                loadScript('js/floaters.js', () => {
                    loadScript('js/3Dlogo.js', () => {
                        loadScript('js/hoverEffect.js', () => {
                            loadScript('js/nightsky.js', () => {
                                loadScript('js/cockpit.js', () => {
                                    if (typeof initializeCockpit === 'function') {
                                        initializeCockpit();
                                    }
                                });
                            });
                        });
                    });
                });
            });
        });
    }

    if (document.body.classList.contains('logo_design_page')) {
        loadScript('js/3Dlogo.js', () => {
            loadScript('js/logo_design.js', () => {
                if (typeof initializeLogoDesignPage === 'function') {
                    initializeLogoDesignPage();
                }
            });
        });
    }

    if (document.body.classList.contains('game_design_page')) {
        loadScript('js/game_design.js', () => {
            if (typeof initializeGameDesignPage === 'function') {
                initializeGameDesignPage();
            }
        });
    }

})();