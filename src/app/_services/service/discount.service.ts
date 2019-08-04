import { Injectable, } from '@angular/core';
import { HttpClient, HttpErrorResponse, } from '@angular/common/http';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BadRequest } from './../../common/bad-request';
import { NotFoundError } from './../../common/not-found-error';
import { AppError } from './../../common/app-error';
import { AuthenticationService } from './authentication.service';
import { Discount, Item, Result } from '../model/index';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  lstDiscount: Discount[];
  objDiscount: Discount = {} as any;
  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) { }

  public search(SearchBy: string, Search: string, IsActive: Boolean, StartDate: Date, EndDate: Date):
    Observable<Discount[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    let CompanyID = currentUser.CompanyID;

    return this.httpClient.get<Discount[]>(environment.baseUrl +
      `Discount/Search?SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search + `&IsActive=` + IsActive +
      `&CompanyID=` + CompanyID + `&CompanyDetailID=` + CompanyDetailID + `&StartDate=` + StartDate + `&EndDate=` + EndDate)
      .pipe(catchError(this.handleError));
  }

  public searchById(DiscountID: number): Observable<Discount> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Discount>(environment.baseUrl +
      `Discount/SearchByID?CompanyDetailID=` + CompanyDetailID + `&CompanyID=` + CompanyID + `&DiscountID=` + DiscountID)
      .pipe(catchError(this.handleError));
  }

  public upsert(objDiscount: Discount, ItemIds: number[]): Observable<Result> {
    this.lstDiscount = [] as any;
    ItemIds.forEach(element => {
      let objDiscount1: Discount={} as any;
      // old data      
      objDiscount1.CustomerID = objDiscount.CustomerID;
      objDiscount1.TransactionType = objDiscount.TransactionType;
      objDiscount1.InventoryType = objDiscount.InventoryType;
      objDiscount1.InventoryType = objDiscount.InventoryType;
      objDiscount1.MarketPlaceContribution = objDiscount.MarketPlaceContribution;
      objDiscount1.StoreContribution = objDiscount.StoreContribution;
      objDiscount1.OtherContribution = objDiscount.OtherContribution;
      objDiscount1.StartDate = objDiscount.StartDate;
      objDiscount1.EndDate = objDiscount.EndDate;
      // log and comany detail
      let currentUser = this.authenticationService.currentUserValue; 
      objDiscount1.LoginId = currentUser.UserId;
      objDiscount1.CompanyDetailID = currentUser.CompanyDetailID;
      objDiscount1.ItemID = element;
      this.lstDiscount.push(objDiscount1); 
    });  
    return this.httpClient.post<Result>(environment.baseUrl + `Discount/Upsert`, this.lstDiscount)
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
