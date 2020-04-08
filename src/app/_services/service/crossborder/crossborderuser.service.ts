import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { BadRequest } from '../../../common/bad-request';
import { NotFoundError } from '../../../common/not-found-error';
import { AppError } from '../../../common/app-error';

import { AuthenticationService } from '.././authentication.service';
import { Result } from '../../model/crossborder';
import { environment } from '../../../../environments/environment';
import { IUser } from '../../model';

@Injectable({
  providedIn: 'root'
})
export class CrossborderuserService {
  objUser: IUser = {} as any;
  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService
  ) { }

  public search(SearchBy: string, Search: string, IsActive: boolean):
    Observable<IUser[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let LoginId = currentUser.UserId;
    return this.httpClient.get<string>(environment.baseUrl + `CrossBorderUser/Search?Search=` + Search
      + `&SearchBy=` + encodeURIComponent(SearchBy)
      + `&IsActive=` + IsActive + `&LoginId=` + LoginId)
      .pipe(
        map(data => {
          return JSON.parse(data) as IUser[];
        }),
        catchError(this.handleError)
      );
  }

  public searchById(UserId: number):
    Observable<IUser> {
    let currentUser = this.authenticationService.currentUserValue;
    let LoginId = currentUser.UserId;
    return this.httpClient.get<string>(environment.baseUrl + `CrossBorderUser/SearchById?LoginId=` + LoginId
      + `&UserId=` + UserId)
      .pipe(
        map(data => {
          return JSON.parse(data) as IUser;
        }),
        catchError(this.handleError)
      );
  }

  public insert(user: IUser): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    user.UserType = currentUser.UserType;
    user.LoginId = currentUser.UserId;
    return this.httpClient.post<Result>(environment.baseUrl + `CrossBorderUser/Insert`, user)
      .pipe(catchError(this.handleError));
  }

  public update(user: IUser): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue; 
    user.LoginId = currentUser.UserId;
    return this.httpClient.post<Result>(environment.baseUrl + `CrossBorderUser/Update`, user)
      .pipe(catchError(this.handleError));
  }

  public delete(Id: number): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    this.objUser.UserId = Id;
    this.objUser.CompanyID = currentUser.CompanyID;
    this.objUser.LoginId = currentUser.UserId;
    return this.httpClient.post<Result>(environment.baseUrl + `CrossBorderUser/Delete`, this.objUser)
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
