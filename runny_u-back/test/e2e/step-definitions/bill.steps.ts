import { Given, When, Then, Before, setDefaultTimeout } from '@cucumber/cucumber';
import { actorCalled, configure, TakeNotes } from '@serenity-js/core';
import { Ensure, equals } from '@serenity-js/assertions';
import { CallAnApi } from '../screenplay/abilities/CallAnApi';
import { GetBills } from '../screenplay/tasks/Bill';
import { BillResponse } from '../screenplay/questions/BillResponse';

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

setDefaultTimeout(10000);

Before(function () {
  configure({
    crew: []
  });
});

When('consulto las facturas del usuario {string}', 
  async function (userId: string) {
    const actor = actorCalled('BillUser')
      .whoCan(
        CallAnApi.at(BASE_URL),
        TakeNotes.usingAnEmptyNotepad()
      );
    
    await actor.attemptsTo(
      GetBills.forUser(userId)
    );
});

Then('debería recibir una lista vacía', 
  async function () {
    const actor = actorCalled('BillUser');
    const count = await actor.answer(BillResponse.count());
    
    await actor.attemptsTo(
      Ensure.that(count, equals(0))
    );
});

Then('el código de estado debería ser {int}', 
  async function (expectedStatus: number) {
    const actor = actorCalled('BillUser');
    const status = await actor.answer(BillResponse.statusCode());
    
    await actor.attemptsTo(
      Ensure.that(status, equals(expectedStatus))
    );
});

Then('debería recibir el código de estado {int}', 
  async function (expectedStatus: number) {
    const actor = actorCalled('BillUser');
    const status = await actor.answer(BillResponse.statusCode());
    
    await actor.attemptsTo(
      Ensure.that(status, equals(expectedStatus))
    );
});