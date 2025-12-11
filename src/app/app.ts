import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { CatalogStore } from './application/state/catalog/catalog.store';
import { CartStore } from './application';
import { Cart, CartItem } from './domain';
import { ShortDescriptionPipe } from './shared/pipes/short-description.pipe';

@Component({
  selector: 'app-root',
  imports: [CommonModule, ReactiveFormsModule, ShortDescriptionPipe],
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

    // Effects
    effect(() => {
      const carts: CartItem[] = this.cartStore.items();

      if (carts.length > 0) {
        console.log('🛒 Items en el carrito :', carts);
      };

      if (this.catalogStore.prodcutGroupBycategory().length > 0) {
        console.log('🫸 Categorías Detectadas :', this.catalogStore.categories());
      };
    });
  }
  ngOnInit(): void {

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
  }

  deleteCartItem(/* productId: number */) {
    this.cartStore.deleteItemFromCart(1);
  }

  loadCartByUser() {
    this.cartStore.loadCartByUser(this.formTest.value.userId);
  }
}
