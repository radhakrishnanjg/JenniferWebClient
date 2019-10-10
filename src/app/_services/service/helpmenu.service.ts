import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BadRequest } from '../../common/bad-request';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';
import { AuthenticationService } from './authentication.service';
import { environment } from '../../../environments/environment';
import { Helpmenu, Result } from '../model';

@Injectable({
  providedIn: 'root'
})
export class HelpmenuService {

  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService) {

  }

  public search(SearchBy: string, Search: string, IsActive: Boolean): Observable<Helpmenu[]> {
    return this.httpClient.get<Helpmenu[]>(environment.baseUrl + `HelpMenu/Search?SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` +
      Search + `&IsActive=` + IsActive)
      .pipe(catchError(this.handleError));

  }

  public searchById(HelpMenuID: number): Observable<Helpmenu> {
    return this.httpClient.get<Helpmenu>(environment.baseUrl + `HelpMenu/SearchById?HelpMenuID=` + HelpMenuID)
      .pipe(catchError(this.handleError));
  }

  public getMenus(MenuType: string): Observable<Helpmenu[]> {
    return this.httpClient.get<Helpmenu[]>(environment.baseUrl + `HelpMenu/GetMenus?MenuType=`
      + encodeURIComponent(MenuType))
      .pipe(catchError(this.handleError));
  }

  public Insert(obj: Helpmenu): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.LoginId = currentUser.UserId;
    return this.httpClient.post<Result>(environment.baseUrl + `HelpMenu/Create`, obj)
      .pipe(catchError(this.handleError));
  }

  public Update(obj: Helpmenu): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.LoginId = currentUser.UserId;
    return this.httpClient.post<Result>(environment.baseUrl + `HelpMenu/Update`, obj)
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


