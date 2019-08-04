import { Injectable, } from '@angular/core';
import { HttpClient, HttpErrorResponse, } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BadRequest } from './../../common/bad-request';
import { NotFoundError } from './../../common/not-found-error';
import { AppError } from './../../common/app-error';
import { AuthenticationService } from './authentication.service';
import { Marketplace, } from '../model/index';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {
  lstMarketplace: Marketplace[];
  objMarketplace: Marketplace = {} as any;
  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) { }

  public search(SearchBy: string, Search: string, IsActive: Boolean): Observable<Marketplace[]> {
    return this.httpClient.get<Marketplace[]>(environment.baseUrl +
      `Marketplace/Search?SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search + `&IsActive=` + IsActive)
      .pipe(catchError(this.handleError));
  }

  public searchById(MarketplaceID: number): Observable<Marketplace> {
    return this.httpClient.get<Marketplace>(environment.baseUrl +
      `Marketplace/SearchByID?MarketplaceID=` + MarketplaceID)
      .pipe(catchError(this.handleError));
  }

  public exist(MarketplaceID: number, MarketPlace: string) {
    MarketplaceID = isNaN(MarketplaceID) ? 0 : MarketplaceID;
    return this.httpClient.get<Boolean>(environment.baseUrl +
      `Marketplace/Exist?MarketPlace=` + MarketPlace + `&MarketplaceID=` + MarketplaceID)
      .pipe(map(users => {
        if (users)
          return true;
        else
          return false;
      })
      );
  }

  public add(objMarketplace: Marketplace): Observable<boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    objMarketplace.LoginId = currentUser.UserId;
    return this.httpClient.post<boolean>(environment.baseUrl + `Marketplace/Create`, objMarketplace)
      .pipe(catchError(this.handleError));
  }

  public update(objMarketplace: Marketplace): Observable<boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    objMarketplace.LoginId = currentUser.UserId;
    return this.httpClient.post<boolean>(environment.baseUrl + `Marketplace/Update`, objMarketplace)
      .pipe(catchError(this.handleError));
  }
  public delete(MarketplaceID: number): Observable<Boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    this.objMarketplace.MarketplaceID = MarketplaceID;
    this.objMarketplace.LoginId = currentUser.UserId;
    return this.httpClient.post<Boolean>(environment.baseUrl + `Marketplace/Delete`, this.objMarketplace)
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
