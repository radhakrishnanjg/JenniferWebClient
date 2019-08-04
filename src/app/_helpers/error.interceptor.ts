import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AuthenticationService } from '../_services/service/authentication.service';
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            //retry(1),//
            catchError(err => {
                if (err.status === 401) {
                    // auto logout if 401 response returned from api 
                    $('#modalsessionexpired').modal('show');
                    //this.authenticationService.logout();
                    // location.reload(true);
                }
                else if (err.status === 400) {
                    $('#modalbadrequest').modal('show');
                    $('#modalbadrequestcontent').html(`Error Code: ${err.status}\nMessage: ${err.message}`);
                }
                const error = err.error || err.statusText;
                return throwError(error);
            }))
    }
} 