import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import {  throwError, Observable } from 'rxjs';
import { BadRequest } from './../../common/bad-request';
import { AppError } from './../../common/app-error';
import { NotFoundError } from './../../common/not-found-error';
import { AuthenticationService } from './authentication.service';
import { Goodsstorage,Result } from './../model/index';
import { environment } from '../../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class GoodsstorageService {

  lstGoodsstorage: Goodsstorage[];
  objGoodsstorage: Goodsstorage;
  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService
  ) { }

  public search(SearchBy: string, Search: string): Observable<Goodsstorage[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Goodsstorage[]>(environment.baseUrl +
      `Goodsstorage/Search?CompanyDetailID=` + CompanyDetailID + `&SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search)
      .pipe(catchError(this.handleError));
  }

  public searchById(GoodsStorageID: number): Observable<Goodsstorage> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Goodsstorage>(environment.baseUrl +
      `Goodsstorage/SearchById?CompanyDetailID=` + CompanyDetailID + `&GoodsStorageID=` + GoodsStorageID)
      .pipe(catchError(this.handleError));
  }
  public exist(GoodsStorageID: number, JenniferItemSerial: string) { 
    GoodsStorageID = isNaN(GoodsStorageID) ? 0 : GoodsStorageID;
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Boolean>(environment.baseUrl +
      `Goodsstorage/Exist?CompanyDetailID=` + CompanyDetailID +
      `&GoodsStorageID=` + GoodsStorageID + `&JenniferItemSerial=` + JenniferItemSerial)
      .pipe(map(items => {
        return items;
      })
      );
  }

  public add(objGoodsstorage: Goodsstorage[]): Observable<Result> {
    return this.httpClient.post<Result>(environment.baseUrl + `Goodsstorage/Insert`, objGoodsstorage)
      .pipe(catchError(this.handleError));
  }

  public update(objGoodsstorage: Goodsstorage): Observable<boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    objGoodsstorage.CompanyDetailID = currentUser.CompanyDetailID;
    objGoodsstorage.LoginId = currentUser.UserId;
    return this.httpClient.post<boolean>(environment.baseUrl + `Goodsstorage/Update`, objGoodsstorage)
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