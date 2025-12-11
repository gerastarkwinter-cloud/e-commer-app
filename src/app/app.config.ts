import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { ProductRepository } from './domain/repositories/product.repository';
import { ProductService } from './infrastructure/services/product.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { CartRepository } from './domain/repositories/cart.repository';
import { CartService } from './infrastructure/services/cart.service';
import { httpInterceptor } from './infrastructure/interceptors/app-http.interceptor';
import { ANotificationService } from './domain';
import { NotificationService } from './infrastructure/services/notification.service';
import { NOTIFICATION_UI } from './infrastructure/contract/notification.tokens';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([httpInterceptor])
    ),
    { provide: ProductRepository, useExisting: ProductService },
    { provide: CartRepository, useExisting: CartService },
    { provide: ANotificationService, useExisting: NotificationService },
    { provide: NOTIFICATION_UI, useExisting: NotificationService }
  ]
};
