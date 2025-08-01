function initializeLogoDesignPage() {
    const paperContentLeft = document.getElementById('paperContentLeft');
    const paperContentRight = document.getElementById('paperContentRight');
    const paperContentSingle = document.getElementById('paperContentSingle');
    const bookmarksNav = document.getElementById('bookmarksNav');

    if (!paperContentLeft || !paperContentRight || !bookmarksNav || !paperContentSingle) {
        console.error("One or more required elements for the logo design page are missing.");
        return;
    }

    let activeBookmark = null;

    const logoSvg = `
        <svg class="logo_svg_ld" viewBox="0 0 630 400" xmlns="http://www.w3.org/2000/svg">
            <style> .logo_part_green { fill: #009B80; } .logo_part_purple { fill: #80009B; } </style>
            <g> <path class="logo_part_green" d="M0 0 L285 0 L300 20 L300 212 L270 172 L180 172 L270 280 L300 280 L300 400 L120 160 L120 120 L240 120 L255 100 L255 60 L240 40 L90 40 L75 60 L75 100 Z"/> </g>
            <g transform="translate(630, 0) scale(-1, 1)"> <path class="logo_part_purple" d="M0 0 L285 0 L300 20 L300 212 L270 172 L180 172 L270 280 L300 280 L300 400 L120 160 L120 120 L240 120 L255 100 L255 60 L240 40 L90 40 L75 60 L75 100 Z"/> </g>
        </svg>
    `;

    const logo3D_HTML = `
        <div class="logo_3d_sketchbook_wrapper">
            <div id="logo3dSketchbook">
                <div class="logo_half left"></div>
                <div class="logo_half right"></div>
                <div class="logo_half mirror_left"></div>
                <div class="logo_half mirror_right"></div>
            </div>
        </div>
    `;

    const contentMap = {
        motivation: {
            left: `
                <div class="content_section_ld">
                    <h1>Motivation</h1>
                    <p>Why make my own logo? Well, I wanted something simple to show off my design skill at a quick glance. it's like my professional handshake, a little visual 'hello' that says a lot without saying a word.</p>
                    <p>I also enjoyed this little passion project, as it gave me the freedom to play around and create something from scratch that feels 'me'.</p>
                </div>`,
            right: `
                <div class="content_section_ld content_section_ld_visual">
                    <div class="logo_display_container">${logo3D_HTML}</div>
                </div>`
        },
        inspiration: {
            left: `
                <div class="content_section_ld">
                    <h1>Inspiration</h1>
                    <p>When I started brainstorming my logo, I had a pretty clear checklist. It had to feature my initials, and of course, my favorite color deep cyan-green.</p>
                    <p>I went down a bit of a rabbit hole looking at other designs and found myself liking logos that played with interlocking letters and basic shapes. I'm a big fan of symmetry, so getting that balance right was important. In the end, triangles just felt right; they gave me the sharp, bold look I was going for.</p>
                </div>`,
            right: `
                <div class="content_section_ld content_section_ld_visual">
                    <div class="exploration_grid">
                        <div class="sketch_card">
                            <img src="../img/logo_design_img/RS_example_logo.png" alt="RSJ logo example">
                            <h3>Sharp & Geometric</h3>
                            <p>A logo with clear thick lines and a modern feel. I liked how the shapes were used to frame the letters.</p>
                        </div>
                        <div class="sketch_card">
                            <img src="../img/logo_design_img/VLDL_logo.png" alt="VLDL logo example">
                            <h3>Simple & Bold</h3>
                            <p> The VLDL logo looks very basic but the use of the triangles in this way stood out to me.</p>
                        </div>
                        <div class="sketch_card">
                            <img src="../img/logo_design_img/RS_example_logo2.png" alt="RS monogram example">
                            <h3>Interlocking Letters</h3>
                            <p> I liked the way interlocking letters look and wanted to integrate this in my own logo, but decided not to.</p>
                        </div>
                    </div>
                </div>`
        },
        conceptualisation: {
            left: `
                <div class="content_section_ld">
                    <h1>Conceptualisation</h1>
                    <p>With my inspiration sorted, I started sketching. The main goal was to create a symmetrical, triangle-based design that incorporated my initials, 'R' and 'S'. I wanted the 'R' to subtly mirror the shape of the 'S', creating a clever visual that isn't obvious at first glance.</p>
                    <p>I experimented with adding "wings" to the design, but it felt too complicated and didn't fit the clean, bold aesthetic I wanted. It was also important that the logo was made in simple shapes, as this would make it easier to create in an SVG.</p>
                    <p>In the end, I decided to make the 'R' an exact mirror of the 'S'. This approach kept the logo's simplicity and symmetry.</p>
                </div>`,
            right: `
                <div class="content_section_ld content_section_ld_visual">
                    <div class="sketch_gallery">
                        <div class="sketch_display" style="transform: rotate(-2deg);">
                            <img src="../img/logo_design_img/logo_sketch_1.png" alt="Early sketches in a notebook">
                            <div class="sketch_caption">
                                <h3>Initial sketches</h3>
                                <p>Early sketches drawn on paper first.</p>
                            </div>
                        </div>
                        <div class="sketch_display" style="transform: rotate(1.5deg);">
                            <img src="../img/logo_design_img/logo_sketch_2.png" alt="Sketches with color variations">
                            <div class="sketch_caption">
                                <h3>Color & Refinement</h3>
                                <p>Testing several colors on paper.</p>
                            </div>
                        </div>
                    </div>
                </div>`
        },
        realisation: {
            left: `
                <div class="content_section_ld">
                    <h1>Realisation</h1>
                    <p>With the logo's shape finalized, the next step was choosing the color palette. My favorite color, a deep cyan-green, was the starting point. I explored several color theory models to find harmonious and contrasting companions.</p>
                    <p>Below are some of the schemes I considered, including analogous, split-complementary, and triadic. While each had its merits, the triadic combination of green, purple, and gold ultimately provided the bold, balanced, and high-contrast look I was aiming for in the final design.</p>
                    <div class="color_palettes_container">
                        <div class="logo_info_panel">
                            <h3>Cyan</h3>
                            <div class="color_palette">
                                <div class="color_swatch" style="background-color: #009B80;"><span>#009B80</span></div>
                                <div class="color_swatch" style="background-color: #80009B;"><span>#80009B</span></div>
                                <div class="color_swatch" style="background-color: #9B8000;"><span>#9B8000</span></div>
                            </div>
                        </div>
                        <div class="logo_info_panel">
                            <h3>Blue & Bright</h3>
                            <div class="color_palette">
                                <div class="color_swatch" style="background-color: #0089CE;"><span>#0089CE</span></div>
                                <div class="color_swatch" style="background-color: #89CE00;"><span>#89CE00</span></div>
                                <div class="color_swatch" style="background-color: #CE0089;"><span>#CE0089</span></div>
                            </div>
                        </div>
                        <div class="logo_info_panel">
                            <h3>Darker</h3>
                            <div class="color_palette">
                                <div class="color_swatch" style="background-color: #09003A;"><span>#09003A</span></div>
                                <div class="color_swatch" style="background-color: #3A0900;"><span>#3A0900</span></div>
                                <div class="color_swatch" style="background-color: #003A09;"><span>#003A09</span></div>
                            </div>
                        </div>
                    </div>
                </div>`,
            right: `
                <div class="content_section_ld content_section_ld_visual">
                    <div class="realisation_content">
                        <div class="color_exploration_display">
                            <h3>Testing color palettes</h3>
                            <div class="color_variant_card">
                                <img src="../img/logo_design_img/light_mode_colors.png" alt="Logo color variations on a light background">
                                <p>Light Background Variations</p>
                            </div>
                            <div class="color_variant_card">
                                <img src="../img/logo_design_img/dark_mode_colors.png" alt="Logo color variations on a dark background">
                                <p>Dark Background Variations</p>
                            </div>
                        </div>
                    </div>
                </div>`
        },
        integration: {
            left: `
                <div class="content_section_ld">
                    <h1>Integration</h1>
                    <p>With the final design complete, the next step was to integrate it into my resume and business card.</p>
                    <p>On my resume, accessibility was a high priority. Using a color blindness simulation tool¹, I wanted to make sure my logo stays vibrant across most color blindness types, so I settled on a blue and yellow combination.</p>
                    <p>For the business card, I took a more expressive route. The logo covers the entire front, to immediately showcase my design style.</p>
                    <p style="font-size: 0.8rem; margin-top: 2rem; color: #666;"><small>¹ Mathis, D. <em>Color Blindness Simulator</em>, retrieved from <a href="https://davidmathlogic.com/colorblind/" target="_blank" rel="noopener noreferrer">davidmathlogic.com/colorblind</a>.</small></p>
                </div>`,
            right: `
                <div class="content_section_ld content_section_ld_visual">
                    <div class="sketch_gallery">
                        <div class="sketch_display" style="transform: rotate(1deg);">
                            <img src="../img/logo_design_img/resume_logo.png" alt="Logo used on a resume">
                            <div class="sketch_caption">
                                <h3>Resume Application</h3>
                                <p>The color-accessible version of my logo on the resume header.</p>
                            </div>
                        </div>
                        <div class="sketch_display" style="transform: rotate(-1.5deg);">
                            <img src="../img/logo_design_img/bc_logo.png" alt="Logo used on a business card">
                            <div class="sketch_caption">
                                <h3>Business Card Design</h3>
                                <p>The logo on the front side of my business card.</p>
                            </div>
                        </div>
                    </div>
                </div>`
        }
    };
    const orderedContentKeys = Object.keys(contentMap);

    function setContent(contentKey) {
        const content = contentMap[contentKey];
        if (!content) return;

        // Update the active bookmark class in case of slow loading times
        if (activeBookmark) {
            activeBookmark.classList.remove('active');
        }
        activeBookmark = bookmarksNav.querySelector(`[data-content="${contentKey}"]`);
        if (activeBookmark) {
            activeBookmark.classList.add('active');
        }

        const isSmallScreen = window.innerWidth <= 1024;

        // Clear all containers first
        paperContentLeft.innerHTML = '';
        paperContentRight.innerHTML = '';
        if (paperContentSingle) paperContentSingle.innerHTML = '';

        if (isSmallScreen) {
            // If small screen, put on a single page
            if (paperContentSingle) {
                paperContentSingle.innerHTML = (content.left || '') + (content.right || '');
            }
        } else {
            // If desktop, make it split like a sketchbook
            paperContentLeft.innerHTML = content.left || '';
            paperContentRight.innerHTML = content.right || '';
        }
        
        // Re-initialize the logo, else the sides are gone for some reason
        if (contentKey === 'motivation') {
            if (typeof initialize3DLogo === 'function') {
                const logoElement = document.querySelector('#logo3dSketchbook');
                if (logoElement) {
                    initialize3DLogo(logoElement);
                }
            }
        }
    }

    function createBookmarks() {
        bookmarksNav.innerHTML = '';
        orderedContentKeys.forEach(key => {
            const button = document.createElement('button');
            button.className = 'bookmark_ld';
            button.dataset.content = key;

            const buttonText = key.charAt(0).toUpperCase() + key.slice(1);
            button.dataset.fulltext = buttonText;
            button.innerHTML = `<span>${buttonText}</span>`;

            button.addEventListener('click', (event) => {
                event.preventDefault();
                setContent(key);
            });
            bookmarksNav.appendChild(button);
        });

        const exitLink = document.createElement('a');
        exitLink.className = 'bookmark_ld bookmark_exit';
        exitLink.href = '../index.html';
        const exitText = 'Exit to Home';
        exitLink.dataset.fulltext = exitText;
        exitLink.innerHTML = `<span>${exitText}</span>`;
        bookmarksNav.appendChild(exitLink);
    }

    // Random pencils instead of saving pencil data unnecessarily, also looks neat
    function createPencils() {
        const container = document.getElementById('pencilContainer');
        if (!container) return;
        container.innerHTML = '';

        const PENCIL_COUNT = 8;
        const colors = ['red', 'blue', 'green', 'purple', 'dark', 'yellow', 'orange', 'cyan'];
        const sizes = ['short', '', 'long'];

        for (let i = 0; i < PENCIL_COUNT; i++) {
            const pencilEl = document.createElement('div');
            
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = sizes[Math.floor(Math.random() * sizes.length)];
            
            pencilEl.className = `pencil color_${color} ${size}`;
            
            const rotation = Math.floor(Math.random() * 360);
            const side = Math.floor(Math.random() * 4);
            let style = `transform: rotate(${rotation}deg);`;

            switch (side) {
                case 0: style += `top: ${Math.random() * 5 + 1}%; left: ${Math.random() * 80 + 10}%;`; break;
                case 1: style += `top: ${Math.random() * 80 + 10}%; right: ${Math.random() * 5 + 1}%;`; break;
                case 2: style += `bottom: ${Math.random() * 5 + 1}%; left: ${Math.random() * 80 + 10}%;`; break;
                case 3: style += `top: ${Math.random() * 80 + 10}%; left: ${Math.random() * 5 + 1}%;`; break;
            }

            pencilEl.style.cssText = style;
            pencilEl.innerHTML = `<div class="pencil_eraser"></div><div class="pencil_ferrule"></div><div class="pencil_body"></div><div class="pencil_tip_container"><div class="pencil_wood"></div><div class="pencil_tip"></div></div>`;
            container.appendChild(pencilEl);
        }
    }

    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    function adjustBookmarkLabels() {
        if (!bookmarksNav) return;
    
        const allBookmarks = bookmarksNav.querySelectorAll('.bookmark_ld');
        if (allBookmarks.length === 0) return;
    
        const isSmallScreen = window.innerWidth <= 1024;
    
        allBookmarks.forEach(bm => {
            const span = bm.querySelector('span');
            if (!span) return;
    
            const isExitButton = bm.classList.contains('bookmark_exit');
            const fullText = bm.dataset.fulltext;
    
            if (isExitButton) {
                span.textContent = isSmallScreen ? '←' : 'Exit to Home';
            } else {
                if (fullText) {
                    span.textContent = isSmallScreen ? fullText.charAt(0) : fullText;
                }
            }
        });
    }
    
    // Initial setup
    createBookmarks();
    setContent(orderedContentKeys[0]);
    createPencils();
    adjustBookmarkLabels();
    
    // If the user resizes the window, resize everything again
    window.addEventListener('resize', throttle(() => {
        adjustBookmarkLabels();
        const currentContentKey = activeBookmark ? activeBookmark.dataset.content : orderedContentKeys[0];
        setContent(currentContentKey);
    }, 200));
}