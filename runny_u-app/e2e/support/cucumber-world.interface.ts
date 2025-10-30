import { Actor } from '@serenity-js/core';

export interface CucumberWorld {

  actor: Actor;
  
  attemptsTo(...tasks: any[]): Promise<void>;
  
  baseURL: string;
  backendURL: string;
  
  authToken: string;
  testUserId: string;
  
  cartId?: string;
  
  serviceFailing?: 'save' | 'billing';
  
  attach(data: string | Buffer, mediaType: string): void;
}