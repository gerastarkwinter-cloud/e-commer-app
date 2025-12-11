import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { ProductRepository } from './domain/repositories/product.repository';
import { ProductService } from './infrastructure/services/product.service';
import { provideHttpClient } from '@angular/common/http';
import { CartRepository } from './domain/repositories/cart.repository';
import { CartService } from './infrastructure/services/cart.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    { provide: ProductRepository, useExisting: ProductService },
    { provide: CartRepository, useExisting: CartService },
  ]
};
