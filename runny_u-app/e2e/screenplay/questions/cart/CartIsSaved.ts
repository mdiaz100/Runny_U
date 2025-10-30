import { Question } from '@serenity-js/core';
import { CartPage } from '../../ui/CartPage';

export const CartIsSaved = () =>
  Question.about('si el carrito está guardado', actor =>
    CartPage.cartSavedIndicator()
      .isVisible()
      .answeredBy(actor)
  );