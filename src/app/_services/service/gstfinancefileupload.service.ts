import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BadRequest } from './../../common/bad-request';
import { NotFoundError } from './../../common/not-found-error';
import { AppError } from './../../common/app-error';
import { AuthenticationService } from './authentication.service';
import { Gstfinancefileupload, Result } from '../model/index'
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
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Gstfinancefileupload[]>(environment.baseUrl +
      `GSTFinance/Search?ApprovalStatus=` + ApprovalStatus + `&FileType=` + FileType + `&FileName=` + FileName
      + `&LoginId=` + LoginId + `&CompanyDetailID=` + CompanyDetailID)
      .pipe(catchError(this.handleError));
  }

  public SearchById(FileID: number): Observable<Gstfinancefileupload> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Gstfinancefileupload>(environment.baseUrl +
      `GSTFinance/SearchById?FileID=` + FileID + `&CompanyDetailID=` + CompanyDetailID)
      .pipe(catchError(this.handleError));
  }

  public Existence(FileId: number, FileType: string, Year: number, Month: number) {
    FileId = isNaN(FileId) ? 0 : FileId;
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Boolean>(environment.baseUrl +
      `GSTFinance/Existence?FileId=` + FileId + `&FileType=` + FileType +
      `&Year=` + Year + `&Month=` + Month + `&CompanyDetailID=` + CompanyDetailID)
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
    let CompanyDetailID = currentUser.CompanyDetailID;
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
    frmData.append("CompanyDetailID", CompanyDetailID.toString());
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
    objGstfinancefileupload.CompanyDetailID = currentUser.CompanyDetailID;
    objGstfinancefileupload.LoginId = currentUser.UserId;
    return this.httpClient.post<Result>(environment.baseUrl + `GSTFinance/Approval`, objGstfinancefileupload)
      .pipe(catchError(this.handleError));
  }


  public Delete(FileID: number): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    this.objGstfinancefileupload.FileID = FileID;
    this.objGstfinancefileupload.CompanyDetailID = currentUser.CompanyDetailID;
    this.objGstfinancefileupload.LoginId = currentUser.UserId;
    return this.httpClient.post<Result>(environment.baseUrl + `GSTFinance/Delete`, this.objGstfinancefileupload)
      .pipe(catchError(this.handleError));
  }

  public FinanceApproverCheck(): Observable<string> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    let LoginId = currentUser.UserId;
    return this.httpClient.get<string>(environment.baseUrl +
      `GSTFinance/FinanceApproverCheck?LoginId=` + LoginId + `&CompanyDetailID=` + CompanyDetailID)
      .pipe(catchError(this.handleError));
  }

  public GSTReturnProcesses(): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    this.objGstfinancefileupload.CompanyDetailID = currentUser.CompanyDetailID;
    this.objGstfinancefileupload.LoginId = currentUser.UserId;
    return this.httpClient.post<Result>(environment.baseUrl + `GSTFinance/GSTReturnProcesses`, this.objGstfinancefileupload)
      .pipe(catchError(this.handleError));
  }

  public DownloadGSTReturn(Year: number, Month: number, State: string) {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get(environment.baseUrl +
      `GSTFinance/DownloadGSTReturn?Year=` + Year + `&Month=` + Month + `&State=` + State +
      `&CompanyDetailID=` + CompanyDetailID,
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
