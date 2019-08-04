import { Injectable, } from '@angular/core';
import { HttpClient, HttpErrorResponse, } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BadRequest } from './../../common/bad-request';
import { NotFoundError } from './../../common/not-found-error';
import { AppError } from './../../common/app-error';
import { AuthenticationService } from './authentication.service';
import { Customerwarehouse, } from '../model/index';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CustomerwarehouseService {
  lstCustomerwarehouse: Customerwarehouse[];
  objCustomerwarehouse: Customerwarehouse = {} as any;
  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) { }

  public search(SearchBy: string, Search: string, IsActive: Boolean): Observable<Customerwarehouse[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Customerwarehouse[]>(environment.baseUrl +
      `Customerwarehouse/Search?CompanyID=` + CompanyID + `&SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search + `&IsActive=` + IsActive)
      .pipe(catchError(this.handleError));
  }

  public searchById(CustomerWarehouseID: number): Observable<Customerwarehouse> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Customerwarehouse>(environment.baseUrl +
      `Customerwarehouse/SearchByID?CompanyID=` + CompanyID + `&CustomerWarehouseID=` + CustomerWarehouseID)
      .pipe(catchError(this.handleError));
  }

  public exist(CustomerWarehouseID: number, WarehouseName: string, CustomerID: number) {
    CustomerWarehouseID = isNaN(CustomerWarehouseID) ? 0 : CustomerWarehouseID;
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Boolean>(environment.baseUrl +
      `Customerwarehouse/Exist?CompanyID=` + CompanyID + `&WarehouseName=` + encodeURIComponent(WarehouseName)   + `&CustomerID=` + CustomerID + `&CustomerWarehouseID=` + CustomerWarehouseID)
      .pipe(map(users => {
        if (users)
          return true;
        else
          return false;
      })
      );
  }

  public add(objCustomerwarehouse: Customerwarehouse): Observable<boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    objCustomerwarehouse.CompanyId = currentUser.CompanyID;
    objCustomerwarehouse.LoginId = currentUser.UserId;
    return this.httpClient.post<boolean>(environment.baseUrl + `Customerwarehouse/Create`, objCustomerwarehouse)
      .pipe(catchError(this.handleError));
  }

  public update(objCustomerwarehouse: Customerwarehouse): Observable<boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    objCustomerwarehouse.CompanyId = currentUser.CompanyID;
    objCustomerwarehouse.LoginId = currentUser.UserId;
    return this.httpClient.post<boolean>(environment.baseUrl + `Customerwarehouse/Update`, objCustomerwarehouse)
      .pipe(catchError(this.handleError));
  }
  
  public delete(CustomerWarehouseID: number): Observable<Boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    this.objCustomerwarehouse.CustomerWarehouseID = CustomerWarehouseID;
    this.objCustomerwarehouse.CompanyId = currentUser.CompanyID;
    this.objCustomerwarehouse.LoginId = currentUser.UserId;
    return this.httpClient.post<Boolean>(environment.baseUrl + `Customerwarehouse/Delete`, this.objCustomerwarehouse)
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
