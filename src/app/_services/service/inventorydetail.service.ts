import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { BadRequest } from './../../common/bad-request';
import { AppError } from './../../common/app-error';
import { NotFoundError } from './../../common/not-found-error';
import { AuthenticationService } from './authentication.service';
import { Inventorydetail } from './../model/index';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventorydetailService {

  lstInventorydetail: Inventorydetail[];
  objInventorydetail: Inventorydetail = {} as any;
  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService
  ) { }

  public search(SearchBy: string, Search: string): Observable<Inventorydetail[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Inventorydetail[]>(environment.baseUrl +
      `InventoryDetail/Search?CompanyDetailID=` + CompanyDetailID + `&SearchBy=` + encodeURIComponent(SearchBy)
      + `&Search=` + encodeURIComponent(Search))
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
