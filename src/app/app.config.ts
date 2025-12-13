import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { appRoutes } from './app.routes';
import { ProductRepository } from './domain/repositories/product.repository';
import { ProductService } from './infrastructure/services/product.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { CartRepository } from './domain/repositories/cart.repository';
import { CartService } from './infrastructure/services/cart.service';
import { httpInterceptor } from './infrastructure/interceptors/app-http.interceptor';
import { ANotificationService } from './domain';
import { NotificationService } from './infrastructure/services/notification.service';
import { NOTIFICATION_UI } from './infrastructure/config/notification.tokens';
import { AuthRepository } from './domain/repositories/user.repository';
import { AuthUserService } from './infrastructure';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(appRoutes),
    provideHttpClient(
      withInterceptors([httpInterceptor])
    ),
    { provide: ProductRepository, useClass: ProductService },
    { provide: CartRepository, useClass: CartService },
    { provide: ANotificationService, useExisting: NotificationService },
    { provide: AuthRepository, useExisting: AuthUserService },
    { provide: NOTIFICATION_UI, useExisting: NotificationService }
  ]
};
