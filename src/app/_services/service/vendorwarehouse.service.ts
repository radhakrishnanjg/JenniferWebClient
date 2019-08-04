import { Injectable, } from '@angular/core';
import { HttpClient, HttpErrorResponse, } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BadRequest } from './../../common/bad-request';
import { NotFoundError } from './../../common/not-found-error';
import { AppError } from './../../common/app-error';
import { AuthenticationService } from './authentication.service';
import { Vendorwarehouse, } from '../model/index';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class VendorwarehouseService {
  lstVendorwarehouse: Vendorwarehouse[];
  objVendorwarehouse: Vendorwarehouse = {} as any;
  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) { }

  public search(SearchBy: string, Search: string, IsActive: Boolean): Observable<Vendorwarehouse[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Vendorwarehouse[]>(environment.baseUrl +
      `Vendorwarehouse/Search?CompanyID=` + CompanyID + `&SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search + `&IsActive=` + IsActive)
      .pipe(catchError(this.handleError));
  }

  public searchById(VendorWarehouseID: number): Observable<Vendorwarehouse> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Vendorwarehouse>(environment.baseUrl +
      `Vendorwarehouse/SearchByID?CompanyID=` + CompanyID + `&VendorWarehouseID=` + VendorWarehouseID)
      .pipe(catchError(this.handleError));
  }

  public exist(VendorWarehouseID: number, WarehouseName: string,VendorID:number) {
    VendorWarehouseID = isNaN(VendorWarehouseID) ? 0 : VendorWarehouseID;
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Boolean>(environment.baseUrl +
      `Vendorwarehouse/Exist?CompanyID=` + CompanyID + `&WarehouseName=` + encodeURIComponent(WarehouseName) + `&VendorID=` + VendorID + `&VendorWarehouseID=` + VendorWarehouseID)
      .pipe(map(users => {
        if (users)
          return true;
        else
          return false;
      })
      );
  }

  public add(objVendorwarehouse: Vendorwarehouse): Observable<boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    objVendorwarehouse.CompanyID = currentUser.CompanyID;
    objVendorwarehouse.LoginId = currentUser.UserId;
    return this.httpClient.post<boolean>(environment.baseUrl + `Vendorwarehouse/Create`, objVendorwarehouse)
      .pipe(catchError(this.handleError));
  }

  public update(objVendorwarehouse: Vendorwarehouse): Observable<boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    objVendorwarehouse.CompanyID = currentUser.CompanyID;
    objVendorwarehouse.LoginId = currentUser.UserId;
    return this.httpClient.post<boolean>(environment.baseUrl + `Vendorwarehouse/Update`, objVendorwarehouse)
      .pipe(catchError(this.handleError));
  }
  public delete(VendorWarehouseID: number): Observable<Boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    this.objVendorwarehouse.VendorWarehouseID = VendorWarehouseID;
    this.objVendorwarehouse.CompanyID = currentUser.CompanyID;
    this.objVendorwarehouse.LoginId = currentUser.UserId;
    return this.httpClient.post<Boolean>(environment.baseUrl + `Vendorwarehouse/Delete`, this.objVendorwarehouse)
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
