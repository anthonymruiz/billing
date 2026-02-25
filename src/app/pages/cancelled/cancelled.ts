import { Component } from '@angular/core';
import { PriceIntervalEnum } from '../../core/enums/enums';
import { SubscriptionService } from '../../core/services/subscription.service';

@Component({
  selector: 'app-cancelled',
  imports: [],
  templateUrl: './cancelled.html',
  styleUrl: './cancelled.scss',
})
export class Cancelled {
  reactivating = false;

  constructor(private subscriptionService: SubscriptionService) {}

  reactivateNow(): void {
    if (this.reactivating) {
      return;
    }

    this.reactivating = true;

    this.subscriptionService.createCheckout({ interval: PriceIntervalEnum.Month }).subscribe({
      next: (url) => {
        this.reactivating = false;
        if (url) {
          window.location.assign(url);
        }
      },
      error: () => {
        this.reactivating = false;
      }
    });
  }

}
