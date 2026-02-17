import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
navItems = [
    { label: 'Home', route: '/', icon: 'feather icon-home' },
    { label: 'Billing', route: '/billing', icon: 'feather icon-list' },
    { label: 'Subscriptions', route: '/subscriptions', icon: 'feather icon-list' },
    { label: 'Payments', route: '/payments', icon: 'feather icon-bar-chart-2' }
  ];
  constructor(private router: Router) {}
  logout(){

  }
  
 
}
