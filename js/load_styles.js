// instantly execute the function
(function() {
    const isPagesDir = window.location.pathname.includes('/pages/');
    const pathPrefix = isPagesDir ? '../' : './';

    const stylesheets = [
        "styling/style.css",
        "styling/animations.css",
        "styling/loader.css",
        "styling/space.css",
        "styling/planet.css",
        "styling/planet_rings.css",
        "styling/home.css",
        "styling/effects.css",
        "styling/mission_control.css",
        "styling/logo_design.css",
        "styling/game_design.css",
        "styling/responsive.css"
    ];

    const head = document.head;
    stylesheets.forEach(href => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = pathPrefix + href;
        head.appendChild(link);
    });
})();