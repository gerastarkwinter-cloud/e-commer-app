import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { CartStore, CatalogStore } from "../../../../application";
import { ANotificationService } from "../../../../domain";
import { ActivatedRoute, Router } from "@angular/router";
import { UPDATE_DELAY_MS } from "../../../../shared/utils/const.utils";

@Component({
    selector: 'app-cart-checkout',
    templateUrl: './cart-check-out.component.html',
    standalone: true,
    imports: [CommonModule]
})
export class CartCheckOutComponent {
    private readonly cartStore = inject(CartStore);
    private readonly catalogStore = inject(CatalogStore);
    private readonly notification = inject(ANotificationService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    readonly selectedProduct = this.catalogStore.selectedProduct;
    readonly cartId = this.cartStore.id;

    readonly isPaying = signal(false);

    payout() {
        if (this.isPaying()) return;

        this.isPaying.set(true);

        requestAnimationFrame(() => {
            setTimeout(() => {
                this.notification.success(
                    'Pago confirmado. Gracias por tu compra. Tu pedido fue registrado correctamente y comenzará a procesarse ahora.'
                );

                this.cartStore.deleteCart(this.cartId() as number);

                const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
                this.router.navigateByUrl(returnUrl ?? '/catalog')
                    .finally(() => this.isPaying.set(false));
            }, UPDATE_DELAY_MS);
        });
    }
}
