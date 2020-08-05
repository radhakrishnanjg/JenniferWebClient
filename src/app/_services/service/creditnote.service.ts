import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { BadRequest } from '../../common/bad-request';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';

import { AuthenticationService } from './authentication.service';
import { CreditNoteHeader, Result, JsonModal, CreditNoteDetail, Refund, PendingSalesInvoice } from '../model/index';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CreditnoteService {
  objJsonModal: JsonModal = {} as any;
  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) {
  }
  public Search(SearchBy: string, Search: string, StartDate: Date, EndDate: Date):
    Observable<CreditNoteHeader[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl + `CreditNote/Search?CompanyDetailID=` + CompanyDetailID
      + `&SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search
      + `&StartDate=` + StartDate + `&EndDate=` + EndDate)
      .pipe(
        map(data => {
          return JSON.parse(data) as CreditNoteHeader[];
        }),
        catchError(this.handleError)
      );
  }

  public SearchById(CNType: string, CNID: number): Observable<CreditNoteHeader> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl + `CreditNote/SearchById?CNType=` + CNType
      + `&CNID=` + CNID
      + `&CompanyDetailID=` + CompanyDetailID)
      .pipe(
        map(data => {
          return JSON.parse(data) as CreditNoteHeader;
        }),
        catchError(this.handleError)
      );
  }

  public PendingSalesByCustomerId(CNType: string, CustomerId: number): Observable<PendingSalesInvoice[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl +
      `CreditNote/PendingSalesByCustomerId?CNType=` + CNType
      + `&CustomerId=` + CustomerId
      + `&CompanyDetailID=` + CompanyDetailID)
      .pipe(
        map(data => {
          return JSON.parse(data) as PendingSalesInvoice[];
        }),
        catchError(this.handleError)
      );
  }

  public SearchBySalesOrderID(CNType: string, SalesOrderID: number): Observable<CreditNoteDetail[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl +
      `CreditNote/SearchBySalesOrderID?CNType=` + CNType
      + `&SalesOrderID=` + SalesOrderID
      + `&CompanyDetailID=` + CompanyDetailID
    )
      .pipe(
        map(data => {
          return JSON.parse(data) as CreditNoteDetail[];
        }),
        catchError(this.handleError)
      );
  }

  public Insert(obj: CreditNoteHeader): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.CompanyDetailID = currentUser.CompanyDetailID;
    obj.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `CreditNote/Insert`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  public Delete(CNID: number, CNType: string): Observable<Result> {
    let obj: CreditNoteHeader = {} as any;
    let currentUser = this.authenticationService.currentUserValue;
    obj.CNID = CNID;
    obj.CNType = CNType;
    obj.CompanyDetailID = currentUser.CompanyDetailID;
    obj.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `CreditNote/Delete`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }
  
  public RefundSearch(SearchBy: string, Search: string, StartDate: Date, EndDate: Date):
    Observable<Refund[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl + `CreditNote/RefundSearch?CompanyDetailID=` + CompanyDetailID
      + `&SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search
      + `&StartDate=` + StartDate + `&EndDate=` + EndDate)
      .pipe(
        map(data => {
          return JSON.parse(data) as Refund[];
        }),
        catchError(this.handleError)
      );
  }

  public RefundSearchByCNID(CNID: number): Observable<Refund> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl + `CreditNote/RefundSearchByCNID?CNID=` + CNID
      + `&CompanyDetailID=` + CompanyDetailID)
      .pipe(
        map(data => {
          return JSON.parse(data) as Refund;
        }),
        catchError(this.handleError)
      );
  }

  public RefundInsert(obj: Refund): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.CompanyDetailID = currentUser.CompanyDetailID;
    obj.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `CreditNote/RefundInsert`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  public RefundDelete(RefundID: number): Observable<Result> {
    let obj: Refund = {} as any;
    let currentUser = this.authenticationService.currentUserValue;
    obj.RefundID = RefundID; 
    obj.CompanyDetailID = currentUser.CompanyDetailID;
    obj.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `CreditNote/RefundDelete`, this.objJsonModal)
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
