import { Injectable, } from '@angular/core';
import { HttpClient, HttpErrorResponse, } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, throwError, } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { BadRequest } from './../../common/bad-request';
import { NotFoundError } from './../../common/not-found-error';
import { AppError } from './../../common/app-error';

import { AuthenticationService } from './authentication.service';
import { Goodsdispute, } from '../model/index';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GoodsDisputeService {
  lst: Goodsdispute[];
  obj: Goodsdispute = {} as any;
  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) { }

  public search(SearchBy: string, Search: string): Observable<Goodsdispute[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Goodsdispute[]>(environment.baseUrl +
      `GoodsDispute/Search?CompanyDetailID=` + CompanyDetailID + `&SearchBy=` + encodeURIComponent(SearchBy) + `&Search=` + Search)
      .pipe(catchError(this.handleError));
  }

  public searchById(DisputeID: number): Observable<Goodsdispute> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Goodsdispute>(environment.baseUrl +
      `GoodsDispute/SearchById?CompanyDetailID=` + CompanyDetailID + `&DisputeID=` + DisputeID)
      .pipe(catchError(this.handleError));
  }

  // public getItems(JenniferItemSerial: string): Observable<Item[]> {
  //   let currentUser = this.authenticationService.currentUserValue;
  //   let CompanyDetailID = currentUser.CompanyDetailID;
  //   return this.httpClient.get<Item[]>(environment.baseUrl + `PrivateUtility/GetGoodsDisputeGRNInvItem?JenniferItemSerial=` + JenniferItemSerial +
  //     `&CompanyDetailID=` + CompanyDetailID)
  //     .pipe(catchError(this.handleError));
  // }

  public exist(DisputeID: number, JenniferItemSerial: string) {
    DisputeID = isNaN(DisputeID) ? 0 : DisputeID;
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Boolean>(environment.baseUrl +
      `GoodsDispute/Exist?CompanyDetailID=` + CompanyDetailID +
      `&DisputeID=` + DisputeID + `&JenniferItemSerial=` + JenniferItemSerial)
      .pipe(map(items => {
        return items;
      })
      );
  }

  public Insert(GRNInwardID: number, JenniferItemSerial: string, DisputeType: string,
    OtherItemID: string, Remarks: string, VideoLink: string,
    Filedata1: File, Filedata2: File, Filedata3: File, Filedata4: File, Filedata5: File, Filedata6: File,
    Filedata7: File, Filedata8: File, Filedata9: File, Filedata10: File, ): Observable<boolean> {
    let currentUser = this.authenticationService.currentUserValue;
    let frmData = new FormData();
    frmData.append("CompanyDetailID", currentUser.CompanyDetailID.toString());
    frmData.append("LoginId", currentUser.UserId.toString());
    frmData.append("JenniferItemSerial", JenniferItemSerial);
    frmData.append("GRNInwardID", GRNInwardID.toString());
    frmData.append("DisputeType", DisputeType);
    frmData.append("OtherItemID", OtherItemID);
    frmData.append("Remarks", Remarks);
    frmData.append("VideoLink", VideoLink);
    if (Filedata1 != null) {
      frmData.append("Image1", Filedata1, Filedata1.name);
    }
    if (Filedata2 != null) {
      frmData.append("Image2", Filedata2, Filedata2.name);
    }
    if (Filedata3 != null) {
      frmData.append("Image3", Filedata3, Filedata3.name);
    }
    if (Filedata4 != null) {
      frmData.append("Image4", Filedata4, Filedata4.name);
    }
    if (Filedata5 != null) {
      frmData.append("Image5", Filedata5, Filedata5.name);
    }
    if (Filedata6 != null) {
      frmData.append("Image6", Filedata6, Filedata6.name);
    }
    if (Filedata7 != null) {
      frmData.append("Image7", Filedata7, Filedata7.name);
    }
    if (Filedata8 != null) {
      frmData.append("Image8", Filedata8, Filedata8.name);
    }
    if (Filedata9 != null) {
      frmData.append("Image9", Filedata9, Filedata9.name);
    }
    if (Filedata10 != null) {
      frmData.append("Image10", Filedata10, Filedata10.name);
    }
    return this.httpClient.post<boolean>(environment.baseUrl + `GoodsDispute/Insert`, frmData)
      .pipe(catchError(this.handleError));
  }

  public DownloadImages(DisputeID: number) {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get(environment.baseUrl + `GoodsDispute/GetImages?CompanyDetailID=` + CompanyDetailID +
      `&DisputeID=` + DisputeID,
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
