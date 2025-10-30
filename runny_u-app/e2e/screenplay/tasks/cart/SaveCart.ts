import { Task } from '@serenity-js/core';
import { Click } from '@serenity-js/web';
import { CartPage } from '../../ui/CartPage';

export const SaveCart = () =>
  Task.where(`#actor guarda el carrito`,
    Click.on(CartPage.saveCartButton())
  );