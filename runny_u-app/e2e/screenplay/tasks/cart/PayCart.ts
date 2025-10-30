import { Task } from '@serenity-js/core';
import { Click } from '@serenity-js/web';
import { CartPage } from '../../ui/CartPage';

export const PayCart = () =>
  Task.where(`#actor paga el carrito`,
    Click.on(CartPage.payCartButton())
  );