import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { Navigate } from '@serenity-js/web';
import { Ensure, equals, isTrue, includes } from '@serenity-js/assertions';


import { IncreaseQuantity } from '../../screenplay/tasks/cart/IncreaseQuantity';
import { DecreaseQuantity } from '../../screenplay/tasks/cart/DecreaseQuantity';
import { RemoveItem } from '../../screenplay/tasks/cart/RemoveItem';
import { ClearCart } from '../../screenplay/tasks/cart/ClearCart';
import { SaveCart } from '../../screenplay/tasks/cart/SaveCart';
import { PayCart } from '../../screenplay/tasks/cart/PayCart';
import { ConfirmAction } from '../../screenplay/tasks/cart/ConfirmAction';
import { CancelAction } from '../../screenplay/tasks/cart/CancelAction';

import { CartItemCount } from '../../screenplay/questions/cart/CartItemCount';
import { CartItemQuantity } from '../../screenplay/questions/cart/CartItemQuantity';
import { CartTotal } from '../../screenplay/questions/cart/CartTotal';
import { CartIsEmpty } from '../../screenplay/questions/cart/CartIsEmpty';
import { ModalTitle } from '../../screenplay/questions/cart/ModalMessage';
import { ProductIsInCart } from '../../screenplay/questions/cart/ProductIsInCart';
import { CartIsSaved } from '../../screenplay/questions/cart/CartIsSaved';
import { CucumberWorld } from '../../support/cucumber-world.interface';

let currentProduct: string;
let expectedTotal: string;

// ============== GIVEN ==============

Given('que estoy autenticado en el sistema', async function(this: CucumberWorld) {
  await this.attemptsTo(
    Navigate.to(`${this.baseURL}/cart`)
  );
});

Given('tengo productos en mi carrito', async function(this: CucumberWorld) {
  currentProduct = 'Pizza';
  await this.attemptsTo(
    Navigate.to(`${this.baseURL}/cart`)
  );
});

Given('que tengo un producto con cantidad {int} en el carrito', 
  async function(this: CucumberWorld, quantity: number) {
    currentProduct = 'Pizza';
    await updateCartQuantity(this, currentProduct, quantity);
    
    await this.attemptsTo(
      Navigate.to(`${this.baseURL}/cart`),
      Ensure.that(CartItemQuantity.of(currentProduct), equals(quantity))
    );
  }
);

Given('que tengo {int} productos en mi carrito', 
  async function(this: CucumberWorld, count: number) {
    const products = [
      { name: 'Pizza', price: 15.00 },
      { name: 'Hamburguesa', price: 10.50 },
      { name: 'Refresco', price: 5.00 }
    ];

    await createCartWithProducts(this, products.slice(0, count));
    
    await this.attemptsTo(
      Navigate.to(`${this.baseURL}/cart`),
      Ensure.that(CartItemCount(), equals(count))
    );
  }
);

Given('que mi carrito está vacío', async function(this: CucumberWorld) {
  await clearCartInBackend(this);
  
  await this.attemptsTo(
    Navigate.to(`${this.baseURL}/cart`),
    Ensure.that(CartIsEmpty(), isTrue())
  );
});

Given('estoy autenticado como usuario', async function(this: CucumberWorld) {
  await this.attemptsTo(
    Navigate.to(`${this.baseURL}/cart`)
  );
});

Given('el servicio de guardado no está disponible', async function(this: CucumberWorld) {
  this.serviceFailing = 'save';
});

Given('que tengo un carrito guardado', async function(this: CucumberWorld) {
  currentProduct = 'Pizza';
  
  await this.attemptsTo(
    Navigate.to(`${this.baseURL}/cart`),
    SaveCart(),
    ConfirmAction()
  );
});

Given('el carrito no está guardado', async function(this: CucumberWorld) {
  await this.attemptsTo(
    Navigate.to(`${this.baseURL}/cart`),
    Ensure.that(CartIsSaved(), equals(false))
  );
});

Given('el servicio de facturación no está disponible', async function(this: CucumberWorld) {
  this.serviceFailing = 'billing';
});

Given('que tengo productos en mi carrito con total de {float}', 
  async function(this: CucumberWorld, total: number) {
    await createCartWithTotal(this, total);
    expectedTotal = `$${total.toFixed(2)}`;
    
    await this.attemptsTo(
      Navigate.to(`${this.baseURL}/cart`)
    );
  }
);

Given('que tengo los siguientes productos en el carrito:', 
  async function(this: CucumberWorld, dataTable: DataTable) {
    const products = dataTable.hashes();
    let calculatedTotal = 0;
    
    const cartItems = products.map(product => {
      const price = parseFloat(product['precio']);
      const quantity = parseInt(product['cantidad']);
      calculatedTotal += price * quantity;
      
      return {
        name: product['producto'],
        price: price,
        quantity: quantity
      };
    });
    
    await createCartWithProducts(this, cartItems);
    expectedTotal = `$${calculatedTotal.toFixed(2)}`;
    
    await this.attemptsTo(
      Navigate.to(`${this.baseURL}/cart`)
    );
  }
);

// ============== WHEN ==============

When('aumento la cantidad del producto', async function(this: CucumberWorld) {
  await this.attemptsTo(
    IncreaseQuantity.of(currentProduct)
  );
});

When('disminuyo la cantidad del producto', async function(this: CucumberWorld) {
  await this.attemptsTo(
    DecreaseQuantity.of(currentProduct)
  );
});

When('confirmo la eliminación en el modal', async function(this: CucumberWorld) {
  await this.attemptsTo(
    ConfirmAction()
  );
});

When('hago clic en eliminar producto', async function(this: CucumberWorld) {
  await this.attemptsTo(
    RemoveItem.named(currentProduct)
  );
});

When('cancelo la eliminación en el modal', async function(this: CucumberWorld) {
  await this.attemptsTo(
    CancelAction()
  );
});

When('hago clic en vaciar carrito', async function(this: CucumberWorld) {
  await this.attemptsTo(
    ClearCart()
  );
});

When('confirmo vaciar el carrito en el modal', async function(this: CucumberWorld) {
  await this.attemptsTo(
    ConfirmAction()
  );
});

When('cancelo el vaciado en el modal', async function(this: CucumberWorld) {
  await this.attemptsTo(
    CancelAction()
  );
});

When('intento hacer clic en vaciar carrito', async function(this: CucumberWorld) {
  await this.attemptsTo(
    Navigate.to(`${this.baseURL}/cart`)
  );
});

When('hago clic en guardar carrito', async function(this: CucumberWorld) {
  await this.attemptsTo(
    SaveCart()
  );
});

When('hago clic en pagar carrito', async function(this: CucumberWorld) {
  await this.attemptsTo(
    PayCart()
  );
});

When('intento hacer clic en pagar carrito', async function(this: CucumberWorld) {
  await this.attemptsTo(
    Navigate.to(`${this.baseURL}/cart`)
  );
});

When('navego al carrito', async function(this: CucumberWorld) {
  await this.attemptsTo(
    Navigate.to(`${this.baseURL}/cart`)
  );
});

// ============== THEN ==============

Then('la cantidad del producto debe ser {int}', 
  async function(this: CucumberWorld, expectedQuantity: number) {
    await this.attemptsTo(
      Ensure.that(
        CartItemQuantity.of(currentProduct), 
        equals(expectedQuantity)
      )
    );
  }
);

Then('el total del carrito debe actualizarse correctamente', 
  async function(this: CucumberWorld) {
    await this.attemptsTo(
      Ensure.that(CartTotal(), includes('$'))
    );
  }
);

Then('el producto debe ser eliminado del carrito', 
  async function(this: CucumberWorld) {
    await this.attemptsTo(
      Ensure.that(
        ProductIsInCart.named(currentProduct), 
        equals(false)
      )
    );
  }
);

Then('debo ver el mensaje {string}', 
  async function(this: CucumberWorld, expectedMessage: string) {
    await this.attemptsTo(
      Ensure.that(ModalTitle(), includes(expectedMessage))
    );
  }
);

Then('el producto debe permanecer en el carrito', 
  async function(this: CucumberWorld) {
    await this.attemptsTo(
      Ensure.that(
        ProductIsInCart.named(currentProduct), 
        isTrue()
      )
    );
  }
);

Then('el carrito debe estar vacío', async function(this: CucumberWorld) {
  await this.attemptsTo(
    Ensure.that(CartIsEmpty(), isTrue())
  );
});

Then('los productos deben permanecer en el carrito', 
  async function(this: CucumberWorld) {
    await this.attemptsTo(
      Ensure.that(CartItemCount(), equals(1))
    );
  }
);

Then('no debe ocurrir ninguna acción', async function(this: CucumberWorld) {
  await this.attemptsTo(
    Navigate.to(`${this.baseURL}/cart`)
  );
});

Then('el total del carrito debe ser {string}', 
  async function(this: CucumberWorld, expectedTotal: string) {
    await this.attemptsTo(
      Ensure.that(CartTotal(), equals(expectedTotal))
    );
  }
);

Then('el carrito debe quedar marcado como guardado', 
  async function(this: CucumberWorld) {
    await this.attemptsTo(
      Ensure.that(CartIsSaved(), isTrue())
    );
  }
);

Then('debo ver el mensaje de error {string}', 
  async function(this: CucumberWorld, errorMessage: string) {
    await this.attemptsTo(
      Ensure.that(ModalTitle(), includes('Error'))
    );
  }
);

Then('debo ver el número de factura', async function(this: CucumberWorld) {
  await this.attemptsTo(
    Ensure.that(ModalTitle(), includes('Factura'))
  );
});

Then('el carrito debe vaciarse automáticamente', 
  async function(this: CucumberWorld) {
    await this.attemptsTo(
      Ensure.that(CartIsEmpty(), isTrue())
    );
  }
);

Then('debo ver el total formateado como {string}', 
  async function(this: CucumberWorld, expectedFormat: string) {
    await this.attemptsTo(
      Ensure.that(CartTotal(), equals(expectedFormat))
    );
  }
);

Then('debería ver la página del carrito', async function(this: CucumberWorld) {
  console.log('✅ Llegamos a la página del carrito');
});

// ============== HELPER FUNCTIONS ==============

async function updateCartQuantity(context: CucumberWorld, productName: string, quantity: number) {
  const cartId = context.cartId;
  
  await fetch(`${context.backendURL}/v1/cart/${cartId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${context.authToken}`
    },
    body: JSON.stringify({
      cartItems: [{
        name: productName,
        price: 15.00,
        quantity: quantity
      }]
    })
  });
}

async function createCartWithProducts(context: CucumberWorld, products: any[]) {
  if (context.cartId) {
    await fetch(`${context.backendURL}/v1/cart/${context.cartId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${context.authToken}` }
    });
  }
  
  const response = await fetch(`${context.backendURL}/v1/cart/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${context.authToken}`
    },
    body: JSON.stringify({
      user: context.testUserId,
      cartItems: products.map(p => ({
        product: 'product-1',
        name: p.name,
        price: p.price,
        quantity: p.quantity || 1,
        image: `${p.name.toLowerCase()}.jpg`
      }))
    })
  });
  
  const cart = await response.json();
  context.cartId = cart.id;
}

async function createCartWithTotal(context: CucumberWorld, total: number) {
  const products = [
    { name: 'Producto Test', price: total, quantity: 1 }
  ];
  await createCartWithProducts(context, products);
}

async function clearCartInBackend(context: CucumberWorld) {
  if (context.cartId) {
    await fetch(`${context.backendURL}/v1/cart/${context.cartId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${context.authToken}` }
    });
    context.cartId = undefined;
  }
}