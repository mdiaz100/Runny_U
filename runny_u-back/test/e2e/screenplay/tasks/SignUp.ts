import { Task, Interaction, Actor, notes } from '@serenity-js/core';
import { CallAnApi } from '../abilities/CallAnApi';
import { SignUpRequest } from '../models/LoginRequest';

export class SignUp {
  static withCredentials(credentials: SignUpRequest): Task {
    return Task.where(
      `#actor signs up with email ${credentials.email}`,
      Interaction.where(`#actor sends sign up request`, async (actor: Actor) => {
        const api = actor.abilityTo(CallAnApi);
        const response = await api.post('/v1/auth/sign-up', credentials);
        
        // Guardar solo los datos necesarios, no el objeto completo
        await actor.attemptsTo(
          notes().set('lastResponseData', response.data),
          notes().set('lastResponseStatus', response.status)
        );
      }),
    );
  }
}