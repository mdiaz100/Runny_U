describe('Restaurant Page Tests', () => {

  beforeEach(() => {
    window.localStorage.setItem('token', 'fake-token');
    cy.intercept('GET', '**/restaurants/*', {
      statusCode: 200,
      body: {
        id: '1',
        name: 'Restaurante de Prueba',
        schedule: '7:00 AM - 10:00 PM',
        location: 'Calle 123',
        image: 'test.jpg',
        menu: [
          {
            category: 'Entradas',
            items: [
              {
                id: 'item1',
                name: 'Arepas',
                price: 5000,
                image: 'arepa.jpg',
                description: 'Deliciosas arepas'
              }
            ]
          }
        ]
      }
    }).as('restaurantRequest');

    cy.visit('/restaurant/c5a780a0-166f-4547-b109-7988998b7b0f');
    cy.wait('@restaurantRequest');
  });

  it('Carga del restaurante y su menú', () => {
    cy.contains('Restaurante de Prueba').should('be.visible');
    cy.contains('Entradas').should('be.visible');
    cy.contains('Arepas').should('be.visible');
  });

  it('Añadir al carrito cuando está logueado', () => {
  window.localStorage.setItem('token', 'fake-token');

  cy.get('.add-btn').first().click();

  cy.url().should('not.include', '/login');
});



  it('Debe pedir login si no ha iniciado sesión', () => {
    window.localStorage.removeItem('token'); 

    cy.get('.add-btn').first().click();

    cy.contains(/inicia sesión/i, { timeout: 8000 })
      .should('be.visible');

    cy.url().should('include', '/login');
  });
});
