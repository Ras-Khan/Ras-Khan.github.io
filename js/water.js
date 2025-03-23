
function initializeWater() {
    const canvas = document.getElementById("waterCanvas");
    const ctx = canvas.getContext("2d");

    const buffer1 = document.createElement("canvas");
    const buffer2 = document.createElement("canvas");
    const blended = document.createElement("canvas");

    const bctx1 = buffer1.getContext("2d");
    const bctx2 = buffer2.getContext("2d");
    const bctx = blended.getContext("2d");

    const res = 512;
    buffer1.width = buffer2.width = blended.width = res;
    buffer1.height = buffer2.height = blended.height = res;

    const normal1 = new Image();
    const normal2 = new Image();

    let offsetX = 0;
    let offsetY = 0;
    const speed = 0.4;

    normal1.crossOrigin = "anonymous";
    normal2.crossOrigin = "anonymous";
    normal1.src = "img/Water_Normal_1.jpg";
    normal2.src = "img/Water_Normal_2.jpg";
    

    Promise.all([
        new Promise((res) => (normal1.onload = res)),
        new Promise((res) => (normal2.onload = res))
    ]).then(() => {
        draw();
    });

    function blendNormals() {
        bctx.clearRect(0, 0, res, res);

        bctx1.clearRect(0, 0, res, res);
        bctx1.drawImage(normal1, offsetX % res, offsetY % res, res, res, 0, 0, res, res);

        bctx2.clearRect(0, 0, res, res);
        bctx2.drawImage(normal2, (offsetX + res / 2) % res, (offsetY + res / 2) % res, res, res, 0, 0, res, res);

        const imgData1 = bctx1.getImageData(0, 0, res, res).data;
        const imgData2 = bctx2.getImageData(0, 0, res, res).data;
        const imgOut = bctx.createImageData(res, res);

        for (let i = 0; i < imgData1.length; i += 4) {
            imgOut.data[i] = (imgData1[i] + imgData2[i]) >> 1;     // R
            imgOut.data[i + 1] = (imgData1[i + 1] + imgData2[i + 1]) >> 1; // G
            imgOut.data[i + 2] = (imgData1[i + 2] + imgData2[i + 2]) >> 1; // B
            imgOut.data[i + 3] = 255; // Alpha
        }

        bctx.putImageData(imgOut, 0, 0);
    }

    function draw() {
        offsetX += speed;
        offsetY -= speed;

        blendNormals();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, "rgba(58, 112, 183, 0.80)");
        gradient.addColorStop(1, "rgba(16, 41, 73, 1.00)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        const resX = canvas.width / res;
        const resY = canvas.height / res;

        const blendedData = bctx.getImageData(0, 0, res, res).data;

        for (let y = 0; y < canvas.height; y += 6) {
            for (let x = 0; x < canvas.width; x += 6) {
                const u = Math.floor(x / resX);
                const v = Math.floor(y / resY);
                const i = (v * res + u) * 4;

                const r = blendedData[i];     // X-direction
                const b = blendedData[i + 2]; // Z-depth

                const brightness = ((r - 128) + (b - 128)) * 0.4;

                ctx.fillStyle = `rgba(255,255,255,${0.03 + brightness * 0.002})`;
                ctx.fillRect(x, y, 6, 6);
            }
        }

        ctx.restore();

        requestAnimationFrame(draw);
    }
}
