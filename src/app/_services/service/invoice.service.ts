import { Injectable, } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { BadRequest } from '../../common/bad-request';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';

import { AuthenticationService } from './authentication.service';
import { Poorder, Invoice, Invoiceitem, Result, Vendorwarehouse } from '../model/index';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  lstInvoiceitem: Invoiceitem[];
  objInvoiceitem: Invoiceitem = {} as any;
  
  lstInvoice: Invoice[];
  objInvoice: Invoice = {} as any;

  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) { }

  public search(SearchBy: string, Search: string, StartDate: Date, EndDate: Date): Observable<Invoice[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Invoice[]>(environment.baseUrl +
      `Invoice/Search?CompanyID=` + CompanyID + `&CompanyDetailID=` + CompanyDetailID + `&SearchBy=` + encodeURIComponent(SearchBy) + 
      `&Search=` + Search + `&StartDate=` + StartDate + `&EndDate=` + EndDate)
      .pipe(catchError(this.handleError));
  }

  public searchById(PurchaseID: number, POID: number): Observable<Invoice> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Invoice>(environment.baseUrl +
      `Invoice/SearchByID?CompanyID=` + CompanyID + `&CompanyDetailID=` + CompanyDetailID  + 
      `&PurchaseID=` + PurchaseID  + `&POID=` + POID)
      .pipe(catchError(this.handleError));
  }

  public exist(PurchaseID: number, InvoiceNumber: string) {
    PurchaseID = isNaN(PurchaseID) ? 0 : PurchaseID;
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Boolean>(environment.baseUrl +
      `Invoice/Exist?CompanyDetailID=` + CompanyDetailID + `&PurchaseID=` + PurchaseID + 
      `&InvoiceNumber=` + InvoiceNumber)
      .pipe(map(users => {
        if (users)
          return true;
        else
          return false;
      })
      );
  }

  public GetPoHeaderByPOID(POID: number): Observable<Poorder> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Poorder>(environment.baseUrl + `POOrder/SearchById?POID=` + POID
      + `&CompanyDetailID=` + CompanyDetailID)
      .pipe(catchError(this.handleError));
  }

  // public getInvoiceItems(PurchaseID: number): Observable<Invoiceitem[]> {
  //   let currentUser = this.authenticationService.currentUserValue;
  //   let CompanyDetailID = currentUser.CompanyDetailID;
  //   let CompanyID = currentUser.CompanyID;
  //   return this.httpClient.get<Invoiceitem[]>(environment.baseUrl + `Invoice/GetInvoiceItems?PurchaseID=` + PurchaseID +
  //     `&CompanyDetailID=` + CompanyDetailID + `&CompanyID=` + CompanyID)
  //     .pipe(catchError(this.handleError));
  // }

  public getNewInvoice(POID: number): Observable<Invoiceitem[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Invoiceitem[]>(environment.baseUrl + `Invoice/GetNewInvoice?POID=` + POID +
      `&CompanyID=` + CompanyID + `&CompanyDetailID=` + CompanyDetailID)
      .pipe(catchError(this.handleError));
  } 
  
  public upsert(objInvoice: Invoice ): Observable<Result> {    
    let currentUser = this.authenticationService.currentUserValue; 
    objInvoice.CompanyDetailID = currentUser.CompanyDetailID;
    objInvoice.LoginId = currentUser.UserId; 
    return this.httpClient.post<Result>(environment.baseUrl + `Invoice/Upsert`, objInvoice)
      .pipe(catchError(this.handleError));
  }

  public delete(PurchaseID: number): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    this.objInvoice.PurchaseID = PurchaseID;
    this.objInvoice.CompanyDetailID = currentUser.CompanyDetailID;
    this.objInvoice.LoginId = currentUser.UserId;
    return this.httpClient.post<Result>(environment.baseUrl + `Invoice/Delete`, this.objInvoice)
      .pipe(catchError(this.handleError));
  }

  public getVendorWarehouses(VendorID:number): Observable<Vendorwarehouse[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Vendorwarehouse[]>(environment.baseUrl + `PrivateUtility/GetVendorWarehouses?CompanyID=` + CompanyID+
    `&VendorID=` + VendorID)
      .pipe(catchError(this.handleError));
  }

  public getGSTType(VendorWarehouseID:number,LocationID :number ): Observable<string> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<string>(environment.baseUrl + `PrivateUtility/GetGSTType?CompanyID=` + CompanyID+
    `&VendorWarehouseID=` + VendorWarehouseID + `&LocationID=` + LocationID )
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
