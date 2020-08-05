import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';

import { BadRequest } from '../../../common/bad-request';
import { NotFoundError } from '../../../common/not-found-error';
import { AppError } from '../../../common/app-error';

import { AuthenticationService } from '../authentication.service';
import {
    JsonModal, Result, SellerRegistration, Dropdown, IORPartners, EORPartners, ShipTo,
    Consignor, LogisticPartners, PackageHeader
}
    from '../../model/crossborder/index';
import { Country, State, State1 } from '../../../_services/model';
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


    public getsellerregistrations(): Observable<SellerRegistration[]> {
        return this.httpClient.get<string>(environment.baseUrl + 'JsonPrivateUtility/GetSellerRegistrations')
            .pipe(
                map(data => {
                    return JSON.parse(data) as SellerRegistration[];
                }),
                catchError(this.handleError)
            );
    }

    // public GetShipFrom(): Observable<ShipFrom[]> {
    //     return this.httpClient.get<string>(environment.baseUrl + 'JsonPrivateUtility/GetShipFrom')
    //         .pipe(
    //             map(data => {
    //                 return JSON.parse(data) as ShipFrom[];
    //             }),
    //             catchError(this.handleError)
    //         );
    // }

    public GetShipTo(): Observable<ShipTo[]> {
        let currentUser = this.authenticationService.currentUserValue;
        let SellerFormID = currentUser.SellerFormID;
        return this.httpClient.get<string>(environment.baseUrl + 'JsonPrivateUtility/GetShipTo?SellerFormID=' + SellerFormID)
            .pipe(
                map(data => {
                    return JSON.parse(data) as ShipTo[];
                }),
                catchError(this.handleError)
            );
    }

    public GetConsignor(): Observable<Consignor[]> {
        let currentUser = this.authenticationService.currentUserValue;
        let SellerFormID = currentUser.SellerFormID;
        return this.httpClient.get<string>(environment.baseUrl + 'JsonPrivateUtility/GetConsignor?SellerFormID=' + SellerFormID)
            .pipe(
                map(data => {
                    return JSON.parse(data) as Consignor[];
                }),
                catchError(this.handleError)
            );
    }

    // public GetConsignee(): Observable<Consignee[]> {
    //     return this.httpClient.get<string>(environment.baseUrl + 'JsonPrivateUtility/GetConsignee')
    //         .pipe(
    //             map(data => {
    //                 return JSON.parse(data) as Consignee[];
    //             }),
    //             catchError(this.handleError)
    //         );
    // }

    public GetLogisticPartners(): Observable<LogisticPartners[]> { 
        let currentUser = this.authenticationService.currentUserValue;
        let SellerFormID = currentUser.SellerFormID;
        return this.httpClient.get<string>(environment.baseUrl + 'JsonPrivateUtility/GetLogisticPartners?SellerFormID=' + SellerFormID)
            .pipe(
                map(data => {
                    return JSON.parse(data) as LogisticPartners[];
                }),
                catchError(this.handleError)
            );
    }

    public GetCARPFBAShipment(): Observable<PackageHeader[]> {
        let currentUser = this.authenticationService.currentUserValue;
        let SellerFormID = currentUser.SellerFormID;
        return this.httpClient.get<string>(environment.baseUrl + 'JsonPrivateUtility/GetCARPFBAShipment?SellerFormID=' + SellerFormID)
            .pipe(
                map(data => {
                    return JSON.parse(data) as PackageHeader[];
                }),
                catchError(this.handleError)
            );
    }

    public GetPODFBAShipment(): Observable<PackageHeader[]> {
        let currentUser = this.authenticationService.currentUserValue;
        let LoginId = currentUser.UserId;
        return this.httpClient.get<string>(environment.baseUrl + 'JsonPrivateUtility/GetPODFBAShipment?LoginId=' + LoginId)
            .pipe(
                map(data => {
                    return JSON.parse(data) as PackageHeader[];
                }),
                catchError(this.handleError)
            );
    }

    public GetShipmentFBAShipment(): Observable<PackageHeader[]> {
        let currentUser = this.authenticationService.currentUserValue;
        let LoginId = currentUser.UserId;
        return this.httpClient.get<string>(environment.baseUrl + 'JsonPrivateUtility/GetShipmentFBAShipment?LoginId=' + LoginId)
            .pipe(
                map(data => {
                    return JSON.parse(data) as PackageHeader[];
                }),
                catchError(this.handleError)
            );
    }

    public GetCheckListFBAShipment(): Observable<PackageHeader[]> {
        let currentUser = this.authenticationService.currentUserValue;
        let LoginId = currentUser.UserId;
        return this.httpClient.get<string>(environment.baseUrl + 'JsonPrivateUtility/GetCheckListFBAShipment?LoginId=' + LoginId)
            .pipe(
                map(data => {
                    return JSON.parse(data) as PackageHeader[];
                }),
                catchError(this.handleError)
            );
    }

    public GetBOEFBAShipment(): Observable<PackageHeader[]> {
        let currentUser = this.authenticationService.currentUserValue;
        let LoginId = currentUser.UserId;
        return this.httpClient.get<string>(environment.baseUrl + 'JsonPrivateUtility/GetBOEFBAShipment?LoginId=' + LoginId)
            .pipe(
                map(data => {
                    return JSON.parse(data) as PackageHeader[];
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