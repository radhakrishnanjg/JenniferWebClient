import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { BadRequest } from '../../common/bad-request';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';

import { AuthenticationService } from './authentication.service';
import {
  Poorder, Poorderitem, Result, Brand, ProductGroup, Category, SubCategory, UOM, Item, Poprint
  , PoMFI
} from '../model/index';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class PoService {
  objPoorder: Poorder = {} as any;
  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) {
  }

  public search(SearchBy: string, Search: string, StartDate: Date, EndDate: Date):
    Observable<Poorder[]> {

    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Poorder[]>(environment.baseUrl + `POOrder/Search?CompanyDetailID=` + CompanyDetailID
      + `&SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search
      + `&StartDate=` + StartDate + `&EndDate=` + EndDate)
      .pipe(catchError(this.handleError));
  }

  public searchById(POID: number): Observable<Poorder> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Poorder>(environment.baseUrl + `POOrder/SearchById?POID=` + POID
      + `&CompanyDetailID=` + CompanyDetailID)
      .pipe(catchError(this.handleError));
  }

  public getItems(POID: number): Observable<Poorderitem[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Poorderitem[]>(environment.baseUrl + `POOrder/GetOrderItems?POID=` + POID +
      `&CompanyDetailID=` + CompanyDetailID)
      .pipe(catchError(this.handleError));
  }

  public getPONumber(LocationID: number): Observable<string> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl + `POOrder/GetPoNumber?LocationID=` + LocationID +
      `&CompanyDetailID=` + CompanyDetailID)
      .pipe(catchError(this.handleError));
  }

  public InsertOrUpdate(objPoorder1: Poorder): Observable<Result> {
    // sad sad sadsa d
    let currentUser = this.authenticationService.currentUserValue;
    objPoorder1.CompanyDetailID = currentUser.CompanyDetailID;
    objPoorder1.CompanyID = currentUser.CompanyID;
    objPoorder1.LoginId = currentUser.UserId;

    return this.httpClient.post<Result>(environment.baseUrl + `POOrder/Upsert`, objPoorder1)
      .pipe(catchError(this.handleError));
  }

  public getOrderBrands(): Observable<Brand[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Brand[]>(environment.baseUrl + `PrivateUtility/GetOrderBrands?CompanyDetailID=` + CompanyDetailID)

      .pipe(catchError(this.handleError));
  }

  public getOrderProductGroups(BrandID: number): Observable<ProductGroup[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<ProductGroup[]>(environment.baseUrl + `PrivateUtility/GetOrderProductGroups?CompanyDetailID=` + CompanyDetailID
      + `&BrandID=` + BrandID)
      .pipe(catchError(this.handleError));
  }

  public getOrderCategories(BrandID: number, ProductGroupID: number): Observable<Category[]> {
    if (ProductGroupID != 0) {
      let currentUser = this.authenticationService.currentUserValue;
      let CompanyDetailID = currentUser.CompanyDetailID;
      return this.httpClient.get<Category[]>(environment.baseUrl + `PrivateUtility/GetOrderCategories?CompanyDetailID=` + CompanyDetailID +
        `&BrandID=` + BrandID + `&ProductGroupID=` + ProductGroupID)
        .pipe(catchError(this.handleError));
    }
  }

  public getOrderSubCategories(BrandID: number, CategoryID: number): Observable<SubCategory[]> {
    if (CategoryID != 0) {
      let currentUser = this.authenticationService.currentUserValue;
      let CompanyDetailID = currentUser.CompanyDetailID;
      return this.httpClient.get<SubCategory[]>(environment.baseUrl + `PrivateUtility/GetSubCategories?CompanyDetailID=` + CompanyDetailID +
        + `&BrandID=` + BrandID + `&CategoryID=` + CategoryID)
        .pipe(catchError(this.handleError));
    }
  }

  public getOrderUOMs(): Observable<UOM[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<UOM[]>(environment.baseUrl + `PrivateUtility/GetOrderUOMs?CompanyDetailID=` + CompanyDetailID)
      .pipe(catchError(this.handleError));
  }

  public getVendorItemLevels(vendorID: number): Observable<Item[]> {
    //if (SubCategoryID != 0) {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Item[]>(environment.baseUrl + `PrivateUtility/GetVendorItemLevels?CompanyDetailID=` + CompanyDetailID
      + `&VendorID=` + vendorID
    )
      .pipe(catchError(this.handleError));
    //}
  }

  // public getOrderItems(BrandID:number, SubCategoryID: number): Observable<Item[]> {
  //   if (SubCategoryID != 0) {
  //     let currentUser = this.authenticationService.currentUserValue;
  //     let CompanyDetailID = currentUser.CompanyDetailID;
  //     return this.httpClient.get<Item[]>(environment.baseUrl + `PrivateUtility/GetItems?CompanyDetailID=` + CompanyDetailID +
  //       `&BrandID=` + BrandID + `&SubCategoryID=` + SubCategoryID)
  //       .pipe(catchError(this.handleError));
  //   }
  // }

  public getItemDescription(ItemID: number, VendorID: number): Observable<Item> {
    if (ItemID != 0) {
      let currentUser = this.authenticationService.currentUserValue;
      let CompanyDetailID = currentUser.CompanyDetailID;
      return this.httpClient.get<Item>(environment.baseUrl + `PrivateUtility/GetItemDescription?CompanyDetailID=` + CompanyDetailID +
        `&ItemID=` + ItemID + `&VendorID=` + VendorID)
        .pipe(catchError(this.handleError));
    }
  }

  public delete(POID: number, LocationID: number): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    this.objPoorder.POID = POID;
    this.objPoorder.LocationID = LocationID;
    this.objPoorder.CompanyDetailID = currentUser.CompanyDetailID;
    this.objPoorder.LoginId = currentUser.UserId;
    return this.httpClient.post<Result>(environment.baseUrl + `POOrder/Delete`, this.objPoorder)
      .pipe(catchError(this.handleError));
  }

  public bulkUpsert(obj: Poorder): Observable<Poorderitem[]> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.CompanyDetailID = currentUser.CompanyDetailID;
    obj.CompanyID = currentUser.CompanyID;
    return this.httpClient.post<Poorderitem[]>(environment.baseUrl + `POOrder/BulkUpsert`, obj)
      .pipe(catchError(this.handleError));
  }

  public poPrint(POID: number): Observable<Poprint> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Poprint>(environment.baseUrl + `POOrder/POPrint?POID=` + POID
      + `&CompanyDetailID=` + CompanyDetailID)
      .pipe(catchError(this.handleError));
  }

  public MFISearch(): Observable<PoMFI[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<PoMFI[]>(environment.baseUrl + `POOrder/MFISearch?CompanyDetailID=` +
      CompanyDetailID
    )
      .pipe(catchError(this.handleError));
  }

  public UpdateFile(Filedata1: File[], PONumber: string): Observable<boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    let frmData = new FormData();
    frmData.append("CompanyDetailID", currentUser.CompanyDetailID.toString());
    frmData.append("PONumber", PONumber);
    frmData.append("LoginId", currentUser.UserId.toString());
    // frmData.append("Filedata", Filedata); 
    let f = 0;
    for (f = 0; f < Filedata1.length; f++) {
      frmData.append("Filedata", Filedata1[f]);
    }
    return this.httpClient.post<boolean>(environment.baseUrl + `POOrder/UpdateFile`, frmData)
      .pipe(catchError(this.handleError));
  }

  public GetFile(PONumber: string) {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get(environment.baseUrl + `POOrder/GetFile?CompanyDetailID=` + CompanyDetailID +
      `&PONumber=` + PONumber,
      { responseType: 'blob' })
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
