import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { StateEnum } from '../interfaces/interfaces';
import { SubscriptionService } from '../services/subscription.service';
import { catchError, forkJoin, map, of } from 'rxjs';
  
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const subscriptionService = inject(SubscriptionService);
  const router = inject(Router);

  // Check if there's a token in query params (being processed)
  const hasTokenInUrl = route.queryParams['key'];
  
  if (hasTokenInUrl && !authService.isAuthenticated()) {
    return true;
  }

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/no-session']);
  }

  const currentUser = authService.currentUserValue;
  if (!currentUser?.token) {
    return router.createUrlTree(['/no-session']);
  }

  return forkJoin({
    subcriptionState: subscriptionService.getSubcriptionState(currentUser.token).pipe(
      catchError(() => of(null))
    ),
    subscription: subscriptionService.getSubscription().pipe(
      catchError(() => of(null))
    )
  }).pipe(
    map(({ subcriptionState }) => {
      if (subcriptionState) {
        authService.updateSubscriptionState(subcriptionState);
      }

      const effectiveState = subcriptionState?.State ?? authService.currentUserValue?.subcriptionState?.State;
      const targetRoute = effectiveState == StateEnum.new
        ? '/active'
        : effectiveState === StateEnum.inactive
          ? '/reactive'
          : '/home';

      const requestedRoute = state.url.split('?')[0] || '/';
      const guardedRoutes = new Set(['/', '/home', '/active', '/reactive']);

      if (guardedRoutes.has(requestedRoute) && requestedRoute !== targetRoute) {
        return router.createUrlTree([targetRoute]);
      }

      return true;
    })
  );
};

 
