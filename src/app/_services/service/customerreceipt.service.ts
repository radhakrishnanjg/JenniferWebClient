import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of, } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';

import { BadRequest } from '../../common/bad-request';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';

import { AuthenticationService } from './authentication.service';
import { CustomerReceiptHeader, Result, CustomerReceiptDetail, JsonModal } from '../model/index';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerreceiptService {
  objJsonModal: JsonModal = {} as any;
  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) { }

  public Search(SearchBy: string, Search: string, StartDate: Date, EndDate: Date):
    Observable<CustomerReceiptHeader[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl + `CustomerReceipt/Search?CompanyDetailID=` + CompanyDetailID
      + `&SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search
      + `&StartDate=` + StartDate + `&EndDate=` + EndDate)
      .pipe(
        map(data => {
          return JSON.parse(data) as CustomerReceiptHeader[];
        }),
        catchError(this.handleError)
      );
  }

  public SearchById(ReceiptID: number): Observable<CustomerReceiptHeader> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl + `CustomerReceipt/SearchById?ReceiptID=` + ReceiptID
      + `&CompanyDetailID=` + CompanyDetailID)
      .pipe(
        map(data => {
          return JSON.parse(data) as CustomerReceiptHeader;
        }),
        catchError(this.handleError)
      );
  }

  public SearchByCustomerId(CustomerId: number): Observable<CustomerReceiptDetail[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl +
      `CustomerReceipt/SearchByCustomerId?CustomerId=` + CustomerId
      + `&CompanyDetailID=` + CompanyDetailID)
      .pipe(
        map(data => {
          return JSON.parse(data) as CustomerReceiptDetail[];
        }),
        catchError(this.handleError)
      );
    // var data = '';
    // var aa = JSON.parse(data) as CustomerReceiptDetail[];
    // return of(aa);
  }

  public Insert(obj: CustomerReceiptHeader): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.CompanyDetailID = currentUser.CompanyDetailID;
    obj.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `CustomerReceipt/Insert`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  public Delete(ReceiptID: number): Observable<Result> {
    let obj: CustomerReceiptHeader = {} as any;
    let currentUser = this.authenticationService.currentUserValue;
    obj.ReceiptID = ReceiptID;
    obj.CompanyDetailID = currentUser.CompanyDetailID;
    obj.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `CustomerReceipt/Delete`, this.objJsonModal)
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
