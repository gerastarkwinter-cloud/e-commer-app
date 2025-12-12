import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartStore, CatalogStore } from '../../../../application';
import { Product } from '../../../../domain';



@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-detail-page.component.html',
})
export class ProductDetailPageComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly catalogStore = inject(CatalogStore);
  private readonly cartStore = inject(CartStore);
  private readonly fb = inject(FormBuilder);

  // id del producto desde la ruta
  readonly productId = computed(() => {
    const idParam = this.route.snapshot.paramMap.get('id');
    return idParam ? Number(idParam) : null;
  });

  // catálogo ya cargado en memoria
  readonly products = this.catalogStore.products;

  // producto actual (o null si aún no está)
  readonly product = computed<Product | null>(() => {
    const id = this.productId();
    const list = this.products();
    if (id == null || !list?.length) return null;
    return list.find(p => p.id === id) ?? null;
  });

  // form cantidad
  readonly form = this.fb.nonNullable.group({
    amount: [1, [Validators.required, Validators.min(1)]],
  });

  private get amountCtrl() {
    return this.form.controls.amount;
  }

  constructor() {
    // por si llegas directo al detalle sin pasar por catálogo
    this.catalogStore.loadCatalogFull();
  }

  increaseCount() {
    const current = this.amountCtrl.value;
    this.amountCtrl.setValue(current + 1);
  }

  decreaseCount() {
    const current = this.amountCtrl.value;
    this.amountCtrl.setValue(current > 1 ? current - 1 : 1);
  }

  onAdd() {
    const p = this.product();
    if (!p || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const quantity = this.amountCtrl.value;
    const userId = 1; // TODO userStore cuando exista

    const cartInput = {
      id: this.cartStore.id(),          // null si aún no hay carrito
      userId,
      items: [{ productId: p.id, quantity }],
    };

    if (cartInput.id) {
      this.cartStore.addItemToCart(cartInput);
    } else {
      this.cartStore.saveCart(cartInput);
    }
  }
}
