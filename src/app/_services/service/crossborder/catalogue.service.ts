import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { BadRequest } from '../../../common/bad-request';
import { NotFoundError } from '../../../common/not-found-error';
import { AppError } from '../../../common/app-error';

import { AuthenticationService } from '.././authentication.service';
import { CatalogueHeader, Result, JsonModal, IORCatalogueStatus, IOR_Status } from '../../model/crossborder';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CatalogueService {
    objJsonModal: JsonModal = {} as any;
    constructor(private httpClient: HttpClient,
        private authenticationService: AuthenticationService) {
    }

    public search(SearchBy: string, Search: string, StartDate: Date, EndDate: Date):
        Observable<CatalogueHeader[]> {
        let currentUser = this.authenticationService.currentUserValue;
        let SellerFormID = currentUser.SellerFormID;
        return this.httpClient.get<string>(environment.baseUrl + `Catalogue/Search?&SearchBy=` +
            encodeURIComponent(SearchBy) + `&Search=` + Search
            + `&StartDate=` + StartDate + `&EndDate=` + EndDate + `&SellerFormID=` + SellerFormID)
            .pipe(
                map(data => {
                    return JSON.parse(data) as CatalogueHeader[];
                }),
                catchError(this.handleError)
            );
    }

    public searchById(CatalogueID: number): Observable<CatalogueHeader> {
        let currentUser = this.authenticationService.currentUserValue;
        let SellerFormID = currentUser.SellerFormID;
        return this.httpClient.get<string>(environment.baseUrl + `Catalogue/SearchById?CatalogueID=` + CatalogueID
            + `&SellerFormID=` + SellerFormID)
            .pipe(
                map(data => {
                    return JSON.parse(data) as CatalogueHeader;
                }),
                catchError(this.handleError)
            );
    }

    public doAction(obj: CatalogueHeader): Observable<Result> {
        let currentUser = this.authenticationService.currentUserValue;
        obj.SellerFormID = currentUser.SellerFormID;
        obj.LoginId = currentUser.UserId;
        this.objJsonModal.Json = JSON.stringify(obj);
        return this.httpClient.post<Result>(environment.baseUrl + `Catalogue/DoAction`, this.objJsonModal)
            .pipe(catchError(this.handleError));
    }

    public insert(obj: CatalogueHeader): Observable<Result> {
        let currentUser = this.authenticationService.currentUserValue;
        obj.SellerFormID = currentUser.SellerFormID;
        obj.LoginId = currentUser.UserId;
        obj.Action = 'I';
        this.objJsonModal.Json = JSON.stringify(obj);
        return this.httpClient.post<Result>(environment.baseUrl + `Catalogue/DoAction`, this.objJsonModal)
            .pipe(catchError(this.handleError));
    }

    public update(obj: CatalogueHeader): Observable<Result> {
        let currentUser = this.authenticationService.currentUserValue;
        obj.SellerFormID = currentUser.SellerFormID;
        obj.LoginId = currentUser.UserId;
        obj.Action = 'U';
        this.objJsonModal.Json = JSON.stringify(obj);
        return this.httpClient.post<Result>(environment.baseUrl + `Catalogue/DoAction`, this.objJsonModal)
            .pipe(catchError(this.handleError));
    }

    public withdraw(obj: CatalogueHeader): Observable<Result> {
        let currentUser = this.authenticationService.currentUserValue;
        obj.SellerFormID = currentUser.SellerFormID;
        obj.LoginId = currentUser.UserId;
        obj.Action = 'W';
        this.objJsonModal.Json = JSON.stringify(obj);
        return this.httpClient.post<Result>(environment.baseUrl + `Catalogue/DoAction`, this.objJsonModal)
            .pipe(catchError(this.handleError));
    }

    //#region IOR Catalogue

    public IORSearch(SearchBy: string, Search: string, StartDate: Date, EndDate: Date):
        Observable<CatalogueHeader[]> {
        let currentUser = this.authenticationService.currentUserValue;
        let LoginID = currentUser.UserId;
        return this.httpClient.get<string>(environment.baseUrl + `Catalogue/IORSearch?&SearchBy=` +
            encodeURIComponent(SearchBy)
            + `&Search=` + Search
            + `&StartDate=` + StartDate
            + `&EndDate=` + EndDate
            + `&LoginID=` + LoginID)
            .pipe(
                map(data => {
                    return JSON.parse(data) as CatalogueHeader[];
                }),
                catchError(this.handleError)
            );
    }

    public IORSearchById(CatalogueID: number): Observable<CatalogueHeader> {
        let currentUser = this.authenticationService.currentUserValue;
        return this.httpClient.get<string>(environment.baseUrl + `Catalogue/IORSearchById?CatalogueID=` + CatalogueID
        ).pipe(
            map(data => {
                return JSON.parse(data) as CatalogueHeader;
            }),
            catchError(this.handleError)
        );
    }

    public IORAction(obj: CatalogueHeader): Observable<Result> {
        let currentUser = this.authenticationService.currentUserValue;
        obj.LoginId = currentUser.UserId;
        this.objJsonModal.Json = JSON.stringify(obj);
        return this.httpClient.post<Result>(environment.baseUrl + `Catalogue/IORAction`, this.objJsonModal)
            .pipe(catchError(this.handleError));
    }

    public IORGetCatalogueStatus(lst: IOR_Status[]): Observable<IORCatalogueStatus[]> {
        this.objJsonModal.Json = JSON.stringify(lst);
        return this.httpClient.post<string>(environment.baseUrl + `Catalogue/IORGetCatalogueStatus`, this.objJsonModal)
            .pipe(
                map(data => {
                    return JSON.parse(data) as IORCatalogueStatus[];
                }),
                catchError(this.handleError)
            );
    }

    //#endregion  


    //#region Custom  Catalogue Methods

    public CustomSearch(SearchBy: string, Search: string, StartDate: Date, EndDate: Date):
        Observable<CatalogueHeader[]> {
        return this.httpClient.get<string>(environment.baseUrl + `Catalogue/CustomSearch?&SearchBy=` +
            encodeURIComponent(SearchBy) + `&Search=` + Search
            + `&StartDate=` + StartDate + `&EndDate=` + EndDate)
            .pipe(
                map(data => {
                    return JSON.parse(data) as CatalogueHeader[];
                }),
                catchError(this.handleError)
            );
    }

    public CustomSearchById(CatalogueID: number): Observable<CatalogueHeader> {
        return this.httpClient.get<string>(environment.baseUrl + `Catalogue/CustomSearchById?CatalogueID=` + CatalogueID)
            .pipe(
                map(data => {
                    return JSON.parse(data) as CatalogueHeader;
                }),
                catchError(this.handleError)
            );
    }

    public CustomAction(obj: CatalogueHeader): Observable<Result> {
        let currentUser = this.authenticationService.currentUserValue;
        obj.LoginId = currentUser.UserId;
        this.objJsonModal.Json = JSON.stringify(obj);
        return this.httpClient.post<Result>(environment.baseUrl + `Catalogue/CustomAction`, this.objJsonModal)
            .pipe(catchError(this.handleError));
    }

    //#endregion  

    //#region "EOR Catalogue"

    public EORSearch(SearchBy: string, Search: string, StartDate: Date, EndDate: Date):
        Observable<CatalogueHeader[]> {
        let currentUser = this.authenticationService.currentUserValue;
        let LoginID = currentUser.UserId;
        return this.httpClient.get<string>(environment.baseUrl + `Catalogue/EORSearch?&SearchBy=` +
            encodeURIComponent(SearchBy)
            + `&Search=` + Search
            + `&StartDate=` + StartDate
            + `&EndDate=` + EndDate
            + `&LoginID=` + LoginID)
            .pipe(
                map(data => {
                    return JSON.parse(data) as CatalogueHeader[];
                }),
                catchError(this.handleError)
            );
    }

    public EORSearchById(CatalogueID: number): Observable<CatalogueHeader> {
        return this.httpClient.get<string>(environment.baseUrl + `Catalogue/EORSearchById?CatalogueID=` + CatalogueID)
            .pipe(
                map(data => {
                    return JSON.parse(data) as CatalogueHeader;
                }),
                catchError(this.handleError)
            );
    }

    //#endregion "EOR Catalogue"

    private handleError(error: HttpErrorResponse) {
        if (error.status === 404)
            return throwError(new NotFoundError(error));

        if (error.status === 400)
            return throwError(new BadRequest(error));
        return throwError(new AppError(error));
    }
}
