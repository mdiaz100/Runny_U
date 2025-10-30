import { Question } from '@serenity-js/core';
import { Text } from '@serenity-js/web';
import { CartPage } from '../../ui/CartPage';

export const CartItemQuantity = {
  of: (productName: string) =>
    Question.about(`cantidad del producto ${productName}`, actor =>
      Text.of(CartPage.itemQuantity(productName))
        .answeredBy(actor)
        .then(text => parseInt(text.trim()))
    )
};