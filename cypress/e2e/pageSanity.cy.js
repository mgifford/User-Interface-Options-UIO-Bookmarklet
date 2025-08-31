describe('Page Sanity Checks', () => {
  const pages = [
    { url: 'http://localhost:8080/index.html', name: 'Home' },
    { url: 'http://localhost:8080/forms.html', name: 'Forms' }
  ];

  pages.forEach(page => {
    context(`${page.name} Page`, () => {
      beforeEach(() => {
        cy.visit(page.url, {
          onBeforeLoad(win) {
            cy.spy(win.console, 'error').as('consoleError');
            cy.spy(win.console, 'warn').as('consoleWarn');
          }
        });
      });

      it('should not expose raw CSS or JS in the body', () => {
        cy.get('body').should('not.contain.text', '{'); // No raw CSS blocks
        cy.get('body').should('not.contain.text', 'function'); // No raw JS
        cy.get('body').should('not.contain.text', 'var '); // No raw JS
        cy.get('body').should('not.contain.text', 'let '); // No raw JS
        cy.get('body').should('not.contain.text', 'const '); // No raw JS
      });

      it('should have a visible header, nav, and main', () => {
        cy.get('header').should('be.visible');
        cy.get('nav').should('be.visible');
        cy.get('main').should('be.visible');
      });

      it('should not have broken layout or missing styles', () => {
        cy.get('body').should('have.css', 'background-color');
        cy.get('body').should('have.css', 'color');
        cy.get('header').should('have.css', 'background-color');
      });

      it('should not have console errors or warnings', () => {
        cy.get('@consoleError').should('not.be.called');
        cy.get('@consoleWarn').should('not.be.called');
      });
    });
  });
});
