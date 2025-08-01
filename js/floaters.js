function initializeFloaters(containerElement = null) {
    const isCockpitView = !!containerElement;

    const rectangle = document.createElement("div");
    // Use a class for cockpit view to avoid ID conflicts and for specific styling
    rectangle.className = isCockpitView ? 'floater_cockpit_view' : '';
    if (!isCockpitView) {
        rectangle.id = "floatingRectangle";
    }

    rectangle.innerHTML = `
        <div class="rect_face rect_front"></div>
        <div class="rect_face rect_back"></div>
        <div class="rect_face rect_left"></div>
        <div class="rect_face rect_right"></div>
        <div class="rect_face rect_top"></div>
        <div class="rect_face rect_bottom"></div>
    `;

    if (isCockpitView) {
        containerElement.appendChild(rectangle);

        const floatingInterface = document.createElement("div");
        floatingInterface.id = "floatingInterface";
        floatingInterface.classList.add('cockpit_interface'); // Add a class for specific styling
        floatingInterface.style.display = "none";
        floatingInterface.innerHTML = `
            <div id="floatingInterfaceTopBar"></div>
            <button id="closeInterface">✕</button>
            <div id="floatingInterfaceContent">
                <h2>Contact</h2>
                <a href="#"> <p> <img src="../img/mail.png"> r.sahangoekhan@gmail.com</p> </a>
                <a href="#" target="_blank"> <p> <img src="../img/github.png"> https://github.com/Ras-Khan </p> </a>
                <a href="#" target="_blank"> <p> <img src="../img/linkedIn.png"> https://www.linkedin.com/in/rashad-sahang/ </p> </a>
            </div>
            <div id="floatingInterfaceBottomBar"></div>
        `;
        containerElement.appendChild(floatingInterface);
        
        const openCockpitInterface = () => {
            floatingInterface.style.display = 'block';
            rectangle.style.animationPlayState = 'paused';
            requestAnimationFrame(() => {
                 floatingInterface.classList.add('visible');
            });
        };

        const closeCockpitInterface = () => {
            floatingInterface.classList.remove('visible');
            rectangle.style.animationPlayState = 'running';
        };

        floatingInterface.addEventListener('transitionend', (e) => {
            if (!floatingInterface.classList.contains('visible') && e.propertyName === 'opacity') {
                floatingInterface.style.display = 'none';
            }
        });

        rectangle.addEventListener('click', openCockpitInterface);

        const closeButton = floatingInterface.querySelector('#closeInterface');
        closeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            closeCockpitInterface();
        });

        return;
    }

    // Old behaviour for an older version of the site
    document.body.appendChild(rectangle);

    const frontFace = rectangle.querySelector('.rect_front');
    const floatingInterface = document.createElement("div");
    floatingInterface.id = "floatingInterface";
    floatingInterface.style.display = "none";
    floatingInterface.innerHTML = `
        <div id="floatingInterfaceTopBar"></div>
        <div id="floatingInterfaceContent">
            <button id="closeInterface">✕</button>
            <h2>Contact</h2>
            <a href="#" target="_blank"> <p> <img src="img/github.png"> Github.com/</p> </a>
            <a href="#"> <p> <img src="img/mail.png"> test@gmail.com</p> </a>
            <a href="#" target="_blank"> <p> <img src="img/linkedIn.png"> www.linkedin.com/</p> </a>
        </div>
        <div id="floatingInterfaceBottomBar"></div>
    `;    
    document.body.appendChild(floatingInterface);

    let moving = true;
    let positionX = 75;
    let positionY = 0;
    let angle = Math.random() * Math.PI * 2;
    let rotationZ = 0;
    let animationFrame;
    let interfaceOpen = false;
    const durationInterfaceOpening = 600;

    function animateFloating() {
        if (!moving) return;
    
        angle += 0.01;
        positionX -= 0.008;
        positionY = Math.sin(angle) * 1.5 + Math.cos(angle * 0.5) * 1;
    
        let tiltX = 70 + Math.sin(angle * 0.6) * 5; // 65–75° rotation
        let tiltY = Math.sin(angle * 0.8) * 1.5;
        rotationZ = Math.sin(angle * 0.5) * 7;
    
        rectangle.style.left = `${positionX}%`;
        rectangle.style.bottom = `${10 + positionY}%`;
        rectangle.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotateZ(${rotationZ}deg)`;
    
        if (positionX <= -10) {
            positionX = 100;
        }
        animationFrame = requestAnimationFrame(animateFloating);
    }
    
    function openInterface() {
        if (interfaceOpen) return;
        interfaceOpen = true;
        moving = false;
        cancelAnimationFrame(animationFrame);

        floatingInterface.style.display = "block";
        floatingInterface.classList.remove("closing");
        floatingInterface.classList.add("opening");

        let progress = 0;
        const startTime = performance.now();

        const floatingInterfaceHeight = document.getElementsByClassName("opening")[0].clientHeight;
        const floatingInterfaceBarsHeight = document.getElementById("floatingInterfaceTopBar").clientHeight;
        const calculatedHeight = (floatingInterfaceHeight/2) - floatingInterfaceBarsHeight;

        function animateReveal(timestamp) {
            progress = Math.min((timestamp - startTime) / durationInterfaceOpening, 1);
            const easedProgress = Math.pow(progress, 2);
            const revealHeight = easedProgress * calculatedHeight;

            floatingInterface.style.clipPath = `inset(${calculatedHeight - revealHeight}px 0 ${calculatedHeight - revealHeight}px 0)`;

            document.getElementById("floatingInterfaceTopBar").style.transform = `translateY(${revealHeight}px)`;
            document.getElementById("floatingInterfaceBottomBar").style.transform = `translateY(-${revealHeight}px)`;

            if (progress < 1) {
                requestAnimationFrame(animateReveal);
            } else {
                document.getElementById("floatingInterfaceContent").style.opacity = "1";
            }
        }
        requestAnimationFrame(animateReveal);
        
    }

    function closeInterface() {
        if (!interfaceOpen) return;
        interfaceOpen = false;

        let progress = 0;
        const startTime = performance.now();

        const floatingInterfaceHeight = document.getElementsByClassName("opening")[0].clientHeight;
        const floatingInterfaceBarsHeight = document.getElementById("floatingInterfaceTopBar").clientHeight;
        const calculatedHeight = (floatingInterfaceHeight/2) - floatingInterfaceBarsHeight;

        function animateHide(timestamp) {
            progress = Math.min((timestamp - startTime) / durationInterfaceOpening, 1);
            const revealHeight = (1 - progress) * calculatedHeight;

            floatingInterface.style.clipPath = `inset(${calculatedHeight - revealHeight}px 0 ${calculatedHeight - revealHeight}px 0)`;

            document.getElementById("floatingInterfaceTopBar").style.transform = `translateY(${revealHeight}px)`;
            document.getElementById("floatingInterfaceBottomBar").style.transform = `translateY(-${revealHeight}px)`;

            if (progress < 1) {
                requestAnimationFrame(animateHide);
            } else {
                floatingInterface.style.display = "none";
                moving = true;
                animateFloating();
            }
        }

        requestAnimationFrame(animateHide);
    }

    rectangle.addEventListener("click", openInterface);
    document.addEventListener("click", (event) => {
        if (event.target.id === "closeInterface") {
            closeInterface();
        }
    });


    frontFace.addEventListener("mouseenter", () => {
        if (!interfaceOpen) {
            moving = false;
            cancelAnimationFrame(animationFrame);
        }
    });
    
    frontFace.addEventListener("mouseleave", () => {
        if (!interfaceOpen) {
            moving = true;
            animateFloating();
        }
    });
    
    animateFloating();
}