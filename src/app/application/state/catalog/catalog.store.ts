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

import { Product } from '../../../domain';
import { ProductRepository } from '../../repositories/product.repository';
import { pipe } from 'rxjs';
import { tapResponse } from '@ngrx/operators'
import { debounceTime, switchMap, tap } from 'rxjs/operators';


// Definir estado
export interface CatalogState {
    products: Product[];
    loading: boolean;
    error: null | string;
    selectedProduct: Product | null;
}

// Iniciar estado
const initialState: CatalogState = {
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
        getAllsProducts: rxMethod<void>(
            pipe(
                tap(() => {
                    console.log('Cargando productos...');
                    patchState(store, { loading: true, error: null });
                }
                ),
                switchMap(() => {
                    return repo.getAll()
                        .pipe(
                            tapResponse({
                                next: (products) => {
                                    console.log('Productos cargados:', products);
                                    patchState(store, { products: products, loading: false });
                                },
                                error: (error) => {
                                    console.error('Error al cargar productos:', error);
                                    patchState(store, { error: 'Error al cargar productos', loading: false });
                                }
                            })
                        )
                }),

            ))

    })
    ),
    // withHooks({
    //     onInit: (store) => {
    //         console.log('CatalogStore initialized with state:', store);
    //     },
    //     onDestroy(store) {
    //         console.log('CatalogStore destroyed. Final state:', store);
    //     },
    // })
);