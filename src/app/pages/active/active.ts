import { Component, OnInit } from '@angular/core';
import { ICouponRequestDto, IUser } from '../../core/interfaces/interfaces';
import { SubscriptionService } from '../../core/services/subscription.service';
import { AuthService } from '../../core/services/auth.service';
import { PriceIntervalEnum } from '../../core/enums/enums';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-active',
  imports: [CommonModule, FormsModule],
  templateUrl: './active.html',
  styleUrl: './active.scss',
})
export class Active implements OnInit {
  user: IUser | null = null;
  code = '';
  applyingCode = false;
  activating = false;
  coupon: ICouponRequestDto;
  hasCouponValidationAttempted = false;

  constructor(
    public authService: AuthService,
    private subscriptionService: SubscriptionService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;
  }

  get userName(): string {
    return this.authService.currentUserValue?.name || 'User';
  }

  get userPhoto(): string {
    return this.user?.photo || 'https://i0.wp.com/codigoespagueti.com/wp-content/uploads/2024/01/pokemon-pikachu-no-evoluciono.jpg';
  }

  get userEmail(): string {
    return this.authService.currentUserValue?.email || '';
  }

  get fullName(): string {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      return 'User';
    }

    return currentUser.lastName
      ? `${currentUser.name} ${currentUser.lastName}`
      : currentUser.name || 'User';
  }

  get showInvalidCouponMessage(): boolean {
    if (!this.hasCouponValidationAttempted || this.applyingCode) {
      return false;
    }

    return !this.coupon || this.coupon.hasExpired;
  }
  apply(){
     this.coupon = {
      code: this.code,
      expiresAt: new Date().toISOString(),
      hasExpired: false,
      couponDiscount: '50% OFF'
     }
  }
  applyCode(): void {
    const normalizedCode = this.code.trim();
    this.code = normalizedCode;

    if (!normalizedCode) {
      this.hasCouponValidationAttempted = true;
      this.coupon = null;
      return;
    }

    this.applyingCode = true;
    this.hasCouponValidationAttempted = true;

    this.subscriptionService.validateCode(normalizedCode).subscribe((coupon: ICouponRequestDto) => {
      this.coupon = coupon;
      if (coupon?.code) {
        // coupon.code = 'CP-0A5Z76';
        this.code = coupon.code;
      }
      this.applyingCode = false;
    }, err => {
      this.coupon = null;
      this.applyingCode = false;
    })
  }

  activateAccount(): void {
    if (this.activating) {
      return;
    }

    this.activating = true;
    const payload = {
      interval: PriceIntervalEnum.Month,
      referredCode: this.coupon && !this.coupon.hasExpired ? this.code : undefined
    };

    this.subscriptionService.createCheckout(payload).subscribe(url => {
      this.activating = false;
      window.location.href = url;
    }, err => {
      this.activating = false;
    })

  }
}

