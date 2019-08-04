import { Injectable, } from '@angular/core';
import { HttpClient, HttpErrorResponse  } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, throwError,   } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { BadRequest } from '../../common/bad-request';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';

import { AuthenticationService } from './authentication.service';
import {  Location ,Result} from '../model/index';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class LocationService {

  lstlocation: Location[];
  objlocation: Location = {} as any;
  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) {
  }

  public search(SearchBy: string, Search: string,IsActive:Boolean): Observable<Location[]> {
     
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Location[]>(environment.baseUrl + `Location/Search?SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` +
     Search + `&IsActive=` + IsActive + `&CompanyID=` + CompanyID)
      .pipe(catchError(this.handleError));
  }

  public searchById(Id: number): Observable<Location> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Location>(environment.baseUrl + `Location/SearchByID?LocationID=` + Id + `&CompanyID=` + CompanyID)
      .pipe(catchError(this.handleError));
  }

  public existLocationName(LocationID: number, LocationName: string) {
    LocationID = isNaN(LocationID) ? 0 : LocationID;
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Boolean>(environment.baseUrl + `Location/ExistLocationName?LocationID=` + LocationID + `&LocationName=` + LocationName +`&CompanyID=` + CompanyID)
      .pipe(
        map(users => {
          if (users && users == true)
            return true;
          else
            return false;
        })
      );
  }

  public existGSTNumber(LocationID: number, GSTNumber: string) {
    LocationID = isNaN(LocationID) ? 0 : LocationID;
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Boolean>(environment.baseUrl + `Location/ExistGSTNumber?LocationID=` + LocationID + `&GSTNumber=` + GSTNumber +`&CompanyID=` + CompanyID)
      .pipe(
        map(users => {
          if (users && users == true)
            return true;
          else
            return false;
        })
      );
  }

  public add(obj: Location): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.CompanyID = currentUser.CompanyID;
    obj.LoginId = currentUser.UserId; 
    return this.httpClient.post<Result>(environment.baseUrl + `Location/Create`, obj)
      .pipe(catchError(this.handleError));
  }

  public update(obj: Location): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.CompanyID = currentUser.CompanyID;
    obj.LoginId = currentUser.UserId;

    return this.httpClient.post<Result>(environment.baseUrl + `Location/Update`, obj)
      .pipe(catchError(this.handleError));
  }
  
  public delete(LocationID: number): Observable<Boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    this.objlocation.LocationID = LocationID;
    this.objlocation.CompanyID = currentUser.CompanyID;
    this.objlocation.LoginId = currentUser.UserId;
    return this.httpClient.post<Boolean>(environment.baseUrl + `Location/Delete`, this.objlocation)
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
