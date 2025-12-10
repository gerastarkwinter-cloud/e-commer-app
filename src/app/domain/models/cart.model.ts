import { CartProductRef } from './cart-product-ref.model';

export interface Cart {
    id: number;
    userId: number;
    date: string;
    products: CartProductRef[];
}
