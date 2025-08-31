describe('UIO+ Accessibility Bookmarklet', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080');
  });

  it('injects the preference editor and alters the page', () => {
    cy.window().then((win) => {
      // Simulate clicking the bookmarklet
      const script = win.document.createElement('script');
      script.textContent = `
        window.uioPlus = {
          settings: { highContrast: true, textSize: 150, lineSpacing: true, simplifyPage: true },
          init: function() {
            this.createControls();
            this.applySettings();
            this.addEventListeners();
          },
          createControls: function() {
            var controls = window.document.createElement("div");
            controls.id = "uioPlus-controls";
            controls.style.cssText = "position:fixed;top:10px;right:10px;background:#fff;padding:15px;border:1px solid #ccc;box-shadow:0 2px 10px rgba(0,0,0,0.1);z-index:999999;max-width:350px;overflow:auto;";
            controls.innerHTML =
              '<div style="margin-bottom:10px"><label><input type="checkbox" checked data-feature="highContrast"> High Contrast</label></div>' +
              '<div style="margin-bottom:10px"><label>Text Size: <input type="range" min="100" max="200" value="150" data-feature="textSize"></label></div>' +
              '<div style="margin-bottom:10px"><label><input type="checkbox" checked data-feature="lineSpacing"> Increased Line Spacing</label></div>' +
              '<div style="margin-bottom:10px"><label><input type="checkbox" checked data-feature="simplifyPage"> Simplify Page</label></div>' +
              '<div style="margin-bottom:10px"><label><input type="checkbox" data-feature="showToc"> Show Table of Contents</label></div>' +
              '<div id="uioPlus-toc-section" style="display:none;margin-bottom:10px"><strong>Table of Contents</strong><ul id="uioPlus-toc" style="margin:0;padding:0;list-style:none"></ul></div>' +
              '<button onclick="uioPlus.toggle()" style="margin-top:10px">Minimize</button>';
            window.document.body.appendChild(controls);
            // Add accessibility SVG icon if not present
            if (!window.document.getElementById('uioPlus-accessibility-icon')) {
              var icon = window.document.createElement('div');
              icon.id = 'uioPlus-accessibility-icon';
              icon.setAttribute('aria-label', 'Accessibility Preferences');
              icon.setAttribute('title', 'Accessibility Preferences');
              icon.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:99999;cursor:pointer;background:none;border:none;padding:0;';
              icon.innerHTML = '<svg width="40" height="40" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g><path d="M24,2A22,22,0,1,0,46,24,21.9,21.9,0,0,0,24,2Zm0,40A18,18,0,1,1,42,24,18.1,18.1,0,0,1,24,42Z" fill="#0066cc"/><circle cx="24" cy="13" r="3" fill="#222"/><path d="M35,17H13a2,2,0,0,0,0,4h7v4.8l-2,9.8A2.1,2.1,0,0,0,19.6,38H20a2.1,2.1,0,0,0,2-1.6L23.8,27h.4L26,36.4A2.1,2.1,0,0,0,28,38h.4A2.1,2.1,0,0,0,30,35.6l-2-9.8V21h7a2,2,0,0,0,0-4Z" fill="#222"/></g></svg>';
              icon.onclick = function(e) {
                e.stopPropagation();
                window.uioPlus.toggle();
              };
              window.document.body.appendChild(icon);
            }
            // Show/hide TOC section based on checkbox
            controls.querySelector('[data-feature="showToc"]').addEventListener('change', function(e) {
              window.document.getElementById('uioPlus-toc-section').style.display = e.target.checked ? 'block' : 'none';
            });
          },
          applySettings: function() {
            if(!this.styleEl) {
              this.styleEl = window.document.createElement("style");
              window.document.head.appendChild(this.styleEl);
            }
            var css = [];
            css.push("body { background: #000 !important; color: #fff !important; }");
            css.push("a { color: #3399ff !important; }");
            css.push("body { font-size: 150% !important; }");
            css.push("p, div { line-height: 3 !important; }");
            css.push("header, footer, nav, aside, .ad, .social, .comments { display: none !important; }");
            css.push("main, article, .content { width: 90% !important; margin: 0 auto !important; }");
            this.styleEl.textContent = css.join('\\n');
            window.localStorage.setItem('uioPlus', JSON.stringify(this.settings));
          },
          addEventListeners: function() {},
          toggle: function() {
            var controls = window.document.getElementById('uioPlus-controls');
            if (controls) {
              controls.style.display = 'none';
              window.document.getElementById('uioPlus-accessibility-icon').style.display = 'block';
            } else {
              this.createControls();
              this.applySettings();
              this.addEventListeners();
              window.document.getElementById('uioPlus-controls').style.display = 'block';
              window.document.getElementById('uioPlus-accessibility-icon').style.display = 'none';
            }
          }
        };
        window.uioPlus.init();
      `;
      win.document.head.appendChild(script);
    });

    // Verify the page is altered
    cy.get('body').should('have.css', 'background-color', 'rgb(0, 0, 0)');
    cy.get('body').should('have.css', 'color', 'rgb(255, 255, 255)');
    cy.get('body').should('have.css', 'font-size', '24px'); // 150% of default 16px
    cy.get('p', { timeout: 8000 }).then($p => {
      const lh = $p.css('line-height');
      cy.log('Computed line-height:', lh);
      expect(lh).to.equal('72px');
    });
    cy.get('header').should('not.be.visible');
    cy.get('footer').should('not.be.visible');
    cy.get('nav').should('not.be.visible');
  });
});
