import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';

import { BadRequest } from '../../../common/bad-request';
import { NotFoundError } from '../../../common/not-found-error';
import { AppError } from '../../../common/app-error';

import { AuthenticationService } from '../authentication.service';
import { JsonModal, Result, SellerRegistration, Dropdown, IORPartners, EORPartners }
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

    

    private handleError(error: HttpErrorResponse) {
        if (error.status === 404)
            return throwError(new NotFoundError(error));

        if (error.status === 400)
            return throwError(new BadRequest(error));
        return throwError(new AppError(error));
    }



}