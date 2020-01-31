import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';

import { BadRequest } from '../../common/bad-request';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';

import { AuthenticationService } from './authentication.service';
import { Voucher, JsonModal, Result, Ledger, LedgerTaxRate } from '../model/index';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LedgerService {
  objJsonModal: JsonModal = {} as any;

  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService
  ) { }

  public Search(SearchBy: string, Search: string, IsActive: boolean):
    Observable<Ledger[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<string>(environment.baseUrl + `Ledger/Search?Search=` + Search
      + `&SearchBy=` + encodeURIComponent(SearchBy)
      + `&IsActive=` + IsActive
      + `&CompanyID=` + CompanyID)
      .pipe(
        map(data => {
          return JSON.parse(data) as Ledger[];
        }),
        catchError(this.handleError)
      );
  }

  public SearchById(LedgerID: number): Observable<Ledger> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<string>(environment.baseUrl + `Ledger/SearchById?LedgerID=` + LedgerID
      + `&CompanyID=` + CompanyID)
      .pipe(
        map(data => {
          return JSON.parse(data) as Ledger;
        }),
        catchError(this.handleError)
      );
  }

  public Exist(LedgerID: number, LedgerText: string, ) {
    LedgerID = isNaN(LedgerID) ? 0 : LedgerID;
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Boolean>(environment.baseUrl +
      `Ledger/Exist?LedgerText=` + LedgerText + `&LedgerID=` + LedgerID +
      `&CompanyID=` + CompanyID)
      .pipe(map(users => {
        if (users)
          return true;
        else
          return false;
      })
      );
  }

  public Insert(obj: Ledger): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.CompanyID = currentUser.CompanyID;
    obj.LoginId = currentUser.UserId;
    obj.Action = 'I';
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `Ledger/DoAction`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  public Update(obj: Ledger): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.LoginId = currentUser.UserId;
    obj.CompanyID = currentUser.CompanyID;
    obj.Action = 'U';
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `Ledger/DoAction`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  public Delete(LedgerID: number): Observable<Result> {
    let obj = new Ledger();
    obj.LedgerID = LedgerID
    let currentUser = this.authenticationService.currentUserValue;
    obj.LoginId = currentUser.UserId;
    obj.CompanyID = currentUser.CompanyID;
    obj.Action = 'D';
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `Ledger/DoAction`, this.objJsonModal)
      .pipe(catchError(this.handleError));

  }


  public gettaxrate(): Observable<LedgerTaxRate[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl + `Ledger/GetTaxrate?CompanyDetailID=` + CompanyDetailID)
      .pipe(
        map(data => {
          return JSON.parse(data) as LedgerTaxRate[];
        }),
        catchError(this.handleError)
      );
  }

  public getvoucher(): Observable<Voucher[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<string>(environment.baseUrl + `Ledger/GetVoucher?CompanyID=` + CompanyID)
      .pipe(
        map(data => {
          return JSON.parse(data) as Voucher[];
        }),
        catchError(this.handleError)
      );
  }


  private handleError(error: HttpErrorResponse) {
    if (error.status === 404)
      return throwError(new NotFoundError(error));

    if (error.status === 400)
      return throwError(new BadRequest(error));
    return throwError(new AppError(error));
  }
}
