import { Injectable, } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { BadRequest } from '../../common/bad-request';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';

import { AuthenticationService } from './authentication.service';
import { Poshipment, Poorderitem, Result } from '../model/index';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class PoshipmentService {

  lstPoshipment: Poshipment[];
  objPoshipment: Poshipment = {} as any;
  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) {
  }

  public search(SearchBy: string, Search: string, FromDate: Date, ToDate: Date):
    Observable<Poshipment[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Poshipment[]>(environment.baseUrl + `Poshipment/Search?CompanyDetailID=` + CompanyDetailID
      + `&CompanyID=` + CompanyID + `&SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search
      + `&FromDate=` + FromDate + `&ToDate=` + ToDate)
      .pipe(catchError(this.handleError));
  }

  public searchById(POID: number, ShipmentID: number): Observable<Poshipment> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Poshipment>(environment.baseUrl + `Poshipment/SearchByID?POID=` + POID
      + `&ShipmentID=` + ShipmentID + `&CompanyDetailID=` + CompanyDetailID + `&CompanyID=` + CompanyID)
      .pipe(catchError(this.handleError));
  }

  public shipment_Pending(): Observable<Poshipment[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Poshipment[]>(environment.baseUrl +
      `Poshipment/shipment_Pending?CompanyDetailID=` + CompanyDetailID
    )
      .pipe(catchError(this.handleError));
  }

  // public shipment_Pending():
  //   Observable<Poorder[]> {
  //   let currentUser = this.authenticationService.currentUserValue;
  //   let CompanyDetailID = currentUser.CompanyDetailID;
  //   return this.httpClient.get<Poorder[]>(environment.baseUrl +
  //     `Poshipment/shipment_Pending?CompanyDetailID=` + CompanyDetailID
  //   )
  //     .pipe(catchError(this.handleError));
  // }

  public getShipmentAvailableQty(POID: number): Observable<Poorderitem[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Poorderitem[]>(environment.baseUrl + `Poshipment/GetShipmentAvailableQty?POID=` + POID +
      `&CompanyDetailID=` + CompanyDetailID)
      .pipe(catchError(this.handleError));
  }

  public existShipmentNumber(ShipmentID: number, ShipmentNumber: string) {
    ShipmentID = isNaN(ShipmentID) ? 0 : ShipmentID;
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Boolean>(environment.baseUrl + `Poshipment/Exist?ShipmentID=` + ShipmentID +
      `&ShipmentNumber=` + ShipmentNumber + `&CompanyDetailID=` + CompanyDetailID)
      .pipe(
        map(users => {
          if (users && users == true)
            return true;
          else
            return false;
        })
      );
  }

  public add(obj: Poshipment, Filedata: File[],): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    let LoginId = currentUser.UserId;
    let frmData = new FormData();
    frmData.append("ShipmentNumber", obj.ShipmentNumber);
    frmData.append("ShipmentName", obj.ShipmentName);
    frmData.append("CompanyDetailID", CompanyDetailID.toString());
    frmData.append("POID", obj.POID.toString());
    if (obj.CarpID != null) {
      frmData.append("CarpID", obj.CarpID);
    }
    if (obj.Appointment != null) {
      frmData.append("Appointment", obj.Appointment.toString());
    }
    frmData.append("Remarks", obj.Remarks);
    frmData.append("IsMailSent", obj.IsMailSent ? "True" : "False");
    frmData.append("ShipmentStatus", '');
    frmData.append("LoginId", LoginId.toString());
    let ItemIdsData: string = '';
    obj.lstItem.forEach(element => {
      ItemIdsData += element.ItemID + ":" + element.ShipmentQty + "|";
    });
    ItemIdsData = ItemIdsData.substring(0, ItemIdsData.length - 1);
    frmData.append("ItemIdsData", ItemIdsData.toString());

    if (Filedata != null && Filedata.length > 0) {
      for (var i = 0; i < Filedata.length; i++) {
        frmData.append("fileUpload", Filedata[i]);
      }
    }
    return this.httpClient.post<Result>(environment.baseUrl + `Poshipment/Create`, frmData)
      .pipe(catchError(this.handleError));
  }

  public update(obj: Poshipment): Observable<Boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.CompanyDetailID = currentUser.CompanyDetailID;
    obj.LoginId = currentUser.UserId;
    return this.httpClient.post<Boolean>(environment.baseUrl + `Poshipment/Update`, obj)
      .pipe(catchError(this.handleError));
  }

  public delete(ShipmentID: number, POID: number): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    this.objPoshipment.ShipmentID = ShipmentID;
    this.objPoshipment.POID = POID;
    this.objPoshipment.CompanyDetailID = currentUser.CompanyDetailID;
    this.objPoshipment.LoginId = currentUser.UserId;
    return this.httpClient.post<Result>(environment.baseUrl + `Poshipment/Delete`, this.objPoshipment)
      .pipe(catchError(this.handleError));
  }
  public DownloadLabels(POID: number, ShipmentID: number) {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get(environment.baseUrl + `Poshipment/DownloadLabels?POID=` + POID
      + `&ShipmentID=` + ShipmentID + `&CompanyDetailID=` + CompanyDetailID + `&CompanyID=` + CompanyID,
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
