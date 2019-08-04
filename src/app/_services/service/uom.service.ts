import { Injectable, } from '@angular/core';
import { HttpClient, HttpErrorResponse, } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BadRequest } from './../../common/bad-request';
import { NotFoundError } from './../../common/not-found-error';
import { AppError } from './../../common/app-error';
import { AuthenticationService } from './authentication.service';
import { UOM, } from '../model/index';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UomService {
  lstUOM: UOM[];
  objUOM: UOM = {} as any;
  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) { }

  public getUOMS(SearchBy: string, Search: string,IsActive:Boolean): Observable<UOM[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID; 
    return this.httpClient.get<UOM[]>(environment.baseUrl +
      `UOM/Search?CompanyID=` + CompanyID +`&SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search+ `&IsActive=` + IsActive)
      .pipe(catchError(this.handleError));
  }

  public getUOM(UOMID: number): Observable<UOM> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID; 
    return this.httpClient.get<UOM>(environment.baseUrl +
      `UOM/SearchByID?CompanyID=` + CompanyID + `&UOMID=` + UOMID)
      .pipe(catchError(this.handleError));
  }

  public existUOM(UOMID: number, UOM: string,Description: string) {
    UOMID = isNaN(UOMID) ? 0 : UOMID; 
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Boolean>(environment.baseUrl +
      `UOM/Exist?CompanyID=` + CompanyID + `&UOM=` + UOM + `&UOMID=` + UOMID+ `&Description=` + Description)
      .pipe(map(users => {
        if (users)
          return true;
        else
          return false;
      })
      );
  }

  public add(objUOM: UOM): Observable<boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    objUOM.CompanyId = currentUser.CompanyID;
    objUOM.LoginId = currentUser.UserId;
    return this.httpClient.post<boolean>(environment.baseUrl + `UOM/Create`, objUOM)
      .pipe(catchError(this.handleError));
  }

  public update(objUOM: UOM): Observable<boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    objUOM.CompanyId = currentUser.CompanyID;
    objUOM.LoginId = currentUser.UserId;
    return this.httpClient.post<boolean>(environment.baseUrl + `UOM/Update`, objUOM)
      .pipe(catchError(this.handleError));
  }
  public delete(UOMID: number): Observable<Boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    this.objUOM.UOMID = UOMID;
    this.objUOM.CompanyId = currentUser.CompanyID;
    this.objUOM.LoginId = currentUser.UserId;
    return this.httpClient.post<Boolean>(environment.baseUrl + `UOM/Delete`, this.objUOM)
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
