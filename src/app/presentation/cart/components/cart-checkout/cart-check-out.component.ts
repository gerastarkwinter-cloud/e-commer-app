import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { CartStore, CatalogStore } from "../../../../application";
import { Product } from "../../../../domain";

@Component({
    selector: 'app-cart-checkout',
    templateUrl: './cart-check-out.component.html',
    standalone: true,
    imports: [CommonModule]
})
export class CartCheckOutComponent {
    private readonly cartStore = inject(CartStore);
    private readonly catalogStore = inject(CatalogStore);

    readonly selectedProduct = this.catalogStore.selectedProduct;
    constructor() { }


}