import { Injectable, } from '@angular/core';
import { HttpClient, HttpErrorResponse, } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BadRequest } from './../../common/bad-request';
import { NotFoundError } from './../../common/not-found-error';
import { AppError } from './../../common/app-error';
import { AuthenticationService } from './authentication.service';
import { ProductGroup, } from '../model/index';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ProductgroupService {
  lstProductgroup: ProductGroup[];
  objProductgroup: ProductGroup = {} as any;
  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) { }

  public search(SearchBy: string, Search: string, IsActive: Boolean): Observable<ProductGroup[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<ProductGroup[]>(environment.baseUrl +
      `ProductGroup/Search?CompanyID=` + CompanyID + `&SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search + `&IsActive=` + IsActive)
      .pipe(catchError(this.handleError));
  }

  public searchById(ProductGroupID: number): Observable<ProductGroup> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<ProductGroup>(environment.baseUrl +
      `ProductGroup/SearchByID?CompanyID=` + CompanyID + `&ProductGroupID=` + ProductGroupID)
      .pipe(catchError(this.handleError));
  }

  public exist(ProductGroupID: number, ProductGroupName: string) {
    ProductGroupID = isNaN(ProductGroupID) ? 0 : ProductGroupID;
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Boolean>(environment.baseUrl +
      `ProductGroup/Exist?CompanyID=` + CompanyID + `&ProductGroupName=` + ProductGroupName + `&ProductGroupID=` + ProductGroupID)
      .pipe(map(users => {
        if (users)
          return true;
        else
          return false;
      })
      );
  }

  public add(objProductgroup: ProductGroup): Observable<boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    objProductgroup.CompanyId = currentUser.CompanyID;
    objProductgroup.LoginId = currentUser.UserId;
    return this.httpClient.post<boolean>(environment.baseUrl + `ProductGroup/Create`, objProductgroup)
      .pipe(catchError(this.handleError));
  }

  public update(objProductgroup: ProductGroup): Observable<boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    objProductgroup.CompanyId = currentUser.CompanyID;
    objProductgroup.LoginId = currentUser.UserId;
    return this.httpClient.post<boolean>(environment.baseUrl + `ProductGroup/Update`, objProductgroup)
      .pipe(catchError(this.handleError));
  }
  public delete(ProductGroupID: number): Observable<Boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    this.objProductgroup.ProductGroupID = ProductGroupID;
    this.objProductgroup.CompanyId = currentUser.CompanyID;
    this.objProductgroup.LoginId = currentUser.UserId;
    return this.httpClient.post<Boolean>(environment.baseUrl + `ProductGroup/Delete`, this.objProductgroup)
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
