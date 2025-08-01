function initializeLoader() {
  const overlay = document.getElementById("loadingOverlay");
  const bar = document.getElementById("loadingBar");
  const percent = document.getElementById("loadingPercent");

  const duration = 750; // arbritary duration in ms to make it look fancy
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const t = Math.min(elapsed / duration, 1); 
    const progress = Math.floor(t * 100);

    bar.style.width = `${progress}%`;
    percent.innerText = `${progress}%`;

    if (t < 1) {
      requestAnimationFrame(update);
    } else {
      setTimeout(() => {
        overlay.classList.add("lift");
      }, 50);
      overlay.addEventListener("animationend", () => {
        overlay.remove();
      });
    }
  }

  requestAnimationFrame(update);
}
