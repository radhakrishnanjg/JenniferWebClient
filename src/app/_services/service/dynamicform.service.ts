import { Injectable, } from '@angular/core';
import { HttpClient, HttpErrorResponse, } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BadRequest } from '../../common/bad-request';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';
import { AuthenticationService } from './authentication.service';
import { DynamicFormViewModel, DynamicFormDropDownViewModel, RequestForm, Result } from '../model/index';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DynamicformService {

  lstDynamicFormDropDownViewModel: DynamicFormDropDownViewModel[];
  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) { }

  public GetLiveForms(FormType: string): Observable<RequestForm[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let LoginId = currentUser.UserId;
    let UserType = currentUser.UserType;
    return this.httpClient.get<string>(environment.baseUrl +
      `DynamicForm/GetLiveForms?LoginId=` + LoginId
      + `&UserType=` + UserType 
      + `&FormType=` + FormType)
      .pipe(
        map(data => {
          return JSON.parse(data) as RequestForm[];
        }),
        catchError(this.handleError)
      );
  }

  public GetColumnDetail(RequestFormID: number): Observable<string> {
    return this.httpClient.get<string>(environment.baseUrl +
      `DynamicForm/GetColumnDetail?RequestFormID=` + RequestFormID)
      .pipe(catchError(this.handleError));
  }

  public GetColumnDetailDropDownValues(RequestFormID: number): Observable<DynamicFormDropDownViewModel[]> {
    return this.httpClient.get<DynamicFormDropDownViewModel[]>(environment.baseUrl +
      `DynamicForm/GetColumnDetailDropDownValues?RequestFormID=` + RequestFormID)
      .pipe(catchError(this.handleError));
  }

  public GetColumnDetailError(RequestFormID: number): Observable<string> {
    return this.httpClient.get<string>(environment.baseUrl +
      `DynamicForm/GetColumnDetailError?RequestFormID=` + RequestFormID)
      .pipe(catchError(this.handleError));
  }

  public GetFormHeader(RequestFormID: number): Observable<string> {
    return this.httpClient.get<string>(environment.baseUrl +
      `DynamicForm/GetFormHeader?RequestFormID=` + RequestFormID)
      .pipe(catchError(this.handleError));
  }

  public GenerateFormID(RequestFormID: number): Observable<string> {
    return this.httpClient.get<string>(environment.baseUrl +
      `DynamicForm/GenerateFormID?RequestFormID=` + RequestFormID)
      .pipe(catchError(this.handleError));
  }


  public Exist(RequestFormID: number, FormID: string, Value: string, Caption: string) {
    return this.httpClient.get<Boolean>(environment.baseUrl +
      `DynamicForm/Exist?RequestFormID=` + RequestFormID + `&FormID=` + FormID + `&Value=` + Value + `&Caption=` + Caption)
      .pipe(map(users => {
        if (users)
          return true;
        else
          return false;
      })
      );
  }

  public GetChildDropdownData(RequestFormID: number, WhereClause: string, Caption: string, Value: string): Observable<string> {
    return this.httpClient.get<string>(environment.baseUrl +
      `DynamicForm/GetChildDropdownData?RequestFormID=` + RequestFormID
      + `&WhereClause=` + WhereClause + `&Caption=` + Caption + `&Value=` + Value)
      .pipe(catchError(this.handleError));
  }

  public Insert(objDynamicFormViewModel: DynamicFormViewModel): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    objDynamicFormViewModel.LoginId = currentUser.UserId;
    return this.httpClient.post<Result>(environment.baseUrl + `DynamicForm/Insert`, objDynamicFormViewModel)
      .pipe(catchError(this.handleError));
  }

  public GetData(RequestFormID: number, FormID: string): Observable<string> {
    return this.httpClient.get<string>(environment.baseUrl +
      `DynamicForm/GetData?RequestFormID=` + RequestFormID + `&FormID=` + FormID)
      .pipe(catchError(this.handleError));
  }

  public InsertWorkFlow(objDynamicFormViewModel: DynamicFormViewModel): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    objDynamicFormViewModel.LoginId = currentUser.UserId;
    return this.httpClient.post<Result>(environment.baseUrl + `DynamicForm/InsertWorkFlow`, objDynamicFormViewModel)
      .pipe(catchError(this.handleError));
  }

  public GetWorkFlowAudits(RequestFormID: number, FormID: string): Observable<string> {
    return this.httpClient.get<string>(environment.baseUrl +
      `DynamicForm/GetWorkFlowAudits?RequestFormID=` + RequestFormID + `&FormID=` + FormID)
      .pipe(catchError(this.handleError));
  }

  public GetAllWorkFlowDetail(RequestFormID: number): Observable<string> {
    return this.httpClient.get<string>(environment.baseUrl +
      `DynamicForm/GetAllWorkFlowDetail?RequestFormID=` + RequestFormID)
      .pipe(catchError(this.handleError));
  }

  public GetDataReport(RequestFormID: number, SearchBy: string, Search: string,
    StartDate: string, EndDate: string): Observable<string> {
    return this.httpClient.get<string>(environment.baseUrl +
      `DynamicForm/GetDataReport?RequestFormID=` + RequestFormID + `&SearchBy=` + SearchBy + `&Search=` + Search
      + `&StartDate=` + StartDate + `&EndDate=` + EndDate)
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
