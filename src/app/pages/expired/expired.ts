import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expired',
  imports: [CommonModule],
  templateUrl: './expired.html',
  styleUrl: './expired.scss',
})
export class Expired { 
@Output() loginAgain = new EventEmitter<void>();

  constructor(private router: Router) {}

  onLoginAgain(): void {
    this.loginAgain.emit();
    this.router.navigate(['/login']);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  contactSupport(): void {
    this.router.navigate(['/support']);
  }
}
