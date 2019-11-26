import { Injectable, } from '@angular/core';
import { HttpClient, HttpErrorResponse, } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BadRequest } from './../../common/bad-request';
import { NotFoundError } from './../../common/not-found-error';
import { AppError } from './../../common/app-error';
import { AuthenticationService } from './authentication.service';
import {
  RequestForm, RequestFormColumnDetail, RequestFormWorkFlowDetail,
  Department, RegularExpValue, SeniorMasterTable, Users, Result
} from '../model/index';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestformService {
  lst: RequestForm[];
  obj: RequestForm = {} as any;
  objDepartment: Department;
  objRegularExpvalue: RegularExpValue;
  objSeniorMasterTable: SeniorMasterTable;
  objUsers: Users;
  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) { }

  public search(SearchBy: string, Search: string): Observable<RequestForm[]> {
    return this.httpClient.get<RequestForm[]>(environment.baseUrl +
      `RequestForm/Search?SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search)
      .pipe(catchError(this.handleError));
  }

  public searchById(RequestFormID: number): Observable<RequestForm> {
    return this.httpClient.get<RequestForm>(environment.baseUrl +
      `RequestForm/SearchById?RequestFormID=` + RequestFormID)
      .pipe(catchError(this.handleError));
  }

  public exist(FormShortID: string, RequestFormID: number) {
    RequestFormID = isNaN(RequestFormID) ? 0 : RequestFormID;
    return this.httpClient.get<Boolean>(environment.baseUrl +
      `RequestForm/Exist?FormShortID=` + FormShortID + `&RequestFormID=` + RequestFormID)
      .pipe(map(users => {
        if (users)
          return true;
        else
          return false;
      })
      );
  }

  public generateRegisterID(SystemType: string): Observable<string> {
    return this.httpClient.get<string>(environment.baseUrl +
      `RequestForm/GenerateRegisterID?SystemType=` + SystemType)
      .pipe(catchError(this.handleError));
  }

  public department(): Observable<Department[]> {
    return this.httpClient.get<Department[]>(environment.baseUrl +
      `RequestForm/Department`)
      .pipe(catchError(this.handleError));
  }

  public requestFormRegularExpValue(): Observable<RegularExpValue[]> {
    return this.httpClient.get<RegularExpValue[]>(environment.baseUrl +
      `RequestForm/RequestFormRegularExpValue`)
      .pipe(catchError(this.handleError));
  }

  public requestFormSeniorMaster(): Observable<SeniorMasterTable[]> {
    return this.httpClient.get<SeniorMasterTable[]>(environment.baseUrl +
      `RequestForm/RequestFormSeniorMaster`)
      .pipe(catchError(this.handleError));
  }

  public requestFormUsersByDepartmentId(DepartmentId: number): Observable<Users[]> {
    return this.httpClient.get<Users[]>(environment.baseUrl +
      `RequestForm/RequestFormUsersByDepartmentId?DepartmentId=` + DepartmentId)
      .pipe(catchError(this.handleError));
  }

  public insert(objRequestForm: RequestForm): Observable<Result> {
    return this.httpClient.post<Result>(environment.baseUrl + `RequestForm/Insert`, objRequestForm)
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
