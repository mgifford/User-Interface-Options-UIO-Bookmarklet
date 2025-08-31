// UIO+ Accessibility Bookmarklet
window.uioPlus = {
    settings: null,
    defaultSettings: {
        iconPosition: "bottomRight",
        textSize: "100",
        highContrast: false,
        lineSpacing: false,
        simplifyPage: false,
        showToc: false
    },
    init: function() {
        if (window.uioPlus.initialized) {
            this.toggle();
            return;
        }
        window.uioPlus.initialized = true;
        
        // Load settings from localStorage
        try {
            const savedSettings = localStorage.getItem('uioPlus');
            this.settings = savedSettings ? JSON.parse(savedSettings) : {};
        } catch(e) {
            this.settings = {};
        }
        
        // Ensure all default settings exist
        this.settings = { ...this.defaultSettings, ...this.settings };
        this.createControls();
        this.applySettings();
        this.addEventListeners();
    },
    createControls: function() {
        var controls = document.createElement("div");
        controls.id = "uioPlus-controls";
        controls.style.cssText = "position:fixed;top:10px;right:10px;background:#fff;padding:15px;border:1px solid #ccc;border-radius:4px;box-shadow:0 2px 10px rgba(0,0,0,0.1);z-index:999999;max-width:350px;overflow:auto;";
        
        controls.innerHTML = `
            <div style="margin-bottom:10px">
                <label><input type="checkbox" data-feature="highContrast"> High Contrast</label>
            </div>
            <div style="margin-bottom:10px">
                <label>Text Size: <input type="range" min="100" max="200" value="150" data-feature="textSize"></label>
            </div>
            <div style="margin-bottom:10px">
                <label><input type="checkbox" data-feature="lineSpacing"> Increased Line Spacing</label>
            </div>
            <div style="margin-bottom:10px">
                <label><input type="checkbox" data-feature="simplifyPage"> Simplify Page</label>
            </div>
            <div style="margin-bottom:10px">
                <label>Icon Position: 
                    <select data-feature="iconPosition" style="margin-left:5px;padding:4px;border-radius:3px;border:1px solid #ccc;">
                        <option value="topLeft">Top Left</option>
                        <option value="topRight">Top Right</option>
                        <option value="bottomLeft">Bottom Left</option>
                        <option value="bottomRight">Bottom Right</option>
                    </select>
                </label>
            </div>
            <div style="margin-bottom:10px">
                <label><input type="checkbox" data-feature="showToc"> Show Table of Contents</label>
            </div>
            <div id="uioPlus-toc-section" style="display:none">
                <div id="uioPlus-toc-title" style="display:none">
                    <strong>Table of Contents</strong>
                </div>
                <ul id="uioPlus-toc" style="margin:0;padding:0;list-style:none"></ul>
            </div>
            <div style="margin-top:15px;display:flex;gap:10px;justify-content:space-between;">
                <button onclick="window.uioPlus.resetSettings()" style="background:#f0f0f0;color:#333;border:1px solid #ccc;padding:8px 16px;border-radius:4px;cursor:pointer;flex:1">Reset</button>
                <button onclick="window.uioPlus.toggle()" style="background:#0066cc;color:#fff;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;flex:1">Minimize</button>
            </div>
        `;
        
        document.body.appendChild(controls);

        if (!document.getElementById('uioPlus-accessibility-icon')) {
            var icon = document.createElement('div');
            icon.id = 'uioPlus-accessibility-icon';
            icon.setAttribute('aria-label', 'Accessibility Preferences');
            icon.setAttribute('title', 'Accessibility Preferences');
            var position = this.getIconPosition();
            icon.style.cssText = `position:fixed;${position};z-index:99999;cursor:pointer;background:#fff;border:2px solid #0066cc;border-radius:50%;width:48px;height:48px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.1);`;
            icon.innerHTML = '<svg width="32" height="32" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g><path d="M24,2A22,22,0,1,0,46,24,21.9,21.9,0,0,0,24,2Zm0,40A18,18,0,1,1,42,24,18.1,18.1,0,0,1,24,42Z" fill="#0066cc"/><circle cx="24" cy="13" r="3" fill="#222"/><path d="M35,17H13a2,2,0,0,0,0,4h7v4.8l-2,9.8A2.1,2.1,0,0,0,19.6,38H20a2.1,2.1,0,0,0,2-1.6L23.8,27h.4L26,36.4A2.1,2.1,0,0,0,28,38h.4A2.1,2.1,0,0,0,30,35.6l-2-9.8V21h7a2,2,0,0,0,0-4Z" fill="#222"/></g></svg>';
            icon.onclick = (e) => {
                e.stopPropagation();
                this.toggle();
            };
            document.body.appendChild(icon);
        }

        // Apply saved settings to controls
        Object.keys(this.settings).forEach(feature => {
            const input = controls.querySelector(`[data-feature="${feature}"]`);
            if (input) {
                if (input.type === 'checkbox') {
                    input.checked = this.settings[feature];
                } else {
                    input.value = this.settings[feature];
                }
            }
        });

        if (this.settings.showToc) {
            document.getElementById('uioPlus-toc-section').style.display = 'block';
            document.getElementById('uioPlus-toc-title').style.display = 'block';
            this.buildTOC();
        }
    },
    buildTOC: function() {
        var toc = document.getElementById('uioPlus-toc');
        if (!toc) return;
        
        toc.innerHTML = '';
        var headings = document.querySelectorAll('main h1, main h2, main h3, main h4, main h5, main h6');
        
        headings.forEach(function(heading, idx) {
            if (!heading.id) heading.id = 'uioPlus-toc-h-' + idx;
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.href = '#' + heading.id;
            a.textContent = heading.textContent;
            a.title = 'Jump to ' + heading.textContent;
            a.style.cssText = 'color:inherit;text-decoration:none;display:block;padding:4px 0;';
            li.appendChild(a);
            toc.appendChild(li);
        });
    },
    applySettings: function() {
        if (!this.styleEl) {
            this.styleEl = document.createElement('style');
            document.head.appendChild(this.styleEl);
        }

        var css = [];
        
        if (this.settings.highContrast) {
            css.push(`
                body { 
                    background: #000 !important; 
                    color: #fff !important;
                }
                a { 
                    color: #66b3ff !important;
                }
                img:not([src*=".svg"]), video { 
                    filter: invert(1) !important;
                }
                svg {
                    fill: #fff !important;
                }
                .installation {
                    background: #333 !important;
                    border-color: #666 !important;
                    color: #fff !important;
                }
                #uioPlus-controls {
                    background: #000 !important;
                    color: #fff !important;
                    border-color: #666 !important;
                }
                #uioPlus-controls input[type="checkbox"] {
                    border-color: #fff !important;
                }
                #uioPlus-controls button {
                    background: #66b3ff !important;
                    color: #000 !important;
                }
                #uioPlus-controls select {
                    background: #000 !important;
                    color: #fff !important;
                    border-color: #666 !important;
                }
                #uioPlus-accessibility-icon {
                    background: #000 !important;
                    border-color: #666 !important;
                }
                #uioPlus-accessibility-icon svg {
                    fill: #fff !important;
                }
                .warning {
                    background: #333 !important;
                    border-color: #666 !important;
                    color: #fff !important;
                }
            `);
        }

        if (this.settings.textSize) {
            css.push(`
                body, button, input, select, textarea { 
                    font-size: ${this.settings.textSize}% !important;
                }
            `);
        }

        if (this.settings.lineSpacing) {
            css.push(`
                p, li, td { 
                    line-height: 2 !important;
                    margin-bottom: 1.5em !important;
                }
                h1, h2, h3, h4, h5, h6 {
                    line-height: 1.4 !important;
                    margin-bottom: 1em !important;
                }
            `);
        }

        if (this.settings.simplifyPage) {
            css.push(`
                header:not(h1,h2,h3,h4,h5,h6), footer:not(h1,h2,h3,h4,h5,h6), nav:not(main nav), 
                aside:not(main aside), .ad, .social, .comments, .sidebar, 
                [role="banner"], [role="contentinfo"], [role="complementary"] { 
                    display: none !important;
                }
                main, article, .content, [role="main"] { 
                    width: 90% !important;
                    max-width: 800px !important;
                    margin: 2rem auto !important;
                }
            `);
        }

        this.styleEl.textContent = css.join('\n');
        try {
            localStorage.setItem('uioPlus', JSON.stringify(this.settings));
        } catch(e) {
            console.warn('Could not save UIO+ settings:', e);
        }
    },
    addEventListeners: function() {
        document.getElementById('uioPlus-controls').addEventListener('change', (e) => {
            if (e.target.hasAttribute('data-feature')) {
                var feature = e.target.getAttribute('data-feature');
                this.settings[feature] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
                // Immediately store settings after any change
                try {
                    localStorage.setItem('uioPlus', JSON.stringify(this.settings));
                } catch(e) {
                    console.warn('Could not save UIO+ settings:', e);
                }

                if (feature === 'showToc') {
                    document.getElementById('uioPlus-toc-section').style.display = this.settings.showToc ? 'block' : 'none';
                    document.getElementById('uioPlus-toc-title').style.display = this.settings.showToc ? 'block' : 'none';
                    if (this.settings.showToc) {
                        this.buildTOC();
                    }
                } else if (feature === 'iconPosition') {
                    var icon = document.getElementById('uioPlus-accessibility-icon');
                    if (icon) {
                        var position = this.getIconPosition();
                        icon.style.cssText = `position:fixed;${position};z-index:99999;cursor:pointer;background:#fff;border:2px solid #0066cc;border-radius:50%;width:48px;height:48px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.1);`;
                    }
                }

                this.applySettings();
            }
        });

        // Add keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key === 'a') {
                this.toggle();
            }
        });
    },
    getIconPosition: function() {
        switch(this.settings.iconPosition) {
            case 'topLeft':
                return 'top:20px;left:20px';
            case 'topRight':
                return 'top:20px;right:20px';
            case 'bottomLeft':
                return 'bottom:20px;left:20px';
            case 'bottomRight':
            default:
                return 'bottom:20px;right:20px';
        }
    },

    reset: function() {
        this.settings = JSON.parse(JSON.stringify(this.defaultSettings));
        try {
            localStorage.setItem('uioPlus', JSON.stringify(this.settings));
        } catch(e) {
            console.warn('Could not save UIO+ settings:', e);
        }
        this.applySettings();
    },

    toggle: function() {
        var controls = document.getElementById('uioPlus-controls');
        var icon = document.getElementById('uioPlus-accessibility-icon');
        
        if (controls) {
            controls.remove();
            icon.style.display = 'block';
        } else {
            this.createControls();
            this.applySettings();
            this.addEventListeners();
            icon.style.display = 'none';
        }
    }
};

// Initialize the bookmarklet
window.uioPlus.init();
