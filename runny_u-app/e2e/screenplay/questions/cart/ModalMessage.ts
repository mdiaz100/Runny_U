import { Question } from '@serenity-js/core';
import { Text } from '@serenity-js/web';
import { CartPage } from '../../ui/CartPage';

export const ModalTitle = () =>
  Question.about('título del modal', actor =>
    Text.of(CartPage.swalTitle())
      .answeredBy(actor)
  );

export const ModalText = () =>
  Question.about('texto del modal', actor =>
    Text.of(CartPage.swalText())
      .answeredBy(actor)
  );