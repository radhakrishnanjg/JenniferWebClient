import { Injectable, } from '@angular/core';
import { HttpClient, HttpErrorResponse, } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BadRequest } from './../../common/bad-request';
import { NotFoundError } from './../../common/not-found-error';
import { AppError } from './../../common/app-error';
import { AuthenticationService } from './authentication.service';
import { Item,Result ,Itemtaxdetail, Itemhsndetail} from '../model/index';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ItemService {
  lstitem: Item[];
  objitem: Item = {} as any;
  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) { }

  public getItems(SearchBy: string, Search: string, IsActive: Boolean): Observable<Item[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyId = currentUser.CompanyID;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Item[]>(environment.baseUrl +
      `Item/Search?CompanyId=` + CompanyId + `&CompanyDetailID=` + CompanyDetailID +
      `&SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search +
      `&IsActive=` + IsActive)
      .pipe(catchError(this.handleError));
  }

  public getItem(ItemID: number): Observable<Item> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyId = currentUser.CompanyID;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Item>(environment.baseUrl +
      `Item/SearchByID?CompanyId=` + CompanyId + `&CompanyDetailID=` + CompanyDetailID + `&ItemID=` + ItemID)
      .pipe(catchError(this.handleError));
  }

  public existItemCode(ItemID: number, ItemCode: string) {
    ItemID = isNaN(ItemID) ? 0 : ItemID;
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Boolean>(environment.baseUrl +
      `Item/Exist?CompanyDetailID=` + CompanyDetailID + `&ItemCode=` + ItemCode + `&ItemID=` + ItemID)
      .pipe(map(users => {
        if (users)
          return true;
        else
          return false;
      })
      );
  }

  public addItem(user: Item): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    user.CompanyDetailID = currentUser.CompanyDetailID;
    user.LoginId = currentUser.UserId;
    return this.httpClient.post<Result>(environment.baseUrl + `Item/Create`, user)
      .pipe(catchError(this.handleError));
  }

  public updateItem(user: Item): Observable<boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    user.CompanyDetailID = currentUser.CompanyDetailID;
    user.LoginId = currentUser.UserId;
    return this.httpClient.post<boolean>(environment.baseUrl + `Item/Update`, user)
      .pipe(catchError(this.handleError));
  }

  public updateImage(Filedata: File, ItemID: number): Observable<boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    let frmData = new FormData();
    frmData.append("CompanyDetailID", currentUser.CompanyDetailID.toString());
    frmData.append("ItemID", ItemID.toString());
    frmData.append("LoginId", currentUser.UserId.toString());
    frmData.append("ImageData", Filedata, Filedata.name);
    return this.httpClient.post<boolean>(environment.baseUrl + `Item/UpdateImage`, frmData)
      .pipe(catchError(this.handleError));
  }

  public delete(ItemID: number): Observable<Boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    this.objitem.ItemID = ItemID;
    this.objitem.CompanyDetailID = currentUser.CompanyDetailID;
    this.objitem.LoginId = currentUser.UserId;
    return this.httpClient.post<Boolean>(environment.baseUrl + `Item/Delete`, this.objitem)
      .pipe(catchError(this.handleError));
  }

  public taxUpdate(tax: Itemtaxdetail): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    tax.CompanyDetailID = currentUser.CompanyDetailID;
    tax.LoginId = currentUser.UserId;
    return this.httpClient.post<Result>(environment.baseUrl + `Item/TaxUpdate`, tax)
      .pipe(catchError(this.handleError));
  } 

  public hsnUpdate(hsn: Itemhsndetail): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    hsn.CompanyDetailID = currentUser.CompanyDetailID;
    hsn.LoginId = currentUser.UserId;
    return this.httpClient.post<Result>(environment.baseUrl + `Item/HSNUpdate`, hsn)
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
