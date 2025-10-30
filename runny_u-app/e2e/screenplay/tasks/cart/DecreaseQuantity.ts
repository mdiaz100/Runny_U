import { Task } from '@serenity-js/core';
import { Click } from '@serenity-js/web';
import { CartPage } from '../../ui/CartPage';

export const DecreaseQuantity = {
  of: (productName: string) =>
    Task.where(`#actor disminuye la cantidad de ${productName}`,
      Click.on(CartPage.decreaseQuantityButton(productName))
    )
};