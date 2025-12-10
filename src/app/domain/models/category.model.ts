import { Product } from "./product.model";

export interface CategoryGroup {
    category: string;
    products: Product[];
}