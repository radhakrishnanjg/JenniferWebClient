import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { BadRequest } from '../../common/bad-request';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';

import { AuthenticationService } from './authentication.service';
import { environment } from '../../../environments/environment';
import { SalesShipment } from '../model';
@Injectable({
  providedIn: 'root'
})
export class SalesShipmentService {

  salesShipment: SalesShipment = {} as any;
  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) {
  }

  public search(SearchBy: string, Search: string):
    Observable<SalesShipment[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<SalesShipment[]>(environment.baseUrl + `SalesShipment/Search?CompanyDetailID=` + CompanyDetailID
      + `&SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search)
      .pipe(catchError(this.handleError));
  }

  public searchById(ShipmentOutwardID: number): Observable<SalesShipment> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<SalesShipment>(environment.baseUrl + `SalesShipment/SearchById?ShipmentOutwardID=` + ShipmentOutwardID
      + `&CompanyDetailID=` + CompanyDetailID)
      .pipe(catchError(this.handleError));
  }

  public getShipmentID(): Observable<string> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<string>(environment.baseUrl + `SalesShipment/GetShipmentID?CompanyID=` + CompanyID)
      .pipe(catchError(this.handleError));
  }

  // public getInvoiceNumbers(): Observable<SalesInvoice> {
  //   let currentUser = this.authenticationService.currentUserValue;
  //   let CompanyDetailID = currentUser.CompanyDetailID;
  //   return this.httpClient.get<SalesInvoice>(environment.baseUrl + `SalesShipment/GetInvoices?CompanyDetailID=` + CompanyDetailID)
  //     .pipe(catchError(this.handleError));
  // }

  // public getCourierNames(): Observable<Courier> {
  //   return this.httpClient.get<Courier>(environment.baseUrl + `SalesShipment/GetCourierNames`)
  //     .pipe(catchError(this.handleError));
  // }

  // public getUOMs(): Observable<Courier> {
  //   let currentUser = this.authenticationService.currentUserValue;
  //   let CompanyID = currentUser.CompanyID;
  //   return this.httpClient.get<Courier>(environment.baseUrl + `PrivateUtility/GetUOMs?CompanyID=` + CompanyID)
  //     .pipe(catchError(this.handleError));
  // }

  public existCourierTrackingID(ShipmentOutwardID: number, CourierTrackingID: string) {
    ShipmentOutwardID = isNaN(ShipmentOutwardID) ? 0 : ShipmentOutwardID;
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Boolean>(environment.baseUrl + `SalesShipment/Exist?ShipmentOutwardID=` +
      ShipmentOutwardID + `&CourierTrackingID=` + CourierTrackingID + `&CompanyDetailID=` + CompanyDetailID)
      .pipe(
        map(data => {
          if (data && data == true)
            return true;
          else
            return false;
        })
      );
  }

  public generateSalesShipment(): Observable<string> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<string>(environment.baseUrl + `SalesShipment/GenerateSaleShipment?CompanyID=` + CompanyID)
      .pipe(catchError(this.handleError));
  }

  public add(obj: SalesShipment): Observable<Boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.CompanyDetailID = currentUser.CompanyDetailID;
    obj.LoginId = currentUser.UserId;
    return this.httpClient.post<Boolean>(environment.baseUrl + `SalesShipment/Create`, obj)
      .pipe(catchError(this.handleError));
  }

  public update(obj: SalesShipment): Observable<Boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.CompanyDetailID = currentUser.CompanyDetailID;
    obj.LoginId = currentUser.UserId;
    return this.httpClient.post<Boolean>(environment.baseUrl + `SalesShipment/Update`, obj)
      .pipe(catchError(this.handleError));
  }

  public delete(shipmentOutwardID: number): Observable<Boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    this.salesShipment.ShipmentOutwardID = shipmentOutwardID;
    this.salesShipment.CompanyDetailID = currentUser.CompanyDetailID;
    this.salesShipment.LoginId = currentUser.UserId;
    return this.httpClient.post<Boolean>(environment.baseUrl + `SalesShipment/Delete`, this.salesShipment)
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
