import { By, PageElement } from '@serenity-js/web';

export class CartPage {
 
  static cartItems = () =>
    PageElement.located(By.css('.cart-item'))
      .describedAs('items del carrito');

  static cartItemByName = (productName: string) =>
    PageElement.located(By.xpath(`//li[contains(@class, 'cart-item')][.//h3[contains(@class, 'item-name')][contains(text(), '${productName}')]]`))
      .describedAs(`item del carrito: ${productName}`);

  static itemQuantity = (productName: string) =>
    PageElement.located(By.xpath(`//li[contains(@class, 'cart-item')][.//h3[contains(text(), '${productName}')]]//span[contains(@class, 'item-quantity')]`))
      .describedAs(`cantidad del producto ${productName}`);

 
  static increaseQuantityButton = (productName: string) =>
    PageElement.located(By.xpath(`//li[contains(@class, 'cart-item')][.//h3[contains(text(), '${productName}')]]//button[contains(@aria-label, 'Aumentar cantidad')]`))
      .describedAs(`botón aumentar cantidad de ${productName}`);

  static decreaseQuantityButton = (productName: string) =>
    PageElement.located(By.xpath(`//li[contains(@class, 'cart-item')][.//h3[contains(text(), '${productName}')]]//button[contains(@aria-label, 'Reducir cantidad')]`))
      .describedAs(`botón disminuir cantidad de ${productName}`);

  static removeItemButton = (productName: string) =>
    PageElement.located(By.xpath(`//li[contains(@class, 'cart-item')][.//h3[contains(text(), '${productName}')]]//button[contains(@aria-label, 'Eliminar producto')]`))
      .describedAs(`botón eliminar ${productName}`);

  
  static clearCartButton = () =>
    PageElement.located(By.css('button.clear-cart-btn'))
      .describedAs('botón vaciar carrito');

  static saveCartButton = () =>
    PageElement.located(By.css('button.checkout-btn'))
      .describedAs('botón guardar carrito');

  static payCartButton = () =>
    PageElement.located(By.xpath(`//button[contains(@class, 'checkout-btn')][contains(text(), 'Proceder al pago')]`))
      .describedAs('botón pagar carrito');

 
  static cartTotal = () =>
    PageElement.located(By.css('.cart-total strong'))
      .describedAs('total del carrito');

  static formattedTotal = () =>
    PageElement.located(By.css('.cart-total strong'))
      .describedAs('total formateado del carrito');


  static emptyCartMessage = () =>
    PageElement.located(By.css('.empty-cart'))
      .describedAs('mensaje de carrito vacío');

 
  static swalModal = () =>
    PageElement.located(By.css('.swal2-container'))
      .describedAs('modal de confirmación');

  static swalTitle = () =>
    PageElement.located(By.css('.swal2-title'))
      .describedAs('título del modal');

  static swalText = () =>
    PageElement.located(By.css('.swal2-html-container, .swal2-content'))
      .describedAs('texto del modal');

  static swalConfirmButton = () =>
    PageElement.located(By.css('.swal2-confirm'))
      .describedAs('botón confirmar del modal');

  static swalCancelButton = () =>
    PageElement.located(By.css('.swal2-cancel'))
      .describedAs('botón cancelar del modal');

  static cartSavedIndicator = () =>
    PageElement.located(By.xpath(`//button[contains(text(), 'Proceder al pago')][not(@disabled)]`))
      .describedAs('indicador de carrito guardado');
}