import { CommonModule } from '@angular/common';
import { Component, input, output, signal, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cart, Product } from '../../../../domain';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
})
export class ProductItemComponent {

  // 1) El producto que pinta la card
  readonly product = input.required<Product>();

  // 2) Evento producto cantidad inicial.
  //    (el cart lo construye la page, no la card)
  readonly addToCart = output<Cart>();
  // 2.1) Evento hacia arriba: producto + cantidad
  readonly updateToCart = output<Cart>();
  // 2.1) Evento hacia arriba: producto + cantidad
  readonly deleteToCart = output<number>();

  // 3) Estado local de UI: ¿esta card ya está en el carrito?
  readonly inCart = signal(false);

  // 4) Formulario reactivo tipado
  private readonly fb = inject(FormBuilder);

  readonly formItem = this.fb.nonNullable.group({
    amount: [1, [Validators.required, Validators.min(1)]],
  });

  // GET cómodo para no repetir controles['amount']
  private get amountCtrl() {
    return this.formItem.controls.amount;
  }

  // ---- Acciones de la UI ----

  increaseCount() {
    const current = this.amountCtrl.value;
    this.amountCtrl.setValue(current + 1);
  }

  decreaseCount() {
    const current = this.amountCtrl.value;
    this.amountCtrl.setValue(current > 1 ? current - 1 : 1);
  }

  onAdd() {
    if (this.formItem.invalid) {
      this.formItem.markAllAsTouched();
      return;
    }

    const quantity = this.amountCtrl.value;
    const productId = this.product().id; // <- USAR el id real
    const userId = 1; // TODO: Temporal, se usara cuando entre userStore.

    this.addToCart.emit({ items: [{ productId, quantity }], userId, id: null });
    this.inCart.set(true);
  }

  onUpdateAmount() {
    if (this.formItem.invalid) {
      this.formItem.markAllAsTouched();
      return;
    }

    const quantity = this.amountCtrl.value;
    const productId = this.product().id;
    const userId = 1; // TODO: Temporal, se usara cuando entre userStore.

    // Aqui es el evento de actualizar.
    this.updateToCart.emit({ items: [{ productId, quantity }], userId, id: null });
    // sigue en carrito, solo cambia cantidad
  }

  onCancel(idProduct: number) {
    console.log('idProduct: ', idProduct);
    // return
    this.inCart.set(false);
    this.amountCtrl.setValue(1);
    // Agregar el evento de eliminar
    this.deleteToCart.emit(idProduct)
  }
}
