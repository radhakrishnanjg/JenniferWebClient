import { Injectable, } from '@angular/core';
import { HttpClient, HttpErrorResponse, } from '@angular/common/http';
import { Observable, throwError, } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError, tap } from 'rxjs/operators';
import { BadRequest } from '../../common/bad-request';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';
import { Department, JsonModal, Result } from '../model/index';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from './authentication.service';
@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  objJsonModal: JsonModal = {} as any;
  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService
  ) { }

  public Search(SearchBy: string, Search: string, IsActive: boolean): Observable<Department[]> {
    return this.httpClient.get<string>(environment.baseUrl +
      `Department/Search?SearchBy=` + encodeURIComponent(SearchBy)
      + `&Search=` + encodeURIComponent(Search)
      + `&IsActive=` + IsActive)
      .pipe(
        map(data => {
          return JSON.parse(data) as Department[];
        }),
        catchError(this.handleError)
      );
  }

  public SearchById(DepartmentID: number): Observable<Department> {
    return this.httpClient.get<string>(environment.baseUrl +
      `Department/SearchById?DepartmentID=` + DepartmentID)
      .pipe(
        map(data => {
          return JSON.parse(data) as Department
        }),
        catchError(this.handleError)
      );
  }

  public Exist(DepartmentID: number, Code: string): Observable<boolean> {
    return this.httpClient.get<boolean>(environment.baseUrl +
      `Department/Exist?DepartmentID=` + DepartmentID + `&Code=` + encodeURIComponent(Code))
      .pipe(catchError(this.handleError));
  }


  public Insert(objDepartment: Department): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    objDepartment.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(objDepartment);
    return this.httpClient.post<Result>(environment.baseUrl + `Department/Insert`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  public Update(objDepartment: Department): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    objDepartment.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(objDepartment);
    return this.httpClient.patch<Result>(environment.baseUrl + `Department/Update`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  public Delete(objDepartment: Department): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    objDepartment.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(objDepartment);
    return this.httpClient.post<Result>(environment.baseUrl + `Department/Delete`, this.objJsonModal)
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
