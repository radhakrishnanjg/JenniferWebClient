import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { BadRequest } from '../../../common/bad-request';
import { NotFoundError } from '../../../common/not-found-error';
import { AppError } from '../../../common/app-error';

import { AuthenticationService } from '.././authentication.service';
import { Result, JsonModal, SellerRegistration, Dropdown, IORPartners, EORPartners } from '../../model/crossborder';
import { environment } from '../../../../environments/environment';
import { ApplicationAccess, Country } from '../../model';

@Injectable({
  providedIn: 'root'
})
export class SellerregistrationService {
  objJsonModal: JsonModal = {} as any;

  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService
  ) { }

  //#region CrossBorder

  GetApplicationAccess(): Observable<ApplicationAccess[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let UserId = currentUser.UserId;
    return this.httpClient.get<string>(environment.baseUrl + `SellerRegistration/GetApplicationAccess?UserId=` +
      UserId)
      .pipe(
        map(data => {
          return JSON.parse(data) as ApplicationAccess[];
        }),
        catchError(this.handleError)
      );
  }

  ////#endregion
  public Search(SearchBy: string, Search: string, IsActive: boolean):
    Observable<SellerRegistration[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let LoginId = currentUser.UserId;
    return this.httpClient.get<string>(environment.baseUrl + `SellerRegistration/Search?Search=` + Search
      + `&SearchBy=` + encodeURIComponent(SearchBy)
      + `&IsActive=` + IsActive + `&LoginId=` + LoginId)
      .pipe(
        map(data => {
          return JSON.parse(data) as SellerRegistration[];
        }),
        catchError(this.handleError)
      );
  }

  public SearchById(SellerFormID: number): Observable<SellerRegistration> {
    return this.httpClient.get<string>(environment.baseUrl + `SellerRegistration/SearchById?SellerFormID=`
      + SellerFormID)
      .pipe(
        map(data => {
          return JSON.parse(data) as SellerRegistration;
        }),
        catchError(this.handleError)
      );
  }

  isEmailRegisterd(username: string) {
    return this.httpClient.get<string>(environment.baseUrl + `SellerRegistration/EmailIdExistance?EmailId=` + username)
      .pipe(map(users => {
        if (users && users == 'Success')
          return true;
        else
          return false;
      })
      );
  }


  public getOTP(Email: string): Observable<string> {
    return this.httpClient.get<string>(environment.baseUrl + `SellerRegistration/GetOTP?Email=`
      + Email)
      .pipe(catchError(this.handleError));
  }

  public Register(obj: SellerRegistration): Observable<Result> {
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `SellerRegistration/Register`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  public doAction(obj: SellerRegistration): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `SellerRegistration/DoAction`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  public update(obj: SellerRegistration): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.LoginId = currentUser.UserId;
    obj.Action = 'U';
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `SellerRegistration/DoAction`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  public delete(obj: SellerRegistration): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.LoginId = currentUser.UserId;
    obj.Action = 'D';
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `SellerRegistration/DoAction`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  public marketPlaceUpdate(obj: SellerRegistration): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.LoginId = currentUser.UserId;
    obj.Action = 'MU';
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `SellerRegistration/DoAction`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  public mobileRequest(obj: SellerRegistration): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.LoginId = currentUser.UserId;
    obj.Action = 'MR';
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `SellerRegistration/DoAction`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  public Authorize(SellerFormID: number, Email: string, ApprovalStatus: string, ApprovalRemarks: string): Observable<Result> {
    let obj = new SellerRegistration();
    obj.SellerFormID = SellerFormID;
    obj.Email = Email;
    obj.ApprovalStatus = ApprovalStatus;
    obj.ApprovalRemarks = ApprovalRemarks;
    let currentUser = this.authenticationService.currentUserValue;
    // // obj.CompanyDetailID = currentUser.CompanyDetailID;
    // obj.CompanyDetailID = 31;
    obj.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `SellerRegistration/Authorize`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }


  //#region Object File

  public FileSave(Filedata: File, Objectid: string): Observable<string> {
    let frmData = new FormData();
    frmData.append("FileData", Filedata, Filedata.name);
    // frmData.append("CompanyID", currentUser.CompanyID.toString());
    frmData.append("Objectid", Objectid);
    return this.httpClient.post<string>(environment.baseUrl + `SellerRegistration/FileSave`, frmData)
      .pipe(catchError(this.handleError));
  }

  public DownloadObjectFile(Objectid: string) {
    return this.httpClient.get(environment.baseUrl + `SellerRegistration/DownloadObjectFile?Objectid=` + Objectid,
      { responseType: 'blob' })
      .pipe(catchError(this.handleError));
  }

  //#endregion

  public getvalues(Type: string): Observable<Dropdown[]> {
    return this.httpClient.get<string>(environment.baseUrl + `SellerRegistration/GetValues?Type=` + Type)
      .pipe(
        map(data => {
          return JSON.parse(data) as Dropdown[];
        }),
        catchError(this.handleError)
      );

  }
  public getCountries(): Observable<Country[]> {
    return this.httpClient.get<string>(environment.baseUrl + 'SellerRegistration/GetCountries')
      .pipe(
        map(data => {
          return JSON.parse(data) as Country[];
        }),
        catchError(this.handleError)
      );
  }

  public getIORPartners(): Observable<IORPartners[]> {
    return this.httpClient.get<string>(environment.baseUrl + 'SellerRegistration/GetIORPartners')
      .pipe(
        map(data => {
          return JSON.parse(data) as IORPartners[];
        }),
        catchError(this.handleError)
      );
  }

  public getEORPartners(): Observable<EORPartners[]> {
    return this.httpClient.get<string>(environment.baseUrl + 'SellerRegistration/GetEORPartners')
      .pipe(
        map(data => {
          return JSON.parse(data) as EORPartners[];
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 404)
      return throwError(new NotFoundError(error));

    if (error.status === 400)
      return throwError(new BadRequest(error));
    return throwError(new AppError(error));
  }
}
