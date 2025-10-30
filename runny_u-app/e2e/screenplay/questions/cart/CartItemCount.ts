import { Question } from '@serenity-js/core';
import { By, PageElements } from '@serenity-js/web';
import { CartPage } from '../../ui/CartPage';

export const CartItemCount = () =>
  Question.about('cantidad de items en el carrito', actor =>
    PageElements.located(By.css('.cart-item'))
      .count()
      .answeredBy(actor)
  );