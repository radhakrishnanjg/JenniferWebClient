import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IUser, Userlog } from '../model/index';
import { environment } from '../../../environments/environment';
import { EncrDecrService } from '../service/encr-decr.service';

import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<IUser>;
    public currentUser: Observable<IUser>;
    user: IUser = {} as any;
    users: IUser[];


    constructor(private http: HttpClient,
        private EncrDecr: EncrDecrService,
        private cookieService: CookieService, ) {
        if (localStorage.getItem('currentJennifer1') == null) {
            var encrypted = this.EncrDecr.set('Radha@123!()', JSON.stringify(this.user));
            localStorage.setItem('currentJennifer1', encrypted);
        }
        this.currentUserSubject = new BehaviorSubject<IUser>(
            JSON.parse(this.EncrDecr.get('Radha@123!()', localStorage.getItem('currentJennifer1'))));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): IUser {
        return this.currentUserSubject.value; // != undefined ? this.currentUserSubject.value : null;
    }

    login(username: string, password: string): Observable<IUser> {
        return this.http.post<IUser>(environment.baseUrl + `SignIn`, { observe: 'response' },
            {
                headers: new HttpHeaders(
                    {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + username + ":" + password
                    })
            })
            .pipe(
                map((user: IUser) => {
                    // login successful if there's a jwt token in the response 
                    if (user != null) {
                        // store user details and jwt token in local storage to keep user logged in between page refreshes
                        var encrypted = this.EncrDecr.set('Radha@123!()', JSON.stringify(user));
                        localStorage.setItem('currentJennifer1', encrypted);
                        this.currentUserSubject.next(user);
                    }
                    return user;
                }), catchError(this.handleError));
    }

    public logout() {
        this.cookieService.deleteAll();
        localStorage.clear();
        this.currentUserSubject.next(null);
        // return this.http.post<boolean>(environment.baseUrl + `SignOut`, {})
        //     .pipe(catchError(this.handleError));
    }

    public getIpAddress() :Observable<string>{
        // return this.http
        //     .get('http://freegeoip.net/json/?callback')
        //     .map(response => response || {})
        //     .pipe(catchError(this.handleError));

       return this.http.get<string>('https://jsonip.com')
       .pipe(catchError(this.handleError));
    }

    public adduserLog(userlo: Userlog): Observable<boolean> {
        //rk
        let currentUser = this.currentUserValue;
        userlo.UserId = currentUser.UserId;
        return this.http.post<boolean>(environment.baseUrl + `UserLog`, userlo)
            .pipe(catchError(this.handleError));
    }

    private handleError(errorResponse: HttpErrorResponse) {
        if (errorResponse.error instanceof ErrorEvent) {
            console.error('Client Side Error :', errorResponse.error.message);
        } else {
            console.error('Server Side Error :', errorResponse);
        }
        return throwError('There is a problem with the service. We are notified & working on it. Please try again later.');
    }
}

