function loadScript(url, callback) {
    const script = document.createElement('script');
    script.src = url;
    script.onload = callback;
    document.head.appendChild(script);
}

// Load all scripts in sequence
loadScript('js/loader.js', () => {
    loadScript('js/3Dlogo.js', () => {
        loadScript('js/hexagon.js', () => {
            loadScript('js/nightsky.js', () => {
                loadScript('js/water.js', () => {
                    loadScript('js/cube.js', () => {
                        loadScript('js/floaters.js', () => {
                            loadScript('js/hoverEffect.js', () => {
                                // Initialize everything
                                initializeLoader();
                                initialize3DLogo();
                                initializeHexagon();
                                initializeNightSky();
                                initializeWater();
                                initializeCube(); 
                                initializeFloaters();

                                // Attach highlights to stuff
                                attachHighlightEffect(document.querySelector('.glass_container'));
                                const rectangle = document.querySelector('#floatingRectangle .rect_front');
                                if (rectangle) attachHighlightEffect(rectangle);
                            });
                        });
                    });
                });
            });
        });
    });
});
