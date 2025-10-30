import { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { actorCalled, Actor } from '@serenity-js/core';
import { BrowseTheWebWithPlaywright } from '@serenity-js/playwright';
import { chromium, Browser, BrowserContext, Page } from 'playwright';


setDefaultTimeout(60000);

let browser: Browser;
let currentContext: BrowserContext;
let currentPage: Page;
let authToken: string; 
let testUserId: string; 


const BACKEND_URL = 'http://localhost:3000/api';
const BASE_URL =  'http://localhost:4200';


const TEST_USER = {
  email: 'test@soyudemedellin.edu.co',
  password: 'Test123!',
  username: 'testuser'
};

BeforeAll(async function() {
  console.log('Iniciando browser...');
  
  browser = await chromium.launch({
    headless: process.env['HEADLESS'] !== 'false',
    slowMo: 50,
  });


  console.log('Autenticando usuario de prueba...');
  try {
    const response = await fetch(`${BACKEND_URL}/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: TEST_USER.email,
        password: TEST_USER.password
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error en login (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    
   
    if (!data.success || !data.token) {
      console.error('Respuesta del login:', JSON.stringify(data, null, 2));
      throw new Error('Login fallido o token no encontrado');
    }
    
    authToken = data.token;
    
    
    try {
      const payload = authToken.split('.')[1];
      const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString());
      testUserId = decodedPayload.id;
      
      if (!testUserId) {
        console.error('Payload del JWT:', decodedPayload);
        throw new Error('User ID no encontrado en el token JWT');
      }
    } catch (decodeError) {
      console.error('Error decodificando JWT:', decodeError);
      throw new Error('No se pudo decodificar el token JWT');
    }
    
    console.log(' Usuario autenticado correctamente');
    console.log('   User ID:', testUserId);
  } catch (error) {
    console.error('Error en autenticación:', error);
    console.error('\nVerifica:');
    console.error('   1. El backend está corriendo en:', BACKEND_URL);
    console.error('   2. El usuario existe en Supabase (email:', TEST_USER.email + ')');
    console.error('   3. El endpoint de login es correcto: /v1/auth/login\n');
    throw error;
  }
});

Before(async function({ pickle }) {
  console.log(`\n Scenario: ${pickle.name}`);
  
 
  currentContext = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  
    storageState: {
      cookies: [],
      origins: [{
        origin: BASE_URL,
        localStorage: [
          { name: 'access_token', value: authToken },
          { name: 'user_id', value: testUserId }
        ]
      }]
    }
  });
  
  currentPage = await currentContext.newPage();

 
  console.log('🛒 Creando datos de prueba en el backend...');
  try {
    
    await cleanupUserCart(testUserId);

    
    const cartResponse = await fetch(`${BACKEND_URL}/v1/cart/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        user: testUserId,
        cartItems: [
          {
            product: 'product-1', 
            name: 'Pizza',
            price: 15.00,
            quantity: 1,
            image: 'pizza.jpg'
          }
        ]
      })
    });

    if (cartResponse.ok) {
      const cart = await cartResponse.json();
      console.log('Carrito creado:', cart.id);
      
     
      (this as any).cartId = cart.id;
    }
  } catch (error) {
    console.warn('No se pudo crear el carrito de prueba:', error);
  }
  

  const actor = actorCalled('Usuario').whoCan(
    BrowseTheWebWithPlaywright.using(browser)
  );
  
  (this as any).actor = actor;
  (this as any).authToken = authToken;
  (this as any).testUserId = testUserId;
  (this as any).baseURL = BASE_URL;
  (this as any).backendURL = BACKEND_URL;
  
  (this as any).attemptsTo = async (...tasks: any[]) => {
    return actor.attemptsTo(...tasks);
  };
});

After(async function({ pickle, result }) {
  const cartId = (this as any).cartId;

  if (cartId) {
    try {
      await fetch(`${BACKEND_URL}/v1/cart/${cartId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      console.log('Carrito de prueba eliminado');
    } catch (error) {
      console.warn('No se pudo limpiar el carrito:', error);
    }
  }

  if (result?.status === Status.FAILED) {
    console.log(`Scenario failed: ${pickle.name}`);
    console.log('---'.repeat(30));
    try {
      const screenshot = await currentPage.screenshot({ fullPage: true });
      this.attach(screenshot, 'image/png');
      
      const html = await currentPage.content();
      this.attach(html, 'text/html');

      const logs = await currentPage.evaluate(() => {
        return (window as any).__consoleLogs || [];
      });
      if (logs.length > 0) {
        this.attach(JSON.stringify(logs, null, 2), 'application/json');
      }
    } catch (error) {
      console.error('Error capturando screenshot:', error);
    }
  } else {
    console.log(`Scenario passed: ${pickle.name}`);
  }
  
  try {
    await currentContext?.close();
  } catch (error) {
    console.error('Error cerrando contexto:', error);
  }
});

AfterAll(async function() {
  console.log('\nCerrando browser...');
  try {
    await browser?.close();
  } catch (error) {
    console.error('Error cerrando browser:', error);
  }
});

// ============= FUNCIONES HELPER =============

async function cleanupUserCart(userId: string) {
  try {
    const response = await fetch(`${BACKEND_URL}/v1/cart/user/${userId}`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    if (response.ok) {
      const carts = await response.json();
      for (const cart of carts) {
        await fetch(`${BACKEND_URL}/v1/cart/${cart.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
      }
    }
  } catch (error) {
    console.warn('No se pudo limpiar carritos anteriores:', error);
  }
}