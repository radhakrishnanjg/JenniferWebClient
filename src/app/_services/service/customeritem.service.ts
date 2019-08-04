import { Injectable, } from '@angular/core';
import { HttpClient, HttpErrorResponse, } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BadRequest } from './../../common/bad-request';
import { NotFoundError } from './../../common/not-found-error';
import { AppError } from './../../common/app-error';
import { AuthenticationService } from './authentication.service';
import { Customeritem, } from '../model/index';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CustomeritemService {
  lstCustomeritem: Customeritem[];
  objCustomeritem: Customeritem = {} as any;
  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) { }

  public search(SearchBy: string, Search: string, IsActive: Boolean): Observable<Customeritem[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Customeritem[]>(environment.baseUrl +
      `Customeritem/Search?CompanyDetailID=` + CompanyDetailID + `&SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search + `&IsActive=` + IsActive)
      .pipe(catchError(this.handleError));
  }

  public searchById(CustomerItemID: number): Observable<Customeritem> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Customeritem>(environment.baseUrl +
      `Customeritem/SearchByID?CompanyDetailID=` + CompanyDetailID + `&CustomerItemID=` + CustomerItemID)
      .pipe(catchError(this.handleError));
  }

  public exist(CustomerItemID: number, ItemID: number,CustomerID :number) {
    CustomerItemID = isNaN(CustomerItemID) ? 0 : CustomerItemID;
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Boolean>(environment.baseUrl +
      `Customeritem/Exist?CompanyDetailID=` + CompanyDetailID + `&ItemID=` + ItemID +  `&CustomerID=` + CustomerID + `&CustomerItemID=` + CustomerItemID)
      .pipe(map(users => {
        if (users)
          return true;
        else
          return false;
      })
      );
  }

  public add(objCustomeritem: Customeritem): Observable<boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    objCustomeritem.CompanyDetailID = currentUser.CompanyDetailID;
    objCustomeritem.LoginId = currentUser.UserId;
    return this.httpClient.post<boolean>(environment.baseUrl + `Customeritem/Create`, objCustomeritem)
      .pipe(catchError(this.handleError));
  }

  public update(objCustomeritem: Customeritem): Observable<boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    objCustomeritem.CompanyDetailID = currentUser.CompanyDetailID;
    objCustomeritem.LoginId = currentUser.UserId;
    return this.httpClient.post<boolean>(environment.baseUrl + `Customeritem/Update`, objCustomeritem)
      .pipe(catchError(this.handleError));
  }
  public delete(CustomerItemID: number): Observable<Boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    this.objCustomeritem.CustomerItemID = CustomerItemID;
    this.objCustomeritem.CompanyDetailID = currentUser.CompanyDetailID;
    this.objCustomeritem.LoginId = currentUser.UserId;
    return this.httpClient.post<Boolean>(environment.baseUrl + `Customeritem/Delete`, this.objCustomeritem)
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
