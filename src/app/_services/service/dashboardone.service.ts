import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from './authentication.service';
import { Result, ItemLevelStaticData, ProfitLossData, ItemWiseProfitLossData, Companydetails } from '../model/index';
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
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl +
      `Dashboard1/UpdatedDate?CompanyDetailID=` + CompanyDetailID)
      .pipe(catchError(this.handleError));
  }

  public liveSalesData(): Observable<string> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl +
      `Dashboard1/LiveSalesData?CompanyDetailID=` + CompanyDetailID)
      .pipe(catchError(this.handleError));
  }

  public liveReturnsValue(): Observable<string> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl +
      `Dashboard1/LiveReturnsValue?CompanyDetailID=` + CompanyDetailID)
      .pipe(catchError(this.handleError));
  }

  public orderByTime(): Observable<string> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl +
      `Dashboard1/OrderByTime?CompanyDetailID=` + CompanyDetailID)
      .pipe(catchError(this.handleError));
  }

  public performence(StrtDT: string, EndDT: string): Observable<string> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl +
      `Dashboard1/Performence?CompanyDetailID=` + CompanyDetailID + `&StrtDT=` + StrtDT + `&EndDT=` + EndDT)
      .pipe(catchError(this.handleError));
  }

  public returnsByTime(): Observable<string> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl +
      `Dashboard1/ReturnsByTime?CompanyDetailID=` + CompanyDetailID)
      .pipe(catchError(this.handleError));
  }

  public salesVsReturnsOrders(StrtDT: string, EndDT: string): Observable<string> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl +
      `Dashboard1/SalesVsReturnsOrders?CompanyDetailID=` + CompanyDetailID + `&StrtDT=` + StrtDT + `&EndDT=` + EndDT)
      .pipe(catchError(this.handleError));
  }

  public salesVsReturnsValue(StrtDT: string, EndDT: string): Observable<string> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl +
      `Dashboard1/SalesVsReturnsValue?CompanyDetailID=` + CompanyDetailID + `&StrtDT=` + StrtDT + `&EndDT=` + EndDT)
      .pipe(catchError(this.handleError));
  }

  public staticSalesData(StrtDT: string, EndDT: string): Observable<string> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl +
      `Dashboard1/StaticSalesData?CompanyDetailID=` + CompanyDetailID + `&StrtDT=` + StrtDT + `&EndDT=` + EndDT)
      .pipe(catchError(this.handleError));
  }

  public topProductsSalesOrder(): Observable<string> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl +
      `Dashboard1/TopProductsSalesOrder?CompanyDetailID=` + CompanyDetailID)
      .pipe(catchError(this.handleError));
  }

  public topSellersInRevenue(StrtDT: string, EndDT: string): Observable<string> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl +
      `Dashboard1/TopSellersInRevenue?CompanyDetailID=` + CompanyDetailID + `&StrtDT=` + StrtDT + `&EndDT=` + EndDT)
      .pipe(catchError(this.handleError));
  }

  public revenueByLocation(StrtDT: string, EndDT: string): Observable<string> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl +
      `Dashboard1/RevenueByLocation?CompanyDetailID=` + CompanyDetailID + `&StrtDT=` + StrtDT + `&EndDT=` + EndDT)
      .pipe(catchError(this.handleError));
  }

  public ItemLevelStaticData(): Observable<ItemLevelStaticData[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl +
      `Dashboard1/ItemLevelStaticData?CompanyDetailID=` + CompanyDetailID)
      .pipe(
        map(data => {
          return JSON.parse(data) as ItemLevelStaticData[];
        }),
        catchError(this.handleError)
      );
  }

  //#region  Profit Loss

  public GetProfitStores(CompanyID: number): Observable<Companydetails[]> {
    return this.httpClient.get<string>(environment.baseUrl +
      `Dashboard1/GetProfitStores?CompanyID=` + CompanyID)
      .pipe(
        map(data => {
          return JSON.parse(data) as Companydetails[];
        }),
        catchError(this.handleError)
      );
  }


  public GetProfitLossOrders(CompanyDetailID: number): Observable<ProfitLossData[]> {
    return this.httpClient.get<string>(environment.baseUrl +
      `Dashboard1/GetProfitLossOrders?CompanyDetailID=` + CompanyDetailID)
      .pipe(
        map(data => {
          return JSON.parse(data) as ProfitLossData[];
        }),
        catchError(this.handleError)
      );
  }

  public GetProfitLossSKUs(CompanyDetailID: number): Observable<ProfitLossData[]> {
    return this.httpClient.get<string>(environment.baseUrl +
      `Dashboard1/GetProfitLossSKUs?CompanyDetailID=` + CompanyDetailID)
      .pipe(
        map(data => {
          return JSON.parse(data) as ProfitLossData[];
        }),
        catchError(this.handleError)
      );
  }

  public GetProfitLossData(CompanyDetailID: number, OrderID: string, SKU: string,
    StrtDT: string, EndDT: string): Observable<ProfitLossData[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyId = currentUser.CompanyID;
    return this.httpClient.get<string>(environment.baseUrl +
      `Dashboard1/GetProfitLossData?CompanyId=` + CompanyId +
      `&CompanyDetailID=` + CompanyDetailID + `&OrderID=` + OrderID +
      `&SKU=` + SKU + `&StrtDT=` + StrtDT + `&EndDT=` + EndDT
    )
      .pipe(
        map(data => {
          return JSON.parse(data) as ProfitLossData[];
        }),
        catchError(this.handleError)
      );
  }

  public GetItemWiseProfitLossData(SearchBy: string, Search: string,
    StrtDT: string, EndDT: string): Observable<ItemWiseProfitLossData[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyId = currentUser.CompanyID;
    return this.httpClient.get<string>(environment.baseUrl +
      `Dashboard1/GetItemWiseProfitLossData?CompanyId=` + CompanyId +
      `&SearchBy=` + SearchBy + `&Search=` + Search +
      `&StrtDT=` + StrtDT + `&EndDT=` + EndDT
    )
      .pipe(
        map(data => {
          return JSON.parse(data) as ItemWiseProfitLossData[];
        }),
        catchError(this.handleError)
      );
  }
  //#endregion

  public GetMISPresentation(SearchBy: string, Search: string,
    StrtDT: string, EndDT: string): Observable<any[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyId = currentUser.CompanyID;
    return this.httpClient.get<string>(environment.baseUrl +
      `Dashboard1/GetMISPresentation?CompanyId=` + CompanyId +
      `&SearchBy=` + SearchBy + `&Search=` + Search +
      `&StrtDT=` + StrtDT + `&EndDT=` + EndDT
    ).pipe(
      map(data => {
        return JSON.parse(data) as any[];
      }),
      catchError(this.handleError)
    );
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
