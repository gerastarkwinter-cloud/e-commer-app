import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { CartStore, CatalogStore } from '../../application';
import { ProductListComponent } from "../../shared/components/product/product-list/product-list.component";
import { Cart } from '../../domain';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, ProductListComponent],
  templateUrl: './catalog-page.component.html',
  styleUrls: ['./catalog-page.component.scss']
})
export class CatalogPageComponent implements OnInit {


  private readonly catalogStore = inject(CatalogStore);
  private readonly cartStore = inject(CartStore);

  readonly products = this.catalogStore.products;

  constructor() { }

  ngOnInit(): void {
    this.catalogStore.loadCatalogFull();
  }

  AddToCart($event: Cart) {
    $event && this.cartStore.addItemToCart($event);
  }


  UpdateItemToCart($event: Cart) {
    $event && this.cartStore.updateItemInCart($event);
  }

  DeleteItemFromCart($event: number) {
    $event && this.cartStore.deleteItemFromCart($event);
  }

}
