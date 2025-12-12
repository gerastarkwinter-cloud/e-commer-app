import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
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

  readonly tax = 10.55;

  constructor() { }

  /**
   * Guarda la informacion del carrito en el backend
   */
  saveCart() {
   
  }

  /**
   * Actualiza la cantidad de un producto en el carrito.
   * @param event 
   */
  updateItemFromCart(event: any) {
    console.log('Event: ', event)
    const productsAdd = [{
      productId: event.productId,
      quantity: event.quantity
    }]
    const userId = 1; // TODO: Cambiar luego cuando se trabaje con el userStore.
    const cartItem: Cart = {
      id: 1, // TODO: Cuando se tenga el usuario se trabajara con el id del carrito selecionado, por el momento es fijo.
      userId: userId,
      items: productsAdd || []
    }
    // return
    // const quantity = this.amountCtrl.value;
    // const productId = this.product().id;

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
