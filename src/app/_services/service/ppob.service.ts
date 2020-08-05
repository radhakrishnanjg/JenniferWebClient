import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { BadRequest } from '../../common/bad-request';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';

import { AuthenticationService } from './authentication.service';
import { Ppob, Result, JsonModal } from '../model/index';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PpobService {
  objJsonModal: JsonModal = {} as any;

  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService
  ) { }

  
  public PPOBSearch(SearchBy: string, Search: string, IsActive: boolean):
    Observable<Ppob[]> { 
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<string>(environment.baseUrl + `PPOB/PPOBSearch?&SearchBy=` +
      encodeURIComponent(SearchBy) + `&Search=` + Search
      + `&IsActive=` + IsActive + `&CompanyID=` + CompanyID)
      .pipe(
        map(data => {
          return JSON.parse(data) as Ppob[];
        }),
        catchError(this.handleError)
      );
  }

  
  public PPOBSearchById(PPOBID: number): Observable<Ppob> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<string>(environment.baseUrl + `PPOB/PPOBSearchById?PPOBID=` + PPOBID
      + `&CompanyID=` + CompanyID)
      .pipe(
        map(data => {
          return JSON.parse(data) as Ppob;
        }),
        catchError(this.handleError)
      );
  }

  public PPOBInsert(obj: Ppob): Observable<Result> {
    debugger
    let currentUser = this.authenticationService.currentUserValue;
    obj.Action = 'I'; 
    obj.LoginId = currentUser.UserId;
    obj.CompanyID=currentUser.CompanyID
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `PPOB/PPOBAction`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  public PPOBUpdate(obj: Ppob): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.Action = 'U'; 
    obj.LoginId = currentUser.UserId;
    obj.CompanyID=currentUser.CompanyID
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `PPOB/PPOBAction`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  public PPOBDelete(PPOBID:number): Observable<Result> {
    let obj = new Ppob();
    let currentUser = this.authenticationService.currentUserValue;
    obj.Action = 'D';
    obj.PPOBID =PPOBID;
    obj.CompanyID = currentUser.CompanyID;
    obj.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `PPOB/PPOBAction`, this.objJsonModal)
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
