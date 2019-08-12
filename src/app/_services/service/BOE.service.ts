import { Injectable, } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { BadRequest } from '../../common/bad-request';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';

import { AuthenticationService } from './authentication.service';
import { BOEHeader, Result } from '../model/index';
import { environment } from '../../../environments/environment';
@Injectable({
    providedIn: 'root'
})

export class BoeService {
    lstBOEHeader: BOEHeader[];
    objBOEHeader: BOEHeader = {} as any;

    constructor(private httpClient: HttpClient,
        private authenticationService: AuthenticationService) { }

    public search(SearchBy: string, Search: string, StartDate: Date, EndDate: Date): Observable<BOEHeader[]> {
        let currentUser = this.authenticationService.currentUserValue;
        let CompanyDetailID = currentUser.CompanyDetailID;
        return this.httpClient.get<BOEHeader[]>(environment.baseUrl +
            `BOE/Search?CompanyDetailID=` + CompanyDetailID + `&SearchBy=` + encodeURIComponent(SearchBy) +
            `&Search=` + Search + `&StartDate=` + StartDate + `&EndDate=` + EndDate)
            .pipe(catchError(this.handleError));
    }

    public searchById(PurchaseID: number, BOEID: number): Observable<BOEHeader> {
        let currentUser = this.authenticationService.currentUserValue;
        let CompanyDetailID = currentUser.CompanyDetailID;
        return this.httpClient.get<BOEHeader>(environment.baseUrl +
            `BOE/SearchByID?CompanyDetailID=` + CompanyDetailID +
            `&BOEID=` + BOEID + `&PurchaseID=` + PurchaseID)
            .pipe(catchError(this.handleError));
    }

    public newBOE(PurchaseID: number): Observable<BOEHeader> {
        let currentUser = this.authenticationService.currentUserValue;
        let CompanyDetailID = currentUser.CompanyDetailID;
        return this.httpClient.get<BOEHeader>(environment.baseUrl +
            `BOE/newBOE?CompanyDetailID=` + CompanyDetailID +
            `&PurchaseID=` + PurchaseID)
            .pipe(catchError(this.handleError));
    }

    public exist(BOEID: number, BOENumber: string) {
        BOEID = isNaN(BOEID) ? 0 : BOEID;
        let currentUser = this.authenticationService.currentUserValue;
        let CompanyDetailID = currentUser.CompanyDetailID;
        return this.httpClient.get<Boolean>(environment.baseUrl +
            `BOE/Exist?CompanyDetailID=` + CompanyDetailID + `&BOEID=` + BOEID +
            `&BOENumber=` + BOENumber)
            .pipe(map(users => {
                if (users)
                    return true;
                else
                    return false;
            })
            );
    }

    public upsert(objBOEHeader: BOEHeader): Observable<Result> {
        let currentUser = this.authenticationService.currentUserValue;
        objBOEHeader.CompanyDetailId = currentUser.CompanyDetailID;
        objBOEHeader.LoginId = currentUser.UserId;
        return this.httpClient.post<Result>(environment.baseUrl + `BOE/Upsert`, objBOEHeader)
            .pipe(catchError(this.handleError));
    }

    public delete(BOEID: number): Observable<Result> {
        let currentUser = this.authenticationService.currentUserValue;
        this.objBOEHeader.BOEID = BOEID;
        this.objBOEHeader.CompanyDetailId = currentUser.CompanyDetailID;
        this.objBOEHeader.LoginId = currentUser.UserId;
        return this.httpClient.post<Result>(environment.baseUrl + `BOE/Delete`, this.objBOEHeader)
            .pipe(catchError(this.handleError));
    }

    public DownloadSKUWiseData(PurchaseID: number) {
        let currentUser = this.authenticationService.currentUserValue;
        let CompanyDetailId = currentUser.CompanyDetailID;
        return this.httpClient.get(environment.baseUrl + `BOE/DownloadSKUWiseData?PurchaseID=` + PurchaseID
            + `&CompanyDetailId=` + CompanyDetailId,
            { responseType: 'blob' })
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
