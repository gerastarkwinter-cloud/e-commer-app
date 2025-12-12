import { inject } from "@angular/core";

import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { tapResponse } from "@ngrx/operators";

import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { of, pipe } from "rxjs";
import { concatMap, debounceTime, switchMap, tap } from "rxjs/operators";

import { ANotificationService, Cart, CartItem, Product } from "../../../domain";
import { CartRepository } from "../../../domain/repositories/cart.repository";

export interface CartState {
    userId: number | null;
    items: CartItem[];
    loading: boolean;
    error: string | null;
}

const initialState: CartState = {
    userId: null,
    items: [],
    loading: false,
    error: null,
};

export const CartStore = signalStore(
    withState<CartState>(initialState),
    withComputed(({ items }) => ({
        totalItems: () => items().length,
        totalQuantity: () => items().reduce((total, item) => total + item.quantity, 0)
    })),
    withMethods((store, repo = inject(CartRepository)) => ({
        // Cargar el carrito por usuario
        loadCartByUser: rxMethod<number>(
            pipe(
                tap(() => patchState(store, { loading: true, error: null, items: [] })),
                switchMap(userId => repo.getByUser(userId)),
                tapResponse({
                    next: (cart) => {
                        if (!cart) {
                            patchState(store, {
                                loading: false,
                                userId: null,
                                items: []
                            });
                            return;
                        }
                        patchState(store, {
                            userId: cart.userId,
                            items: cart.items,
                            loading: false,
                            error: null
                        });
                    },
                    error: (error) => {
                        console.error('Error al cargar el carrito: ', error);
                        patchState(store, { error: 'Error al cargar el carrito', loading: false });
                    }
                })
            )
        ),
        // Confirmar datos del carrito a la nube.
        saveCart: rxMethod<Cart>(
            pipe(
                tap((cartInput) => {
                    console.log('cartInput: ', cartInput)

                    patchState(store, { loading: true, error: null });
                }),
            )
        ),
        // Agregar producto al carrito local.
        addItemToCart: rxMethod<Cart>(
            pipe(
                tap((itemsInput) => {
                    let message = '';

                    // console.log('itemsInput: ', itemsInput)
                    patchState(store, { loading: true, error: null });
                    const currentItems = store.items();
                    const merged: CartItem[] = [...currentItems];
                    for (const newItem of itemsInput.items) {
                        const idx = merged.findIndex(i => i.productId === newItem.productId);
                        if (idx === -1) {
                            merged.push(newItem);
                        } /* else {
                            merged[idx] = {
                                ...merged[idx],
                                quantity: merged[idx].quantity + newItem.quantity,
                            };
                        } */
                    }
                    patchState(store, {
                        userId: itemsInput.userId,
                        items: merged,
                        loading: false,
                        error: message || null,
                    });
                    console.log('Items fusionados después de la actualización:', merged);
                }),
                // concatMap((itemsInput) => {
                //     tapResponse(({
                //         next:(itemsInput) =>{
                //             return
                //         },
                //         error:(error) =>{

                //         }
                //     }))
                // })
                // concatMap((cartInput) =>
                //     repo.createCart(cartInput).pipe(
                //         tapResponse({
                //             next: (cart) => {
                //                 console.log('cart: ', cart)

                //                 const currentItems = store.items();
                //                 const merged: CartItem[] = [...currentItems];

                //                 for (const newItem of cart.items) {
                //                     const idx = merged.findIndex(i => i.productId === newItem.productId);
                //                     if (idx === -1) {
                //                         merged.push(newItem);
                //                     } else {
                //                         merged[idx] = {
                //                             ...merged[idx],
                //                             quantity: merged[idx].quantity + newItem.quantity,
                //                         };
                //                     }
                //                 }
                //                 patchState(store, {
                //                     userId: cart.userId,
                //                     items: merged,
                //                     loading: false,
                //                     error: null,
                //                 });
                //                 notification.success(`
                //                         El producto ha sido agregado al carrito con exito.
                //                     `)
                //             },
                //             error: (error) => {
                //                 console.error('Error al agregar el carrito: ', error);
                //                 patchState(store, {
                //                     error: 'Error al agregar el carrito',
                //                     loading: false,
                //                 });
                //             },
                //         })
                //     )
                // )
            )
        ),
        // Actualizar producto del carrito local.
        updateItemInCart: rxMethod<Cart>(
            pipe(
                tap((cartInput) => {
                    let message = '';
                    patchState(store, { loading: true, error: null });
                    if (cartInput) {
                        const currentItems = store.items();
                        console.log('Items actuales del carrito:', currentItems);
                        const merged: CartItem[] = [...currentItems];
                        console.log('Items fusionados antes de la actualización:', merged);
                        for (const updateItem of cartInput.items) {
                            const idx = merged.findIndex(i => i.productId === updateItem.productId);
                            if (idx !== -1) {
                                merged[idx] = {
                                    ...merged[idx],
                                    quantity: updateItem.quantity,
                                };
                                message = 'Producto actualizado.'
                            } else {
                                message = 'Error al actualizar el producto, consulte a soporte.'
                            }
                        }
                        patchState(store, {
                            items: merged,
                            loading: false,
                            error: message || null,
                        });
                        console.log('Items fusionados después de la actualización:', merged);
                    }
                }),
                // concatMap((cartInput) => {
                //     return repo.updateCart(cartInput).pipe(
                //         tapResponse({
                //             next: (value) => {
                //                 console.log('Carrito actualizado:', value);
                //                 if (value) {
                //                     const currentItems = store.items();
                //                     console.log('Items actuales del carrito:', currentItems);
                //                     const merged: CartItem[] = [...currentItems];
                //                     console.log('Items fusionados antes de la actualización:', merged);
                //                     for (const updateItem of value.items) {
                //                         const idx = merged.findIndex(i => i.productId === updateItem.productId);
                //                         if (idx !== -1) {
                //                             merged[idx] = {
                //                                 ...merged[idx],
                //                                 quantity: updateItem.quantity,
                //                             };
                //                         }
                //                     }
                //                     patchState(store, {
                //                         items: merged,
                //                         loading: false,
                //                         error: null,
                //                     });
                //                     console.log('Items fusionados después de la actualización:', merged);
                //                     notification.success(`El producto ha sido actualizado con exito.`)
                //                 }
                //             },
                //             error: (error) => {
                //                 console.error('Error al actualizar el carrito:', error);
                //                 patchState(store, {
                //                     error: 'Error al actualizar el carrito',
                //                     loading: false,
                //                 });
                //             },
                //         })
                //     )
                // })
            )
        ),
        // Eliminar producto del carrito loca.
        deleteItemFromCart: rxMethod<number>(
            pipe(
                tap((productId) => {
                    patchState(store, { loading: true, error: null });
                    const currentItems = store.items();
                    const filteredItems = currentItems.filter(item => item.productId !== productId);
                    console.log('Listada despues de la eliminacion: ', filteredItems)
                    patchState(store, {
                        items: filteredItems,
                        loading: false,
                        error: null,
                    });
                    // notification.success('Producto removido.!')
                }),
                // concatMap((productId) => {
                //     return repo.deleteCart(productId).pipe(
                //         tapResponse({
                //             next: () => {
                //                 const currentItems = store.items();
                //                 const filteredItems = currentItems.filter(item => item.productId !== productId);
                //                 console.log('Listada despues de la eliminacion: ', filteredItems)
                //                 patchState(store, {
                //                     items: filteredItems,
                //                     loading: false,
                //                     error: null,
                //                 });
                //                 notification.success('Producto removido.!')
                //             },
                //             error: (error) => {
                //                 console.error('Error al eliminar el carrito:', error);
                //                 patchState(store, {
                //                     error: 'Error al eliminar el carrito',
                //                     loading: false,
                //                 });
                //             },
                //         })
                //     );
                // })
            )
        )
    })
    )
)