/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { AuthUserService } from './auth-user.service';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { User } from '../../domain';

describe('UserService', () => {
  let service: AuthUserService;
  let httpMock: HttpTestingController;

  const API_URL = 'https://fakestoreapi.com';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthUserService
      ],
    });
    service = TestBed.inject(AuthUserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería obtener el token', () => {
    const payload = {
      id: 1,
      username: 'gera',
      password: '123456',
    }
    const mockAuthResponse: User[] = [
      {
        id: 1,
        username: 'gera',
        password: '123456',
        email: 'gera@gmail.com',
        token: 'AAAbbb'
      },
    ];

    let result!: User | null;

    service.AuthUser(payload).subscribe(res => (result = res));

    const req = httpMock.expectOne(`${API_URL}/auth/login`);
    expect(`${API_URL}/auth/login`).toBe(req.request.url);
    expect(req.request.method).toBe('POST');
    req.flush(mockAuthResponse);

    expect(result).toEqual({
      id: 1,
      username: 'gera',
      password: '123456',
      email: 'gera@gmail.com',
      token: 'AAAbbb'
    });
  });
});