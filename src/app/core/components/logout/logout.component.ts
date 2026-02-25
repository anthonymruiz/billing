import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
  isLoggingOut: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.performLogout();
  }

  performLogout(): void {
    this.isLoggingOut = true;
    
    // Small delay to show logout UI
    setTimeout(() => {
      this.authService.logout();
      this.router.navigate(['/session-closed']);
    }, 3000);
  }

  cancel(): void {
    this.router.navigate(['/']);
  }
}
