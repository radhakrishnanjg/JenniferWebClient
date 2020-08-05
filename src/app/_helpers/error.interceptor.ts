import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AuthenticationService } from '../_services/service/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Injectable(
    {
        providedIn: 'root'
    }
)
export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(
        private authenticationService: AuthenticationService,
        // private _alertService: ToastrService,
        private router: Router,
    ) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError(err => {
                if (this.router.url !== '/Signin' && err.status === 401) {
                    // debugger
                    // auto logout if 401 response returned from api 
                    // $('#modalsessionexpired').modal('show');
                    //this.authenticationService.logout();
                    // location.reload(true);  
                    $('#modalsessionexpired').modal('show');
                    // this._alertService.info('Your session expired.!. Any confirmed transaction are saved.but you will need to restart any searches or unfinished transactions.');
                    // this.router.navigate(['/Signin']);
                }
                else if (err.status === 400) {
                    $('#modalbadrequest').modal('show');
                    $('#modalbadrequestcontent').html(`Error Code: ${err.status}\nMessage: ${err.message}`);
                }
                const error = err.error || err.statusText;
                return throwError(error);
            }));
    }
} 