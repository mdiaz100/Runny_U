import { Task } from '@serenity-js/core';
import { Click } from '@serenity-js/web';
import { CartPage } from '../../ui/CartPage';

export const IncreaseQuantity = {
  of: (productName: string) =>
    Task.where(`#actor aumenta la cantidad de ${productName}`,
      Click.on(CartPage.increaseQuantityButton(productName))
    )
};