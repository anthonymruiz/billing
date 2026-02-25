import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { IUser } from '../../core/interfaces/interfaces';
import { CommonModule } from '@angular/common';
import { SubscriptionService } from '../../core/services/subscription.service';
import Swal from 'sweetalert2';

interface IServiceStatusItem {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  user: IUser | null = null;
  managingSubscription = false;

  readonly services: IServiceStatusItem[] = [
    {
      icon: 'mail',
      title: 'Business Email Service',
      description: 'Professional, secure, and reliable communication for your organization.'
    },
    {
      icon: 'chat',
      title: 'Secure Business Chat',
      description: 'Real-time messaging with enterprise-level security.'
    },
    {
      icon: 'call',
      title: 'Advanced Call Solutions',
      description: 'Scalable voice solutions for customer engagement and business operations.'
    },
    {
      icon: 'account_balance_wallet',
      title: 'TripleEnable Identity Wallet',
      description: 'Advanced multi-layer authentication and intelligent security activation.'
    },
    {
      icon: 'verified_user',
      title: 'TripleValidate Identity Shield',
      description: 'Secure identity and data verification system to reduce fraud risk.'
    },
    {
      icon: 'language',
      title: 'Premium Web Domain',
      description: 'Professional domain registration and management for your digital presence.'
    }
  ];

  constructor(
    private authService: AuthService,
    private subscriptionService: SubscriptionService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;
  }

  get userName(): string {
    return this.authService.currentUserValue?.name || 'User';
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

  get userEmail(): string {
    return this.authService.currentUserValue?.email || '';
  }

  get userHandle(): string {
    const fromUserName = this.authService.currentUserValue?.userName;
    if (fromUserName && fromUserName.trim()) {
      return `@${fromUserName.replace('@', '').trim()}`;
    }

    const emailPrefix = this.userEmail.split('@')[0] || 'user';
    return `@${emailPrefix}`;
  }

  get userPhoto(): string {
    return this.authService.currentUserValue?.photo || 'https://i0.wp.com/codigoespagueti.com/wp-content/uploads/2024/01/pokemon-pikachu-no-evoluciono.jpg';
  }

  get subscriptionLabel(): string {
    const state = this.authService.currentUserValue?.subcriptionState?.State;
    if (!state) {
      return 'Pending';
    }

    return state;
  }

  get isActiveSubscription(): boolean {
    return this.subscriptionLabel.toLowerCase() === 'active';
  }

  get activatedDateText(): string {
    const subscription = this.subscriptionService.currentSubscriptionState as any;
    const value = subscription?.currentPeriodStart ?? subscription?.CurrentPeriodStart;
    return this.formatSubscriptionDate(value);
  }

  get renewalDateText(): string {
    const subscription = this.subscriptionService.currentSubscriptionState as any;
    const value = subscription?.currentPeriodEnd ?? subscription?.CurrentPeriodEnd;
    return this.formatSubscriptionDate(value);
  }

  get isAutoRenewDisabled(): boolean {
    const subscription = this.subscriptionService.currentSubscriptionState as any;
    const autoRenew = subscription?.autoRenew ?? subscription?.AutoRenew;
    return autoRenew === false;
  }

  get renewalLabelText(): string {
    return this.isAutoRenewDisabled ? 'Will be paused on:' : 'Next renewal';
  }

  private formatSubscriptionDate(value: string | null | undefined): string {
    if (!value) {
      return '-';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '-';
    }

    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  }

  copyText(value: string): void {
    if (!value) {
      return;
    }

    navigator.clipboard?.writeText(value).then(() => {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Copied to clipboard',
        showConfirmButton: false,
        timer: 1800,
        timerProgressBar: true,
        background: '#111827',
        color: '#f3f4f6',
        iconColor: '#10b981'
      });
    }).catch(() => {
      Swal.fire({
        icon: 'error',
        title: 'Copy failed',
        text: 'Unable to copy this value right now.',
        background: '#111827',
        color: '#f3f4f6',
        confirmButtonColor: '#374151'
      });
    });
  }

  manageSubscription(): void {
    if (this.managingSubscription) {
      return;
    }

    this.managingSubscription = true;

    this.subscriptionService.manageSubscription().subscribe(url => {
      this.managingSubscription = false;
      if (url) {
        window.location.assign(url);
      }
    }, err => {
      this.managingSubscription = false;
    }) 
  }
}
