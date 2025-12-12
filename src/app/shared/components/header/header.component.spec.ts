import { TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { CommonModule } from '@angular/common';
import { provideRouter, RouterLink, RouterLinkActive } from '@angular/router';
import { provideZoneChangeDetection, provideZonelessChangeDetection } from '@angular/core';

describe('HeaderComponent', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HeaderComponent],
            providers: [
                provideZonelessChangeDetection(),
                provideRouter([]),
            ],
        });
    });
    it('debería crear el componente', () => {
        const fixture = TestBed.createComponent(HeaderComponent);
        const component = fixture.componentInstance;

        fixture.componentRef.setInput('title', 'MiHogar');
        fixture.detectChanges();

        expect(component).toBeTruthy();
        expect(component.userName()).toBe('Marcos Maure');
        expect(component.userInitial()).toBe('M');
    });

    it('debería leer los inputs title e items', () => {
        const fixture = TestBed.createComponent(HeaderComponent);
        const component = fixture.componentInstance;

        fixture.componentRef.setInput('title', 'Ecommerce');
        fixture.componentRef.setInput('items', 5);
        fixture.detectChanges();

        expect(component.title()).toBe('Ecommerce');
        expect(component.items()).toBe(5);
    });

    it('debería actualizar la inicial si cambia el userName', () => {
 
        const fixture = TestBed.createComponent(HeaderComponent);
        const component = fixture.componentInstance;

        fixture.componentRef.setInput('title', 'MiHogar');
        fixture.detectChanges();

        component.userName.set('ana');
        fixture.detectChanges();

        expect(component.userInitial()).toBe('A');
    });

    it('debería la inicial debe ser "?" si userName está vacío.', () => {

        const fixture = TestBed.createComponent(HeaderComponent);
        const component = fixture.componentInstance;

        fixture.componentRef.setInput('title', 'MiHogar');
        fixture.detectChanges();

        component.userName.set('');
        fixture.detectChanges();

        expect(component.userInitial()).toBe('?');
    });
});
