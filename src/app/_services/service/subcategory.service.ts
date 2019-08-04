import { Injectable, } from '@angular/core';
import { HttpClient, HttpErrorResponse, } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BadRequest } from './../../common/bad-request';
import { NotFoundError } from './../../common/not-found-error';
import { AppError } from './../../common/app-error';
import { AuthenticationService } from './authentication.service';
import { SubCategory, } from '../model/index';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SubcategoryService {
  lstSubCategory: SubCategory[];
  objSubCategory: SubCategory = {} as any;
  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) { }

  public search(SearchBy: string, Search: string, IsActive: Boolean): Observable<SubCategory[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<SubCategory[]>(environment.baseUrl +
      `SubCategory/Search?CompanyID=` + CompanyID + `&SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search + `&IsActive=` + IsActive)
      .pipe(catchError(this.handleError));
  }

  public searchById(SubCategoryID: number):   Observable<SubCategory> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<SubCategory>(environment.baseUrl +
      `SubCategory/SearchByID?CompanyID=` + CompanyID + `&SubCategoryID=` + SubCategoryID)
      .pipe(catchError(this.handleError));
  }

  public exist(SubCategoryID: number, SubCategoryName: string,CategoryID : number) {
    SubCategoryID = isNaN(SubCategoryID) ? 0 : SubCategoryID;
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Boolean>(environment.baseUrl +
      `SubCategory/Exist?CompanyID=` + CompanyID + `&SubCategoryName=` + encodeURIComponent(SubCategoryName)   + `&SubCategoryID=` + SubCategoryID + `&CategoryID=` + CategoryID)
      .pipe(map(users => {
        if (users)
          return true;
        else
          return false;
      })
      );
  }

  public add(objSubCategory: SubCategory): Observable<boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    objSubCategory.CompanyId = currentUser.CompanyID;
    objSubCategory.LoginId = currentUser.UserId;
    return this.httpClient.post<boolean>(environment.baseUrl + `SubCategory/Create`, objSubCategory)
      .pipe(catchError(this.handleError));
  }

  public update(objSubCategory: SubCategory): Observable<boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    objSubCategory.CompanyId = currentUser.CompanyID;
    objSubCategory.LoginId = currentUser.UserId;
    return this.httpClient.post<boolean>(environment.baseUrl + `SubCategory/Update`, objSubCategory)
      .pipe(catchError(this.handleError));
  }
  public delete(SubCategoryID: number): Observable<Boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    this.objSubCategory.SubCategoryID = SubCategoryID;
    this.objSubCategory.CompanyId = currentUser.CompanyID;
    this.objSubCategory.LoginId = currentUser.UserId;
    return this.httpClient.post<Boolean>(environment.baseUrl + `SubCategory/Delete`, this.objSubCategory)
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
