import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartStore, CatalogStore } from '../../application';
import { CartItemComponent } from './components/cart-item/cart-item.component';
import { Cart, CartItem, Product } from '../../domain';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, RouterLink, CartItemComponent],
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss'],
})
export class CartPageComponent {

  private readonly cartStore = inject(CartStore);
  private readonly catalogStore = inject(CatalogStore);

  readonly cartItemsVm = computed(() => {
    const items = this.cartStore.items();
    const products = this.catalogStore.products();

    const productById = new Map<number, Product>(
      products.map(p => [p.id, p])
    );

    return items.map(item => ({
      ...item,
      product: productById.get(item.productId) ?? undefined,
    }) satisfies CartItem);
  });

  readonly subtotal = computed(() => {
    return this.cartItemsVm().reduce((total, item) =>
      total + (item.product?.price ?? 0) * item.quantity,
      0)
  });

  readonly items = this.cartStore.items;
  readonly totalQuantity = this.cartStore.totalQuantity;
  readonly cartId = this.cartStore.id;

  readonly tax = 10.55;

  constructor() {
    effect(() => {
      const items = this.items();
      const cartId = this.cartId();
      if (!items.length  && cartId !== null ) {
        this.cancelOrder();
      }
    });
  }

  /**
   * Guarda la informacion del carrito en el backend
   */
  saveCart() {
    const cartSave: Cart = {
      id: null,
      userId: 1,
      items: this.items()
    }
    this.cartStore.saveCart(cartSave);
  }

  cancelOrder() {
    this.cartStore.deleteCart(this.cartId() as number);
  }
  /**
   * Actualiza la cantidad de un producto en el carrito.
   * @param event 
   */
  updateItemFromCart(event: any) {
    const productsAdd = [{
      productId: event.productId,
      quantity: event.quantity
    }]
    const userId = 1; // TODO: Cambiar luego cuando se trabaje con el userStore.
    const cartItem: Cart = {
      id: this.cartId(), 
      userId: userId,
      items: productsAdd || []
    }
    this.cartStore.updateItemInCart(cartItem);
  }

  /**
   * Elimina un producto del carrito.
   * @param value 
   */
  deleteItemFromCart(value: number) {
    this.cartStore.deleteItemFromCart(value);
  }

}
