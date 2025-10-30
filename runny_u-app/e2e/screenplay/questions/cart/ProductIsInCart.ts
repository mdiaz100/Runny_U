import { Question } from '@serenity-js/core';
import { CartPage } from '../../ui/CartPage';

export const ProductIsInCart = {
  named: (productName: string) =>
    Question.about(`si ${productName} está en el carrito`, actor =>
      CartPage.cartItemByName(productName)
        .isVisible()
        .answeredBy(actor)
    )
};