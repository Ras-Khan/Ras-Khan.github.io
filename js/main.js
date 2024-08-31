function loadScript(url, callback) {
    const script = document.createElement('script');
    script.src = url;
    script.onload = callback;
    document.head.appendChild(script);
}

// Load all scripts in sequence
loadScript('js/hexagon.js', () => {
    loadScript('js/nightsky.js', () => {
        // Initialize everything
        initializeHexagon();
        initializeNightSky();
    });
});

