import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
// import { LangService } from '../../../core/language/lang.service';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss'
})
export class ConfirmComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() isDeleting: boolean = false;
  @Input() allowCheck: boolean = false;
  @Input() icon: string = '';
  @Output() onConfirm = new EventEmitter();
  check: boolean = false;
  theme = localStorage.getItem("themePreference")
  constructor(private modal: NgbActiveModal) { }
  // constructor(private modal: NgbActiveModal, public langService: LangService) { }

  ngOnInit(): void {
  } 

  getMaterialIcon(): string {
    if (this.icon) {
      const normalized = this.icon.replace('icon-', '').replace(/-/g, '_').toLowerCase();
      const mapping: Record<string, string> = {
        trash: 'delete',
        check: 'check',
        x: 'close',
        log_out: 'logout',
        alert_triangle: 'warning'
      };

      return mapping[normalized] ?? normalized;
    }

    return this.isDeleting ? 'delete' : 'check';
  }

  close(isConfirmed: boolean = false){
      this.onConfirm.emit({isConfirmed: isConfirmed})
      this.modal.close();
  }
}
