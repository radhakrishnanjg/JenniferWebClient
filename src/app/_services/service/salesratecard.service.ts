import { Injectable, } from '@angular/core';
import { HttpClient, HttpErrorResponse, } from '@angular/common/http';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BadRequest } from '../../common/bad-request';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';
import { AuthenticationService } from './authentication.service';
import { Salesratecard, Result } from '../model/index';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class SalesratecardService {
  lstSalesratecard: Salesratecard[];
  objSalesratecard: Salesratecard = {} as any;

  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) { }

  public search(SearchBy: string, Search: string, StartDate: Date, EndDate: Date, IsActive: boolean):
    Observable<Salesratecard[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;

    return this.httpClient.get<Salesratecard[]>(environment.baseUrl +
      `SalesRateCard/Search?SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search +
      `&CompanyDetailID=` + CompanyDetailID + `&StartDate=` + StartDate + `&EndDate=` + EndDate + `&IsActive=` + IsActive)
      .pipe(catchError(this.handleError));
  }

  public upsert(objSalesratecard: Salesratecard, ItemIds: number[]): Observable<Result> {
    this.lstSalesratecard = [] as any;
    ItemIds.forEach(element => {
      let objSalesratecard1: Salesratecard = {} as any;
      // old data      
      objSalesratecard1.InventoryType = objSalesratecard.InventoryType;
      objSalesratecard1.SellingPrice = objSalesratecard.SellingPrice;
      objSalesratecard1.StartDate = objSalesratecard.StartDate;
      objSalesratecard1.EndDate = objSalesratecard.EndDate;
      // log and comany detail
      let currentUser = this.authenticationService.currentUserValue;
      objSalesratecard1.LoginId = currentUser.UserId;
      objSalesratecard1.CompanyDetailID = currentUser.CompanyDetailID;
      objSalesratecard1.ItemID = element;
      this.lstSalesratecard.push(objSalesratecard1);
    });

    return this.httpClient.post<Result>(environment.baseUrl + `SalesRateCard/Upsert`, this.lstSalesratecard)
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
