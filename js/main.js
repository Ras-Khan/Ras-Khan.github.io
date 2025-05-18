// Fade-in from black if transitionOverlay exists
window.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("transitionOverlayPlanet");
    if (overlay) {
        overlay.style.opacity = 1;
        overlay.style.pointerEvents = "auto";
        requestAnimationFrame(() => {
            overlay.style.transition = "opacity 2s ease-in-out";
            overlay.style.opacity = 0;
            setTimeout(() => {
                overlay.style.pointerEvents = "none";
                overlay.remove();
            }, 1000);
        });
    }
});


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
                                // Initialize everything if they exist
                                document.getElementById("loadingOverlay") ? initializeLoader() : null;
                                document.getElementById("logo3D") ? initialize3DLogo() : null;
                                document.querySelector('.hexagon') ? initializeHexagon() : null;
                                initializeNightSky();
                                initializeWater();
                                initializeCube(); 
                                initializeFloaters();

                                // Attach highlights to stuff if they exist
                                document.querySelector('.glass_container') ? attachHighlightEffect(document.querySelector('.glass_container')) : null;
                                document.querySelector('#floatingRectangle .rect_front') ? attachHighlightEffect(document.querySelector('#floatingRectangle .rect_front')) : null;
                            });
                        });
                    });
                });
            });
        });
    });
});
