import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from '../_services/service/authentication.service';
@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
    constructor(
        private authenticationService: AuthenticationService,
        private _spinner: NgxSpinnerService,
    ) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.showLoader();
        return next.handle(req).pipe(tap((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                // if (event.body.result !== undefined) {
                //     let url: string;
                //     url = req.url;
                // }
                this.hideLoader();
            }
        },
            (err: HttpErrorResponse) => {
                this.hideLoader();
            }));
    }

    private showLoader(): void {
        this._spinner.show();
    }
    private hideLoader(): void {
        this._spinner.hide();
    }
}
