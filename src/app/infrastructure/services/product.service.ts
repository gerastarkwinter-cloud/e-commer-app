import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import { ProductRepository } from '../../application/repositories/product.repository';
import { Product } from '../../domain/models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService extends ProductRepository {
    private readonly API_URL = 'https://fakestoreapi.com';

    constructor(private http: HttpClient) { super(); }

    getAll(): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.API_URL}/products`);
    }

    getById(id: number): Observable<Product | null> {
        return this.http.get<Product>(`${this.API_URL}/products/${id}`);
    }
}
