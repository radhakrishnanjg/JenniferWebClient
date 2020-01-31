import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { BadRequest } from '../../common/bad-request';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';

import { AuthenticationService } from './authentication.service';
import { DebitNoteHeader, Result, JsonModal, DebitNoteDetail, PendingPurchaseInvoice } from '../model/index';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DebitnoteService {
  objJsonModal: JsonModal = {} as any;
  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) {
  }
  public Search(SearchBy: string, Search: string, StartDate: Date, EndDate: Date):
    Observable<DebitNoteHeader[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl + `DebitNote/Search?CompanyDetailID=` + CompanyDetailID
      + `&SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search
      + `&StartDate=` + StartDate + `&EndDate=` + EndDate)
      .pipe(
        map(data => {
          return JSON.parse(data) as DebitNoteHeader[];
        }),
        catchError(this.handleError)
      );
  }

  public SearchById(DNType: string, DNID: number): Observable<DebitNoteHeader> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl + `DebitNote/SearchById?DNType=` + DNType
      + `&DNID=` + DNID
      + `&CompanyDetailID=` + CompanyDetailID)
      .pipe(
        map(data => {
          return JSON.parse(data) as DebitNoteHeader;
        }),
        catchError(this.handleError)
      );
  }

  public PendingInvoicesByVendorId(DNType: string, VendorID: number): Observable<PendingPurchaseInvoice[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl +
      `DebitNote/PendingInvoicesByVendorId?DNType=` + DNType
      + `&VendorID=` + VendorID
      + `&CompanyDetailID=` + CompanyDetailID)
      .pipe(
        map(data => {
          return JSON.parse(data) as PendingPurchaseInvoice[];
        }),
        catchError(this.handleError)
      );
  }

  public SearchByPurchaseID(DNType: string, PurchaseID: number): Observable<DebitNoteDetail[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl +
      `DebitNote/SearchByPurchaseID?DNType=` + DNType
      + `&PurchaseID=` + PurchaseID
      + `&CompanyDetailID=` + CompanyDetailID
    )
      .pipe(
        map(data => {
          return JSON.parse(data) as DebitNoteDetail[];
        }),
        catchError(this.handleError)
      );
  }


  public Insert(obj: DebitNoteHeader): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.CompanyDetailID = currentUser.CompanyDetailID;
    obj.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `DebitNote/Insert`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  public Delete(DNID: number, DNType: string): Observable<Result> {
    let obj: DebitNoteHeader = {} as any;
    let currentUser = this.authenticationService.currentUserValue;
    obj.DNID = DNID;
    obj.DNType = DNType;
    obj.CompanyDetailID = currentUser.CompanyDetailID;
    obj.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `DebitNote/Delete`, this.objJsonModal)
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
