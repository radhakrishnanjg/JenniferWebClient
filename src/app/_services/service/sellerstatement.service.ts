import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AppError } from '../../common/app-error';
import { BadRequest } from '../../common/bad-request';
import { NotFoundError } from '../../common/not-found-error';

import { Statement, JsonModal, Result } from '../model/index';
import { AuthenticationService } from './authentication.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SellerstatementService {
  objJsonModal: JsonModal = {} as any;
  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) { }

  public Search(SearchBy: string, Search: string, StartDate: Date, EndDate: Date):
    Observable<Statement[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl +
      `SellerStatement/Search?CompanyDetailID=` + CompanyDetailID
      + `&SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search
      + `&StartDate=` + StartDate + `&EndDate=` + EndDate)
      .pipe(
        map(data => {
          return JSON.parse(data) as Statement[];
        }),
        catchError(this.handleError)
      );
  }

  public SearchById(StatementNumber: string): Observable<Statement> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl + `SellerStatement/SearchById?StatementNumber=` + StatementNumber
      + `&CompanyDetailID=` + CompanyDetailID)
      .pipe(
        map(data => {
          return JSON.parse(data) as Statement;
        }),
        catchError(this.handleError)
      );
  }

  public UpdateStatus(StatementNumber: string, Status: string): Observable<Result> {
    let obj: Statement = {} as any;
    let currentUser = this.authenticationService.currentUserValue;
    obj.StatementNumber = StatementNumber;
    obj.Status = Status;
    obj.CompanyDetailID = currentUser.CompanyDetailID;
    obj.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `SellerStatement/UpdateStatus`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }
  public GenerateStatementFile(StatementNumber: string): Observable<Result> {
    let obj: Statement = {} as any;
    let currentUser = this.authenticationService.currentUserValue;
    obj.StatementNumber = StatementNumber;
    obj.CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.post<Result>(environment.baseUrl + `SellerStatement/GenerateStatementFile`, obj)
      .pipe(catchError(this.handleError));
  }

  public downloadFile(StatementNumber: string) {
    return this.httpClient.get(environment.baseUrl + `SellerStatement/DownloadFile?StatementNumber=` +
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
