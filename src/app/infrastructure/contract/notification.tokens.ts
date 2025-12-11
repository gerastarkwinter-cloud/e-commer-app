// infrastructure/contract/notification.tokens.ts
import { InjectionToken } from '@angular/core';
import { OnNotification } from './segregation.interface';
import { INotification } from '../../domain/models/notification.model';

export const NOTIFICATION_UI = new InjectionToken<OnNotification<INotification>>('NOTIFICATION_UI');
