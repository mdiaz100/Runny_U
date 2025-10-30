import { Task, Duration, Wait as WaitAbility } from '@serenity-js/core';
import { Click } from '@serenity-js/web';
import { CartPage } from '../../ui/CartPage';

export const CancelAction = () =>
  Task.where(`#actor cancela la acción en el modal`,
    WaitAbility.for(Duration.ofSeconds(2)), 
    Click.on(CartPage.swalCancelButton())
  );