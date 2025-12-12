import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

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

  // signals del catálogo
  readonly products = this.catalogStore.products;
  readonly selectedProduct = this.catalogStore.selectedProduct;

  // id que viene de la ruta
  readonly productId = computed(() => {
    const param = this.route.snapshot.paramMap.get('id');
    return param ? Number(param) : null;
  });

  /**
   * Producto actual:
   * 1) intenta sacarlo del listado del catálogo
   * 2) si no está, usa selectedProduct() (lo rellenará loadProductById)
   */
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
      .slice(0, 6); // máximo 6 relacionados
  });

  constructor() {
    const id = this.productId();

    // si no está en el catálogo, lo pido por id
    if (id != null) {
      const list = this.products();
      const exists = list.some(p => p.id === id);
      if (!exists) {
        this.catalogStore.loadProductById(id);
      }
    }

    // si entras directo al detalle y el catálogo está vacío,
    // cargo el catálogo en paralelo (para la sección de relacionados)
    if (!this.products().length) {
      this.catalogStore.loadCatalogFull();
    }
  }
}
