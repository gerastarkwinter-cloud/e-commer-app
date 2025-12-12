import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { CartStore, CatalogStore } from '../../application';
import { Cart } from '../../domain';
import { ProductListComponent } from './product/product-list/product-list.component';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, ProductListComponent],
  templateUrl: './catalog-page.component.html',
})
export class CatalogPageComponent implements OnInit {

  private readonly catalogStore = inject(CatalogStore);
  private readonly cartStore = inject(CartStore);

  readonly products = this.catalogStore.products;

  constructor() { }

  ngOnInit(): void {
    this.catalogStore.loadCatalogFull();
  }

  AddToCart(event: any) {
    let productId: number = event.productId;
    let quantity: number = event.quantity;

    const userId = 1; // TODO: Cambiar luego cuando se trabaje con el userStore.
    const productsAdd = [{
      productId,
      quantity
    }]
    const cartItem: Cart = {
      id: this.cartStore.id(),
      userId: userId,
      items: productsAdd || []
    }

    if (cartItem.id) {
      this.cartStore.addItemToCart(cartItem);
    } else {
      this.cartStore.saveCart(cartItem);
    }
  }

  UpdateItemToCart(event: any) {
    let productId: number = event.productId;
    let quantity: number = event.quantity;
    const userId = 1; // TODO: Cambiar luego cuando se trabaje con el userStore.
    const productsAdd = [{
      productId,
      quantity
    }]

    const cartItem: Cart = {
      id: 1, // TODO: Cuando se tenga el usuario se trabajara con el id del carrito selecionado, por el momento es fijo.
      userId: userId,
      items: productsAdd || []
    }
    this.cartStore.updateItemInCart(cartItem);
  }

  DeleteItemFromCart($event: number) {
    $event && this.cartStore.deleteItemFromCart($event);
  }

}
