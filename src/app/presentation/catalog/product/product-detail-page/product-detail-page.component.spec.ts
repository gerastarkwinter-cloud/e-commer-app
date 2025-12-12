/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDetailPageComponent } from './product-detail-page.component';

describe('ProductDetailsComponent', () => {
  let component: ProductDetailPageComponent;
  let fixture: ComponentFixture<ProductDetailPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductDetailPageComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
