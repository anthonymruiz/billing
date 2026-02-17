import { inject } from '@angular/core';
import { HttpRequest, HttpErrorResponse, HttpHandlerFn } from '@angular/common/http';   
import { catchError, throwError } from 'rxjs';
// import { AuthService } from '../services/authService';
// import { TokenService } from '../services/tokenService';
import { environment } from '../../../environments/environment.development';
 
export function tokenInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  // const tokenService = inject(TokenService);  
  // const token = tokenService.getToken();
  const token = ""
  const currentLanguage = localStorage.getItem('lang');

  let newReq = req;

  if (token && !checkExclude(req)) {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      Lang: currentLanguage ?? 'en'
    };
 

    newReq = req.clone({ setHeaders: headers });
  }

  return next(newReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const isChannelPartnerApi =
        req.url.startsWith(environment.SERVER);
        //TODO: delete the error 500 validation on production
      if (
        isChannelPartnerApi &&
        (error.status === 401 || error.status === 403)
      ) {  
        // tokenService.logOut();   
      }

      return throwError(() => error);
    })
  );
}
function checkExclude(req: HttpRequest<unknown>){ 
 var excludesArr: string[] = [];  
 return excludesArr.some(ex => req.url.includes(ex)); 
}

 
