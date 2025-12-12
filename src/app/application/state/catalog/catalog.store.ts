import {
    signalStore,
    withState,
    withMethods,
    withComputed,
    patchState,
    withHooks
} from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

import { CategoryGroup, Product } from '../../../domain';
import { ProductRepository } from '../../../domain/repositories/product.repository';
import { EMPTY, pipe } from 'rxjs';
import { tapResponse } from '@ngrx/operators'
import { debounceTime, groupBy, switchMap, tap } from 'rxjs/operators';


// Definir estado
export interface CatalogState {
    categories: string[];
    prodcutGroupBycategory: CategoryGroup[];
    products: Product[];
    loading: boolean;
    error: null | string;
    selectedProduct: Product | null;
}

// Iniciar estado
const initialState: CatalogState = {
    categories: [],
    prodcutGroupBycategory: [],
    products: [],
    loading: false,
    error: null,
    selectedProduct: null,
};

// Definiar métodos del estado.
export const CatalogStore = signalStore(
    withState<CatalogState>(initialState),
    withComputed(({ products }) => ({
        totalProducts: () => products().length,
    })),
    withMethods((store, repo = inject(ProductRepository)) => ({

        loadCatalogFull: rxMethod<void>(
            pipe(
                tap(() => {
                    if (store.products().length) {
                        return;
                    }
                    patchState(store, { loading: true, error: null });
                }),
                switchMap(() => {
                    if (store.products().length) {
                        return EMPTY;
                    }

                    return repo.getAll().pipe(
                        tapResponse({
                            next: (catalogDetails) => {
                                patchState(store, {
                                    products: catalogDetails.products,
                                    categories: catalogDetails.categories,
                                    prodcutGroupBycategory: catalogDetails.productGroupByCategory,
                                    selectedProduct: null,
                                    loading: false,
                                });
                            },
                            error: (error) => {
                                console.error('Error al cargar productos:', error);
                                patchState(store, {
                                    error: 'Error al cargar productos',
                                    loading: false,
                                });
                            },
                        })
                    );
                }),
            )
        ),
        loadProductById: rxMethod<number>(
            pipe(
                tap((id) => {
                    const fromStore = store.products().find(p => p.id === id);

                    if (fromStore) {
                        patchState(store, {
                            selectedProduct: fromStore,
                            loading: false,
                            error: null,
                        });
                    } else {
                        patchState(store, { loading: true, error: null });
                    }
                }),
                switchMap((id) => {
                    const fromStore = store.products().find(p => p.id === id);
                    if (fromStore) {
                        return EMPTY; 
                    }

                    return repo.getById(id).pipe(
                        tapResponse({
                            next: (product) => {
                                patchState(store, {
                                    selectedProduct: product,
                                    loading: false,
                                });
                            },
                            error: (error) => {
                                console.error('Error al cargar el producto:', error);
                                patchState(store, {
                                    error: 'Error al cargar el producto',
                                    loading: false,
                                });
                            },
                        })
                    );
                }),
            )
        ),

    }))
);
