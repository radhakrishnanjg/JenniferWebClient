import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AppError } from '../../common/app-error';
import { BadRequest } from '../../common/bad-request';
import { NotFoundError } from '../../common/not-found-error';

import { Salesorder, Item, SalesorderItem, Result, SalesorderunsellableQty } from '../model/index';
import { AuthenticationService } from './authentication.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesorderService {
  objSalesorder: Salesorder = {} as any;

  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService
  ) { }

  public search(SearchBy: string, Search: string, StartDate: Date,EndDate:Date): Observable<Salesorder[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Salesorder[]>(environment.baseUrl + `SalesOrder/Search?CompanyDetailID=` +
      CompanyDetailID + `&SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search 
      + `&StartDate=` + StartDate  + `&EndDate=` + EndDate )
      .pipe(catchError(this.handleError));
  }

  public searchById(SalesOrderID: number): Observable<Salesorder> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Salesorder>(environment.baseUrl + `SalesOrder/SearchById?SalesOrderID=` + SalesOrderID
      + `&CompanyDetailID=` + CompanyDetailID)
      .pipe(catchError(this.handleError));
  }

  public getItems(SalesOrderID: number): Observable<SalesorderItem[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<SalesorderItem[]>(environment.baseUrl + `SalesOrder/GetOrderItems?SalesOrderID=` + SalesOrderID +
      `&CompanyDetailID=` + CompanyDetailID)
      .pipe(catchError(this.handleError));
  }

  public getOrderID(CustomerID: number): Observable<string> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl + `SalesOrder/GetOrderID?CustomerID=` + CustomerID +
      `&CompanyDetailID=` + CompanyDetailID)
      .pipe(catchError(this.handleError));
  }

  public getUnsellableQty(CustomerID: number, TransactionType: string, OrderDate: string): Observable<SalesorderunsellableQty> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<SalesorderunsellableQty>(environment.baseUrl + `SalesOrder/GetUnsellableQty?CompanyDetailID=` + CompanyDetailID + `&CustomerID=` + CustomerID
      + `&TransactionType=` + TransactionType
      + `&OrderDate=` + OrderDate)
      .pipe(catchError(this.handleError));
  }

  public Insert(objSalesOrder: Salesorder): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    objSalesOrder.CompanyDetailID = currentUser.CompanyDetailID;
    objSalesOrder.CompanyID = currentUser.CompanyID;
    objSalesOrder.LoginId = currentUser.UserId;
    return this.httpClient.post<Result>(environment.baseUrl + `SalesOrder/Insert`, objSalesOrder)
      .pipe(catchError(this.handleError));
  }

  public approval(SalesOrderID: number, ApprovalStatus: string): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    this.objSalesorder.SalesOrderID = SalesOrderID;
    this.objSalesorder.ApprovalStatus = ApprovalStatus;
    this.objSalesorder.CompanyDetailID = currentUser.CompanyDetailID;
    this.objSalesorder.LoginId = currentUser.UserId;
    return this.httpClient.post<Result>(environment.baseUrl + `SalesOrder/ApprovalUpdate`, this.objSalesorder)
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
