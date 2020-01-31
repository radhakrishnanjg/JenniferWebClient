import { Injectable } from '@angular/core';
import { Ticket, Result, JsonModal, History } from '../model/index';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from '../service/authentication.service';
import { throwError, Observable } from 'rxjs';
import { BadRequest } from 'src/app/common/bad-request';
import { AppError } from 'src/app/common/app-error';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  objJsonModal: JsonModal = {} as any;
  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService,
  ) { }

  public search(SearchBy: string, Search: string): Observable<Ticket[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let LoginId = currentUser.UserId;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl + `Ticket/Search?CompanyDetailID=` 
    + CompanyDetailID + `&SearchBy=` + SearchBy + `&Search=` + Search + `&LoginId=` + LoginId) 
    .pipe(
      map(data => {
        return JSON.parse(data) as Ticket[];
      }),
      catchError(this.handleError))
  }

  public searchById(SupportQueryID: number): Observable<History[]> {
    let currentUser = this.authenticationService.currentUserValue; 
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl + `Ticket/SearchById?SupportQueryID=`
    + SupportQueryID + `&CompanyDetailID=` + CompanyDetailID)
    .pipe(
      map(data => {
        return JSON.parse(data) as History[];
      }),
      catchError(this.handleError)
    )
  }

  public getUserType(): Observable<History> {
    let currentUser = this.authenticationService.currentUserValue;
    let LoginId = currentUser.UserId; 
    return this.httpClient.get<string>(environment.baseUrl + `Ticket/GetUserType?LoginId=` + LoginId) 
    .pipe(
      map(data => {
        return JSON.parse(data) as History;
      }),
      catchError(this.handleError))
  }

  public searchSellerStatementChatHistory(ReferenceNumber: string): Observable<History[]> { 
    let currentUser = this.authenticationService.currentUserValue; 
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl + `Ticket/SearchSellerStatementChatHistory?ReferenceNumber=`
    + ReferenceNumber + `&CompanyDetailID=` + CompanyDetailID)
    .pipe(
      map(data => {
        return JSON.parse(data) as History[];
      }),
      catchError(this.handleError)
    )
  }

  public insert(obj: Ticket): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue; 
    obj.LoginId = currentUser.UserId;
    obj.CompanyDetailID = currentUser.CompanyDetailID;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `Ticket/Insert`, this.objJsonModal)
    .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status == 404)
      return throwError(new BadRequest(error));

    if (error.status == 400)
      return throwError(new BadRequest(error));
    return throwError(new AppError(error));
  } 
}
