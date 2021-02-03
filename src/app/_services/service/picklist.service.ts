import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { BadRequest } from '../../common/bad-request';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';

import { AuthenticationService } from './authentication.service';
import { Picklistheader, Result, Picklistview, SalesInvoiceHeader, StockAuditReport, StockAudit, JsonModal, JenniferItemSerials, StockAuditStatus, StockExchangeDetail, StockExchangeHeader } from '../model/index';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PicklistService {

  objPicklistheader: Picklistheader = {} as any;
  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) {
  }

  public search(SearchBy: string, Search: string, LocationID: number):
    Observable<Picklistheader[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Picklistheader[]>(environment.baseUrl +
      `Picklist/Search?CompanyDetailID=` + CompanyDetailID
      + `&SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search
      + `&LocationID=` + LocationID)
      .pipe(catchError(this.handleError));
  }

  public searchById(PickListNumber: number): Observable<Picklistheader> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Picklistheader>(environment.baseUrl + `Picklist/SearchByID?PickListNumber=` + PickListNumber
      + `&CompanyDetailID=` + CompanyDetailID)
      .pipe(catchError(this.handleError));
  }

  public processSearchByID(objPicklistheader: Picklistheader): Observable<Picklistheader> {
    let currentUser = this.authenticationService.currentUserValue;
    objPicklistheader.CompanyDetailID = currentUser.CompanyDetailID;
    objPicklistheader.LoginId = currentUser.UserId;
    return this.httpClient.post<Picklistheader>(environment.baseUrl + `Picklist/ProcessSearchByID`, objPicklistheader)
      .pipe(catchError(this.handleError));
  }

  public process(objPicklistheader: Picklistheader): Observable<Picklistheader> {
    let currentUser = this.authenticationService.currentUserValue;
    objPicklistheader.CompanyDetailID = currentUser.CompanyDetailID;
    objPicklistheader.LoginId = currentUser.UserId;
    return this.httpClient.post<Picklistheader>(environment.baseUrl + `Picklist/Process`, objPicklistheader)
      .pipe(catchError(this.handleError));
  }

  public saveAsDraft(objPicklistheader: Picklistheader): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    objPicklistheader.CompanyDetailID = currentUser.CompanyDetailID;
    objPicklistheader.LoginId = currentUser.UserId;
    return this.httpClient.post<Result>(environment.baseUrl + `Picklist/SaveAsDraft`, objPicklistheader)
      .pipe(catchError(this.handleError));
  }

  public saveAsClose(objPicklistheader: Picklistheader): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    objPicklistheader.CompanyDetailID = currentUser.CompanyDetailID;
    objPicklistheader.LoginId = currentUser.UserId;
    return this.httpClient.post<Result>(environment.baseUrl + `Picklist/SaveAsClose`, objPicklistheader)
      .pipe(catchError(this.handleError));
  }



  public InvoiceDownload(PLNum: number): Observable<SalesInvoiceHeader> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<SalesInvoiceHeader>(environment.baseUrl
      + `Picklist/InvoiceDownload?PLNum=` + PLNum
      + `&CompanyDetailID=` + CompanyDetailID)
      .pipe(catchError(this.handleError));
  }

  public PicklistView(PLNum: number): Observable<Picklistview> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Picklistview>(environment.baseUrl
      + `Picklist/PicklistView?PickListNumber=` + PLNum
      + `&CompanyDetailID=` + CompanyDetailID)
      .pipe(catchError(this.handleError));
  }

  objJsonModal: JsonModal = {} as any;
  public StockAuditCheck(lst: JenniferItemSerials[]): Observable<StockAuditReport[]> {
    let obj = new StockAudit();
    let currentUser = this.authenticationService.currentUserValue;
    obj.CompanyDetailID = currentUser.CompanyDetailID;
    obj.LoginId = currentUser.UserId;
    obj.lstSerialNums = lst;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<string>(environment.baseUrl + `Picklist/StockAuditCheck`, this.objJsonModal)
      .pipe(
        map(data => {
          return JSON.parse(data) as StockAuditReport[];
        }),
        catchError(this.handleError)
      );
  }

  public StockAuditCheckStatus(JenniferItemSerial: string): Observable<StockAuditStatus[]> {
    let obj = new StockAudit();
    let currentUser = this.authenticationService.currentUserValue;
    obj.CompanyDetailID = currentUser.CompanyDetailID;
    obj.LoginId = currentUser.UserId;
    obj.JenniferItemSerial = JenniferItemSerial;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<string>(environment.baseUrl + `Picklist/StockAuditCheckStatus`, this.objJsonModal)
      .pipe(
        map(data => {
          return JSON.parse(data) as StockAuditStatus[];
        }),
        catchError(this.handleError)
      );
  }

  public StockExchangeProcess(lst: JenniferItemSerials[]): Observable<StockExchangeDetail[]> {
    let obj = new StockExchangeHeader();
    let currentUser = this.authenticationService.currentUserValue;
    obj.CompanyDetailID = currentUser.CompanyDetailID;
    obj.LoginId = currentUser.UserId;
    obj.lstSerialNums = lst;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<string>(environment.baseUrl + `Picklist/StockExchangeProcess`, this.objJsonModal)
      .pipe(
        map(data => {
          return JSON.parse(data) as StockExchangeDetail[];
        }),
        catchError(this.handleError)
      );
  }

  public StockExChangeSave(obj: StockExchangeHeader): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.CompanyDetailID = currentUser.CompanyDetailID;
    obj.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `Picklist/StockExChangeSave`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  public StockExChangeHistory(SearchBy: string, Search: string,):
    Observable<StockExchangeDetail[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl +
      `Picklist/StockExChangeHistory?CompanyDetailID=` + CompanyDetailID
      + `&SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + encodeURIComponent(Search))
      .pipe(
        map(data => {
          return JSON.parse(data) as StockExchangeDetail[];
        }),
        catchError(this.handleError)
      );
  }
  private handleError(error: HttpErrorResponse) {

    if (error.status === 404)
      return throwError(new NotFoundError(error));

    if (error.status === 400)
      return throwError(new BadRequest(error));
    return throwError(new AppError(error));
  }

}
