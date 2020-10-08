import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BadRequest } from './../../common/bad-request';
import { NotFoundError } from './../../common/not-found-error';
import { AppError } from './../../common/app-error';
import { AuthenticationService } from './authentication.service';
import { Gstfinancefileupload, Result, TallyProcess } from '../model/index'
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GstfinancefileuploadService {

  lstGstfinancefileupload: Gstfinancefileupload[];
  objGstfinancefileupload: Gstfinancefileupload = {} as any;

  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) { }

  public Search(ApprovalStatus: string, FileType: string, FileName: string)
    : Observable<Gstfinancefileupload[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let LoginId = currentUser.UserId;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Gstfinancefileupload[]>(environment.baseUrl +
      `GSTFinance/Search?ApprovalStatus=` + ApprovalStatus + `&FileType=` + FileType + `&FileName=` + FileName
      + `&LoginId=` + LoginId + `&CompanyID=` + CompanyID)
      .pipe(catchError(this.handleError));
  }

  public SearchById(FileID: number): Observable<Gstfinancefileupload> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Gstfinancefileupload>(environment.baseUrl +
      `GSTFinance/SearchById?FileID=` + FileID + `&CompanyID=` + CompanyID)
      .pipe(catchError(this.handleError));
  }

  public Existence(FileId: number, FileType: string, Year: number, Month: number) {
    FileId = isNaN(FileId) ? 0 : FileId;
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Boolean>(environment.baseUrl +
      `GSTFinance/Existence?FileId=` + FileId + `&FileType=` + FileType +
      `&Year=` + Year + `&Month=` + Month + `&CompanyID=` + CompanyID)
      .pipe(map(users => {
        if (users)
          return true;
        else
          return false;
      })
      );
  }

  public Save(Filedata: File, Remarks: string, FileId: number,
    FileType: string, Action: string, Month: number
    , ApprovalStatus: string, Year: number)
    : Observable<Result> {
    debugger
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    let LoginId = currentUser.UserId;
    let frmData = new FormData();

    frmData.append("Action", Action);
    frmData.append("FileId", FileId.toString());
    frmData.append("FileType", FileType);
    frmData.append("Year", Year.toString());
    frmData.append("Month", Month.toString());


    frmData.append("LoginId", LoginId.toString());
    frmData.append("ApprovalStatus", ApprovalStatus);
    frmData.append("Remarks", Remarks);
    frmData.append("CompanyID", CompanyID.toString());
    frmData.append("FileData", Filedata, Filedata.name);

    return this.httpClient.post<Result>(environment.baseUrl + `GSTFinance/UploadFile`, frmData)
      .pipe(catchError(this.handleError));
  }


  public getFileTemplate(FileType: string) {
    return this.httpClient.get(environment.baseUrl + `GSTFinance/GetFileTemplate?FileType=` + FileType,
      { responseType: 'blob' })
      .pipe(catchError(this.handleError));
  }

  public downloadActualFile(downloadFilePath: string, fileName: string) {
    return this.httpClient.get(environment.baseUrl +
      `GSTFinance/DownloadActualFile?downloadFilePath=` + downloadFilePath +
      `&fileName=` + fileName,
      { responseType: 'blob' })
      .pipe(catchError(this.handleError));
  }

  public Approval(objGstfinancefileupload: Gstfinancefileupload): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    objGstfinancefileupload.CompanyID = currentUser.CompanyID;
    objGstfinancefileupload.LoginId = currentUser.UserId;
    return this.httpClient.post<Result>(environment.baseUrl + `GSTFinance/Approval`, objGstfinancefileupload)
      .pipe(catchError(this.handleError));
  }

  public Delete(FileID: number): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    this.objGstfinancefileupload.FileID = FileID;
    this.objGstfinancefileupload.CompanyID = currentUser.CompanyID;
    this.objGstfinancefileupload.LoginId = currentUser.UserId;
    return this.httpClient.post<Result>(environment.baseUrl + `GSTFinance/Delete`, this.objGstfinancefileupload)
      .pipe(catchError(this.handleError));
  }

  public FinanceApproverCheck(ActionName:string ): Observable<string> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    let LoginId = currentUser.UserId; 
    return this.httpClient.get<string>(environment.baseUrl +
      `GSTFinance/FinanceApproverCheck?LoginId=` + LoginId + `&CompanyID=` + CompanyID + `&ActionName=` + ActionName)
      .pipe(catchError(this.handleError));
  }

  public GSTReturnProcesses(): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    this.objGstfinancefileupload.CompanyID = currentUser.CompanyID;
    this.objGstfinancefileupload.LoginId = currentUser.UserId;
    return this.httpClient.post<Result>(environment.baseUrl + `GSTFinance/GSTReturnProcesses`, this.objGstfinancefileupload)
      .pipe(catchError(this.handleError));
  }

  public DownloadGSTReturn(Year: number, Month: number, State: string) {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get(environment.baseUrl +
      `GSTFinance/DownloadGSTReturn?Year=` + Year + `&Month=` + Month + `&State=` + State +
      `&CompanyID=` + CompanyID,
      { responseType: 'blob' })
      .pipe(catchError(this.handleError));
  }

  //#region Tally process

  public SearchProcessedRecords(SearchBy: string, Search: string):
  Observable<TallyProcess[]> {
  let currentUser = this.authenticationService.currentUserValue;
  let CompanyID = currentUser.CompanyID;
  let LoginId = currentUser.UserId;
  return this.httpClient.get<string>(environment.baseUrl + `GSTFinance/SearchProcessedRecords?Search=` + Search
    + `&SearchBy=` + encodeURIComponent(SearchBy)
    + `&LoginId=` + LoginId
    + `&CompanyID=` + CompanyID)
    .pipe(
      map(data => {
        return JSON.parse(data) as TallyProcess[];
      }),
      catchError(this.handleError)
    );
}
  public InsertTallyProcess(obj:TallyProcess): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.CompanyID = currentUser.CompanyID;
    obj.LoginId = currentUser.UserId;
    return this.httpClient.post<Result>(environment.baseUrl + `GSTFinance/InsertTallyProcess`, obj)
      .pipe(catchError(this.handleError));
  }

  public DownloadLTallyProcess(obj:TallyProcess): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.CompanyID = currentUser.CompanyID;
    obj.LoginId = currentUser.UserId;
    return this.httpClient.post<Result>(environment.baseUrl + `GSTFinance/DownloadLTallyProcess`, obj)
      .pipe(catchError(this.handleError));
  }

  public DownloadTallyFile(filename: string) { 
    return this.httpClient.get(environment.baseUrl + `GSTFinance/DownloadTallyFile?` +  
      `filename=` + filename ,
      { responseType: 'blob' })
      .pipe(catchError(this.handleError));
  }

  // #endregion
  private handleError(error: HttpErrorResponse) {

    if (error.status === 404)
      return throwError(new NotFoundError(error));

    if (error.status === 400)
      return throwError(new BadRequest(error));
    return throwError(new AppError(error));
  }


}
