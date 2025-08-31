describe('UIO+ Accessibility Icon and Table of Contents', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/index.html');
  });

  it('should render the accessibility SVG icon in the bottom right', () => {
    cy.get('#uioPlus-accessibility-icon').should('be.visible');
    cy.get('#uioPlus-accessibility-icon svg').should('exist');
    cy.get('#uioPlus-accessibility-icon').should('have.css', 'position', 'fixed');
    cy.get('#uioPlus-accessibility-icon').should('have.css', 'bottom', '24px');
    cy.get('#uioPlus-accessibility-icon').should('have.css', 'right', '24px');
  });

  it('should open the UIO+ panel when the icon is clicked', () => {
    cy.get('#uioPlus-accessibility-icon').click();
    cy.get('#uioPlus-controls').should('be.visible');
  });

  it('should show/hide the Table of Contents when toggled', () => {
    cy.get('#uioPlus-accessibility-icon').click();
    cy.get('#uioPlus-controls').should('be.visible');
    // Simulate toggling the Table of Contents checkbox
    cy.get('#uioPlus-controls input[data-feature="showToc"]').check({ force: true });
    cy.get('#uioPlus-toc').should('be.visible');
    cy.get('#uioPlus-controls input[data-feature="showToc"]').uncheck({ force: true });
    cy.get('#uioPlus-toc').should('not.be.visible');
  });
});
