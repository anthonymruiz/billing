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
  close(isConfirmed: boolean = false){
      this.onConfirm.emit({isConfirmed: isConfirmed})
      this.modal.close();
  }
}
