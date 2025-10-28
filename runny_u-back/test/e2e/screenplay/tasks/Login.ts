import { Task, Interaction, Actor, notes } from '@serenity-js/core';
import { CallAnApi } from '../abilities/CallAnApi';
import { LoginRequest } from '../models/LoginRequest';

export class Login {
  static withCredentials(credentials: LoginRequest): Task {
    return Task.where(
      `#actor logs in with email ${credentials.email}`,
      Interaction.where(`#actor sends login request`, async (actor: Actor) => {
        const api = actor.abilityTo(CallAnApi);
        const response = await api.post('/v1/auth/login', credentials);
        
        // Guardar solo los datos necesarios, no el objeto completo
        await actor.attemptsTo(
          notes().set('lastResponseData', response.data),
          notes().set('lastResponseStatus', response.status)
        );
      }),
    );
  }
}