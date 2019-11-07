import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from './authentication.service';
@Injectable({
  providedIn: 'root'
})
export class DashboardoneService {

  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService
  ) { }


  public updatedDate(): Observable<string> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = 31;//currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl +
      `Dashboard1/UpdatedDate?CompanyDetailID=` + CompanyDetailID)
      .pipe(catchError(this.handleError));
  }

  public liveSalesData(): Observable<string> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID =31;//currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl +
      `Dashboard1/LiveSalesData?CompanyDetailID=` + CompanyDetailID)
      .pipe(catchError(this.handleError));
  }

  public liveReturnsValue(): Observable<string> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID =31;//currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl +
      `Dashboard1/LiveReturnsValue?CompanyDetailID=` + CompanyDetailID)
      .pipe(catchError(this.handleError));
  }

  public orderByTime(): Observable<string> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID =31;//currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl +
      `Dashboard1/OrderByTime?CompanyDetailID=` + CompanyDetailID)
      .pipe(catchError(this.handleError));
  }

  public performence(StrtDT: string, EndDT: string): Observable<string> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID =31;//currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl +
      `Dashboard1/Performence?CompanyDetailID=` + CompanyDetailID + `&StrtDT=` + StrtDT + `&EndDT=` + EndDT)
      .pipe(catchError(this.handleError));
  }

  public returnsByTime(): Observable<string> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID =31;//currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl +
      `Dashboard1/ReturnsByTime?CompanyDetailID=` + CompanyDetailID)
      .pipe(catchError(this.handleError));
  }

  public salesVsReturnsOrders(StrtDT: string, EndDT: string): Observable<string> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID =31;//currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl +
      `Dashboard1/SalesVsReturnsOrders?CompanyDetailID=` + CompanyDetailID + `&StrtDT=` + StrtDT + `&EndDT=` + EndDT)
      .pipe(catchError(this.handleError));
  }

  public salesVsReturnsValue(StrtDT: string, EndDT: string): Observable<string> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID =31;//currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl +
      `Dashboard1/SalesVsReturnsValue?CompanyDetailID=` + CompanyDetailID + `&StrtDT=` + StrtDT + `&EndDT=` + EndDT)
      .pipe(catchError(this.handleError));
  }

  public staticSalesData(StrtDT: string, EndDT: string): Observable<string> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID =31;//currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl +
      `Dashboard1/StaticSalesData?CompanyDetailID=` + CompanyDetailID + `&StrtDT=` + StrtDT + `&EndDT=` + EndDT)
      .pipe(catchError(this.handleError));
  }

  public topProductsSalesOrder(): Observable<string> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID =31;//currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl +
      `Dashboard1/TopProductsSalesOrder?CompanyDetailID=` + CompanyDetailID)
      .pipe(catchError(this.handleError));
  }

  public topSellersInRevenue(StrtDT: string, EndDT: string): Observable<string> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID =31;//currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl +
      `Dashboard1/TopSellersInRevenue?CompanyDetailID=` + CompanyDetailID + `&StrtDT=` + StrtDT + `&EndDT=` + EndDT)
      .pipe(catchError(this.handleError));
  }

  public revenueByLocation(StrtDT: string, EndDT: string): Observable<string> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID =31;//currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl +
      `Dashboard1/RevenueByLocation?CompanyDetailID=` + CompanyDetailID + `&StrtDT=` + StrtDT + `&EndDT=` + EndDT)
      .pipe(catchError(this.handleError));
  }

  private handleError(errorResponse: HttpErrorResponse) {
    if (errorResponse.error instanceof ErrorEvent) {
      console.error('Client Side Error :', errorResponse.error.message);
    } else {
      console.error('Server Side Error :', errorResponse);
    }
    return throwError('There is a problem with the service. We are notified & working on it. Please try again later.');
  }
}
