import { signUpPage } from './signup.po';

describe('Sign Up Page Tests', () => {
  
  beforeEach(() => {
    signUpPage.visit();
    cy.url().should('include', '/sign-up'); 
  });

  it('Muestra advertencia cuando hay campos vacíos', () => {
    signUpPage.getSubmitBtn().click({ force: true });
    cy.contains('Campos incompletos').should('be.visible');
  });

  it('Correo inválido (sin dominio institucional)', () => {
    signUpPage.getFullNameInput().type('Juan Pérez');
    signUpPage.getEmailInput().type('juan@gmail.com');
    signUpPage.getPasswordInput().type('password123');
    signUpPage.getConfirmPasswordInput().type('password123');
    signUpPage.getTermsCheckbox().click();
    signUpPage.getSubmitBtn().click();

    cy.contains('Correo inválido').should('be.visible');
  });

  it('Contraseñas no coinciden', () => {
    signUpPage.getFullNameInput().type('Test User');
    signUpPage.getEmailInput().type('test@soyudemedellin.edu.co');
    signUpPage.getPasswordInput().type('12345678');
    signUpPage.getConfirmPasswordInput().type('87654321');
    signUpPage.getTermsCheckbox().click();
    signUpPage.getSubmitBtn().click();

    cy.contains('Contraseñas no coinciden').should('be.visible');
  });

  it('Debe aceptar términos y condiciones', () => {
    signUpPage.getFullNameInput().type('Test User');
    signUpPage.getEmailInput().type('test@soyudemedellin.edu.co');
    signUpPage.getPasswordInput().type('12345678');
    signUpPage.getConfirmPasswordInput().type('12345678');
    signUpPage.getSubmitBtn().click();
    
    cy.contains('Términos y condiciones').should('be.visible');
  });

  it('Registro exitoso (mockeando backend)', () => {
  cy.get('input[formControlName="fullname"]').type('Test User');
  cy.get('input[formControlName="email"]').type('test2@soyudemedellin.edu.co');
  cy.get('input[formControlName="password"]').type('12345678');
  cy.get('input[formControlName="confirmPassword"]').type('12345678');
  cy.get('input[formControlName="terms"]').click();

  cy.intercept('POST', '**/auth/sign-up', {
    statusCode: 200,
    body: {
      message: 'Registro exitoso',
      token: 'fake-jwt-token'
    },
  }).as('signupRequest');

  cy.get('button[type="submit"]').click();
  cy.wait('@signupRequest');

  cy.contains(/registro exitoso/i, { timeout: 10000 }).should('be.visible');
  cy.url().should('include', '/');
});


});

