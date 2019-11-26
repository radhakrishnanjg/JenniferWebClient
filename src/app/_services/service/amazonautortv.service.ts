import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { BadRequest } from '../../common/bad-request';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';

import { AuthenticationService } from './authentication.service';
import { Result, AmazonAutoRTVConfiguration, AmazonAutoRTVOrder, MWSShipment } from '../model/index';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AmazonautortvService { 
  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService
  ) { }


  public Search(SearchBy: string, Search: string, StartDate: Date, EndDate: Date):
    Observable<AmazonAutoRTVConfiguration[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<AmazonAutoRTVConfiguration[]>(environment.baseUrl
      + `AmazonAutoRTV/Search?CompanyDetailID=` + CompanyDetailID
      + `&SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search
      + `&StartDate=` + StartDate + `&EndDate=` + EndDate)
      .pipe(catchError(this.handleError));
  }

  public SearchById(ConfigID: number): Observable<AmazonAutoRTVConfiguration> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<AmazonAutoRTVConfiguration>(environment.baseUrl
      + `AmazonAutoRTV/SearchById?CompanyDetailID=` + CompanyDetailID + `&ConfigID=` + ConfigID)
      .pipe(catchError(this.handleError));
  }

  public Exist(RTVLocationID: number, RTVReceivingLocationID: number, InventoryType: string,
    ConfigID: number) {
    ConfigID = isNaN(ConfigID) ? 0 : ConfigID;
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Boolean>(environment.baseUrl + `AmazonAutoRTV/Exist?RTVLocationID=` +
      RTVLocationID + `&RTVReceivingLocationID=` + RTVReceivingLocationID
      + `&InventoryType=` + InventoryType + `&ConfigID=` + ConfigID + `&CompanyDetailID=` + CompanyDetailID)
      .pipe(
        map(users => {
          if (users && users == true)
            return true;
          else
            return false;
        })
      );
  }

  public Insert(obj: AmazonAutoRTVConfiguration): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.CompanyDetailID = currentUser.CompanyDetailID;
    obj.LoginId = currentUser.UserId;
    return this.httpClient.post<Result>(environment.baseUrl + `AmazonAutoRTV/Insert`, obj)
      .pipe(catchError(this.handleError));
  }

  public Update(obj: AmazonAutoRTVConfiguration): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.CompanyDetailID = currentUser.CompanyDetailID;
    obj.LoginId = currentUser.UserId;
    return this.httpClient.post<Result>(environment.baseUrl + `AmazonAutoRTV/Update`, obj)
      .pipe(catchError(this.handleError));
  }


  public OrderSearch(SearchBy: string, Search: string, StartDate: Date, EndDate: Date):
    Observable<AmazonAutoRTVOrder[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<AmazonAutoRTVOrder[]>(environment.baseUrl
      + `AmazonAutoRTV/OrderSearch?CompanyDetailID=` + CompanyDetailID
      + `&SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search
      + `&StartDate=` + StartDate + `&EndDate=` + EndDate)
      .pipe(catchError(this.handleError));
  }
 

  public OrderDetailById(RTVID: number) {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get(environment.baseUrl
      + `AmazonAutoRTV/OrderDetailById?CompanyDetailID=` + CompanyDetailID + `&RTVID=` + RTVID,
      { responseType: 'blob' })
      .pipe(catchError(this.handleError));
  }

  public OrderDetailErrorById(RTVID: number) {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get(environment.baseUrl
      + `AmazonAutoRTV/OrderDetailErrorById?CompanyDetailID=` + CompanyDetailID + `&RTVID=` + RTVID,
      { responseType: 'blob' })
      .pipe(catchError(this.handleError));
  }

  public GetInTransit(): Observable<MWSShipment[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<MWSShipment[]>(environment.baseUrl +
      `AmazonAutoRTV/GetInTransit?CompanyDetailID=` + CompanyDetailID)
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
