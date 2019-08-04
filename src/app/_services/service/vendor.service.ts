import { Injectable, } from '@angular/core';
import { HttpClient, HttpErrorResponse, } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BadRequest } from './../../common/bad-request';
import { NotFoundError } from './../../common/not-found-error';
import { AppError } from './../../common/app-error';
import { AuthenticationService } from './authentication.service';
import { Vendor, Result} from '../model/index';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class VendorService {
  lstVendor: Vendor[];
  objVendor: Vendor = {} as any;
  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) { }

  public search(SearchBy: string, Search: string, IsActive: Boolean): Observable<Vendor[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Vendor[]>(environment.baseUrl +
      `Vendor/Search?CompanyID=` + CompanyID + `&SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search + `&IsActive=` + IsActive)
      .pipe(catchError(this.handleError));
  }

  public searchById(VendorID: number): Observable<Vendor> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Vendor>(environment.baseUrl +
      `Vendor/SearchByID?CompanyID=` + CompanyID + `&VendorID=` + VendorID)
      .pipe(catchError(this.handleError));
  }

  public exist(VendorID: number, VendorName: string) {
    VendorID = isNaN(VendorID) ? 0 : VendorID;
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Boolean>(environment.baseUrl +
      `Vendor/Exist?CompanyID=` + CompanyID + `&VendorName=` + encodeURIComponent(VendorName) + `&VendorID=` + VendorID)
      .pipe(map(users => {
        if (users)
          return true;
        else
          return false;
      })
      );
  }

  public existGSTNumber(VendorID: number, GSTNumber: string) {
    VendorID = isNaN(VendorID) ? 0 : VendorID;
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Boolean>(environment.baseUrl + `Vendor/ExistGSTNumber?VendorID=` + VendorID + `&GSTNumber=` + encodeURIComponent(GSTNumber) +`&CompanyID=` + CompanyID)
      .pipe(
        map(users => {
          if (users && users == true)
            return true;
          else
            return false;
        })
      );
  }

  public add(objVendor: Vendor): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    objVendor.CompanyID = currentUser.CompanyID;
    objVendor.LoginId = currentUser.UserId;
    return this.httpClient.post<Result>(environment.baseUrl + `Vendor/Create`, objVendor)
      .pipe(catchError(this.handleError));
  }

  public update(objVendor: Vendor): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    objVendor.CompanyID = currentUser.CompanyID;
    objVendor.LoginId = currentUser.UserId;
    return this.httpClient.post<Result>(environment.baseUrl + `Vendor/Update`, objVendor)
      .pipe(catchError(this.handleError));
  }
  public delete(VendorID: number): Observable<Boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    this.objVendor.VendorID = VendorID;
    this.objVendor.CompanyID = currentUser.CompanyID;
    this.objVendor.LoginId = currentUser.UserId;
    return this.httpClient.post<Boolean>(environment.baseUrl + `Vendor/Delete`, this.objVendor)
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
