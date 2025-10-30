import { Task, Duration, Wait as WaitAbility } from '@serenity-js/core';
import { Click } from '@serenity-js/web';
import { CartPage } from '../../ui/CartPage';

export const ConfirmAction = () =>
  Task.where(`#actor confirma la acción en el modal`,
    WaitAbility.for(Duration.ofSeconds(2)), 
    Click.on(CartPage.swalConfirmButton())
  );