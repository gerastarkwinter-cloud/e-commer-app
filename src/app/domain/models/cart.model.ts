import { Product } from "./product.model";

export interface Cart {
    id: number;
    userId: number;
    date: string;
    products: Product[];
}
