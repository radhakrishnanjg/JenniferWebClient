import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';

import { BadRequest } from '../../common/bad-request';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';

import { AuthenticationService } from './authentication.service';
import { VendorPaymentHeader, Result, VendorPaymentDetail, JsonModal } from '../model/index';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})

export class VendorpaymentService {
  objJsonModal: JsonModal = {} as any;
  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) {
  }

  public Search(SearchBy: string, Search: string, StartDate: Date, EndDate: Date):
    Observable<VendorPaymentHeader[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl + `Vendorpayment/Search?CompanyDetailID=` + CompanyDetailID
      + `&SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search
      + `&StartDate=` + StartDate + `&EndDate=` + EndDate)
      .pipe(
        map(data => {
          return JSON.parse(data) as VendorPaymentHeader[];
        }),
        catchError(this.handleError)
      );
  }

  public SearchById(PaymentID: number): Observable<VendorPaymentHeader> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl + `Vendorpayment/SearchById?PaymentID=` + PaymentID
      + `&CompanyDetailID=` + CompanyDetailID)
      .pipe(
        map(data => {
          return JSON.parse(data) as VendorPaymentHeader;
        }),
        catchError(this.handleError)
      );
  }

  public SearchByVendorId(VendorID: number): Observable<VendorPaymentDetail[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl +
      `Vendorpayment/SearchByVendorId?VendorID=` + VendorID
      + `&CompanyDetailID=` + CompanyDetailID)
      .pipe(
        map(data => {
          return JSON.parse(data) as VendorPaymentDetail[];
        }),
        catchError(this.handleError)
      );;
  }

  public Insert(obj: VendorPaymentHeader): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.CompanyDetailID = currentUser.CompanyDetailID;
    obj.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `Vendorpayment/Insert`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  public Update(obj: VendorPaymentHeader): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.CompanyDetailID = currentUser.CompanyDetailID;
    obj.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `Vendorpayment/Update`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  public Delete(PaymentID: number): Observable<Result> {
    let obj: VendorPaymentHeader = {} as any;
    let currentUser = this.authenticationService.currentUserValue;
    obj.PaymentID = PaymentID;
    obj.CompanyDetailID = currentUser.CompanyDetailID;
    obj.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `Vendorpayment/Delete`, this.objJsonModal)
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
