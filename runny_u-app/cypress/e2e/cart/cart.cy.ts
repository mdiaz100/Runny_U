describe("Carrito de compras - E2E", () => {
  const CART_URL = "/cart";
  
  const mockRestaurant = {
    id: "restaurant-test-123",
    name: "Restaurante de Prueba",
    schedule: "8:00 AM - 10:00 PM",
    location: "Campus Principal",
    image: "https://via.placeholder.com/300",
    description: "Restaurante de prueba para Cypress",
    menu: [
      {
        category: "Platos principales",
        items: [
          {
            id: "item-1",
            name: "Pizza Margarita",
            price: 20000,
            image: "https://via.placeholder.com/150",
            description: "Pizza clásica italiana"
          },
          {
            id: "item-2",
            name: "Hamburguesa Clásica",
            price: 15000,
            image: "https://via.placeholder.com/150",
            description: "Hamburguesa de carne con queso"
          }
        ]
      }
    ]
  };

  beforeEach(() => {
    cy.clearLocalStorage();
    
    cy.intercept("GET", "**/api/restaurants", { 
      statusCode: 200, 
      body: [mockRestaurant] 
    }).as('getRestaurants');
    
    cy.intercept("GET", `**/api/restaurants/${mockRestaurant.id}`, { 
      statusCode: 200, 
      body: mockRestaurant 
    }).as('getRestaurant');
    
    cy.login();
  });

  it(" Muestra carrito vacío", () => {
    cy.visit(CART_URL);
    
    cy.get(".empty-cart", { timeout: 10000 }).should("be.visible");
    cy.contains("Tu carrito está vacío").should("be.visible");
  });

  it(" Agrega un producto al carrito desde restaurante", () => {
    cy.visit(`/restaurant/${mockRestaurant.id}`);
    cy.wait('@getRestaurant');
    
    cy.contains(mockRestaurant.name).should("be.visible");
    cy.contains("Pizza Margarita").should("be.visible");
    
    cy.contains("Pizza Margarita")
      .parents(".menu-card")
      .find(".add-btn")
      .click();
    
    cy.visit(CART_URL);
    
    cy.get(".cart-container", { timeout: 10000 }).should("be.visible");
    cy.contains("Pizza Margarita").should("be.visible");
    cy.get(".item-quantity").should("contain", "1");
  });

  it(" Incrementa cantidad de un producto", () => {
    cy.visit(`/restaurant/${mockRestaurant.id}`);
    cy.wait('@getRestaurant');
    
    cy.contains("Pizza Margarita")
      .parents(".menu-card")
      .find(".add-btn")
      .click();
    
    cy.visit(CART_URL);
    
    cy.get(".cart-container", { timeout: 10000 }).should("be.visible");
    cy.get(".item-quantity").should("contain", "1");
    
   
    cy.get('button[aria-label="Aumentar cantidad"]').click();
    cy.get(".item-quantity").should("contain", "2");
  });

  it("Disminuye cantidad de un producto", () => {
    cy.visit(`/restaurant/${mockRestaurant.id}`);
    cy.wait('@getRestaurant');
    
    cy.contains("Pizza Margarita")
      .parents(".menu-card")
      .find(".add-btn")
      .click()
      .click();
    
    cy.visit(CART_URL);
    
    cy.get(".cart-container", { timeout: 10000 }).should("be.visible");
    cy.get(".item-quantity").should("contain", "2");
    
   
    cy.get('button[aria-label="Reducir cantidad"]').click();
    cy.get(".item-quantity").should("contain", "1");
  });

  it("Elimina producto cuando cantidad llega a 0", () => {
    cy.visit(`/restaurant/${mockRestaurant.id}`);
    cy.wait('@getRestaurant');
    
    cy.contains("Pizza Margarita")
      .parents(".menu-card")
      .find(".add-btn")
      .click();
    
    cy.visit(CART_URL);
    
    cy.get(".cart-container", { timeout: 10000 }).should("be.visible");
    
    
    cy.get('button[aria-label="Reducir cantidad"]').click();
    
    cy.get(".swal2-popup", { timeout: 5000 }).should("be.visible");
    cy.contains("¿Estás seguro?").should("be.visible");
    cy.get(".swal2-confirm").click();
    
    cy.get(".swal2-popup", { timeout: 5000 }).should("be.visible");
    cy.contains("Eliminado").should("be.visible");
    cy.get(".swal2-confirm").click();
    
    cy.get(".empty-cart", { timeout: 10000 }).should("be.visible");
  });

  it("Agrega múltiples productos diferentes", () => {
    cy.visit(`/restaurant/${mockRestaurant.id}`);
    cy.wait('@getRestaurant');
    
    cy.contains("Pizza Margarita")
      .parents(".menu-card")
      .find(".add-btn")
      .click();
    
    cy.contains("Hamburguesa Clásica")
      .parents(".menu-card")
      .find(".add-btn")
      .click();
    
    cy.visit(CART_URL);
    
    cy.get(".cart-container", { timeout: 10000 }).should("be.visible");
    cy.contains("Pizza Margarita").should("be.visible");
    cy.contains("Hamburguesa Clásica").should("be.visible");
    cy.get(".cart-item").should("have.length", 2);
  });

  it("Calcula el total correctamente", () => {
    cy.visit(`/restaurant/${mockRestaurant.id}`);
    cy.wait('@getRestaurant');
    
    cy.contains("Pizza Margarita")
      .parents(".menu-card")
      .find(".add-btn")
      .click();
    
    cy.contains("Hamburguesa Clásica")
      .parents(".menu-card")
      .find(".add-btn")
      .click();
    
    cy.visit(CART_URL);
    
    cy.get(".cart-container", { timeout: 10000 }).should("be.visible");
    cy.get(".cart-total").should("contain", "$35,000");
  });

  it("Vacía el carrito completo", () => {
    cy.visit(`/restaurant/${mockRestaurant.id}`);
    cy.wait('@getRestaurant');
    
    cy.contains("Pizza Margarita")
      .parents(".menu-card")
      .find(".add-btn")
      .click();
    
    cy.contains("Hamburguesa Clásica")
      .parents(".menu-card")
      .find(".add-btn")
      .click();
    
    cy.visit(CART_URL);
    
    cy.get(".cart-container", { timeout: 10000 }).should("be.visible");
    
    cy.get(".clear-cart-btn").click();
    
    cy.get(".swal2-popup", { timeout: 5000 }).should("be.visible");
    cy.get(".swal2-confirm").click();
    
    cy.get(".swal2-popup", { timeout: 5000 }).should("be.visible");
    cy.get(".swal2-confirm").click();
    
    cy.get(".empty-cart", { timeout: 10000 }).should("be.visible");
  });

  it("Guarda carrito con usuario logueado (Mock API)", () => {
    cy.intercept("POST", "**/cart/create", {
      statusCode: 200,
      body: { id: "CART123", items: [] },
    }).as("saveCart");

    cy.visit(`/restaurant/${mockRestaurant.id}`);
    cy.wait('@getRestaurant');
    
    cy.contains("Pizza Margarita")
      .parents(".menu-card")
      .find(".add-btn")
      .click();
    
    cy.visit(CART_URL);
    
    cy.get(".cart-container", { timeout: 10000 }).should("be.visible");
    
    cy.contains("Guardar Carrito").should("be.visible").click();
    
    cy.wait("@saveCart").its("response.statusCode").should("eq", 200);
    
    cy.get(".swal2-popup", { timeout: 5000 }).should("be.visible");
    cy.contains("Guardado").should("be.visible");
  });
});