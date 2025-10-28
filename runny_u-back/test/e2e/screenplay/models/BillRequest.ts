export interface BillResponse {
  numberBill: number;
  items: CartItem[];
  total: number;
}

export interface CartItem {
  id?: string;
  productName?: string;
  price?: number;
  quantity?: number;
}

export interface CreateBillData {
  userId: string;
  cartId: string;
  numberBill: number;
  total: number;
  items: CartItem[];
}