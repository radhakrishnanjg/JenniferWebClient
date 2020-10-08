import { Injectable, } from '@angular/core';
import { HttpClient, HttpErrorResponse, } from '@angular/common/http';
import { Observable, throwError, } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BadRequest } from './../../common/bad-request';
import { NotFoundError } from './../../common/not-found-error';
import { AppError } from './../../common/app-error';
import { AuthenticationService } from './authentication.service';
import { DownloadMaster, DownloadDetail, AmazonMTR, DownloadLog, Result, JsonModal } from '../model/index';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  objDownloadMaster: DownloadMaster = {} as any;

  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) { }

  public search(SearchBy: string, Search: string, IsActive: Boolean): Observable<DownloadMaster[]> {
    return this.httpClient.get<DownloadMaster[]>(environment.baseUrl +
      `Download/Search?SearchBy=` + SearchBy + `&Search=` + Search + `&IsActive=` + IsActive)
      .pipe(catchError(this.handleError));
  }

  public searchById(Download_Master_ID: number): Observable<DownloadMaster> {
    return this.httpClient.get<DownloadMaster>(environment.baseUrl +
      `Download/SearchById?Download_Master_ID=` + Download_Master_ID)
      .pipe(catchError(this.handleError));
  }

  public getDownloadScreens(Report_Type: string): Observable<DownloadMaster[]> {
    return this.httpClient.get<DownloadMaster[]>(environment.baseUrl +
      `Download/GetScreens?Report_Type=` + Report_Type)
      .pipe(catchError(this.handleError));
  }

  public getDownloadParameters(Download_Master_Id: number): Observable<DownloadDetail[]> {
    return this.httpClient.get<DownloadDetail[]>(environment.baseUrl +
      `Download/GetParameters?Download_Master_Id=` + Download_Master_Id)
      .pipe(catchError(this.handleError));
  }

  public add(objDownloadMaster: DownloadMaster): Observable<Result> {
    return this.httpClient.post<Result>(environment.baseUrl + `Download/Insert`, objDownloadMaster)
      .pipe(catchError(this.handleError));
  }

  public delete(Download_Master_ID: number): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    this.objDownloadMaster.Download_Master_ID = Download_Master_ID;
    this.objDownloadMaster.LoginId = currentUser.UserId;
    return this.httpClient.post<Result>(environment.baseUrl + `Download/Delete`, this.objDownloadMaster)
      .pipe(catchError(this.handleError));
  }


  public downloadExcel(SP_Name: string, MenuId: number, Filename: string, DynamicQuery: string): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    this.objDownloadMaster.Filename = Filename;
    this.objDownloadMaster.SP_Name = SP_Name;
    this.objDownloadMaster.UserId = currentUser.UserId;
    this.objDownloadMaster.CompanyID = currentUser.CompanyID;
    this.objDownloadMaster.CompanyDetailID = currentUser.CompanyDetailID;
    this.objDownloadMaster.MenuID = MenuId;
    DynamicQuery += " @CompanyID=" + currentUser.CompanyID + ",";
    DynamicQuery += "@CompanyDetailID=" + currentUser.CompanyDetailID + ",";
    DynamicQuery += "@UserId=" + currentUser.UserId + ",";
    DynamicQuery += "@MenuId=" + MenuId + "";
    this.objDownloadMaster.DynamicQuery = DynamicQuery;
    return this.httpClient.post<Result>(environment.baseUrl + `Download/DownloadExcel`, this.objDownloadMaster)
      .pipe(catchError(this.handleError));
  }

  public Download(filename: string, MenuId: number) {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get(environment.baseUrl + `Download/Download?CompanyDetailID=` + CompanyDetailID +
      `&filename=` + filename +
      `&MenuId=` + MenuId,
      { responseType: 'blob' })
      .pipe(catchError(this.handleError));
  }


  public getAmazonMTR(SearchBy: string, Search: string, StartDate: Date, EndDate: Date): Observable<AmazonMTR[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<AmazonMTR[]>(environment.baseUrl +
      `Download/AmazonMTRFiles?SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search +
      `&CompanyDetailID=` + CompanyDetailID + `&StartDate=` + StartDate + `&EndDate=` + EndDate)
      .pipe(catchError(this.handleError));
  }

  public downloadAmazonMTR(FilePath: string) {
    return this.httpClient.get(environment.baseUrl + `Download/DownloadAmazonMTRFile?FilePath=` +
      encodeURIComponent(FilePath)
      ,
      { responseType: 'blob' })
      .pipe(catchError(this.handleError));
  }

  //#region Download Log
  public getDownloadLog(Download_Master_ID: number): Observable<DownloadLog[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<string>(environment.baseUrl +
      `Download/GetDownloadLog?CompanyID=` + CompanyID + `&CompanyDetailID=` + CompanyDetailID
      + `&Download_Master_ID=` + Download_Master_ID)
      .pipe(
        map(data => {
          return JSON.parse(data) as DownloadLog[]
        }),
        catchError(this.handleError)
      );
  }

  objJsonModal: JsonModal = {} as any;
  public InsertDownloadLog(objDownloadLog: DownloadLog): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    objDownloadLog.LoginId = currentUser.UserId;
    objDownloadLog.CompanyID = currentUser.CompanyID;
    objDownloadLog.CompanyDetailID = currentUser.CompanyDetailID;

    let DynamicQuery = objDownloadLog.Dynamic_Query;
    DynamicQuery += " @CompanyID=" + currentUser.CompanyID + ",";
    DynamicQuery += "@CompanyDetailID=" + currentUser.CompanyDetailID + ",";
    DynamicQuery += "@UserId=" + currentUser.UserId + ",";
    DynamicQuery += "@MenuId=" + objDownloadLog.MenuId + "";
    objDownloadLog.Dynamic_Query = DynamicQuery; 
    this.objJsonModal.Json = JSON.stringify(objDownloadLog);
    return this.httpClient.post<Result>(environment.baseUrl + `Download/InsertDownloadLog`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  //#endregion
  private handleError(error: HttpErrorResponse) {

    if (error.status === 404)
      return throwError(new NotFoundError(error));

    if (error.status === 400)
      return throwError(new BadRequest(error));
    return throwError(new AppError(error));
  }
}
