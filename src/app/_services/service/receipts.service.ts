import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { BadRequest } from '../../common/bad-request';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';

import { AuthenticationService } from './authentication.service';
import { Receipts, Result, UpcomingReceipts } from '../model/index';
import { environment } from '../../../environments/environment';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReceiptsService {
  obj: Receipts = {} as any;
  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) { }

  public search(StartDate: Date, EndDate: Date):
    Observable<Receipts[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Receipts[]>(environment.baseUrl + `Receipts/Search?CompanyDetailID=`
      + CompanyDetailID + `&StartDate=` + StartDate + `&EndDate=` + EndDate)
      .pipe(catchError(this.handleError));
  }

  public UpcomingReceiptSearch():
    Observable<UpcomingReceipts[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl + `Receipts/UpcomingReceiptSearch?CompanyDetailID=`
      + CompanyDetailID)
      .pipe(
        map(data => {
          return JSON.parse(data) as UpcomingReceipts[];
        }),
        catchError(this.handleError)
      );
  }

  public Update(obj1: Receipts): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj1.CompanyDetailID = currentUser.CompanyDetailID;
    obj1.LoginId = currentUser.UserId;
    return this.httpClient.post<Result>(environment.baseUrl + `Receipts/Update`, obj1)
      .pipe(catchError(this.handleError));
  }

  public DownloadReceiptFile(ReportID: string) {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get(environment.baseUrl + `Receipts/DownloadReceiptFile?` +
      `CompanyDetailID=` + CompanyDetailID + `&ReportID=` + ReportID,
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
