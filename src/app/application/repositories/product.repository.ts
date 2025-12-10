import { Observable } from "rxjs";
import { Product } from "../../domain";


export abstract class ProductRepository {
    abstract getAll(): Observable<Product[]>;
    abstract getById(id: number): Observable<Product | null>;
    // abstract create(product: Product): Observable<Product>;
    // abstract update(id: number, product: Product): Observable<Product>;
    // abstract delete(id: number): Observable<boolean>;
}