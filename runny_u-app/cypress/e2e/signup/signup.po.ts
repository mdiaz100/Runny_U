export class SignUpPage {
  visit() {
    cy.visit('/sign-up');
  }

  getFullNameInput() {
    return cy.get('input[formControlName="fullname"]');
  }

  getEmailInput() {
    return cy.get('input[formControlName="email"]');
  }

  getPasswordInput() {
    return cy.get('input[formControlName="password"]');
  }

  getConfirmPasswordInput() {
    return cy.get('input[formControlName="confirmPassword"]');
  }

  getTermsCheckbox() {
    return cy.get('input[formControlName="terms"]');
  }

  getSubmitBtn() {
    return cy.get('button[type="submit"]');
  }
}

export const signUpPage = new SignUpPage();
