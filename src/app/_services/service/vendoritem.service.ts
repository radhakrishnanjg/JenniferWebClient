import { Injectable, } from '@angular/core';
import { HttpClient, HttpErrorResponse, } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BadRequest } from './../../common/bad-request';
import { NotFoundError } from './../../common/not-found-error';
import { AppError } from './../../common/app-error';
import { AuthenticationService } from './authentication.service';
import { Vendoritem, } from '../model/index';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class VendoritemService {
  lstBrand: Vendoritem[];
  objVendoritem: Vendoritem = {} as any;
  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) { }

  public search(SearchBy: string, Search: string, IsActive: Boolean): Observable<Vendoritem[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Vendoritem[]>(environment.baseUrl +
      `Vendoritem/Search?CompanyDetailID=` + CompanyDetailID + `&SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search + `&IsActive=` + IsActive)
      .pipe(catchError(this.handleError));
  }

  public searchById(VendorItemID: number): Observable<Vendoritem> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Vendoritem>(environment.baseUrl +
      `Vendoritem/SearchByID?CompanyDetailID=` + CompanyDetailID + `&VendorItemID=` + VendorItemID)
      .pipe(catchError(this.handleError));
  }

  public exist(VendorItemID: number, ItemID: number, VendorID: number) {
    VendorItemID = isNaN(VendorItemID) ? 0 : VendorItemID;
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Boolean>(environment.baseUrl +
      `Vendoritem/Exist?CompanyDetailID=` + CompanyDetailID + `&ItemID=` + ItemID + `&VendorID=` + VendorID + `&VendorItemID=` + VendorItemID)
      .pipe(map(users => {
        if (users)
          return true;
        else
          return false;
      })
      );
  }

  public existVendorItemCode(VendorItemID: number, VendorItemCode: string) {
    VendorItemID = isNaN(VendorItemID) ? 0 : VendorItemID;
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Boolean>(environment.baseUrl +
      `Vendoritem/ExistVendorItemCode?CompanyDetailID=` + CompanyDetailID
      + `&VendorItemCode=` + encodeURIComponent(VendorItemCode)
      + `&VendorItemID=` + VendorItemID)
      .pipe(map(users => {
        if (users)
          return true;
        else
          return false;
      })
      );
  }

  public add(objVendoritem: Vendoritem): Observable<boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    objVendoritem.CompanyDetailID = currentUser.CompanyDetailID;
    objVendoritem.LoginId = currentUser.UserId;
    return this.httpClient.post<boolean>(environment.baseUrl + `Vendoritem/Create`, objVendoritem)
      .pipe(catchError(this.handleError));
  }

  public update(objVendoritem: Vendoritem): Observable<boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    objVendoritem.CompanyDetailID = currentUser.CompanyDetailID;
    objVendoritem.LoginId = currentUser.UserId;
    return this.httpClient.post<boolean>(environment.baseUrl + `Vendoritem/Update`, objVendoritem)
      .pipe(catchError(this.handleError));
  }
  public delete(VendorItemID: number): Observable<Boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    this.objVendoritem.VendorItemID = VendorItemID;
    this.objVendoritem.CompanyDetailID = currentUser.CompanyDetailID;
    this.objVendoritem.LoginId = currentUser.UserId;
    return this.httpClient.post<Boolean>(environment.baseUrl + `Vendoritem/Delete`, this.objVendoritem)
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
