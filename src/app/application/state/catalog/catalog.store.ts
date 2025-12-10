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
import { pipe } from 'rxjs';
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
                    console.log('Cargando productos...');
                    patchState(store, { loading: true, error: null });
                }
                ),
                switchMap(() => {
                    return repo.getAll()
                        .pipe(
                            tapResponse({
                                next: (catalogDetails) => {
                                    console.log('Productos cargados:', catalogDetails);
                                    patchState(store, {
                                        products: catalogDetails.products,
                                        categories: catalogDetails.categories,
                                        prodcutGroupBycategory: catalogDetails.productGroupByCategory,
                                        selectedProduct: null,
                                        loading: false
                                    });
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