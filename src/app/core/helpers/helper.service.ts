import { DOCUMENT, inject,Inject, Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, map, Observable, of, switchMap } from 'rxjs';
import Swal, { SweetAlertPosition } from 'sweetalert2';
import { ConfirmComponent } from './confirm/confirm.component'; 
import { TranslateService } from '@ngx-translate/core'; 
// import cronParser from 'cron-parser';
// import { TokenService } from '../services/tokenService';
// import { SettingsServic } from '../services/settings';
// import { UserRoleEnum } from '../enums/userRoleEnum';
export const regexExps = {
  normalString: /^[a-zA-ZÀ-ÿ0-9\s.,_-]+$/,
  onlyLetters: /^[a-zA-ZÀ-ÿ\s]+$/,
  phone: /^[+]?[\d\s-]{7,20}$/,
  number: /^\d+(\.\d+)?$/,
  email: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
  emailNoSpaces: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  number0to100: /^(100(\.0+)?|0(\.\d+)?|[1-9]?[0-9](\.\d+)?)$/
}
@Injectable({
  providedIn: 'root'
})
export class Helper {
  debounceTimer: any;
  themeObservable = new BehaviorSubject<string>(null);
  // constructor(private modalService: NgbModal, private langService: LangService) { }
  constructor(private modalService: NgbModal,   @Inject(DOCUMENT) private document: Document) { }
  isDate(value: any): boolean {
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|([+-]\d{2}:\d{2})))?$/;
    if (value instanceof Date) {
      return !isNaN(value.getTime());
    }
    if (typeof value === 'string' && isoDateRegex.test(value)) {
      const date = new Date(value);
      return date instanceof Date && !isNaN(date.getTime());
    }
    return false;
  }
  getRandom(min = 1000000, max = 9000000) {
    return Math.floor(
      Math.random() * (max - min) + min
    )
  }

  addDebounceTime(debounceTime: number): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.debounceTimer) clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(() => {
        resolve(null)
      }, debounceTime);
    })
  }
  mergeArrays(firstArray: any[], secondArray: any[]) {
    const merge = [...firstArray, ...secondArray]
    const result = [...new Set(merge.map(x => JSON.stringify(x)))]
    return result.map(x => JSON.parse(x))
  }
  error(text: string = "Something went wrong...") {
    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 3000,

      didOpen: (toast: any) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
        toast.addEventListener('click', () => {
          Swal.close();
        })
      }
    })
    
    Toast.fire({
      icon: 'error',
      title: text,
      // background: "#0c1427",
      // color: "white",
      showClass: {
        popup: 'animate__animated animate__fadeInRight error'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutRight error'
      }
    })
  }
  success(text: string = "Action executed successfully",) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 3000,

      didOpen: (toast: any) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
        toast.addEventListener('click', () => {
          Swal.close();
        })
      }
    })
 
    Toast.fire({
      icon: 'success',
      title: `${text}`,
      background: "#E6F7ED",
      showClass: {
        popup: 'animate__animated animate__fadeInUp success'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutDown success'
      },

    })
  }
  warning(text: string = "Warning") {
    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 3000,

      didOpen: (toast: any) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
        toast.addEventListener('click', () => {
          Swal.close();
        })
      }
    })
    
    Toast.fire({
      icon: 'warning',
      title: text,
      //  background: "#f8bb86",
      // color: "white",
      showClass: {
        popup: 'animate__animated animate__fadeInRight warning'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutRight warning'
      }
    })
  }


  confirm(message = "Are you sure?", text = "This action can not be reverted!", allowCheck: boolean = false, isDeleting: boolean = false, icon = ''): Observable<any> {
    return new Observable(suscriber => {
      const ref = this.modalService.open(ConfirmComponent, { backdrop: 'static', modalDialogClass: "is-confirm" });
      ref.componentInstance.title = message;
      ref.componentInstance.description = text;
      ref.componentInstance.allowCheck = allowCheck;
      ref.componentInstance.isDeleting = isDeleting;
      ref.componentInstance.icon = icon;
      ref.componentInstance.onConfirm.subscribe((result: any) => {
        suscriber.next(result)
      })
    })
  }
  // confirm(message = this.langService.currentLang.ALERT_SURE, text = this.langService.currentLang.ALERT_CONFIRM, allowCheck: boolean = false, isDeleting: boolean = false, icon: string = null): Observable<any> {
  //   return new Observable(suscriber => {
  //     const ref = this.modalService.open(ConfirmComponent, { backdrop: 'static', modalDialogClass: "is-confirm" });
  //     ref.componentInstance.title = message;
  //     ref.componentInstance.description = text;
  //     ref.componentInstance.allowCheck = allowCheck;
  //     ref.componentInstance.isDeleting = isDeleting;
  //     ref.componentInstance.icon = icon;
  //     ref.componentInstance.onConfirm.subscribe(result => {
  //       suscriber.next(result)
  //     })
  //   })
  // }
  confirmDelete(message = "Are you sure?", text = "This action can not be reverted!", allowCheck: boolean = false, icon = ''): Observable<any> {
    return this.confirm(message, text, allowCheck, true, icon)
  }
  // confirmDelete(message = this.langService.currentLang.ALERT_SURE, text = this.langService.currentLang.ALERT_ALERT, allowCheck: boolean = false, icon: string = null): Observable<any> {
  //   return this.confirm(message, text, allowCheck, true, icon)
  // }

  public validateByRegExp(value: string, regex: RegExp): boolean {
    if (!value) return false;
    return regex.test(value);
  }
  public dontAllowChars(event: KeyboardEvent, pattern: RegExp) {
    const inputChar = event.key;
    if (!pattern.test(inputChar) && event.key !== 'Backspace' && event.key !== 'Tab') {
      event.preventDefault();
    }
  }
  public allowOnlyRange(event: any, min: number, max: number) {
    const value = event.target.value + event.key;

    // Permitimos teclas especiales
    if (event.key === 'Backspace' || event.key === 'Tab') return;

    // Si no es número o punto decimal, bloqueamos
    if (!/^\d*\.?\d*$/.test(value)) {
      event.preventDefault();
      return;
    }

    // Convertimos el valor a número
    const num = parseFloat(value);

    // Validamos el rango
    if (num < min || num > max) {
      event.preventDefault();
    }
  }
  public allowOnly0ToDecimal(
  event: KeyboardEvent,
  toNumber: number = 100
) {
  const allowedKeys = [
    'Backspace',
    'Tab',
    'ArrowLeft',
    'ArrowRight',
    'Delete'
  ];

  if (allowedKeys.includes(event.key)) {
    return;
  }

  const input = event.target as HTMLInputElement;
  const key = event.key;

  // Permitir solo números y punto
  if (!/[0-9.]/.test(key)) {
    event.preventDefault();
    return;
  }

  // Evitar más de un punto
  if (key === '.' && input.value.includes('.')) {
    event.preventDefault();
    return;
  }

  // Construir el valor futuro respetando el cursor
  const selectionStart = input.selectionStart ?? input.value.length;
  const selectionEnd = input.selectionEnd ?? input.value.length;

  const futureValue =
    input.value.substring(0, selectionStart) +
    key +
    input.value.substring(selectionEnd);

  // Validar formato: número con hasta 2 decimales
  const decimalRegex = /^\d+(\.\d{0,2})?$/;

  if (!decimalRegex.test(futureValue)) {
    event.preventDefault();
    return;
  }

  const num = parseFloat(futureValue);

  if (!isNaN(num) && num > toNumber) {
    event.preventDefault();
    return;
  }
}
public allowOnly0ToNumber(event: KeyboardEvent, toNumber: number = 100) {

    if (['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(event.key))
      return;

    const input = event.target as HTMLInputElement;
    const key = event.key;
    if (!/[0-9]/.test(key)) {
      event.preventDefault();
      return;
    }
    const futureValue = input.value + key;
    if ((key === '.') && input.value.includes('.')) {
      event.preventDefault();
      return;
    }

    const num = parseFloat(futureValue);

    if (isNaN(num)) return;

    if (num > toNumber) {
      event.preventDefault();
      return;
    }
  }



  copyTextToClipboard(text: string) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      var successful = document.execCommand('copy');
      var message = successful ? "Copied" : 'Unable to copy';
      this.success(message)
    } catch (err) {
      console.error("Error", err);
    }
    document.body.removeChild(textArea);
  }
  // public hasAccess(roles: UserRoleEnum[]) {
  //   if (!roles) return true;
  //   const _role = this.tokenService.getRole();
  //   const role = UserRoleEnum[_role];
  //   if (!role) return false;
  //   return roles.includes(role);
  // }

  // get userRoles() {
  //   return UserRoleEnum;
  // }

  toggleColorPreference(theme: string) {
    this.document.body.classList.remove('theme-light', 'theme-dark');
    this.document.body.classList.add(theme);
    localStorage.setItem("themePreference", theme)
    this.themeObservable.next(theme)
  }
  // getNextPayout(): Observable<Date> {
  //   const settingsService = inject(SettingsServic);

  //   return settingsService.getSettings().pipe(
  //     map((data: any[]) => { 
  //       const frequency = data.find(x => x.key === 'PaymentsFrequency');
  //       if (!frequency?.value) {
  //         return null;
  //       } 
  //       const interval = cronParser.parse(frequency.value, {
  //         currentDate: new Date()
  //       });

  //       return interval.next().toDate();
  //     })
  //   );
  // }

}
