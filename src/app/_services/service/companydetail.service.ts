import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { BadRequest } from '../../common/bad-request';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';
import { AuthenticationService } from './authentication.service';

import {  Companydetails, Result } from '../model/index';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CompanydetailService {

  lstcompanydetails: Companydetails[];
  objcompanydetail: Companydetails = {} as any;
  private messageSource = new BehaviorSubject( new Companydetails()); 
  currentMessage = this.messageSource.asObservable();

  changeMessage(message: Companydetails) { 
    this.messageSource.next(message)
  }
  
  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) {
  }

  public search(Search: string): Observable<Companydetails[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    let LoginId = currentUser.UserId;
    return this.httpClient.get<Companydetails[]>(environment.baseUrl + 
      `CompanyDetail/Search?Search=` + Search + `&CompanyID=` + CompanyID + `&LoginId=` + LoginId)
      .pipe(catchError(this.handleError));
  }

  public searchById(Id: number): Observable<Companydetails> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Companydetails>(environment.baseUrl + `CompanyDetail/SearchByID?CompanyDetailID=` + Id + `&CompanyID=` + CompanyID)
      .pipe(catchError(this.handleError));
  }

  public Exist(CompanyDetailID: number, StoreName: string) {
    CompanyDetailID = isNaN(CompanyDetailID) ? 0 : CompanyDetailID;
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Boolean>(environment.baseUrl +
      `CompanyDetail/Exist?CompanyDetailID=` + CompanyDetailID + `&StoreName=` + StoreName + `&CompanyID=` + CompanyID)
      .pipe(
        map(users => {
          if (users && users == true)
            return true;
          else
            return false;
        })
      );
  }
  public ExistSellerID(CompanyDetailID: number, MarketPlaceSellerID: string) {
    CompanyDetailID = isNaN(CompanyDetailID) ? 0 : CompanyDetailID;
    return this.httpClient.get<Boolean>(environment.baseUrl +
      `CompanyDetail/ExistSellerID?CompanyDetailID=` + CompanyDetailID + `&MarketPlaceSellerID=` + MarketPlaceSellerID)
      .pipe(
        map(users => {
          if (users && users == true)
            return true;
          else
            return false;
        })
      );
  }

  public add(obj: Companydetails): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.CompanyID = currentUser.CompanyID;
    obj.LoginId = currentUser.UserId;

    return this.httpClient.post<Result>(environment.baseUrl + `CompanyDetail/Create`, obj)
      .pipe(catchError(this.handleError));
  }

  public update(obj: Companydetails): Observable<Boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.CompanyID = currentUser.CompanyID;
    obj.LoginId = currentUser.UserId;

    return this.httpClient.post<Boolean>(environment.baseUrl + `CompanyDetail/Update`, obj)
      .pipe(catchError(this.handleError));
  }
  public delete(CompanyDetailID: number): Observable<Boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    this.objcompanydetail.CompanyDetailID = CompanyDetailID;
    this.objcompanydetail.CompanyID = currentUser.CompanyID;
    this.objcompanydetail.LoginId = currentUser.UserId;
    return this.httpClient.post<Boolean>(environment.baseUrl + `CompanyDetail/Delete`, this.objcompanydetail)
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
