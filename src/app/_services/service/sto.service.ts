import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AppError } from '../../common/app-error';
import { BadRequest } from '../../common/bad-request';
import { NotFoundError } from '../../common/not-found-error';

import { Sto, Stodetail,Result } from '../model/index';
import { AuthenticationService } from './authentication.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StoService {
  objSto: Sto = {} as any;

  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService
  ) { }

  public search(SearchBy: string, Search: string, StartDate: Date, EndDate: Date): Observable<Sto[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Sto[]>(environment.baseUrl + `STO/Search?CompanyDetailID=` +
      CompanyDetailID + `&SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search + `&StartDate=` + StartDate
      + `&EndDate=` + EndDate)
      .pipe(catchError(this.handleError));
  }

  public searchById(STOID: number): Observable<Sto> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Sto>(environment.baseUrl + `STO/SearchById?STOID=` + STOID
      + `&CompanyDetailID=` + CompanyDetailID)
      .pipe(catchError(this.handleError));
  }

  public getStockDiscountItems(STOID: number, IsDiscount: boolean): Observable<Stodetail[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Stodetail[]>(environment.baseUrl + `STO/GetStockDiscountItems?STOID=` + STOID
      + `&CompanyDetailID=` + CompanyDetailID
      + `&IsDiscount=` + IsDiscount)
      .pipe(catchError(this.handleError));
  }

  public generateSTONumber(): Observable<string> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl + `STO/GenerateSTONumber?CompanyDetailID=` + CompanyDetailID)
      .pipe(catchError(this.handleError));
  }

  public Insert(objSto: Sto): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    objSto.CompanyDetailID = currentUser.CompanyDetailID;
    objSto.CompanyID = currentUser.CompanyID;
    objSto.LoginId = currentUser.UserId;
    return this.httpClient.post<Result>(environment.baseUrl + `STO/Insert`, objSto)
      .pipe(catchError(this.handleError));
  }

  public Update(objSto: Sto): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    objSto.CompanyDetailID = currentUser.CompanyDetailID;
    objSto.CompanyID = currentUser.CompanyID;
    objSto.LoginId = currentUser.UserId;
    return this.httpClient.post<Result>(environment.baseUrl + `STO/Update`, objSto)
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
