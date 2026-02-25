import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { Footer } from './footer/footer';
import { AuthService } from '../../core/services/auth.service';
import { AuthLoadingComponent } from '../../core/components/auth-loading/auth-loading.component';
import { SubscriptionService } from '../../core/services/subscription.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { IUser, StateEnum } from '../../core/interfaces/interfaces';

@Component({
  selector: 'app-home-layout',
  imports: [RouterOutlet, CommonModule, Navbar, Footer, AuthLoadingComponent],
  templateUrl: './home-layout.html',
  styleUrl: './home-layout.scss',
})
export class HomeLayout implements OnInit, OnDestroy {
  isExchangingToken: boolean = false;
  showWelcome: boolean = false;
  showError: boolean = false;
  currentUser: IUser | null = null;
  errorMessage: string = 'Unable to access your account';
  private countdownSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private subscriptionService: SubscriptionService
  ) {}

  ngOnInit(): void { 
    this.authService.validateToken(); 
    this.loadSubscriptionIfAuthenticated();

    this.countdownSubscription = this.authService.sessionCountdown$.subscribe((remaining) => {
      if (remaining === null) {
        this.showError = false;
        this.errorMessage = 'Unable to access your account';
        return;
      }
      this.showError = true;
      this.errorMessage = 'Sesion expirada.';
    });
 
    this.route.queryParams.subscribe(params => {
      const token = params['key']; 
      if (token && !this.authService.isAuthenticated()) {
        this.isExchangingToken = true; 
        this.authService.exchangeToken(token).subscribe(
          (user) => {
            if (user) {
              console.log('Token exchange successful:', user);
              this.currentUser = user;
              this.isExchangingToken = false;
              this.showWelcome = true;
              
              // Remove token from URL
              this.router.navigate([], {
                relativeTo: this.route,
                queryParams: {},
                replaceUrl: true
              });
              
              // Redirect based on subscription state  
              setTimeout(() => {
                this.showWelcome = false;
                const state = user.subcriptionState?.State;
                const targetRoute = state == StateEnum.new ? '/active' : state === StateEnum.inactive ? '/reactive' : '/home'
                this.router.navigate([targetRoute]); 
              }, 2000); 
            } else {
              console.error('Token exchange failed');
              this.isExchangingToken = false;
              this.showError = true;
              this.errorMessage = 'Invalid authentication token.';
            }
          },
          (error) => {
            console.error('Token exchange error:', error);
            this.isExchangingToken = false;
            this.showError = true;
            this.errorMessage = 'An error occurred during authentication.';
          }
        );
      } else if (!token && !this.authService.isAuthenticated()) { 
        this.isExchangingToken = false;
        this.showError = true;
        this.errorMessage = 'No authentication key provided.';
      } else {
        this.isExchangingToken = false;
      }
    });
  }

  private loadSubscriptionIfAuthenticated(): void {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser || !this.authService.validateToken()) {
      return;
    }

    this.subscriptionService.getSubscription().subscribe({
      next: () => {},
      error: () => {}
    });

    this.subscriptionService.getSubcriptionState(currentUser.token).subscribe({
      next: (subcriptionState) => {
        this.authService.updateSubscriptionState(subcriptionState);
      },
      error: () => {}
    });
  }

  ngOnDestroy(): void {
    this.countdownSubscription?.unsubscribe();
  }
}
