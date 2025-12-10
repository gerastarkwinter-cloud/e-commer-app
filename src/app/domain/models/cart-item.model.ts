import { Product } from './product.model';

/** Representa un item en el carrito en tu store/local, con datos completos del producto */
export interface CartItem {
    product: Product;
    quantity: number;
    subtotal: number;
}
