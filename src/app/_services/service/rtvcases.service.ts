import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BadRequest } from '../../common/bad-request';
import { NotFoundError } from '../../common/not-found-error';

import { AppError } from '../../common/app-error';
import { AuthenticationService } from './authentication.service';
import { RTVCaseHeader, Result } from '../model/index';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RTVcasesService {
  objRTVCaseHeader: RTVCaseHeader = {} as any;
  lstRTVCaseHeadernew: RTVCaseHeader[] = [] as any;

  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) { }

  public RTVCaseAssign(FromDate: string, ToDate: string): Observable<RTVCaseHeader[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<RTVCaseHeader[]>(environment.baseUrl + `RTVCases/RTVCaseAssign?CompanyDetailID=` +
      CompanyDetailID
      + `&FromDate=` + FromDate + `&ToDate=` + ToDate)
      .pipe(catchError(this.handleError));
  }

  public RTVCaseAssignSave(AssignTo: number, lstRTVCaseHeader1: RTVCaseHeader[]): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    lstRTVCaseHeader1.forEach((element, index) => {
      lstRTVCaseHeader1[index].AssignTo = AssignTo;
      lstRTVCaseHeader1[index].CompanyDetailID = currentUser.CompanyDetailID;
      lstRTVCaseHeader1[index].LoginId = currentUser.UserId;
    });

    return this.httpClient.post<Result>(environment.baseUrl + `RTVCases/RTVCaseAssignSave`, lstRTVCaseHeader1)
      .pipe(catchError(this.handleError));
  }

  public RTVCaseTransferSave(TransferTo: number, Remarks: string, lstRTVCaseHeader: RTVCaseHeader[]): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    lstRTVCaseHeader.forEach((element, index) => {
      lstRTVCaseHeader[index].TransferTo = TransferTo;
      lstRTVCaseHeader[index].Remarks = Remarks;
      lstRTVCaseHeader[index].CompanyDetailID = currentUser.CompanyDetailID;
      lstRTVCaseHeader[index].LoginId = currentUser.UserId;
    });
    return this.httpClient.post<Result>(environment.baseUrl + `RTVCases/RTVCaseTransferSave`, lstRTVCaseHeader)
      .pipe(catchError(this.handleError));
  }

  public RTVCaseUpdate(objRTVCaseHeaderViewModel: RTVCaseHeader): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    objRTVCaseHeaderViewModel.LoginId = currentUser.UserId;
    objRTVCaseHeaderViewModel.CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.post<Result>(environment.baseUrl + `RTVCases/RTVCaseUpdate`, objRTVCaseHeaderViewModel)
      .pipe(catchError(this.handleError));
  }


  public RTVAssignSearch(SearchBy: string, Search: string, FromDate: string, ToDate: string): Observable<RTVCaseHeader[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    let LoginId = currentUser.LoginId;
    return this.httpClient.get<RTVCaseHeader[]>(environment.baseUrl + `RTVCases/RTVAssignSearch?CompanyDetailID=` +
      CompanyDetailID + `&SearchBy=` + SearchBy + `&Search=` + Search + `&LoginId=` + LoginId
      + `&FromDate=` + FromDate + `&ToDate=` + ToDate)
      .pipe(catchError(this.handleError));
  }

  public RTVTransferSearch(SearchBy: string, Search: string, FromDate: string, ToDate: string): Observable<RTVCaseHeader[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<RTVCaseHeader[]>(environment.baseUrl + `RTVCases/RTVTransferSearch?CompanyDetailID=` +
      CompanyDetailID + `&SearchBy=` + SearchBy + `&Search=` + Search
      + `&FromDate=` + FromDate + `&ToDate=` + ToDate)
      .pipe(catchError(this.handleError));
  }

  public Existence(ParentCaseId: string, AmazonCaseId: string, RTVID: number) {
    RTVID = isNaN(RTVID) ? 0 : RTVID;
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Boolean>(environment.baseUrl + `RTVCases/Existence?ParentCaseId=` + ParentCaseId +
      `&CompanyDetailID=` + CompanyDetailID + `&AmazonCaseId=` + AmazonCaseId + `&RTVID=` + RTVID)
      .pipe(
        map(users => {
          if (users && users == true)
            return true;
          else
            return false;
        })
      );
  }

  public RTVCaseImages(RemovalOrderID: string, TrackingID: string, DisputeType: string) {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get(environment.baseUrl + `RTVCases/RTVCaseImages?CompanyDetailID=` +
      CompanyDetailID + `&RemovalOrderID=` + RemovalOrderID + `&TrackingID=` + TrackingID
      + `&DisputeType=` + DisputeType, { responseType: 'blob' })
      .pipe(catchError(this.handleError));
  }

  public RTVCaseReplicationSearch(SearchBy: string, Search: string, FromDate: string, ToDate: string): Observable<RTVCaseHeader[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<RTVCaseHeader[]>(environment.baseUrl + `RTVCases/RTVCaseReplicationSearch?CompanyDetailID=` +
      CompanyDetailID + `&SearchBy=` + SearchBy + `&Search=` + Search
      + `&FromDate=` + FromDate + `&ToDate=` + ToDate)
      .pipe(catchError(this.handleError));
  }

  public RTVCaseSearch(SearchBy: string, Search: string, FromDate: string, ToDate: string): Observable<RTVCaseHeader[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<RTVCaseHeader[]>(environment.baseUrl + `RTVCases/RTVCaseSearch?CompanyDetailID=` +
      CompanyDetailID + `&SearchBy=` + SearchBy + `&Search=` + Search
      + `&FromDate=` + FromDate + `&ToDate=` + ToDate)
      .pipe(catchError(this.handleError));
  }

  public RTVCaseSearchById(RTVID: number): Observable<RTVCaseHeader> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<RTVCaseHeader>(environment.baseUrl + `RTVCases/RTVCaseSearchById?CompanyDetailID=` +
      CompanyDetailID + `&RTVID=` + RTVID)
      .pipe(catchError(this.handleError));
  }

  public RTVCaseTransfer(LoginId: number): Observable<RTVCaseHeader[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<RTVCaseHeader[]>(environment.baseUrl + `RTVCases/RTVCaseTransfer?CompanyDetailID=` +
      CompanyDetailID + `&LoginId=` + LoginId)
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
