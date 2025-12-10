import { Observable } from "rxjs";
import { CategoryGroup, Product } from "..";

export type CatalogDetails = {
    products: Product[];
    categories: string[];
    productGroupByCategory: CategoryGroup[];
}

export abstract class ProductRepository {
    abstract getAll(): Observable<CatalogDetails>;
    abstract getById(id: number): Observable<Product | null>;
}