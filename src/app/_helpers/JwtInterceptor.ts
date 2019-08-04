import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../_services/service/authentication.service';
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser = this.authenticationService.currentUserValue;
        if (currentUser && currentUser.AuthToken) {
            request = request.clone({
                setHeaders: {
                    UserId: `${currentUser.UserId}`,
                    Token: `${currentUser.AuthToken}`,
                   // 'Accept': 'application/json;charset=utf-8'
                }
            });
        }

        return next.handle(request);
    }
}