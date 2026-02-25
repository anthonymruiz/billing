import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { IUser } from '../../core/interfaces/interfaces';
import { FormsModule } from '@angular/forms';
import {  SubscriptionService } from '../../core/services/subscription.service';
import { PriceIntervalEnum } from '../../core/enums/enums';

@Component({
  selector: 'app-reactive',
  imports: [CommonModule, FormsModule],
  templateUrl: './reactive.html',
  styleUrl: './reactive.scss',
})
export class Reactive {
   reactivating = false;

  readonly services = [
    'Business Email Pro',
    'SecureChat Enterprise',
    'Advanced Call Solutions',
    'TripleEnable Security Suite',
    'TripleValidate Identity Shield',
    'Premium Web Domain Services'
  ];

  constructor(
    private authService: AuthService,
    private subscriptionService: SubscriptionService
  ) {}

  get userName(): string {
    return this.authService.currentUserValue?.name || 'User';
  }

  get userPhoto(): string { 
    return this.authService.currentUserValue?.photo || 'https://i0.wp.com/codigoespagueti.com/wp-content/uploads/2024/01/pokemon-pikachu-no-evoluciono.jpg';
  }

  reactivateAccount(): void {
    if (this.reactivating) {
      return;
    }

    this.reactivating = true;
    this.subscriptionService.createCheckout({ interval: PriceIntervalEnum.Month }).subscribe(url => {
      this.reactivating = false;
      window.location.href = url;  
    }, err=> {
      this.reactivating = false;
    })
  }
}
