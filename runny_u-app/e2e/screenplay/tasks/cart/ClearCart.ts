import { Task } from '@serenity-js/core';
import { Click } from '@serenity-js/web';
import { CartPage } from '../../ui/CartPage';

export const ClearCart = () =>
  Task.where(`#actor vacía el carrito`,
    Click.on(CartPage.clearCartButton())
  );