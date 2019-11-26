
import { Injectable, } from '@angular/core';
import { HttpClient, HttpErrorResponse, } from '@angular/common/http';
import { Observable, throwError, } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError, tap } from 'rxjs/operators';
import { BadRequest } from '../../common/bad-request';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';
import { SeniorMaster, JsonModal, Result } from '../model/index';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from './authentication.service';
@Injectable({
  providedIn: 'root'
})
export class SeniormasterService {
  objJsonModal: JsonModal = {} as any; 
  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService,
    
  ) { }

  public Search(SearchBy: string, Search: string, IsActive: boolean): Observable<SeniorMaster[]> {
    return this.httpClient.get<string>(environment.baseUrl +
      `SeniorMaster/Search?SearchBy=` + encodeURIComponent(SearchBy)
      + `&Search=` + encodeURIComponent(Search)
      + `&IsActive=` + IsActive)
      .pipe(
        map(data => { 
          return JSON.parse(data) as SeniorMaster[];
        }),
        catchError(this.handleError)
      );
  }

  public SearchById(SeniorMasterTableID: number): Observable<SeniorMaster> {
    return this.httpClient.get<string>(environment.baseUrl +
      `SeniorMaster/SearchById?SeniorMasterTableID=` + SeniorMasterTableID)
      .pipe(
        map(data => {
          return JSON.parse(data) as SeniorMaster;
        }),
        catchError(this.handleError)
      );
  }

  public Exist(SeniorMasterTableID: number, TableName: string): Observable<boolean> {
    return this.httpClient.get<boolean>(environment.baseUrl +
      `SeniorMaster/Exist?SeniorMasterTableID=` + SeniorMasterTableID + `&TableName=` + encodeURIComponent(TableName))
      .pipe(catchError(this.handleError));
  }

  public Insert(objSeniorMaster: SeniorMaster): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    objSeniorMaster.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(objSeniorMaster);
    return this.httpClient.post<Result>(environment.baseUrl + `SeniorMaster/Insert`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  public Update(objSeniorMaster: SeniorMaster): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    objSeniorMaster.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(objSeniorMaster);
    return this.httpClient.patch<Result>(environment.baseUrl + `SeniorMaster/Update`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  public Delete(objSeniorMaster: SeniorMaster): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    objSeniorMaster.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(objSeniorMaster);
    return this.httpClient.post<Result>(environment.baseUrl + `SeniorMaster/Delete`, this.objJsonModal)
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
