import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { BadRequest } from './../../common/bad-request';
import { AppError } from './../../common/app-error';
import { NotFoundError } from './../../common/not-found-error';
import { AuthenticationService } from './authentication.service';
import { Shipmentoutward, Result } from './../model/index';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShipmentoutwardService {

  lstShipmentoutward: Shipmentoutward[];
  objShipmentoutward: Shipmentoutward;
  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService

  ) { }

  public search(SearchBy: string, Search: string): Observable<Shipmentoutward[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Shipmentoutward[]>(environment.baseUrl +
      `ShipmentOutward/Search?CompanyDetailID=` + CompanyDetailID + `&SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search)
      .pipe(catchError(this.handleError));
  }

  public searchById(ShipmentOutwardID: number): Observable<Shipmentoutward> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Shipmentoutward>(environment.baseUrl +
      `ShipmentOutward/SearchById?CompanyDetailID=` + CompanyDetailID + `&ShipmentOutwardID=` + ShipmentOutwardID)
      .pipe(catchError(this.handleError));
  }

  public generateOutwardID(): Observable<string> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<string>(environment.baseUrl +
      `ShipmentOutward/GenerateOutwardID?CompanyID=` + CompanyID)
      .pipe(catchError(this.handleError));
  }

  public updateGSTBill(objShipmentoutward: Shipmentoutward): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    objShipmentoutward.CompanyDetailID = currentUser.CompanyDetailID;
    objShipmentoutward.LoginId = currentUser.UserId;
    return this.httpClient.post<Result>(environment.baseUrl +
      `ShipmentOutward/UpdateGSTBill`, objShipmentoutward)
      .pipe(catchError(this.handleError));
  }

  public delete(ShipmentOutwardID: number): Observable<boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    this.objShipmentoutward = new Shipmentoutward();
    this.objShipmentoutward.ShipmentOutwardID = ShipmentOutwardID;
    this.objShipmentoutward.CompanyDetailID = currentUser.CompanyDetailID;
    this.objShipmentoutward.LoginId = currentUser.UserId;
    return this.httpClient.post<boolean>(environment.baseUrl +
      `ShipmentOutward/Delete`, this.objShipmentoutward)
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
