import { Injectable, } from '@angular/core';
import { HttpClient, HttpErrorResponse, } from '@angular/common/http';
import { Observable, throwError, } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BadRequest } from '../../common/bad-request';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';
import { AuthenticationService } from './authentication.service';
import { Salesratecard, Result, JsonModal, EventManager, Commission, FinancialAdjustment, DutyDepositLedgerHeader } from '../model/index';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class SalesratecardService {
  lstSalesratecard: Salesratecard[];
  objSalesratecard: Salesratecard = {} as any;

  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) { }

  public search(SearchBy: string, Search: string, StartDate: Date, EndDate: Date, IsActive: boolean):
    Observable<Salesratecard[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;

    return this.httpClient.get<Salesratecard[]>(environment.baseUrl +
      `SalesRateCard/Search?SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search +
      `&CompanyDetailID=` + CompanyDetailID + `&StartDate=` + StartDate + `&EndDate=` + EndDate + `&IsActive=` + IsActive)
      .pipe(catchError(this.handleError));
  }

  public upsert(objSalesratecard: Salesratecard, ItemIds: number[]): Observable<Result> {
    this.lstSalesratecard = [] as any;
    ItemIds.forEach(element => {
      let objSalesratecard1: Salesratecard = {} as any;
      // old data      
      objSalesratecard1.InventoryType = objSalesratecard.InventoryType;
      objSalesratecard1.SellingPrice = objSalesratecard.SellingPrice;
      objSalesratecard1.StartDate = objSalesratecard.StartDate;
      objSalesratecard1.EndDate = objSalesratecard.EndDate;
      // log and comany detail
      let currentUser = this.authenticationService.currentUserValue;
      objSalesratecard1.LoginId = currentUser.UserId;
      objSalesratecard1.CompanyDetailID = currentUser.CompanyDetailID;
      objSalesratecard1.ItemID = element;
      this.lstSalesratecard.push(objSalesratecard1);
    });

    return this.httpClient.post<Result>(environment.baseUrl + `SalesRateCard/Upsert`, this.lstSalesratecard)
      .pipe(catchError(this.handleError));
  }


  //#region Event Manager
  public EventManagerSearch(SearchBy: string, Search: string, StartDate: string, EndDate: string, IsActive: Boolean):
    Observable<EventManager[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<string>(environment.baseUrl + `SalesRateCard/EventManagerSearch?CompanyID=` + CompanyID
      + `&SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + encodeURIComponent(Search)
      + `&StartDate=` + StartDate + `&EndDate=` + EndDate + `&IsActive=` + IsActive)
      .pipe(
        map(data => {
          return JSON.parse(data) as EventManager[];
        }),
        catchError(this.handleError)
      );
  }

  objJsonModal: JsonModal = {} as any;
  lstEventManager: EventManager[] = [] as any;
  public EventManagerUpsert(objSalesratecard: EventManager, ItemIds: number[]): Observable<Result> {
    this.lstEventManager = [] as any;
    ItemIds.forEach(element => {
      let objSalesratecard1: EventManager = {} as any;
      // old data       
      objSalesratecard1.MarketplaceID = objSalesratecard.MarketplaceID;
      objSalesratecard1.CompanyDetailID = objSalesratecard.CompanyDetailID;
      objSalesratecard1.IsExpense = objSalesratecard.IsExpense;
      objSalesratecard1.Expense = objSalesratecard.Expense;
      objSalesratecard1.StartDate = objSalesratecard.StartDate;
      objSalesratecard1.EndDate = objSalesratecard.EndDate;
      // MULTIPLE item id
      let currentUser = this.authenticationService.currentUserValue;
      objSalesratecard1.LoginId = currentUser.UserId;
      objSalesratecard1.ItemID = element;
      this.lstEventManager.push(objSalesratecard1);
    });
    this.objJsonModal.Json = JSON.stringify(this.lstEventManager);
    return this.httpClient.post<Result>(environment.baseUrl + `SalesRateCard/EventManagerUpsert`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }
  // #endregion

  //#region Subscriptions
  public SubscriptionSearch(SearchBy: string, Search: string, StartDate: string, EndDate: string, IsActive: Boolean):
    Observable<Commission[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<string>(environment.baseUrl + `SalesRateCard/SubscriptionSearch?CompanyID=` + CompanyID
      + `&SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + encodeURIComponent(Search)
      + `&StartDate=` + StartDate + `&EndDate=` + EndDate + `&IsActive=` + IsActive)
      .pipe(
        map(data => {
          return JSON.parse(data) as Commission[];
        }),
        catchError(this.handleError)
      );
  }

  public SubscriptionUpsert(objSalesratecard: Commission): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    objSalesratecard.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(objSalesratecard);
    return this.httpClient.post<Result>(environment.baseUrl + `SalesRateCard/SubscriptionUpsert`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  // #endregion

  
  //#region Financial Adjustment  
  public FinancialAdjustmentSearch(SearchBy: string, Search: string, StartDate: string, EndDate: string):
    Observable<FinancialAdjustment[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<string>(environment.baseUrl +
       `SalesRateCard/FinancialAdjustmentSearch?CompanyID=` + CompanyID
      + `&SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + encodeURIComponent(Search)
      + `&StartDate=` + StartDate + `&EndDate=` + EndDate  )
      .pipe(
        map(data => {
          return JSON.parse(data) as FinancialAdjustment[];
        }),
        catchError(this.handleError)
      );
  }

  public FinancialAdjustmentAction(obj: FinancialAdjustment): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `SalesRateCard/FinancialAdjustmentAction`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  // #endregion

  //#region Duty Deposit Ledger   
  public DutyDepositLedgerSearch(SearchBy: string, Search: string, StartDate: string, EndDate: string):
    Observable<DutyDepositLedgerHeader[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<string>(environment.baseUrl +
       `SalesRateCard/DutyDepositLedgerSearch?CompanyID=` + CompanyID
      + `&SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + encodeURIComponent(Search)
      + `&StartDate=` + StartDate + `&EndDate=` + EndDate  )
      .pipe(
        map(data => {
          return JSON.parse(data) as DutyDepositLedgerHeader[];
        }),
        catchError(this.handleError)
      );
  }

  public DutyDepositLedgerSearchById(DutyDepositLedgerID: number):
    Observable<DutyDepositLedgerHeader> { 
    return this.httpClient.get<string>(environment.baseUrl +
       `SalesRateCard/DutyDepositLedgerSearchById?DutyDepositLedgerID=` + DutyDepositLedgerID )
      .pipe(
        map(data => {
          return JSON.parse(data) as DutyDepositLedgerHeader;
        }),
        catchError(this.handleError)
      );
  }

  public DutyDepositLedgerAction(obj: DutyDepositLedgerHeader): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `SalesRateCard/DutyDepositLedgerAction`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  // #endregion

  private handleError(error: HttpErrorResponse) {

    if (error.status === 404)
      return throwError(new NotFoundError(error));

    if (error.status === 400)
      return throwError(new BadRequest(error));
    return throwError(new AppError(error));
  }
}
