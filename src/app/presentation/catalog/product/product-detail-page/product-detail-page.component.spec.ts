import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { ProductDetailPageComponent } from './product-detail-page.component';
import { CatalogStore } from '../../../../application';
import { Product } from '../../../../domain';

class CatalogStoreMock {
    readonly products = signal<Product[]>([]);
    readonly selectedProduct = signal<Product | null>(null);

    loadCatalogFull = jasmine.createSpy('loadCatalogFull');
    loadProductById = jasmine.createSpy('loadProductById');
}

describe('ProductDetailPageComponent', () => {
    let catalogStore: CatalogStoreMock;
    let paramMap$: BehaviorSubject<any>;

    const makeRouteMock = (id: number | null) => {
        paramMap$ = new BehaviorSubject(convertToParamMap(id == null ? {} : { id: String(id) }));

        return {
            snapshot: { paramMap: convertToParamMap(id == null ? {} : { id: String(id) }) },
            paramMap: paramMap$.asObservable(),
        } as any as ActivatedRoute;
    };

    const p = (id: number, category = 'cat'): Product =>
    ({
        id,
        title: `P${id}`,
        description: `D${id}`,
        price: id,
        image: `img${id}.png`,
        category,
    } as any as Product);

    beforeEach(() => {
        catalogStore = new CatalogStoreMock();

        TestBed.configureTestingModule({
            imports: [ProductDetailPageComponent],
            providers: [
                provideZonelessChangeDetection(),
                provideRouter([]),
                { provide: CatalogStore, useValue: catalogStore },
                { provide: ActivatedRoute, useValue: makeRouteMock(1) },
            ],
        });
    });

    it('debería crear el componente', () => {
        const fixture = TestBed.createComponent(ProductDetailPageComponent);
        const component = fixture.componentInstance;

        fixture.detectChanges();

        expect(component).toBeTruthy();
    });

    it('debería llamar loadCatalogFull si products está vacío', () => {
        catalogStore.products.set([]);

        const fixture = TestBed.createComponent(ProductDetailPageComponent);
        fixture.detectChanges();

        expect(catalogStore.loadCatalogFull).toHaveBeenCalled();
    });

    it('NO debería llamar loadCatalogFull si ya hay products', () => {
        catalogStore.products.set([p(1), p(2)]);

        const fixture = TestBed.createComponent(ProductDetailPageComponent);
        fixture.detectChanges();

        expect(catalogStore.loadCatalogFull).not.toHaveBeenCalled();
    });

    it('debería llamar loadProductById con el id del paramMap', () => {
        TestBed.resetTestingModule();

        catalogStore = new CatalogStoreMock();

        TestBed.configureTestingModule({
            imports: [ProductDetailPageComponent],
            providers: [
                provideZonelessChangeDetection(),
                provideRouter([]),
                { provide: CatalogStore, useValue: catalogStore },
                { provide: ActivatedRoute, useValue: makeRouteMock(7) },
            ],
        });

        const fixture = TestBed.createComponent(ProductDetailPageComponent);
        fixture.detectChanges();

        expect(catalogStore.loadProductById).toHaveBeenCalledWith(7);
    });

    it('debería volver a llamar loadProductById si cambia el paramMap', () => {
        TestBed.resetTestingModule();

        catalogStore = new CatalogStoreMock();
        const route = makeRouteMock(3);

        TestBed.configureTestingModule({
            imports: [ProductDetailPageComponent],
            providers: [
                provideZonelessChangeDetection(),
                provideRouter([]),
                { provide: CatalogStore, useValue: catalogStore },
                { provide: ActivatedRoute, useValue: route },
            ],
        });

        const fixture = TestBed.createComponent(ProductDetailPageComponent);
        fixture.detectChanges();

        expect(catalogStore.loadProductById).toHaveBeenCalledWith(3);

        paramMap$.next(convertToParamMap({ id: '4' }));
        fixture.detectChanges();

        expect(catalogStore.loadProductById).toHaveBeenCalledWith(4);
        expect(catalogStore.loadProductById.calls.count()).toBe(2);
    });

    it('product: debería salir desde products si existe en la lista', () => {
        TestBed.resetTestingModule();

        catalogStore = new CatalogStoreMock();
        const route = makeRouteMock(2);

        catalogStore.products.set([p(1), p(2), p(3)]);
        catalogStore.selectedProduct.set(p(999));

        TestBed.configureTestingModule({
            imports: [ProductDetailPageComponent],
            providers: [
                provideZonelessChangeDetection(),
                provideRouter([]),
                { provide: CatalogStore, useValue: catalogStore },
                { provide: ActivatedRoute, useValue: route },
            ],
        });

        const fixture = TestBed.createComponent(ProductDetailPageComponent);
        const component = fixture.componentInstance;

        fixture.detectChanges();

        expect(component.product()?.id).toBe(2);
    });

    it('product: debería salir desde selectedProduct si no está en la lista', () => {
        TestBed.resetTestingModule();

        catalogStore = new CatalogStoreMock();
        const route = makeRouteMock(10);

        catalogStore.products.set([p(1), p(2)]);
        catalogStore.selectedProduct.set(p(10));

        TestBed.configureTestingModule({
            imports: [ProductDetailPageComponent],
            providers: [
                provideZonelessChangeDetection(),
                provideRouter([]),
                { provide: CatalogStore, useValue: catalogStore },
                { provide: ActivatedRoute, useValue: route },
            ],
        });

        const fixture = TestBed.createComponent(ProductDetailPageComponent);
        const component = fixture.componentInstance;

        fixture.detectChanges();

        expect(component.product()?.id).toBe(10);
    });

    it('relatedProducts: misma categoría, distinto id, máximo 6', () => {
        TestBed.resetTestingModule();

        catalogStore = new CatalogStoreMock();
        const route = makeRouteMock(1);

        const list = [
            p(1, 'A'),
            p(2, 'A'),
            p(3, 'A'),
            p(4, 'A'),
            p(5, 'A'),
            p(6, 'A'),
            p(7, 'A'),
            p(8, 'B'),
        ];
        catalogStore.products.set(list);

        TestBed.configureTestingModule({
            imports: [ProductDetailPageComponent],
            providers: [
                provideZonelessChangeDetection(),
                provideRouter([]),
                { provide: CatalogStore, useValue: catalogStore },
                { provide: ActivatedRoute, useValue: route },
            ],
        });

        const fixture = TestBed.createComponent(ProductDetailPageComponent);
        const component = fixture.componentInstance;

        fixture.detectChanges();

        const related = component.relatedProducts();
        expect(related.length).toBe(6);
        expect(related.some(x => x.id === 1)).toBeFalse();
        expect(related.every(x => x.category === 'A')).toBeTrue();
    });
});
