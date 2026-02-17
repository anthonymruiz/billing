import { Routes } from '@angular/router';
import { Home } from './home';  
import { Billing } from '../pages/billing/billing';  
import { Inactive } from '../pages/inactive/inactive'; 
import { Cancel } from '../pages/cancel/cancel';
import { Cancelled } from '../pages/cancelled/cancelled';
import { Active } from '../pages/active/active';
import { OrderSummary } from '../pages/order-summary/order-summary';

export const HOME_ROUTES: Routes = [
  {
    path: '', 
    component: Home
  },
 
  { path: 'billing', component: Billing },  
  { path: 'inactive', component: Inactive }, 
  { path: 'active', component: Active },  
  { path: 'cancel', component: Cancel }, 
  { path: 'canceled', component: Cancelled }, 
  { path: 'summary', component: OrderSummary },  
];
