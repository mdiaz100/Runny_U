# language: es
Característica: Gestión de facturas
  Como usuario de la aplicación
  Quiero poder consultar mis facturas
  Para revisar mi historial de compras

  Escenario: Consultar facturas de un usuario sin facturas
    Cuando consulto las facturas del usuario "user-no-bills"
    Entonces debería recibir una lista vacía
    Y el código de estado debería ser 200

  Escenario: Consultar facturas de un usuario existente
    Cuando consulto las facturas del usuario "test-user-id"
    Entonces debería recibir el código de estado 200