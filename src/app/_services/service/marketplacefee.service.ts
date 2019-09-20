import { Injectable, } from '@angular/core';
import { HttpClient, HttpErrorResponse, } from '@angular/common/http'; 
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BadRequest } from './../../common/bad-request';
import { NotFoundError } from './../../common/not-found-error';
import { AppError } from './../../common/app-error';
import { AuthenticationService } from './authentication.service';
import { Marketplacefee,  Result } from '../model/index';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class MarketplacefeeService {
  lstMarketplacefee: Marketplacefee[];
  objMarketplacefee: Marketplacefee = {} as any;
  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) { }

  public search(SearchBy: string, Search: string, IsActive: Boolean, StartDate: Date, EndDate: Date):
    Observable<Marketplacefee[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Marketplacefee[]>(environment.baseUrl +
      `Marketplacefee/Search?SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search + `&IsActive=` + IsActive +
      `&CompanyDetailID=` + CompanyDetailID + `&StartDate=` + StartDate + `&EndDate=` + EndDate)
      .pipe(catchError(this.handleError));
  }

  public searchById(MarketplaceFeeId: number): Observable<Marketplacefee> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Marketplacefee>(environment.baseUrl +
      `Marketplacefee/SearchByID?CompanyDetailID=` + CompanyDetailID + `&MarketplaceFeeId=` + MarketplaceFeeId)
      .pipe(catchError(this.handleError));
  }

  // public upsert(objMarketplacefee: Marketplacefee, ItemIds: Item[]): Observable<Result> {
  //   ItemIds.forEach(element => {
  //     let currentUser = this.authenticationService.currentUserValue;
  //     objMarketplacefee.LoginId = currentUser.UserId;
  //     objMarketplacefee.CompanyDetailID = currentUser.CompanyDetailID;
  //     objMarketplacefee.ItemID = element.ItemID;
  //     this.lstMarketplacefee = [] as any;
  //     this.lstMarketplacefee.push(objMarketplacefee);
  //   });
  //   
  //   return this.httpClient.post<Result>(environment.baseUrl + `Marketplacefee/Upsert`, this.lstMarketplacefee)
  //     .pipe(catchError(this.handleError));
  // }

  public upsert(objMarketplacefee: Marketplacefee, ItemIds: number[]): Observable<Result> {
    this.lstMarketplacefee = [] as any;
    ItemIds.forEach(element => {
      let objMarketplacefee1: Marketplacefee={} as any;
      // old data      
      objMarketplacefee1.ItemID = element;
      objMarketplacefee1.ExpenseCharge = objMarketplacefee.ExpenseCharge;
      objMarketplacefee1.ExpenseGSTTax = objMarketplacefee.ExpenseGSTTax;  
      objMarketplacefee1.StartDate = objMarketplacefee.StartDate;
      objMarketplacefee1.EndDate = objMarketplacefee.EndDate;
      // log and comany detail
      let currentUser = this.authenticationService.currentUserValue; 
      objMarketplacefee1.LoginId = currentUser.UserId;
      objMarketplacefee1.CompanyDetailID = currentUser.CompanyDetailID;
      this.lstMarketplacefee.push(objMarketplacefee1); 
    });  
    return this.httpClient.post<Result>(environment.baseUrl + `Marketplacefee/Upsert`, this.lstMarketplacefee)
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
