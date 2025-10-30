import { Question } from '@serenity-js/core';
import { Text } from '@serenity-js/web';
import { CartPage } from '../../ui/CartPage';

export const CartTotal = () =>
  Question.about('total del carrito', actor =>
    Text.of(CartPage.formattedTotal())
      .answeredBy(actor)
  );