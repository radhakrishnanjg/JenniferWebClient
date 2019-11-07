import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AppError } from '../../common/app-error';
import { BadRequest } from '../../common/bad-request';
import { NotFoundError } from '../../common/not-found-error';

import { Salesorder, SalesorderItem, Result, SalesorderunsellableQty, Statement } from '../model/index';
import { AuthenticationService } from './authentication.service';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class StatementService {
  objStatement: Statement = {} as any;


  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService
  ) { }

  public search(SearchBy: string, Search: string, StartDate: Date, EndDate: Date):
    Observable<Statement[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Statement[]>(environment.baseUrl + `Statement/Search?CompanyDetailID=` + CompanyDetailID
      + `&SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search
      + `&StartDate=` + StartDate + `&EndDate=` + EndDate)
      .pipe(catchError(this.handleError));
  }


  public searchById(StatementNumber: string): Observable<Statement> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Statement>(environment.baseUrl + `Statement/SearchById?StatementNumber=` + StatementNumber
      + `&CompanyDetailID=` + CompanyDetailID)
      .pipe(catchError(this.handleError));
  }

  public downloadFile(StatementNumber: string) {
    return this.httpClient.get(environment.baseUrl + `Statement/DownloadFile?StatementNumber=` +
     encodeURIComponent(StatementNumber)
      ,
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
