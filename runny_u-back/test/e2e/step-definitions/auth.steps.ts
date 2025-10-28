import { Given, When, Then, DataTable, Before, setDefaultTimeout } from '@cucumber/cucumber';
import { actorCalled, configure, TakeNotes } from '@serenity-js/core';
import { Ensure, equals, not } from '@serenity-js/assertions';
import { CallAnApi } from '../screenplay/abilities/CallAnApi';
import { SignUp } from '../screenplay/tasks/SignUp';
import { Login } from '../screenplay/tasks/Login';
import { AuthResponse } from '../screenplay/questions/AuthResponse';

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

setDefaultTimeout(10000);

Before(function () {
  configure({
    crew: []
  });
});

Given('que no existe un usuario con el email {string}', async function (email: string) {
  actorCalled('TestUser')
    .whoCan(
      CallAnApi.at(BASE_URL),
      TakeNotes.usingAnEmptyNotepad()
    );
});

Given('que existe un usuario registrado con:', async function (dataTable: DataTable) {
  const data = dataTable.hashes()[0];
  
  await actorCalled('TestUser')
    .whoCan(
      CallAnApi.at(BASE_URL),
      TakeNotes.usingAnEmptyNotepad()
    )
    .attemptsTo(
      SignUp.withCredentials({
        email: data.email,
        password: data.password,
        fullname: data.fullname,
      }),
    );
});

When('me registro con los siguientes datos:', async function (dataTable: DataTable) {
  const data = dataTable.hashes()[0];
  
  const actor = actorCalled('TestUser')
    .whoCan(
      CallAnApi.at(BASE_URL),
      TakeNotes.usingAnEmptyNotepad()
    );
  
  await actor.attemptsTo(
    SignUp.withCredentials({
      email: data.email,
      password: data.password,
      fullname: data.fullname,
    }),
  );
});

When('intento iniciar sesión con:', async function (dataTable: DataTable) {
  const data = dataTable.hashes()[0];
  
  const actor = actorCalled('TestUser')
    .whoCan(
      CallAnApi.at(BASE_URL),
      TakeNotes.usingAnEmptyNotepad()
    );
  
  await actor.attemptsTo(
    Login.withCredentials({
      email: data.email,
      password: data.password,
    }),
  );
});

Then('debería recibir un token de autenticación', async function () {
  const actor = actorCalled('TestUser');
  const token = await actor.answer(AuthResponse.token());
  
  await actor.attemptsTo(
    Ensure.that(token, not(equals(''))),
  );
});

Then('la respuesta debería indicar éxito', async function () {
  const actor = actorCalled('TestUser');
  const success = await actor.answer(AuthResponse.success());
  
  await actor.attemptsTo(
    Ensure.that(success, equals(true)),
  );
});

Then('debería recibir un error de credenciales inválidas', async function () {
  const actor = actorCalled('TestUser');
  const errorDetail = await actor.answer(AuthResponse.errorDetail());
  
  await actor.attemptsTo(
    Ensure.that(errorDetail, equals('Invalid credentials')),
  );
});

Then('el código de error debería ser {string}', async function (code: string) {
  const actor = actorCalled('TestUser');
  const errorCode = await actor.answer(AuthResponse.errorCode());
  
  await actor.attemptsTo(
    Ensure.that(errorCode, equals(code)),
  );
});