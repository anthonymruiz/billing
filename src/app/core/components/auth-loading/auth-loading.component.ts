import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IUser } from '../../interfaces/interfaces';

@Component({
  selector: 'app-auth-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-loading.component.html',
  styleUrls: ['./auth-loading.component.scss']
})
export class AuthLoadingComponent {
  @Input() isLoading: boolean = false;
  @Input() message: string = 'Verifying your access...';
  @Input() user: IUser | null = null;
  @Input() showWelcome: boolean = false;
  @Input() showError: boolean = false;
  @Input() errorMessage: string = 'Unable to access your account';
}
