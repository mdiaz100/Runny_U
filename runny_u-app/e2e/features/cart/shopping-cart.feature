Feature: Gestión del carrito de compras
  Como usuario del sistema
  Quiero gestionar los productos en mi carrito
  Para poder realizar mis compras de manera eficiente

  Background:
    Given que estoy autenticado en el sistema
    And tengo productos en mi carrito

  @cart @increase-quantity
  Scenario: Aumentar cantidad de un producto
    Given que tengo un producto con cantidad 1 en el carrito
    When aumento la cantidad del producto
    Then la cantidad del producto debe ser 2
    And el total del carrito debe actualizarse correctamente

  @cart @decrease-quantity
  Scenario: Disminuir cantidad de un producto
    Given que tengo un producto con cantidad 3 en el carrito
    When disminuyo la cantidad del producto
    Then la cantidad del producto debe ser 2
    And el total del carrito debe actualizarse correctamente

  @cart @remove-item
  Scenario: Eliminar producto cuando la cantidad llega a cero
    Given que tengo un producto con cantidad 1 en el carrito
    When disminuyo la cantidad del producto
    And confirmo la eliminación en el modal
    Then el producto debe ser eliminado del carrito
    And debo ver el mensaje "Eliminado"

  @cart @remove-item-direct
  Scenario: Eliminar producto directamente
    Given que tengo productos en mi carrito
    When hago clic en eliminar producto
    And confirmo la eliminación en el modal
    Then el producto debe ser eliminado del carrito
    And debo ver el mensaje "Eliminado"

  @cart @cancel-remove
  Scenario: Cancelar eliminación de producto
    Given que tengo productos en mi carrito
    When hago clic en eliminar producto
    And cancelo la eliminación en el modal
    Then el producto debe permanecer en el carrito

  @cart @clear-cart
  Scenario: Vaciar carrito completo
    Given que tengo 3 productos en mi carrito
    When hago clic en vaciar carrito
    And confirmo vaciar el carrito en el modal
    Then el carrito debe estar vacío
    And debo ver el mensaje "Eliminado"

  @cart @clear-cart-cancel
  Scenario: Cancelar vaciado de carrito
    Given que tengo productos en mi carrito
    When hago clic en vaciar carrito
    And cancelo el vaciado en el modal
    Then los productos deben permanecer en el carrito

  @cart @empty-cart
  Scenario: Intentar vaciar un carrito vacío
    Given que mi carrito está vacío
    When intento hacer clic en vaciar carrito
    Then no debe ocurrir ninguna acción

  @cart @calculate-total
  Scenario: Calcular total del carrito correctamente
    Given que tengo los siguientes productos en el carrito:
      | producto  | precio | cantidad |
      | Pizza     | 15.00  | 2        |
      | Hamburguesa | 10.50  | 1        |
    Then el total del carrito debe ser "$40.50"

  @cart @save-cart
  Scenario: Guardar carrito exitosamente
    And estoy autenticado como usuario
    When hago clic en guardar carrito
    Then debo ver el mensaje "Guardado"
    And el carrito debe quedar marcado como guardado

  @cart @save-cart-error
  Scenario: Error al guardar carrito
    Given que tengo productos en mi carrito
    And el servicio de guardado no está disponible
    When hago clic en guardar carrito
    Then debo ver el mensaje de error "No se pudo guardar el carrito"

  @cart @pay-cart
  Scenario: Pagar carrito guardado exitosamente
    Given que tengo un carrito guardado
    When hago clic en pagar carrito
    Then debo ver el mensaje "Factura Generada"
    And debo ver el número de factura
    And el carrito debe vaciarse automáticamente

  @cart @pay-cart-not-saved
  Scenario: Intentar pagar carrito sin guardar
    Given que tengo productos en mi carrito
    And el carrito no está guardado
    When intento hacer clic en pagar carrito
    Then no debe ocurrir ninguna acción

  @cart @pay-cart-error
  Scenario: Error al generar factura
    Given que tengo un carrito guardado
    And el servicio de facturación no está disponible
    When hago clic en pagar carrito
    Then debo ver el mensaje de error "No se pudo generar la factura"

  @cart @formatted-currency
  Scenario: Visualizar total con formato de moneda
    Given que tengo productos en mi carrito con total de 123.45
    Then debo ver el total formateado como "$123.45"


@test-simple
Scenario: Prueba simple de navegación
  When navego al carrito
  Then debería ver la página del carrito