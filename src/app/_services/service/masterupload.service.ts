import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BulkMasterUpload, JsonModal, MasterUpload, Result } from '../model/index';
import { AuthenticationService } from './authentication.service';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class MasteruploadService {

  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) { }

  public search(SearchBy: string, Search: string): Observable<MasterUpload[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<MasterUpload[]>(environment.baseUrl + `MasterUpload/Search` +
      `?CompanyID=` + CompanyID + `&CompanyDetailID=` + CompanyDetailID + `&SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search)
      .pipe(catchError(this.handleError));
  }

  public save(Filedata: File, Remarks: string, FileType: string): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    let CompanyID = currentUser.CompanyID;
    let LoginId = currentUser.UserId;
    let frmData = new FormData();
    frmData.append("FileType", FileType);
    frmData.append("LoginId", LoginId.toString());
    frmData.append("CompanyDetailID", CompanyDetailID.toString());
    frmData.append("CompanyID", CompanyID.toString());
    frmData.append("FileData", Filedata, Filedata.name);
    frmData.append("Remarks", Remarks);
    return this.httpClient.post<Result>(environment.baseUrl + `MasterUpload/UploadFile`, frmData)
      .pipe(catchError(this.handleError));
  }

  public getfile(FileId: number) {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get(environment.baseUrl + `MasterUpload/GetFile?CompanyID=` + CompanyID +
      `&CompanyDetailID=` + CompanyDetailID + `&FileId=` + FileId,
      { responseType: 'blob' })
      .pipe(catchError(this.handleError));
  }

  public getErrorDetail(FileId: number) {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get(environment.baseUrl + `MasterUpload/ErrorDetail?CompanyID=` + CompanyID +
      `&CompanyDetailID=` + CompanyDetailID + `&FileId=` + FileId,
      { responseType: 'blob' })
      .pipe(catchError(this.handleError));
  }

  public getFileTemplate(filetype: string) {
    return this.httpClient.get(environment.baseUrl + `MasterUpload/GetFileTemplate?FileType=` + filetype,
      { responseType: 'blob' })
      .pipe(catchError(this.handleError));
  }


  //#region Object File

  public FileSave(Filedata: File, Objectid: string): Observable<string> {
    let currentUser = this.authenticationService.currentUserValue;
    let LoginId = currentUser.UserId;
    let frmData = new FormData();
    frmData.append("LoginId", LoginId.toString());
    frmData.append("FileData", Filedata, Filedata.name);
    // frmData.append("CompanyID", currentUser.CompanyID.toString());
    frmData.append("Objectid", Objectid);
    return this.httpClient.post<string>(environment.baseUrl + `MasterUpload/FileSave`, frmData)
      .pipe(catchError(this.handleError));
  }

  public DownloadObjectFile(Objectid: string) {
    return this.httpClient.get(environment.baseUrl + `MasterUpload/DownloadObjectFile?Objectid=` + Objectid,
      { responseType: 'blob' })
      .pipe(catchError(this.handleError));
  }

  //#endregion

  //#region Reimbursement Delete

  objJsonModal: JsonModal = {} as any;
  public ReimbursementDelete(obj: BulkMasterUpload): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.CompanyDetailID = currentUser.CompanyDetailID;
    obj.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `MasterUpload/ReimbursementDelete`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }
  //#endregion

  private handleError(errorResponse: HttpErrorResponse) {
    if (errorResponse.error instanceof ErrorEvent) {
      console.error('Client Side Error :', errorResponse.error.message);
    } else {
      console.error('Server Side Error :', errorResponse);
    }
    return throwError('There is a problem with the service. We are notified & working on it. Please try again later.');
  }
}
