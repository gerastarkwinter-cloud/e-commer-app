import { Routes } from '@angular/router';

export const appRoutes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'catalog' },
    {
        path: 'catalog', /* component: CatalogPageComponent, */
        loadComponent: () => import('./presentation/catalog/catalog-page.component').then(m => m.CatalogPageComponent)
    },
    {
        path: 'cart', /* component: CartPageComponent */
        loadComponent: () => import('./presentation/cart/cart-page.component').then(m => m.CartPageComponent)
    },
    {
        path: 'product/:id',
        loadComponent: () => import('./presentation/catalog/product/product-detail-page/product-detail-page.component').then(m => m.ProductDetailPageComponent)
    },
    {
        path: 'checkout',
        loadComponent: () => import('./presentation/cart/components/cart-checkout/cart-check-out.component').then(m => m.CartCheckOutComponent)
    },
    { path: '**', redirectTo: 'catalog' },
];