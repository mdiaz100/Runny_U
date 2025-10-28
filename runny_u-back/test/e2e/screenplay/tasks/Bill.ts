import { Task, Interaction, Actor, notes } from '@serenity-js/core';
import { CallAnApi } from '../abilities/CallAnApi';

export class GetBills {
  static forUser(userId: string): Task {
    return Task.where(
      `#actor gets bills for user ${userId}`,
      Interaction.where(`#actor sends get bills request`, async (actor: Actor) => {
        const api = actor.abilityTo(CallAnApi);
        const response = await api.get(`/v1/bill/user/${userId}`);
        
        console.log('GetBills Response Status:', response.status);
        console.log('GetBills Response Data:', JSON.stringify(response.data, null, 2));
        
        await actor.attemptsTo(
          notes().set('lastResponseData', response.data),
          notes().set('lastResponseStatus', response.status)
        );
      }),
    );
  }
}