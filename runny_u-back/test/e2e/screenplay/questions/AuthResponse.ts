import { Question, Actor, notes } from '@serenity-js/core';

export class AuthResponse {
  static token(): Question<Promise<string>> {
    return Question.about<Promise<string>>('authentication token', async (actor: Actor) => {
      const data = await actor.answer(notes().get('lastResponseData'));
      return data?.token || '';
    });
  }

  static success(): Question<Promise<boolean>> {
    return Question.about<Promise<boolean>>('success status', async (actor: Actor) => {
      const data = await actor.answer(notes().get('lastResponseData'));
      return data?.success === true;
    });
  }

  static statusCode(): Question<Promise<number>> {
    return Question.about<Promise<number>>('HTTP status code', async (actor: Actor) => {
      const status = await actor.answer(notes().get('lastResponseStatus'));
      return status || 0;
    });
  }

  static errorCode(): Question<Promise<string>> {
    return Question.about<Promise<string>>('error code', async (actor: Actor) => {
      const data = await actor.answer(notes().get('lastResponseData'));
      return data?.code || '';
    });
  }

  static errorDetail(): Question<Promise<string>> {
    return Question.about<Promise<string>>('error detail', async (actor: Actor) => {
      const data = await actor.answer(notes().get('lastResponseData'));
      return data?.detail || '';
    });
  }
}