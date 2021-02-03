import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { BadRequest } from '../../common/bad-request';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';

import { AuthenticationService } from './authentication.service';
import { Result, AmazonAutoRTVConfiguration, AmazonAutoRTVOrder, MWSShipment, BulkDownloadTemplate, JsonModal, SalesInvoiceHeader, ProductTaxCode, ProductTaxCodeMaster } from '../model/index';
import { environment } from '../../../environments/environment';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class AmazonautortvService {
  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService
  ) { }


  public Search(SearchBy: string, Search: string, StartDate: string, EndDate: string):
    Observable<AmazonAutoRTVConfiguration[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl
      + `AmazonAutoRTV/Search?CompanyDetailID=` + CompanyDetailID
      + `&SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search
      + `&StartDate=` + StartDate + `&EndDate=` + EndDate)
      // .pipe(catchError(this.handleError));
      .pipe(
        map(data => {
          return JSON.parse(data) as AmazonAutoRTVConfiguration[];
        }),
        catchError(this.handleError)
      );
  }

  public SearchById(ConfigID: number): Observable<AmazonAutoRTVConfiguration> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<AmazonAutoRTVConfiguration>(environment.baseUrl
      + `AmazonAutoRTV/SearchById?CompanyDetailID=` + CompanyDetailID + `&ConfigID=` + ConfigID)
      .pipe(catchError(this.handleError));
  }

  public Exist(RTVLocationID: number, RTVReceivingLocationID: number, InventoryType: string,
    ConfigID: number) {
    ConfigID = isNaN(ConfigID) ? 0 : ConfigID;
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Boolean>(environment.baseUrl + `AmazonAutoRTV/Exist?RTVLocationID=` +
      RTVLocationID + `&RTVReceivingLocationID=` + RTVReceivingLocationID
      + `&InventoryType=` + InventoryType + `&ConfigID=` + ConfigID + `&CompanyDetailID=` + CompanyDetailID)
      .pipe(
        map(users => {
          if (users && users == true)
            return true;
          else
            return false;
        })
      );
  }

  public Insert(obj: AmazonAutoRTVConfiguration): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.CompanyDetailID = currentUser.CompanyDetailID;
    obj.LoginId = currentUser.UserId;
    return this.httpClient.post<Result>(environment.baseUrl + `AmazonAutoRTV/Insert`, obj)
      .pipe(catchError(this.handleError));
  }

  public Update(obj: AmazonAutoRTVConfiguration): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.CompanyDetailID = currentUser.CompanyDetailID;
    obj.LoginId = currentUser.UserId;
    return this.httpClient.post<Result>(environment.baseUrl + `AmazonAutoRTV/Update`, obj)
      .pipe(catchError(this.handleError));
  }

  //#region Amazon Auto RTV Order
  public OrderSearch(SearchBy: string, Search: string, StartDate: string, EndDate: string):
    Observable<AmazonAutoRTVOrder[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl
      + `AmazonAutoRTV/OrderSearch?CompanyDetailID=` + CompanyDetailID
      + `&SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search
      + `&StartDate=` + StartDate + `&EndDate=` + EndDate)
      .pipe(
        map(data => {
          return JSON.parse(data) as AmazonAutoRTVOrder[];
        }),
        catchError(this.handleError)
      );
  }


  public OrderDetailById(RTVID: number) {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get(environment.baseUrl
      + `AmazonAutoRTV/OrderDetailById?CompanyDetailID=` + CompanyDetailID + `&RTVID=` + RTVID,
      { responseType: 'blob' })
      .pipe(catchError(this.handleError));
  }

  public OrderDetailErrorById(RTVID: number) {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get(environment.baseUrl
      + `AmazonAutoRTV/OrderDetailErrorById?CompanyDetailID=` + CompanyDetailID + `&RTVID=` + RTVID,
      { responseType: 'blob' })
      .pipe(catchError(this.handleError));
  }

  public InvoiceInsert(obj: AmazonAutoRTVOrder): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.CompanyID = currentUser.CompanyID;
    obj.CompanyDetailID = currentUser.CompanyDetailID;
    obj.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `AmazonAutoRTV/InvoiceInsert`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  public InvoiceDownload(SalesInvoiceID: number): Observable<SalesInvoiceHeader> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<SalesInvoiceHeader>(environment.baseUrl
      + `AmazonAutoRTV/InvoiceDownload?SalesInvoiceID=` + SalesInvoiceID
      + `&CompanyDetailID=` + CompanyDetailID)
      .pipe(catchError(this.handleError));
  }

  // #endregion

  //#region RTV In Transit

  public GetInTransit(SearchBy: string, Search: string, StartDate: string, EndDate: string): Observable<MWSShipment[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl +
      `AmazonAutoRTV/GetInTransit?CompanyDetailID=` + CompanyDetailID
      + `&SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search
      + `&StartDate=` + StartDate + `&EndDate=` + EndDate)
      .pipe(
        map(data => {
          return JSON.parse(data) as MWSShipment[];
        }),
        catchError(this.handleError)
      );
  }


  // #endregion
  // #region Amazon Bulk RTV Order
  public BulkDownloadTemplate(LocationID: number):
    Observable<BulkDownloadTemplate[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<string>(environment.baseUrl + `AmazonAutoRTV/BulkDownloadTemplate?CompanyID=` + CompanyID
      + `&LocationID=` + LocationID
    )
      .pipe(
        map(data => {
          return JSON.parse(data) as BulkDownloadTemplate[];
        }),
        catchError(this.handleError)
      );
  }

  objJsonModal: JsonModal = {} as any;
  public BulkAction(obj: AmazonAutoRTVOrder): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.CompanyID = currentUser.CompanyID;
    obj.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `AmazonAutoRTV/BulkAction`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  public BulkSearchById(BatchId: string):
    Observable<AmazonAutoRTVOrder> {
    return this.httpClient.get<string>(environment.baseUrl + `AmazonAutoRTV/BulkSearchById?BatchId=` + BatchId
    )
      .pipe(
        map(data => {
          return JSON.parse(data) as AmazonAutoRTVOrder;
        }),
        catchError(this.handleError)
      );
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }
  // #endregion


  // #region Amazon Product Tax Code

  public AmazonProductTaxCodeMaster():
    Observable<ProductTaxCodeMaster[]> {
    return this.httpClient.get<string>(environment.baseUrl + `AmazonAutoRTV/AmazonProductTaxCodeMaster`
    )
      .pipe(
        map(data => {
          return JSON.parse(data) as ProductTaxCodeMaster[];
        }),
        catchError(this.handleError)
      );
  }
  public AmazonProductTaxCodeDownloadTemplate():
    Observable<ProductTaxCode[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<string>(environment.baseUrl + `AmazonAutoRTV/AmazonProductTaxCodeDownloadTemplate?CompanyID=` + CompanyID
    )
      .pipe(
        map(data => {
          return JSON.parse(data) as ProductTaxCode[];
        }),
        catchError(this.handleError)
      );
  }

  public AmazonProductTaxCodeAction(obj: ProductTaxCode): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.CompanyID = currentUser.CompanyID;
    obj.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `AmazonAutoRTV/AmazonProductTaxCodeAction`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  public AmazonProductTaxCodeSearch(SearchBy: string, Search: string, StartDate: string, EndDate: string):
    Observable<ProductTaxCode[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<string>(environment.baseUrl
      + `AmazonAutoRTV/AmazonProductTaxCodeSearch?CompanyID=` + CompanyID
      + `&SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search
      + `&StartDate=` + StartDate + `&EndDate=` + EndDate
    )
      .pipe(
        map(data => {
          return JSON.parse(data) as ProductTaxCode[];
        }),
        catchError(this.handleError)
      );
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
