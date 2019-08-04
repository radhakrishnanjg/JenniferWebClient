import { Injectable, } from '@angular/core';
import { HttpClient, HttpErrorResponse, } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BadRequest } from './../../common/bad-request';
import { NotFoundError } from './../../common/not-found-error';
import { AppError } from './../../common/app-error';
import { AuthenticationService } from './authentication.service';
import { Category, } from '../model/index';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  lstCategory: Category[];
  objCategory: Category = {} as any;
  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) { }

  public search(SearchBy: string, Search: string, IsActive: Boolean): Observable<Category[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Category[]>(environment.baseUrl +
      `Category/Search?CompanyID=` + CompanyID + `&SearchBy=` + SearchBy + `&Search=` + Search + `&IsActive=` + IsActive)
      .pipe(catchError(this.handleError));
  }

  public searchById(CategoryID: number): Observable<Category> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Category>(environment.baseUrl +
      `Category/SearchByID?CompanyID=` + CompanyID + `&CategoryID=` + CategoryID)
      .pipe(catchError(this.handleError));
  }

  public exist(CategoryID: number, CategoryName: string, ProductGroupID: number) {
    CategoryID = isNaN(CategoryID) ? 0 : CategoryID;
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Boolean>(environment.baseUrl +
      `Category/Exist?CompanyID=` + CompanyID + `&CategoryName=` + encodeURIComponent(CategoryName) + `&CategoryID=` + CategoryID + `&ProductGroupID=` + ProductGroupID)
      .pipe(map(users => {
        if (users)
          return true;
        else
          return false;
      })
      );
  }

  public add(objCategory: Category): Observable<boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    objCategory.CompanyId = currentUser.CompanyID;
    objCategory.LoginId = currentUser.UserId;
    return this.httpClient.post<boolean>(environment.baseUrl + `Category/Create`, objCategory)
      .pipe(catchError(this.handleError));
  }

  public update(objCategory: Category): Observable<boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    objCategory.CompanyId = currentUser.CompanyID;
    objCategory.LoginId = currentUser.UserId;
    return this.httpClient.post<boolean>(environment.baseUrl + `Category/Update`, objCategory)
      .pipe(catchError(this.handleError));
  }

  public delete(CategoryID: number): Observable<Boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    this.objCategory.CategoryID = CategoryID;
    this.objCategory.CompanyId = currentUser.CompanyID;
    this.objCategory.LoginId = currentUser.UserId;
    return this.httpClient.post<Boolean>(environment.baseUrl + `Category/Delete`, this.objCategory)
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
