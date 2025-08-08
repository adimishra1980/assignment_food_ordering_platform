export interface IMenuItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
}

export interface IOrder {
  id: number;
  customer_name: string;
  customer_phone: string;
  status: 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'PAID';
  items: IOrderItem[];
  created_at: string;
  total_amount:number
}

export interface IOrderItem {
  order_id: number;
  name: string;
  quantity: number;
  menu_item_id: string
}