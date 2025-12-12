import { CommonModule } from '@angular/common';
import { Component, input, output, signal, inject, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cart, CartItem, Product } from '../../../../domain';
import { ShortDescriptionPipe } from '../../../pipes/short-description.pipe';

@Component({
  selector: 'app-product-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, ShortDescriptionPipe],
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
})
export class ProductItemComponent {

  /** INPUTS */
  readonly product = input.required<Product>();
  readonly isHaveItems = input<boolean>(false);

  /** OUTPUTS */
  readonly addToCart = output<{ productId: number, quantity: number }>();
  readonly updateToCart = output<{ productId: number, quantity: number }>();
  readonly deleteToCart = output<number>();

  readonly inCart = signal(false);
  private readonly fb = inject(FormBuilder);

  readonly formItem = this.fb.nonNullable.group({
    amount: [1, [Validators.required, Validators.min(1)]],
  });

  private get amountCtrl() {
    return this.formItem.controls.amount;
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
    if (this.formItem.invalid) {
      this.formItem.markAllAsTouched();
      return;
    }

    const quantity = this.amountCtrl.value;
    const productId = this.product().id; // <- USAR el id real

    this.addToCart.emit({ productId, quantity });
    this.inCart.set(true);
  }

  onUpdateAmount() {
    if (this.formItem.invalid) {
      this.formItem.markAllAsTouched();
      return;
    }

    const quantity = this.amountCtrl.value;
    const productId = this.product().id;

    this.updateToCart.emit({ productId, quantity });
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
