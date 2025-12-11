import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { CatalogStore } from './application/state/catalog/catalog.store';
import { CartStore } from './application';
import { Cart, CartItem } from './domain';
@Component({
  selector: 'app-root',
  imports: [CommonModule, ReactiveFormsModule],
  providers: [CatalogStore, CartStore],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {


  protected readonly title = signal('e-commerce-app');
  protected readonly catalogStore = inject(CatalogStore);
  protected readonly cartStore = inject(CartStore);

  private readonly fb = inject(FormBuilder);
  public formTest!: FormGroup;

  public readonly $products = this.catalogStore.products;

  constructor() {
    this.formTest = this.fb.group({
      userId: [{ value: 1, disabled: false }],
    });

    console.log('🫸 :', this.catalogStore.loading());
    console.log('🫸Total :', this.catalogStore.totalProducts());

    // Effects
    effect(() => {
      const carts: CartItem[] = this.cartStore.items();

      // console.log('Efecto - Loading State:', this.catalogStore.loading());
      // console.log('🛒 Productos :', this.catalogStore.products());
      if (carts.length > 0) {
        console.log('🛒 Items en el carrito :', carts);
      };

      if (this.catalogStore.prodcutGroupBycategory().length > 0) {
        // console.log('Estado: ', this.catalogStore)
        // console.log('🫸 Categorías :', this.catalogStore.prodcutGroupBycategory());
        // console.log('🫸 Total Categorías :', this.catalogStore.categories().length);
        console.log('🫸 Categorías Detectadas :', this.catalogStore.categories());
      };
    });
  }
  ngOnInit(): void {
    // console.log('Productos cargados en OnInit:', this.$products());
    // this.catalogStore.get();
  }

  addItemToCart() {
    const newItem: Cart = {
      id: null,
      userId: 1,
      items: [{
        productId: 7,
        quantity: 44
      }]
    }

    this.cartStore.addItemToCart(newItem);
    console.log('Carrito del usuario:', this.cartStore.items());
  }

  updateCartItem() {
    const updatedItem: Cart = {
      id: 1,
      userId: 1,
      items: [{
        productId: 1,
        quantity: 10588445
      }]
    }
    this.cartStore.updateItemInCart(updatedItem);
     console.log('Carrito del usuario:', this.cartStore.items());
  }

  deleteCartItem(/* productId: number */) {
    this.cartStore.deleteItemFromCart(1);
    // console.log('Carrito del usuario después de eliminar el item:', this.cartStore.items());
  }

  loadCartByUser() {
    this.cartStore.loadCartByUser(this.formTest.value.userId);
    // console.log('Carrito del usuario:', this.cartStore.items());
  }


}
