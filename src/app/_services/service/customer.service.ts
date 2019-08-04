import { Injectable, } from '@angular/core';
import { HttpClient, HttpErrorResponse, } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BadRequest } from './../../common/bad-request';
import { NotFoundError } from './../../common/not-found-error';
import { AppError } from './../../common/app-error';
import { AuthenticationService } from './authentication.service';
import { Customer, Result} from '../model/index';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  lstCustomer: Customer[];
  objCustomer: Customer = {} as any;
  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) { }

  public search(SearchBy: string, Search: string, IsActive: Boolean): Observable<Customer[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Customer[]>(environment.baseUrl +
      `Customer/Search?CompanyID=` + CompanyID + `&SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search + `&IsActive=` + IsActive)
      .pipe(catchError(this.handleError));
  }

  public searchById(CustomerID: number): Observable<Customer> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Customer>(environment.baseUrl +
      `Customer/SearchByID?CompanyID=` + CompanyID + `&CustomerID=` + CustomerID)
      .pipe(catchError(this.handleError));
  }

  public exist(CustomerID: number, CustomerName: string) {
    CustomerID = isNaN(CustomerID) ? 0 : CustomerID;
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Boolean>(environment.baseUrl +
      `Customer/Exist?CompanyID=` + CompanyID + `&CustomerName=` + encodeURIComponent(CustomerName) + `&CustomerID=` + CustomerID)
      .pipe(map(users => {
        if (users)
          return true;
        else
          return false;
      })
      );
  }

  public existGSTNumber(CustomerID: number, GSTNumber: string) {
    CustomerID = isNaN(CustomerID) ? 0 : CustomerID;
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Boolean>(environment.baseUrl + `Customer/ExistGSTNumber?CustomerID=` + CustomerID + `&GSTNumber=` + encodeURIComponent(GSTNumber)   +`&CompanyID=` + CompanyID)
      .pipe(
        map(users => {
          if (users && users == true)
            return true;
          else
            return false;
        })
      );
  }

  public add(objCustomer: Customer): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    objCustomer.CompanyId = currentUser.CompanyID;
    objCustomer.LoginId = currentUser.UserId;
    return this.httpClient.post<Result>(environment.baseUrl + `Customer/Create`, objCustomer)
      .pipe(catchError(this.handleError));
  }

  public update(objCustomer: Customer): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    objCustomer.CompanyId = currentUser.CompanyID;
    objCustomer.LoginId = currentUser.UserId;
    return this.httpClient.post<Result>(environment.baseUrl + `Customer/Update`, objCustomer)
      .pipe(catchError(this.handleError));
  }
  public delete(CustomerID: number): Observable<Boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    this.objCustomer.CustomerID = CustomerID;
    this.objCustomer.CompanyId = currentUser.CompanyID;
    this.objCustomer.LoginId = currentUser.UserId;
    return this.httpClient.post<Boolean>(environment.baseUrl + `Customer/Delete`, this.objCustomer)
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
