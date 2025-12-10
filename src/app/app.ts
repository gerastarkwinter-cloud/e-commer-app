import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CatalogStore } from './application/state/catalog/catalog.store';
@Component({
  selector: 'app-root',
  imports: [],
  providers: [CatalogStore],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('e-commerce-app');
  protected readonly catalogStore = inject(CatalogStore);

  public readonly $products = this.catalogStore.products;

  constructor() {
    console.log('🫸 :', this.catalogStore.loading());
    console.log('🫸Total :', this.catalogStore.totalProducts());

    // Effects
    effect(() => {
      // console.log('Efecto - Loading State:', this.catalogStore.loading());
      // console.log('🛒 Productos :', this.catalogStore.products());
      if (this.catalogStore.prodcutGroupBycategory().length > 0) {
        // console.log('Estado: ', this.catalogStore)
        // console.log('🫸 Categorías :', this.catalogStore.prodcutGroupBycategory());
        // console.log('🫸 Total Categorías :', this.catalogStore.categories().length);
        console.log('🫸 Categorías Detectadas :', this.catalogStore.categories());
      }
    });
  }
  ngOnInit(): void {
    // console.log('Productos cargados en OnInit:', this.$products());
    // this.catalogStore.get();
  }
}
