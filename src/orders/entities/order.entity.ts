export class Order {
  id: string;
  productId: string;
  productTitle: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  tax: number;
  taxPercent: number;
  totalAmount: number;
  currency: string;
  status: string;
  createdAt: string;
}
