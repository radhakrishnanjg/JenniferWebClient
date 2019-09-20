import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { BadRequest } from '../../common/bad-request';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';
import { AuthenticationService } from './authentication.service';
import { environment } from '../../../environments/environment';
import { GoodsReceipt, GoodsReceiptDetail, PONumber, } from '../model/goodsreceipt.model';
import { Result } from '../model';
import { Dropdown } from '../model';

@Injectable({
  providedIn: 'root'
})
export class GoodsReceiptService {
  objGoodsReceipt: GoodsReceipt = {} as any;
  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) {
  }

  public search(SearchBy: string, Search: string, StartDate: Date, EndDate: Date):
    Observable<GoodsReceipt[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<GoodsReceipt[]>(environment.baseUrl + `GoodsReceipt/Search?CompanyDetailID=` + CompanyDetailID
      + `&SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search
      + `&StartDate=` + StartDate + `&EndDate=` + EndDate)
      .pipe(catchError(this.handleError));
  }

  public searchById(GRNID: number): Observable<GoodsReceipt> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<GoodsReceipt>(environment.baseUrl + `GoodsReceipt/SearchById?GRNID=` + GRNID
      + `&CompanyDetailID=` + CompanyDetailID)
      .pipe(catchError(this.handleError));
  }

  public getItems(POID: number,GRNType:string ,TrackingNumber:string): Observable<GoodsReceiptDetail[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    
    return this.httpClient.get<GoodsReceiptDetail[]>(environment.baseUrl + `GoodsReceipt/GetItemDetails?POID=` + POID +
      `&CompanyDetailID=` + CompanyDetailID +
      `&GRNType=` + GRNType +
      `&TrackingNumber=` + TrackingNumber)
      .pipe(catchError(this.handleError));
  }

  public getGRNNumber(): Observable<string> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl + `GoodsReceipt/GetGRNNumber?CompanyDetailID=` + CompanyDetailID)
      .pipe(catchError(this.handleError));
  }

  public getPONumbers(): Observable<PONumber[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<PONumber[]>(environment.baseUrl + `GoodsReceipt/GetPONumbers?CompanyDetailID=` + CompanyDetailID)
      .pipe(catchError(this.handleError));
  }

  public getInventoryType(): Observable<Dropdown[]> {
    return this.httpClient.get<Dropdown[]>(environment.baseUrl + `GoodsReceipt/GetInventoryType`)
      .pipe(catchError(this.handleError));
  }

  public exist(GRNID: number, InvoiceNumber: string) {
    GRNID = isNaN(GRNID) ? 0 : GRNID;
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Boolean>(environment.baseUrl +
      `GoodsReceipt/Exist?CompanyDetailID=` + CompanyDetailID + 
      `&InvoiceNumber=` + encodeURIComponent(InvoiceNumber) + `&GRNID=` + GRNID)
      .pipe(map(users => {
        if (users)
          return true;
        else
          return false;
      })
      );
  }

  public Insert(goodsReceipt: GoodsReceipt): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    goodsReceipt.CompanyDetailID = currentUser.CompanyDetailID;
    goodsReceipt.LoginId = currentUser.UserId;
    return this.httpClient.post<Result>(environment.baseUrl + `GoodsReceipt/Insert`, goodsReceipt)
      .pipe(catchError(this.handleError));
  }

  public Delete(GRNID: number): Observable<Result> { 
    let currentUser = this.authenticationService.currentUserValue;
    this.objGoodsReceipt.GRNID = GRNID;
    this.objGoodsReceipt.CompanyDetailID = currentUser.CompanyDetailID;
    this.objGoodsReceipt.LoginId = currentUser.UserId;
    return this.httpClient.post<Result>(environment.baseUrl + `GoodsReceipt/Delete`, this.objGoodsReceipt)
      .pipe(catchError(this.handleError));
  }

  public DownloadLabels(GRNNumber: string) {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get(environment.baseUrl + `GoodsReceipt/Download?CompanyDetailID=` + CompanyDetailID +
      `&GRNNumber=` + GRNNumber,
      { responseType: 'blob' })
      .pipe(catchError(this.handleError));
  }

  public updateImage(Filedata1: File,Filedata2: File,Filedata3: File,Filedata4: File, GRNNumber: string): Observable<boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    let frmData = new FormData();
    frmData.append("CompanyDetailID", currentUser.CompanyDetailID.toString());
    frmData.append("GRNNumber", GRNNumber);
    frmData.append("LoginId", currentUser.UserId.toString());
    frmData.append("Image1", Filedata1, Filedata1.name);
    frmData.append("Image2", Filedata2, Filedata2.name);
    if (Filedata3 != null) {
      frmData.append("Image3", Filedata3, Filedata3.name);
    }
    if (Filedata4 != null) {
      frmData.append("Image4", Filedata4, Filedata4.name);
    }
    return this.httpClient.post<boolean>(environment.baseUrl + `GoodsReceipt/UpdateImage`, frmData)
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
