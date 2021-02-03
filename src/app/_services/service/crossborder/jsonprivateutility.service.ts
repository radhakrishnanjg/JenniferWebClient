import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';

import { BadRequest } from '../../../common/bad-request';
import { NotFoundError } from '../../../common/not-found-error';
import { AppError } from '../../../common/app-error';

import { AuthenticationService } from '../authentication.service';
import { JsonModal, Dropdown, Shipment, } from '../../model/crossborder/index';
import { Country, State, State1, Customerwarehouse, ChartOfAccount, TaxLedger, AmazonAutoRTVOrder, Companydetails, Poshipment } from '../../../_services/model';
import { environment } from '../../../../environments/environment';


@Injectable({
    providedIn: 'root'
})
export class JsonPrivateUtilityService {
    objJsonModal: JsonModal = {} as any;

    constructor(
        private httpClient: HttpClient,
        private authenticationService: AuthenticationService
    ) { }


    public getvalues(Type: string): Observable<Dropdown[]> {
        return this.httpClient.get<string>(environment.baseUrl + `JsonPrivateUtility/GetValues?Type=` + Type)
            .pipe(
                map(data => {
                    return JSON.parse(data) as Dropdown[];
                }),
                catchError(this.handleError)
            );

    }

    public getCountries(): Observable<Country[]> {
        return this.httpClient.get<string>(environment.baseUrl + 'JsonPrivateUtility/GetCountries')
            .pipe(
                map(data => {
                    return JSON.parse(data) as Country[];
                }),
                catchError(this.handleError)
            );
    }


    public getStates(CountryId: number): Observable<State[]> {
        if (CountryId != 0) {
            return this.httpClient.get<string>(environment.baseUrl + `JsonPrivateUtility/GetStates?CountryId=` + CountryId)
                .pipe(
                    map(data => {
                        return JSON.parse(data) as State[];
                    }),
                    catchError(this.handleError)
                );
        }
    }


    public GetChartOfAccountsGroup(): Observable<ChartOfAccount[]> {
        let currentUser = this.authenticationService.currentUserValue;
        let CompanyID = currentUser.CompanyID;
        return this.httpClient.get<string>(environment.baseUrl +
            `JsonPrivateUtility/GetChartOfAccountsGroup?CompanyID=` + CompanyID)
            .pipe(
                map(data => {
                    return JSON.parse(data) as ChartOfAccount[];
                }),
                catchError(this.handleError)
            );
    }

    public GetChartOfAccountsSubGroup(ChartOfAccountsGroup: string): Observable<ChartOfAccount[]> {
        let currentUser = this.authenticationService.currentUserValue;
        let CompanyID = currentUser.CompanyID;
        return this.httpClient.get<string>(environment.baseUrl +
            `JsonPrivateUtility/GetChartOfAccountsSubGroup?ChartOfAccountsGroup=` + encodeURIComponent(ChartOfAccountsGroup)

            + `&CompanyID=` + CompanyID)
            .pipe(
                map(data => {
                    return JSON.parse(data) as ChartOfAccount[];
                }),
                catchError(this.handleError)
            );
    }

    public GetChartOfAccountsFinancialStatement(ChartOfAccountsSubGroup: string): Observable<ChartOfAccount[]> {
        let currentUser = this.authenticationService.currentUserValue;
        let CompanyID = currentUser.CompanyID;
        return this.httpClient.get<string>(environment.baseUrl +
            `JsonPrivateUtility/GetChartOfAccountsFinancialStatement?ChartOfAccountsSubGroup=` + encodeURIComponent(ChartOfAccountsSubGroup)
            + `&CompanyID=` + CompanyID)
            .pipe(
                map(data => {
                    return JSON.parse(data) as ChartOfAccount[];
                }),
                catchError(this.handleError)
            );
    }

    public GetAccounts(): Observable<TaxLedger[]> {
        let currentUser = this.authenticationService.currentUserValue;
        let CompanyID = currentUser.CompanyID;
        return this.httpClient.get<string>(environment.baseUrl +
            `JsonPrivateUtility/GetAccounts?`
            + `&CompanyID=` + CompanyID)
            .pipe(
                map(data => {
                    return JSON.parse(data) as TaxLedger[];
                }),
                catchError(this.handleError)
            );
    }

    public GetRTVCustomerWarehouses(): Observable<Customerwarehouse[]> {
        let currentUser = this.authenticationService.currentUserValue;
        let CompanyID = currentUser.CompanyID;
        return this.httpClient.get<string>(environment.baseUrl +
            `JsonPrivateUtility/GetRTVCustomerWarehouses?`
            + `CompanyID=` + CompanyID)
            .pipe(
                map(data => {
                    return JSON.parse(data) as Customerwarehouse[];
                }),
                catchError(this.handleError)
            );
    }

    public GetRTVGenerateInvoices(OrderID: string): Observable<AmazonAutoRTVOrder[]> {
        let currentUser = this.authenticationService.currentUserValue;
        let CompanyDetailID = currentUser.CompanyDetailID;
        return this.httpClient.get<string>(environment.baseUrl +
            `JsonPrivateUtility/GetRTVGenerateInvoices?`
            + `CompanyDetailID=` + CompanyDetailID
            + `&OrderID=` + encodeURIComponent(OrderID))
            .pipe(
                map(data => {
                    return JSON.parse(data) as AmazonAutoRTVOrder[];
                }),
                catchError(this.handleError)
            );
    }

    public GetAllStores(CompanyID: number): Observable<Companydetails[]> {
        let currentUser = this.authenticationService.currentUserValue;
        let UserId = currentUser.UserId;
        return this.httpClient.get<string>(environment.baseUrl + `JsonPrivateUtility/GetAllStores?CompanyID=` + CompanyID +
            `&UserId=` + UserId)
            .pipe(
                map(data => {
                    return JSON.parse(data) as Companydetails[];
                }),
                catchError(this.handleError)
            );
    }

    public GetDutyDepositLedgerShipments(CompanyDetailID: number): Observable<Poshipment[]> { 
        return this.httpClient.get<string>(environment.baseUrl +
            `JsonPrivateUtility/GetDutyDepositLedgerShipments?CompanyDetailID=` + CompanyDetailID)
            .pipe(
                map(data => {
                    return JSON.parse(data) as Poshipment[];
                }),
                catchError(this.handleError)
            );
    }

    private handleError(error: HttpErrorResponse) {
        if (error.status === 404)
            return throwError(new NotFoundError(error));

        if (error.status === 400)
            return throwError(new BadRequest(error));
        return throwError(new AppError(error));
    }



}