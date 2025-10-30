export class LoginPage {
  visit() {
    cy.visit('/login');
  }

  getEmailInput() {
    return cy.get('#email');
  }

  getPasswordInput() {
    return cy.get('#password');
  }

  getLoginButton() {
    return cy.get('.auth-button');
  }

  typeEmail(email: string) {
    this.getEmailInput().type(email);
  }

  typePassword(password: string) {
    this.getPasswordInput().type(password);
  }

  submit() {
    this.getLoginButton().click();
  }
}
