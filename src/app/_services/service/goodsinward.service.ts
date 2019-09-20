import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { BadRequest } from './../../common/bad-request';
import { AppError } from './../../common/app-error';
import { NotFoundError } from './../../common/not-found-error';
import { AuthenticationService } from './authentication.service';
import { Goodsinward ,Result} from './../model/index';
import { environment } from '../../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class GoodsinwardService {

  lstGoodsinward: Goodsinward[];
  objGoodsinward: Goodsinward = {} as any;
  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService
  ) { }

  public search(SearchBy: string, Search: string): Observable<Goodsinward[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Goodsinward[]>(environment.baseUrl +
      `Goodsinward/Search?CompanyDetailID=` + CompanyDetailID + `&SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search)
      .pipe(catchError(this.handleError));
  }

  public searchById(JenniferItemSerial: string): Observable<Goodsinward> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Goodsinward>(environment.baseUrl +
      `Goodsinward/SearchById?CompanyDetailID=` + CompanyDetailID + `&JenniferItemSerial=` + JenniferItemSerial)
      .pipe(catchError(this.handleError));
  }

  public exist(GRNInwardID: number, JenniferItemSerial: string) { 
    GRNInwardID = isNaN(GRNInwardID) ? 0 : GRNInwardID;
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Boolean>(environment.baseUrl +
      `Goodsinward/Exist?CompanyDetailID=` + CompanyDetailID +
      `&GRNInwardID=` + GRNInwardID + `&JenniferItemSerial=` + JenniferItemSerial)
      .pipe(map(items => {
        return items;
      })
      );
  } 

  public VendorUpdate(objGoodsinward: Goodsinward[]): Observable<Result> {
    return this.httpClient.post<Result>(environment.baseUrl + `Goodsinward/VendorUpdate`, objGoodsinward)
      .pipe(catchError(this.handleError));
  }

  public delete(GRNInwardID: number): Observable<Boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    this.objGoodsinward.GRNInwardID = GRNInwardID;
    this.objGoodsinward.CompanyDetailID = currentUser.CompanyDetailID;
    this.objGoodsinward.LoginId = currentUser.UserId;
    return this.httpClient.post<Boolean>(environment.baseUrl + `Goodsinward/Delete`, this.objGoodsinward)
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
