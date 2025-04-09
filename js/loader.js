function initializeLoader() {
    const overlay = document.getElementById("loadingOverlay");
    const bar = document.getElementById("loadingBar");
  
    let progress = 0;
  
    const interval = setInterval(() => {
      progress += 1.5;
      bar.style.width = `${progress}%`;
    
      if (Math.floor(progress) % 10 === 0) {
        bar.innerText = `${Math.floor(progress)}%`;
      }
    
      if (progress >= 100) {
        clearInterval(interval);
        requestAnimationFrame(() => {
          setTimeout(() => {
            overlay.classList.add("lift");
          }, 50);
        });
        overlay.addEventListener("animationend", () => {
          overlay.remove();
        });
      }
    }, 30);
  }
  