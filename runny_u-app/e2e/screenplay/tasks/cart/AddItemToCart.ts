import { Task } from '@serenity-js/core';
import { Navigate, Click } from '@serenity-js/web';

export const AddItemToCart = {
  withDetails: (productName: string, quantity: number = 1) =>
    Task.where(`#actor agrega ${quantity} ${productName} al carrito`,
      Navigate.to('/restaurant/1'), 
    )
};