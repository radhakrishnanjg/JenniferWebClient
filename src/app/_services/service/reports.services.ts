import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {  throwError } from 'rxjs';
import { catchError } from 'rxjs/operators'; 

import { environment } from '../../../environments/environment';
@Injectable({ providedIn: 'root' })

export class ReportsService {
    constructor(private httpClient: HttpClient) {
    }

    public DownloadLoanDetail(FromDate: string, Todate: string, LoanNum: string, LoanStatus: string) {
        return this.httpClient.get(environment.baseUrl +
            `Report/DownloadLoanDetail?FromDate=` + FromDate + '&Todate=' + Todate +
            '&LoanNum=' + LoanNum + '&LoanStatus=' + LoanStatus,
            { responseType: 'blob' })
            .pipe(catchError(this.handleError));
    }

    public Getzipfile(FileId: string) {
        return this.httpClient.get(environment.baseUrl + 'Upload/GetZipFile?fileid=' + FileId,
            { responseType: 'blob' })
            .pipe(catchError(this.handleError))
            ;
    } 
    private handleError(errorResponse: HttpErrorResponse) {
        if (errorResponse.error instanceof ErrorEvent) {
            console.error('Client Side Error :', errorResponse.error.message);
        } else {
            console.error('Server Side Error :', errorResponse);
        }
        return throwError('There is a problem with the service. We are notified & working on it. Please try again later.');
    }
}