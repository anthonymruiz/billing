import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { AuthService } from './auth.service';
import { ICouponRequestDto, ICheckoutRequest, ISubscriptionState, ISubscriptionViewDto, IToken } from '../interfaces/interfaces';
 
@Injectable({
    providedIn: 'root'
})
export class SubscriptionService {
    private readonly subscriptionStorageKey = 'subscription';
    private subscriptionStateSubject = new BehaviorSubject<ISubscriptionViewDto | null>(null);
    public subscriptionState$ = this.subscriptionStateSubject.asObservable();

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) {
        const storedSubscription = this.getSubscriptionFromStorage();
        if (storedSubscription) {
            this.subscriptionStateSubject.next(storedSubscription);
        }
    }

    get currentSubscriptionState(): ISubscriptionViewDto | null {
        const currentState = this.subscriptionStateSubject.value;
        if (currentState) {
            return currentState;
        }

        const storedSubscription = this.getSubscriptionFromStorage();
        if (storedSubscription) {
            this.subscriptionStateSubject.next(storedSubscription);
        }

        return storedSubscription;
    }

    private getSubscriptionFromStorage(): ISubscriptionViewDto | null {
        const raw = localStorage.getItem(this.subscriptionStorageKey);
        if (!raw) {
            return null;
        }

        try {
            return JSON.parse(raw) as ISubscriptionViewDto;
        } catch {
            localStorage.removeItem(this.subscriptionStorageKey);
            return null;
        }
    }

    private setSubscriptionState(subscription: ISubscriptionViewDto | null): void {
        this.subscriptionStateSubject.next(subscription);

        if (subscription) {
            localStorage.setItem(this.subscriptionStorageKey, JSON.stringify(subscription));
            return;
        }

        localStorage.removeItem(this.subscriptionStorageKey);
    }

   

   



    //   getSubscription(): Observable<ISubscriptionViewDto | null> {
    //     const token = this.authService.currentUserValue?.token?.access_Token;
    //     let headers = new HttpHeaders().set('ngrok-skip-browser-warning', 'true');

    //     if (token) {
    //       const authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    //       headers = headers.set('Authorization', authorization);
    //     }

    //     return this.http.get<ISubscriptionViewDto>(`${environment.TRIPLEENABLE}/api/subscription`, {
    //       headers,
    //       observe: 'response'
    //     }).pipe(
    //       map((response) => response.status === 204 ? null : response.body),
    //       tap((subscription) => {
    //         debugger
    //         this.subscriptionStateSubject.next(subscription ?? null);
    //       })
    //     );
    //   }
    getSubcriptionState(token: IToken): Observable<ISubscriptionState> {
        const headers = new HttpHeaders()
            .set('Authorization', `${token.access_Token}`)
            .set('ngrok-skip-browser-warning', 'true');
        return this.http.get<ISubscriptionState>(`${environment.TRIPLEENABLE}/Subscription/dashboard/state`, { headers });
    }
    getSubscription(): Observable<ISubscriptionViewDto> {
        const token = this.authService.currentUserValue?.token?.access_Token;
        const headers = new HttpHeaders()
            .set('Authorization', `${token}`)
            .set('ngrok-skip-browser-warning', 'true');

        return this.http.get<ISubscriptionViewDto>(`${environment.TRIPLEENABLE}/subscription`, { headers })
            .pipe(
                tap((subscription) => {
                    this.setSubscriptionState(subscription ?? null);
                })
            );
    }
    createCheckout(request: ICheckoutRequest): Observable<string> {
        const token = this.authService.currentUserValue?.token?.access_Token;
        let headers = new HttpHeaders().set('ngrok-skip-browser-warning', 'true');

        if (token) {
            headers = headers.set('Authorization', token);
        }

        let params = new HttpParams().set('interval', String(request.interval));
        if (request.referredCode) {
            params = params.set('referredCode', request.referredCode);
        }

        return this.http.post(`${environment.TRIPLEENABLE}/subscription/checkout`, null, {
            headers,
            params,
            responseType: 'text'
        });
    } 

    validateCode(code: string): Observable<ICouponRequestDto> {
        const normalizedCode = code.trim();
        if (!normalizedCode) {
            return of(null);
        }

        const headers = new HttpHeaders()
            .set('X-Api-Key', environment.CHANNEL_PARTNER_API_KEY);

        return this.http.get<ICouponRequestDto>(`${environment.CHANNEL_PARTNER_API}/referredcodes/coupons/validate/${normalizedCode}`, { headers })
           
    }

      manageSubscription(): Observable<string> {
        const token = this.authService.currentUserValue?.token?.access_Token;
        let headers = new HttpHeaders().set('ngrok-skip-browser-warning', 'true');

        if (token) {
            headers = headers.set('Authorization', token);
        }

        return this.http.post(`${environment.TRIPLEENABLE}/subscription/portal`, {}, {
            headers,
            responseType: 'text'
        });
    } 
}
