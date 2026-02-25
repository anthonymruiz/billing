import { Routes } from '@angular/router';
import { Home } from './home';     
import { Cancel } from '../cancel/cancel';
import { Cancelled } from '../cancelled/cancelled';
import { Active } from '../active/active';
import { OrderSummary } from '../order-summary/order-summary';
import { Expired } from '../expired/expired';
import { SessionClosed } from '../session-closed/session-closed';
import { LogoutComponent } from '../../core/components/logout/logout.component';
import { authGuard } from '../../core/guards/guard';
import { ConfirmCancelation } from '../confirm-cancelation/confirm-cancelation';
import { Reactive } from '../reactive/reactive';
import { Success } from '../success/success';

export const HOME_ROUTES: Routes = [
  {
    path: '', 
    component: Home,
    canActivate: [authGuard]
  },
  {
    path: 'home',
    component: Home,
    canActivate: [authGuard]
  },
   { 
    path: 'reactive', 
    component: Reactive,
    canActivate: [authGuard]
  },  
  
  { 
    path: 'success', 
    component: Success,
    canActivate: [authGuard]
  },
   { 
    path: 'active', 
    component: Active,
    canActivate: [authGuard]
  },
  { 
    path: 'confirm', 
    component: ConfirmCancelation,
    canActivate: [authGuard]
  },  
  { 
    path: 'cancel', 
    component: Cancel,
    canActivate: [authGuard]
  }, 
  { 
    path: 'cancelled', 
    component: Cancelled,
    canActivate: [authGuard]
  }, 
  { 
    path: 'summary', 
    component: OrderSummary,
    canActivate: [authGuard]
  },  
  { 
    path: 'expired', 
    component: Expired,
    canActivate: [authGuard]
  },
  { 
    path: 'logout', 
    component: LogoutComponent
  },
  { 
    path: 'no-session', 
    component: SessionClosed
  },  
];
