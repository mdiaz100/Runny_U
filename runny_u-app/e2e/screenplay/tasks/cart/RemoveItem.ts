import { Task } from '@serenity-js/core';
import { Click } from '@serenity-js/web';
import { CartPage } from '../../ui/CartPage';

export const RemoveItem = {
  named: (productName: string) =>
    Task.where(`#actor elimina ${productName} del carrito`,
      Click.on(CartPage.removeItemButton(productName))
    )
};