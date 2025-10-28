# language: es
Característica: Autenticación de usuarios
  Como usuario de la aplicación
  Quiero poder registrarme e iniciar sesión
  Para acceder a los servicios de la plataforma

  Escenario: Registro exitoso de un nuevo usuario
    Dado que no existe un usuario con el email "test@example.com"
    Cuando me registro con los siguientes datos:
      | email              | password  | fullname      |
      | test@example.com   | Test123!  | Test User     |
    Entonces debería recibir un token de autenticación
    Y la respuesta debería indicar éxito

  Escenario: Inicio de sesión exitoso
    Dado que existe un usuario registrado con:
      | email              | password  | fullname      |
      | login@example.com  | Pass123!  | Login User    |
    Cuando intento iniciar sesión con:
      | email              | password  |
      | login@example.com  | Pass123!  |
    Entonces debería recibir un token de autenticación
    Y la respuesta debería indicar éxito

  Escenario: Inicio de sesión con credenciales inválidas
    Cuando intento iniciar sesión con:
      | email              | password  |
      | wrong@example.com  | Wrong123! |
    Entonces debería recibir un error de credenciales inválidas
    Y el código de error debería ser "400"

  Escenario: Inicio de sesión con contraseña incorrecta
    Dado que existe un usuario registrado con:
      | email              | password  | fullname      |
      | user@example.com   | Correct1! | Real User     |
    Cuando intento iniciar sesión con:
      | email              | password  |
      | user@example.com   | Wrong123! |
    Entonces debería recibir un error de credenciales inválidas