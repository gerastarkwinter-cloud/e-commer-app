import { CommonModule } from '@angular/common';
import {  Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { CatalogStore } from '../../../../application';
import { Product } from '../../../../domain';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail-page.component.html',
})
export class ProductDetailPageComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly catalogStore = inject(CatalogStore);

  readonly products = this.catalogStore.products;
  readonly selectedProduct = this.catalogStore.selectedProduct;

  readonly productId = computed(() => {
    const param = this.route.snapshot.paramMap.get('id');
    return param ? Number(param) : null;
  });


  readonly product = computed<Product | null>(() => {
    const id = this.productId();
    if (id == null) return null;

    const list = this.products();
    const fromList = list.find(p => p.id === id);
    if (fromList) return fromList;

    return this.selectedProduct();
  });

  // productos relacionados: misma categoría, distinto id
  readonly relatedProducts = computed<Product[]>(() => {
    const current = this.product();
    const list = this.products();
    if (!current || !list?.length) return [];

    return list
      .filter(p => p.category === current.category && p.id !== current.id)
      .slice(0, 6);
  });

  constructor() {
    // 1) reaccionar a cambios de /product/:id
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      const id = idParam ? Number(idParam) : null;

      if (id != null) {
        this.catalogStore.loadProductById(id);
      }
    });

    // 2) asegurar catálogo cargado para relacionados
    if (!this.products().length) {
      this.catalogStore.loadCatalogFull();
    }

    // 3) sincronizar input de cantidad con lo que haya en el carrito
    // effect(() => {
    //   const ammount = this.cartQuantity();
    //   this.amountCtrl.setValue(qty, { emitEvent: false });
    // });
  }

}
