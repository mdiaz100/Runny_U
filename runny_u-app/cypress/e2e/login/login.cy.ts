import { LoginPage } from './login.page';

const loginPage = new LoginPage();


const validEmail = 'test@soyudemedellin.edu.co';
const validPassword = 'Test123!';

describe(' Pruebas de Login', () => {
  beforeEach(() => {
    loginPage.visit();
  });


  it(' Debería iniciar sesión correctamente y redirigir al Home', () => {
    loginPage.typeEmail(validEmail);
    loginPage.typePassword(validPassword);

    loginPage.submit();

   
    cy.url().should('include', '/');
  });

  
  it(' Debería mostrar error si las credenciales son incorrectas', () => {
    cy.intercept('POST', '**/auth/login', {
      statusCode: 401,
      body: { message: 'Correo o contraseña incorrectos' },
    });

    loginPage.typeEmail('wrong@mail.com');
    loginPage.typePassword('Wrong123!');

    loginPage.submit();

    cy.contains('Correo o contraseña incorrectos').should('exist');
  });

  
  it('No debe permitir submit con el formulario incompleto', () => {
    loginPage.submit();
    cy.url().should('include', '/login'); 
  });


  it(' Debería validar que el email sea obligatorio y válido', () => {
    loginPage.getEmailInput().focus().blur();

    loginPage.getEmailInput().then(($input) => {
      const input = $input[0] as HTMLInputElement;
      expect(input.validationMessage).to.not.be.empty;
    });

    loginPage.getEmailInput().clear().type('invalidEmail');

    loginPage.getEmailInput().then(($input) => {
      const input = $input[0] as HTMLInputElement;
      expect(input.validationMessage).to.not.be.empty;
    });
  });
});
