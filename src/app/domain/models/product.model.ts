import { CategoryGroup } from "./category.model";

export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    image: string;
    category: string;
}

export type CatalogDetails = {
    products: Product[];
    categories: string[];
    productGroupByCategory: CategoryGroup[];
}

// TODO: Agregar el modelo para detallate de productos
//   "rating": {
//     "rate": 3.9,
//     "count": 120
//   }