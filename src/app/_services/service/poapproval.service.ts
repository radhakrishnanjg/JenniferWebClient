import { Injectable, } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { BadRequest } from '../../common/bad-request';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';

import { AuthenticationService } from './authentication.service';
import { Poorder, Poorderitem, Result } from '../model/index';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class PoapprovalService {

  objPoorder: Poorder = {} as any;
  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) {
  }

  public search(SearchBy: string, Search: string, FromDate: Date, ToDate: Date):
    Observable<Poorder[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Poorder[]>(environment.baseUrl + `Poorder/ApprovalSearch?CompanyDetailID=` + CompanyDetailID
      + `&SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search
      + `&FromDate=` + FromDate + `&ToDate=` + ToDate)
      .pipe(catchError(this.handleError));
  }

  public searchById(POID: number): Observable<Poorder> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Poorder>(environment.baseUrl + `Poorder/ApprovalSearchById?POID=` + POID
      + `&CompanyDetailID=` + CompanyDetailID)
      .pipe(catchError(this.handleError));
  }

  public shipment_Pending():
    Observable<Poorder[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Poorder[]>(environment.baseUrl +
      `Poorder/shipment_Pending?CompanyDetailID=` + CompanyDetailID
    )
      .pipe(catchError(this.handleError));
  }

  public getOrderItems(POID: number): Observable<Poorderitem[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Poorderitem[]>(environment.baseUrl + `POOrder/GetOrderItems?POID=` + POID +
      `&CompanyDetailID=` + CompanyDetailID)
      .pipe(catchError(this.handleError));
  }

  public VerifyPOApproval(VerifyTotalAmount: number, VerifyLocationId: number, POId: number): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Result>(environment.baseUrl + `Poorder/POApprovalVerify?VerifyTotalAmount=` + VerifyTotalAmount +
      `&VerifyLocationId=` + VerifyLocationId + `&POId=` + POId + `&CompanyDetailID=` + CompanyDetailID)
      .pipe(catchError(this.handleError));
  }

  public update(obj: Poorder): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.CompanyDetailID = currentUser.CompanyDetailID;
    obj.LoginId = currentUser.UserId;
    return this.httpClient.post<Result>(environment.baseUrl + `Poorder/ApprovalUpdate`, obj)
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
