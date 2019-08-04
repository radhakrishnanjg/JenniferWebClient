import { Injectable, } from '@angular/core';
import { HttpClient, HttpErrorResponse, } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BadRequest } from './../../common/bad-request';
import { NotFoundError } from './../../common/not-found-error';
import { AppError } from './../../common/app-error';
import { AuthenticationService } from './authentication.service';
import { Dropdown, } from '../model/index';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DropdownService {
  lstDropdown: Dropdown[];
  objDropdown: Dropdown = {} as any;
  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) { }

  public search(SearchBy: string, Search: string, IsActive: Boolean): Observable<Dropdown[]> {
    return this.httpClient.get<Dropdown[]>(environment.baseUrl +
      `Dropdown/Search?SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search + `&IsActive=` + IsActive)
      .pipe(catchError(this.handleError));
  }

  public searchById(DropdownID: number): Observable<Dropdown> {
    return this.httpClient.get<Dropdown>(environment.baseUrl +
      `Dropdown/SearchByID?DropdownID=` + DropdownID)
      .pipe(catchError(this.handleError));
  }

  public exist(DropdownID: number, DropdownType: string, DropdownValue:string) {
    DropdownID = isNaN(DropdownID) ? 0 : DropdownID;
    return this.httpClient.get<Boolean>(environment.baseUrl +
      `Dropdown/Exist?DropdownType=` +  encodeURIComponent(DropdownType) + `&DropdownValue=` +  encodeURIComponent(DropdownValue)+ `&DropdownID=` + DropdownID)
      .pipe(map(users => {
        if (users)
          return true;
        else
          return false;
      })
      );
  }

  public add(objDropdown: Dropdown): Observable<boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    objDropdown.LoginId = currentUser.UserId;
    return this.httpClient.post<boolean>(environment.baseUrl + `Dropdown/Create`, objDropdown)
      .pipe(catchError(this.handleError));
  }

  public update(objDropdown: Dropdown): Observable<boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    objDropdown.LoginId = currentUser.UserId;
    return this.httpClient.post<boolean>(environment.baseUrl + `Dropdown/Update`, objDropdown)
      .pipe(catchError(this.handleError));
  }
  public delete(DropdownID: number): Observable<Boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    this.objDropdown.DropdownID = DropdownID;
    this.objDropdown.LoginId = currentUser.UserId;
    return this.httpClient.post<Boolean>(environment.baseUrl + `Dropdown/Delete`, this.objDropdown)
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
