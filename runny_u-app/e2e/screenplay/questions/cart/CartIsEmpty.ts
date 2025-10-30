import { Question } from '@serenity-js/core';
import { By, PageElements } from '@serenity-js/web';

export const CartIsEmpty = () =>
  Question.about('si el carrito está vacío', async actor => {
    const count = await PageElements.located(By.css('.cart-item'))
      .count()
      .answeredBy(actor);
    return count === 0;
  });