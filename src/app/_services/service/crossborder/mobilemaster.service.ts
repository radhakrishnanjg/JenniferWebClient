import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';

import { BadRequest } from '../../../common/bad-request';
import { NotFoundError } from '../../../common/not-found-error';
import { AppError } from '../../../common/app-error';

import { AuthenticationService } from '../authentication.service';
import { JsonModal, Result, MobileMaster } from '../../model/crossborder';
import { environment } from '../../../../environments/environment';


@Injectable({
    providedIn: 'root'
})
export class MobileMasterService {
    objJsonModal: JsonModal = {} as any;

    constructor(
        private httpClient: HttpClient,
        private authenticationService: AuthenticationService
    ) { }

    public Search(SearchBy: string, Search: string, IsActive: boolean):
        Observable<MobileMaster[]> {
        return this.httpClient.get<string>(environment.baseUrl + `MobileMaster/Search?Search=` + Search
            + `&SearchBy=` + encodeURIComponent(SearchBy)
            + `&IsActive=` + IsActive)
            .pipe(
                map(data => {
                    return JSON.parse(data) as MobileMaster[];
                }),
                catchError(this.handleError)
            );
    }

    public SearchById(JenniferMobileMasterID: number): Observable<MobileMaster> {
        return this.httpClient.get<string>(environment.baseUrl + `MobileMaster/SearchById?JenniferMobileMasterID=`
            + JenniferMobileMasterID)
            .pipe(
                map(data => {
                    return JSON.parse(data) as MobileMaster;
                }),
                catchError(this.handleError)
            );
    }

    public Insert(obj: MobileMaster): Observable<Result> { 
        let currentUser = this.authenticationService.currentUserValue;
        obj.LoginId = currentUser.UserId;
        obj.Action = 'I';
        this.objJsonModal.Json = JSON.stringify(obj);
        return this.httpClient.post<Result>(environment.baseUrl + `MobileMaster/DoAction`, this.objJsonModal)
            .pipe(catchError(this.handleError));
    }

    public SellerAssigned(SellerFormID: number,JenniferMobileMasterID:number): Observable<Result> {
        let obj = new MobileMaster();
        let currentUser = this.authenticationService.currentUserValue;
        obj.LoginId = currentUser.UserId;
        obj.SellerFormID=SellerFormID;
        obj.JenniferMobileMasterID=JenniferMobileMasterID;
        obj.Action = 'S';
        this.objJsonModal.Json = JSON.stringify(obj);
        return this.httpClient.post<Result>(environment.baseUrl + `MobileMaster/DoAction`, this.objJsonModal)
            .pipe(catchError(this.handleError));
    }

    public OTPAssigned(SellerFormID: number,IsOTPSent:boolean): Observable<Result> {
        let obj = new MobileMaster();
        let currentUser = this.authenticationService.currentUserValue;
        obj.LoginId = currentUser.UserId;
        obj.SellerFormID=SellerFormID;
        obj.IsOTPSent=IsOTPSent;
        obj.Action = 'O';
        this.objJsonModal.Json = JSON.stringify(obj);
        return this.httpClient.post<Result>(environment.baseUrl + `MobileMaster/DoAction`, this.objJsonModal)
            .pipe(catchError(this.handleError));
    }

    public Delete(JenniferMobileMasterID: number): Observable<Result> {
        let obj = new MobileMaster();
        obj.JenniferMobileMasterID = JenniferMobileMasterID
        let currentUser = this.authenticationService.currentUserValue;
        obj.LoginId = currentUser.UserId;
        obj.Action = 'D';
        this.objJsonModal.Json = JSON.stringify(obj);
        return this.httpClient.post<Result>(environment.baseUrl + `MobileMaster/DoAction`, this.objJsonModal)
            .pipe(catchError(this.handleError));

    }

    private handleError(error: HttpErrorResponse) {
        if (error.status === 404)
            return throwError(new NotFoundError(error));

        if (error.status === 400)
            return throwError(new BadRequest(error));
        return throwError(new AppError(error));
    }




}