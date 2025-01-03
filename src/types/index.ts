export interface Product {
  id: string;
  name: string;
  price: number;
  size: string;
  description: string;
  images: string[];
  available: boolean;
  category: string;
  gender?: string;
  color?: string;
  condition?: string;
}

export interface CartItem extends Product {
  quantity: number;
}
