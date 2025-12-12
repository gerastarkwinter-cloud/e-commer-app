import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { CatalogStore } from './application/state/catalog/catalog.store';
import { CartStore } from './application';
import { Cart, CartItem } from './domain';
import { ShortDescriptionPipe } from './shared/pipes/short-description.pipe';
import { HoverDirectiveForElement } from './shared/directives/hover.directive';
import { NotificationComponent } from "./shared/components/notification/notification.component";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./shared/components/header/header.component";

@Component({
  selector: 'app-root',
  imports: [CommonModule, ReactiveFormsModule, /* ShortDescriptionPipe, HoverDirectiveForElement,  */NotificationComponent, RouterOutlet, HeaderComponent],
  providers: [CatalogStore, CartStore],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {


  protected readonly title = signal('GenSal23');
  protected readonly catalogStore = inject(CatalogStore);
  protected readonly cartStore = inject(CartStore);

  readonly cartItemsCount = computed(() => this.cartStore.items().length);

  constructor() { }

  ngOnInit(): void {

  }

  // addItemToCart() {
  //   const newItem: Cart = {
  //     id: null,
  //     userId: 1,
  //     items: [{
  //       productId: 7,
  //       quantity: 44
  //     }]
  //   }

  //   this.cartStore.addItemToCart(newItem);
  // }

  // updateCartItem() {
  //   const updatedItem: Cart = {
  //     id: 1,
  //     userId: 1,
  //     items: [{
  //       productId: 1,
  //       quantity: 10588445
  //     }]
  //   }
  //   this.cartStore.updateItemInCart(updatedItem);
  // }

  // deleteCartItem(/* productId: number */) {
  //   this.cartStore.deleteItemFromCart(1);
  // }

  // loadCartByUser() {
  //   this.cartStore.loadCartByUser(this.formTest.value.userId);
  // }
}
