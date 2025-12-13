import { CommonModule } from '@angular/common';
import { Component, input, OnInit, output, signal } from '@angular/core';
import { ShortDescriptionPipe } from '../../../../shared/pipes/short-description.pipe';
import { CartItem } from '../../../../domain';
import { UPDATE_DELAY_MS } from '../../../../shared/utils/const.utils';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule, ShortDescriptionPipe],
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss']
})
export class CartItemComponent {

  // incrementSingal = signal<number>(0);
  // decrementSignal = signal<number>(0);

  readonly updatingQuantity = signal(false);
  readonly quantityProductSelected = signal(0);

  //** INPUTS */
  item = input<CartItem>();

  /** OUTPUTS */
  readonly deleteItemFromCart = output<number>();
  readonly updateItemFromCart = output<{ productId: number; quantity: number }>();

  increaseCount() {
    const item = this.item();
    if (!this.updatingQuantity() && item) {
      this.updatingQuantity.set(true);
      this.quantityProductSelected.set(item.quantity);
      const next = this.quantityProductSelected() + 1;
      this.quantityProductSelected.set(next);
      this.updateItemFromCart.emit({
        productId: item.productId,
        quantity: next,
      });
      setTimeout(() => {
        this.updatingQuantity.set(false);
      }, UPDATE_DELAY_MS);
    };
  }

  decreaseCount() {
    const item = this.item();
    if (!this.updatingQuantity() && item) {
      this.updatingQuantity.set(true);
      this.quantityProductSelected.set(item.quantity);
      const next = this.quantityProductSelected() > 1 ? this.quantityProductSelected() - 1 : 1;
      this.quantityProductSelected.set(next);
      this.updateItemFromCart.emit({
        productId: item.productId,
        quantity: next,
      });
      setTimeout(() => {
        this.updatingQuantity.set(false);
      }, UPDATE_DELAY_MS);
    };
    // const item = this.item();
    // if (!item) return;

    // const newQuantity = item.quantity > 1 ? item.quantity - 1 : 1;

    // this.updateItemFromCart.emit({
    //   productId: item.productId,
    //   quantity: newQuantity,
    // });
  }


  onDelete(idProduct: number) {
    this.deleteItemFromCart.emit(idProduct);
  }

}
