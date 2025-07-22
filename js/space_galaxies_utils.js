
function initializeGalaxiesArray() {
    const galaxyData = [
        {
            x: -10000, y: 5000, z: 15000, arms: 2, particles: 500, coreSize: 600,
            spiralSpread: 1500, rotation: 0.1, rotationSpeed: -0.00007, // speed is per ms, adjusted in animate
            tiltX: 0.5, tiltY: 0.3, tiltZ: 0.5,
            color: "rgba(91, 150, 226, 0.95)", coreColor: "rgba(255, 245, 107, 0.8)"
        },
        {
            x: -1000, y: -3000, z: 45000, arms: 2, particles: 150, coreSize: 200,
            spiralSpread: 600, rotation: 1.2, rotationSpeed: -0.00004,
            tiltX: 0.0, tiltY: 0.2, tiltZ: 0.5,
            color: "rgba(233, 21, 21, 0.41)", coreColor: "rgba(255, 0, 0, 0.53)"
        },
        {
            x: 20000, y: -4000, z: 14000, arms: 2, particles: 500, coreSize: 400,
            spiralSpread: 750, rotation: 2.4, rotationSpeed: 0.00001,
            tiltX: -0.2, tiltY: 0.7, tiltZ: 0.4,
            color: "rgba(255, 180, 255, 0.95)", coreColor: "rgba(235, 208, 227, 0.77)"
        }
    ];

    galaxyData.forEach(data => {
        const galaxy = { ...data, points: [] };
        for (let i = 0; i < galaxy.particles; i++) {
            const arm = i % galaxy.arms;
            const baseAngle = (i / galaxy.particles) * Math.PI * 4 + (arm * Math.PI * 2 / galaxy.arms);
            const dist = (i / galaxy.particles) * galaxy.spiralSpread;
            const randomY = (Math.random() - 0.5) * 150;
            galaxy.points.push({ baseAngle, dist, y: randomY });
        }
        galaxies.push(galaxy);
    });
}

function drawGalaxy(galaxy) {
    const dx = galaxy.x - cameraX;
    const dy = galaxy.y - cameraY;
    const dz = galaxy.z - cameraZ;

    const radY = rotationY * Math.PI / 180;
    const radX = rotationX * Math.PI / 180;
    const cosY = Math.cos(radY);
    const sinY = Math.sin(radY);
    const cosX = Math.cos(radX);
    const sinX = Math.sin(radX);

    const x1 = dx * cosY - dz * sinY;
    const z1 = dx * sinY + dz * cosY;
    const y1 = dy * cosX - z1 * sinX;
    const zRot = dy * sinX + z1 * cosX;

    if (zRot < 50 || zRot > 80000) return;

    const scale = Math.max(Math.min(1000 / zRot, 5), 0.05);
    const x2d_center = (x1 * scale) + width / 2;
    const y2d_center = (y1 * scale) + height / 2;
    const coreRadius = galaxy.coreSize * scale;

    // Draw spiral arms
    for (let i = 0; i < galaxy.points.length; i++) {
        const { baseAngle, dist, y: baseY } = galaxy.points[i];
        const angle = baseAngle + galaxy.rotation;

        let x = Math.cos(angle) * dist;
        let z = Math.sin(angle) * dist;
        let y = baseY;

        let tx = x * Math.cos(galaxy.tiltZ) - y * Math.sin(galaxy.tiltZ);
        let ty = x * Math.sin(galaxy.tiltZ) + y * Math.cos(galaxy.tiltZ);
        x = tx; y = ty;

        tx = x * Math.cos(galaxy.tiltY) + z * Math.sin(galaxy.tiltY);
        let tz = -x * Math.sin(galaxy.tiltY) + z * Math.cos(galaxy.tiltY);
        x = tx; z = tz;

        ty = y * Math.cos(galaxy.tiltX) - z * Math.sin(galaxy.tiltX);
        tz = y * Math.sin(galaxy.tiltX) + z * Math.cos(galaxy.tiltX);
        y = ty; z = tz;

        const px = galaxy.x + x;
        const py = galaxy.y + y;
        const pz = galaxy.z + z;

        const projected = project3DTo2D({ x: px, y: py, z: pz });
        if (!projected) continue;

        const x2d_particle = projected.x;
        const y2d_particle = projected.y;
        const scale_particle = projected.scale;
        const size = Math.max(0.3 * scale_particle, 0.75);

        const dxC = x2d_particle - x2d_center;
        const dyC = y2d_particle - y2d_center;
        if ((dxC * dxC + dyC * dyC) < coreRadius * coreRadius / 4) continue; 

        ctx.beginPath();
        ctx.fillStyle = galaxy.color || "rgba(180, 220, 255, 0.95)";
        ctx.arc(x2d_particle, y2d_particle, size, 0, Math.PI * 2);
        ctx.fill();
    }

    // Draw the galaxy core
    const baseCore = galaxy.coreColor || "rgba(255,255,255,0.8)";
    const grad = ctx.createRadialGradient(x2d_center, y2d_center, 0, x2d_center, y2d_center, coreRadius);
    grad.addColorStop(0, baseCore);
    grad.addColorStop(1, baseCore.replace(/[\d.]+\)$/, "0)")); 

    ctx.beginPath();
    ctx.fillStyle = grad;
    ctx.arc(x2d_center, y2d_center, coreRadius, 0, Math.PI * 2);
    ctx.fill();
}

function renderGalaxies() {
    galaxies.forEach(drawGalaxy);
}
