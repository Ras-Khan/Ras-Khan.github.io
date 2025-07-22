function initialize3DLogo(logoElementOrId = "logo3D") {
    let logo;
    if (typeof logoElementOrId === 'string') {
        logo = document.getElementById(logoElementOrId);
    } else if (logoElementOrId instanceof HTMLElement) {
        logo = logoElementOrId;
    }

    if (!logo) {
        console.error("3D Logo element not found:", logoElementOrId);
        return;
    }

    // Clear existing extrude faces to prevent duplication
    const existingFaces = logo.querySelectorAll('.logo_extrude_face');
    existingFaces.forEach(face => face.remove());

    const depth = 30;

    const clipPathPoints = [
        [0, 0], [285, 0], [300, 20], [300, 212], [270, 172], [180, 172], [270, 280], [300, 280],
        [300, 400], [120, 160], [120, 120], [240, 120], [255, 100], [255, 60], [240, 40], [90, 40],
        [75, 60], [75, 100]
    ];

    const baseColorGreen = [0, 155, 128];
    const baseColorPurple = [128, 0, 155];
    const OffsetX = 165; // Hardcoded offset for translateX, fix later

    function addExtrudeFaces(points, offsetX, baseColor, isMirror = false) {
        for (let i = 0; i < points.length; i++) {
            let [x1, y1] = points[i];
            let [x2, y2] = points[(i + 1) % points.length];

            if (isMirror) {
                x1 = 300 - x1;
                x2 = 300 - x2;
            }

            const dx = x2 - x1;
            const dy = y2 - y1;
            const length = Math.hypot(dx, dy);
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);

            const lightDir = { x: -1, y: -1 };
            const normalX = dy;
            const normalY = -dx;
            const dot = (normalX * lightDir.x + normalY * lightDir.y) /
                        (Math.hypot(normalX, normalY) * Math.hypot(lightDir.x, lightDir.y));
            const shadowFactor = Math.max(0.4, dot);
            const shadedColor = baseColor.map(c => Math.round(c * shadowFactor));
            const rgbaColor = `rgba(${shadedColor[0]}, ${shadedColor[1]}, ${shadedColor[2]}, 1)`;

            const side = document.createElement("div");
            side.className = "logo_extrude_face";
            side.style.position = "absolute";
            side.style.width = `${length}px`;
            side.style.height = `${depth}px`;
            side.style.backgroundColor = rgbaColor;
            side.style.transformOrigin = "top left";

            side.style.transform = `
                translate3d(${x1 + offsetX}px, ${y1}px, 0)
                rotate(${angle}deg)
                rotateX(-90deg)
            `;

            logo.appendChild(side);
        }
    }

    addExtrudeFaces(clipPathPoints, -(OffsetX), baseColorGreen, false); // Green left half
    addExtrudeFaces(clipPathPoints, OffsetX, baseColorPurple, true); // Purple mirrored right half
}