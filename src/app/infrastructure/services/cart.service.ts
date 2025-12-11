import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { Cart, ResponseListCart } from "../../domain";
import { CartRepository } from "../../domain/repositories/cart.repository";


@Injectable({ providedIn: 'root' })
export class CartService extends CartRepository {
    private readonly API_URL = 'https://fakestoreapi.com/carts';
    private readonly http = inject(HttpClient);

    constructor() { super(); }

    getByUser(userId: number): Observable<Cart | null> {
        return this.http
            .get<ResponseListCart[]>(`${this.API_URL}/user/${userId}`)
            .pipe(
                map(carts => {
                    if (!carts.length) return null;
                    const last = carts[carts.length - 1];
                    return {
                        id: last.id,
                        userId: last.userId,
                        items: last.products.map(p => ({
                            productId: p.productId,
                            quantity: p.quantity,
                        })),
                    } as Cart;
                })
            );
    }

    createCart(cart: Cart): Observable<Cart> {
        const payload = {
            userId: cart.userId,
            date: new Date().toISOString(),
            products: cart.items.map(i => ({
                productId: i.productId,
                quantity: i.quantity,
            })),
        };

        return this.http
            .post<ResponseListCart>(`${this.API_URL}`, payload)
            .pipe(
                map(c => ({
                    id: c.id,
                    userId: c.userId,
                    items: c.products.map(p => ({
                        productId: p.productId,
                        quantity: p.quantity,
                    })),
                }))
            );
    }


    updateCart(cart: Cart): Observable<Cart> {
        const payload = {
            userId: cart.userId,
            date: new Date().toISOString(),
            products: cart.items.map(i => ({
                productId: i.productId,
                quantity: i.quantity,
            })),
        };

        return this.http
            .put<ResponseListCart>(`${this.API_URL}/${cart.id}`, payload)
            .pipe(
                map(c => ({
                    id: c.id,
                    userId: c.userId,
                    items: c.products.map(p => ({
                        productId: p.productId,
                        quantity: p.quantity,
                    })),
                }))
            );
    }

    deleteCart(cartId: number): Observable<void> {
        return this.http
            .delete<void>(`${this.API_URL}/${cartId}`);
    }
}