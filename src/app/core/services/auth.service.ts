import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { ISubscriptionState, IToken, ITripleenableUser, IUser } from '../interfaces/interfaces'; 
import { SubscriptionService } from './subscription.service';
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject: BehaviorSubject<IUser | null>;
    public currentUser$: Observable<IUser | null>;
    private tokenExpiryTimeoutId: number | null = null;
    private countdownIntervalId: number | null = null;
    private sessionCountdownSubject = new BehaviorSubject<number | null>(null);
    public sessionCountdown$ = this.sessionCountdownSubject.asObservable();

    constructor(private http: HttpClient, private router: Router, private injector: Injector) {
        const savedUser = localStorage.getItem('currentUser');
        const user = savedUser ? JSON.parse(savedUser) : null;
        this.currentUserSubject = new BehaviorSubject<IUser | null>(user);
        this.currentUser$ = this.currentUserSubject.asObservable();
        this.scheduleTokenExpiry(user);
    }

    private get subscriptionService(): SubscriptionService {
        return this.injector.get(SubscriptionService);
    }


    public get currentUserValue(): IUser | null {
        return this.currentUserSubject.value;
    }

    public isAuthenticated(): boolean {
        const isAuth = this.currentUserValue !== null;
        if (isAuth) {
            return this.validateToken();
        }
        return isAuth;
    }

    public validateToken(): boolean {
        const user = this.currentUserValue; 
        
        if (!user || !user.token) {
            return false;
        } 
        const now = Date.now();
        const tokenExpirationMs = user.token.expires_In_UTC
            ? new Date(user.token.expires_In_UTC).getTime()
            : now; 
        if (now > tokenExpirationMs) {
            console.log('Token has expired, removing from storage');
            this.logout();
            return false;
        } 
        return true;
    } 
 
    exchangeToken(key: string): Observable<IUser> {   
        return this.exchange(key).pipe(switchMap((token: IToken) => { 
            // token.access_Token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2FwaS50cmlwbGVjeWJlci5jb20iLCJzdWIiOiJkb25mYXV0b0BUcmlwbGVFbmFibGVWZXJpZmllZC5jb20iLCJuYW1lIjoiRmF1c3RvIE1hcnTDrW5leiIsImdpdmVuX25hbWUiOiJGYXVzdG8iLCJmYW1pbHlfbmFtZSI6Ik1hcnTDrW5leiIsImVtYWlsIjoiRE9ORkFVVE9AVFJJUExFRU5BQkxFVkVSSUZJRUQuQ09NIiwiYXVkIjpbIiIsImh0dHBzOi8vYXBpLnRyaXBsZWN5YmVyLmNvbSJdLCJqdGkiOiI5YTg1YWY3Ni00Yzk3LTQ5NDEtOGI2Mi04OTVlODY1OGE1NzYiLCJuYW1laWQiOiIxNTUiLCJyb2xlcyI6WyJBbm9ueW1vdXMiLCJQcml2YXRlIl0sImVtYWlsX3ZlcmlmaWVkIjoiVHJ1ZSIsIm5vbmNlIjoiIiwibmJmIjoxNzcxODY2ODc2LCJleHAiOjE3NzQ0NTg4NzYsImlhdCI6MTc3MTg2Njg3Nn0.yVJoMC6XRUiSObZCnDLmhKy_bgTejfBdivgRepn0YiU'
                return this.getProfile(token).pipe(switchMap((profile: ITripleenableUser) => { 
                        return this.subscriptionService.getSubcriptionState(token).pipe(
                            map((subcriptionState: ISubscriptionState) => {  
                                subcriptionState.CustomerId = 'cus_TQLwx8dVKSGQUc'
                                return this.getUser(profile, token, subcriptionState);
                            }),
                            switchMap((user: IUser) =>
                                this.subscriptionService.getSubscription().pipe(
                                    map(() => user),
                                    catchError(() => of(user))
                                )
                            )
                        );
                    })
                );
            }))
    }
     public getCurrentCustomerId(): string | null {
        return this.currentUserValue?.subcriptionState?.CustomerId ?? null;
    }

    public updateSubscriptionState(subcriptionState: ISubscriptionState): void {
        const currentUser = this.currentUserValue;
        if (!currentUser) {
            return;
        }

        const updatedUser: IUser = {
            ...currentUser,
            subcriptionState
        };

        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        this.currentUserSubject.next(updatedUser);
    }

    private exchange(key: string): Observable<IToken> {
        const payload = {
            key: key,
            client_Id: environment.CLIENT_ID
        }; 
        return this.http.post<IToken>(`${environment.OAUTH}/JwtToken/v1/Redeem24Key`, payload);
    }
    private getUser(profile: ITripleenableUser, token: IToken, subcriptionState?: ISubscriptionState): IUser {  
        
        const user: IUser = {
            email: profile?.Email[0],
            userName: profile?.UserName,
            name: profile?.FirstName,
            photo: profile?.Photo ? 'data:image/jpeg;base64,' + profile?.Photo : 'https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png?fit=500%2C500&ssl=1',
            lastName: profile?.LastName,
            token: token, 
            subcriptionState: subcriptionState
        };  
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        this.scheduleTokenExpiry(user);
        return user;
    }

  
   //TODO cambiar endpoint  -> AppUser
    private getProfile(token: IToken): Observable<ITripleenableUser> {
        const decoded = this.decodeToken(token.access_Token);
        const email = decoded.email.toLowerCase();
        const headers = new HttpHeaders().set('X-Api-Key', environment.TRIPLEENABLE_API_KEY) 
        return this.http.get<ITripleenableUser>(`${environment.TRIPLEENABLE}/Profile/${email}`, { headers })
    }

    private decodeToken(token: string) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload
    }
 
    private setUser(user: IUser): void {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        this.scheduleTokenExpiry(user);
    }
    logout(): void {
        this.clearExpiryTimers();
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    private scheduleTokenExpiry(user: IUser | null): void {
        this.clearExpiryTimers();
        if (!user?.token?.expires_In_UTC) {
            return;
        }

        const expiresAt = new Date(user.token.expires_In_UTC).getTime();
        const msUntilExpiry = expiresAt - Date.now();

        if (msUntilExpiry <= 0) {
            this.startExpiryCountdown();
            return;
        }

        this.tokenExpiryTimeoutId = window.setTimeout(() => {
            this.startExpiryCountdown();
        }, msUntilExpiry);
    }

    private startExpiryCountdown(): void {
        this.sessionCountdownSubject.next(3);
        let remaining = 3;

        this.countdownIntervalId = window.setInterval(() => {
            remaining -= 1;
            if (remaining <= 0) {
                this.clearExpiryTimers();
                this.sessionCountdownSubject.next(null);
                this.logout();
                this.router.navigate(['/no-session']);
                return;
            }
            this.sessionCountdownSubject.next(remaining);
        }, 1000);
    }

    private clearExpiryTimers(): void {
        if (this.tokenExpiryTimeoutId !== null) {
            clearTimeout(this.tokenExpiryTimeoutId);
            this.tokenExpiryTimeoutId = null;
        }
        if (this.countdownIntervalId !== null) {
            clearInterval(this.countdownIntervalId);
            this.countdownIntervalId = null;
        }
    }
}
