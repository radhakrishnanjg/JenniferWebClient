import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';

import { BadRequest } from '../../common/bad-request';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';

import { AuthenticationService } from './authentication.service';
import { Voucher, JsonModal, Result, VoucherGSTID } from '../model/index';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {

  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) { }


  public Search(SearchBy: string, Search: string, IsActive: boolean):
    Observable<Voucher[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<string>(environment.baseUrl + `Voucher/Search?Search=` + Search
      + `&SearchBy=` + encodeURIComponent(SearchBy)
      + `&IsActive=` + IsActive
      + `&CompanyID=` + CompanyID)
      .pipe(
        map(data => {
          return JSON.parse(data) as Voucher[];
        }),
        catchError(this.handleError)
      );
  }


  public SearchById(VoucherID: number): Observable<Voucher> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<string>(environment.baseUrl + `Voucher/SearchById?VoucherID=` + VoucherID
      + `&CompanyID=` + CompanyID)
      .pipe(
        map(data => {
          return JSON.parse(data) as Voucher;
        }),
        catchError(this.handleError)
      );
  }

  public GetGstId(StateID:number): Observable<VoucherGSTID[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<string>(environment.baseUrl + `Voucher/GetGstId?StateID=` + StateID+`&CompanyID=`+CompanyID)
      .pipe(
        map(data => {
          return JSON.parse(data) as VoucherGSTID[];
        }),
        catchError(this.handleError)
      );
  }


  public Exist(VoucherID:number, VoucherText: string, ) {
    VoucherID = isNaN(VoucherID) ? 0 : VoucherID;
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Boolean>(environment.baseUrl +
      `Voucher/Exist?VoucherText=` + VoucherText + `&VoucherID=` + VoucherID +
      `&CompanyID=` + CompanyID)
      .pipe(map(users => {
        if (users)
          return true;
        else
          return false;
      })
      );
  }

  objJsonModal: JsonModal = {} as any;
  public Insert(obj: Voucher): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.CompanyID = currentUser.CompanyID;
    obj.LoginId = currentUser.UserId;
    obj.Action = 'I';
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `Voucher/DoAction`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  public Update(obj: Voucher): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.LoginId = currentUser.UserId;
    obj.CompanyID = currentUser.CompanyID;
    obj.Action = 'U';
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `Voucher/DoAction`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  public Delete(VoucherID: number): Observable<Result> {
    let obj = new Voucher();
    obj.VoucherID = VoucherID
    let currentUser = this.authenticationService.currentUserValue;
    obj.LoginId = currentUser.UserId;
    obj.CompanyID = currentUser.CompanyID;
    obj.Action = 'D';
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `Voucher/DoAction`, this.objJsonModal)
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


