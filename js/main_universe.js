function loadScript(url, callback) {
  const script = document.createElement('script');
  script.src = url;
  script.onload = callback;
  document.head.appendChild(script);
}

loadScript('js/loader.js', () => {
  loadScript('js/3Dlogo.js', () => {
    loadScript('js/space_camera_utils.js', () => {
      loadScript('js/space_stars_utils.js', () => {
        loadScript('js/space_galaxies_utils.js', () => {
          loadScript('js/space_planets_utils.js', () => {
            loadScript('js/space_core.js', () => {
              document.getElementById("loadingOverlay") ? initializeLoader() : null;
              document.getElementById("logo3D") ? initialize3DLogo() : null;
              initializeSpace();
            });
          });
        });
      });
    });
  });
});