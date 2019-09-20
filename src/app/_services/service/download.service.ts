import { Injectable, } from '@angular/core';
import { HttpClient, HttpErrorResponse, } from '@angular/common/http';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BadRequest } from './../../common/bad-request';
import { NotFoundError } from './../../common/not-found-error';
import { AppError } from './../../common/app-error';
import { AuthenticationService } from './authentication.service';
import { DownloadMaster, DownloadDetail, AmazonMTR, Result } from '../model/index';
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

  public downloadExcel(MenuId: number, Filename: string, DynamicQuery: string): Observable<Result> {
    this.objDownloadMaster.Filename = Filename;
    let currentUser = this.authenticationService.currentUserValue;
    DynamicQuery += "@CompanyID=" + currentUser.CompanyID + ",";
    DynamicQuery += "@CompanyDetailID=" + currentUser.CompanyDetailID + ",";
    DynamicQuery += "@UserId=" + currentUser.UserId  + ",";
    DynamicQuery += "@MenuId=" + MenuId + "";
    this.objDownloadMaster.DynamicQuery = DynamicQuery;
    return this.httpClient.post<Result>(environment.baseUrl + `Download/DownloadExcel`, this.objDownloadMaster)
      .pipe(catchError(this.handleError));
  }

  public Download(filename: string) {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get(environment.baseUrl + `Download/Download?CompanyDetailID=` + CompanyDetailID +
      `&filename=` + filename,
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

  private handleError(error: HttpErrorResponse) {

    if (error.status === 404)
      return throwError(new NotFoundError(error));

    if (error.status === 400)
      return throwError(new BadRequest(error));
    return throwError(new AppError(error));
  }
}
