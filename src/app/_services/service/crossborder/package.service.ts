import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { BadRequest } from '../../../common/bad-request';
import { NotFoundError } from '../../../common/not-found-error';
import { AppError } from '../../../common/app-error';

import { AuthenticationService } from '.././authentication.service';
import { Carp, Result, JsonModal, Pod, IOR_Status, PackageHeader, CatalogueHeader, Checklist, BOE, Shipment, PackageDetail, InvoiceDetail, InvoiceHeader } from '../../model/crossborder';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  objJsonModal: JsonModal = {} as any;
  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) {
  }

  //#region Carp Seller  

  public CarpSellerSearch(SearchBy: string, Search: string, StartDate: Date, EndDate: Date):
    Observable<Carp[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let SellerFormID = currentUser.SellerFormID;
    return this.httpClient.get<string>(environment.baseUrl + `Package/CarpSellerSearch?&SearchBy=` +
      encodeURIComponent(SearchBy) + `&Search=` + Search
      + `&StartDate=` + StartDate + `&EndDate=` + EndDate + `&SellerFormID=` + SellerFormID)
      .pipe(
        map(data => {
          return JSON.parse(data) as Carp[];
        }),
        catchError(this.handleError)
      );
  }

  public CarpSellerSearchById(CARPID: number): Observable<Carp> {
    let currentUser = this.authenticationService.currentUserValue;
    let SellerFormID = currentUser.SellerFormID;
    return this.httpClient.get<string>(environment.baseUrl + `Package/CarpSellerSearchById?CARPID=` + CARPID
      + `&SellerFormID=` + SellerFormID)
      .pipe(
        map(data => {
          return JSON.parse(data) as Carp;
        }),
        catchError(this.handleError)
      );
  }

  public CarpSellerInsert(obj: Carp): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.Action = 'I';
    obj.SellerFormID = currentUser.SellerFormID;
    obj.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `Package/CarpSellerAction`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  public CarpSellerUpdate(obj: Carp): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.Action = 'U';
    obj.SellerFormID = currentUser.SellerFormID;
    obj.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `Package/CarpSellerAction`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  public CarpSellerDelete(obj: Carp): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.Action = 'D';
    obj.SellerFormID = currentUser.SellerFormID;
    obj.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `Package/CarpSellerAction`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  //#endregion  

  //#region POD IOR  

  public PODIORSearch(SearchBy: string, Search: string, StartDate: Date, EndDate: Date):
    Observable<Pod[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let LoginId = currentUser.UserId;
    return this.httpClient.get<string>(environment.baseUrl + `Package/PODIORSearch?&SearchBy=` +
      encodeURIComponent(SearchBy) + `&Search=` + Search
      + `&StartDate=` + StartDate + `&EndDate=` + EndDate + `&LoginId=` + LoginId)
      .pipe(
        map(data => {
          return JSON.parse(data) as Pod[];
        }),
        catchError(this.handleError)
      );
  }

  public PODIORSearchById(PODID: number): Observable<Pod> {
    let currentUser = this.authenticationService.currentUserValue;
    let LoginId = currentUser.UserId;
    return this.httpClient.get<string>(environment.baseUrl + `Package/PODIORSearchById?PODID=` + PODID
      + `&LoginId=` + LoginId)
      .pipe(
        map(data => {
          return JSON.parse(data) as Pod;
        }),
        catchError(this.handleError)
      );
  }

  public PODIORInsert(obj: Pod): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.Action = 'I';
    obj.SellerFormID = currentUser.SellerFormID;
    obj.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `Package/PODIORAction`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  public PODIORUpdate(obj: Pod): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.Action = 'U';
    obj.SellerFormID = currentUser.SellerFormID;
    obj.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `Package/PODIORAction`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  public PODIORDelete(obj: Pod): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.Action = 'D';
    obj.SellerFormID = currentUser.SellerFormID;
    obj.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `Package/PODIORAction`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  //#endregion  

  //#region Package IOR  

  public PackageIORSearch(SearchBy: string, Search: string, StartDate: Date, EndDate: Date):
    Observable<PackageHeader[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let LoginId = currentUser.UserId;
    return this.httpClient.get<string>(environment.baseUrl + `Package/PackageIORSearch?&SearchBy=` +
      encodeURIComponent(SearchBy) + `&Search=` + Search
      + `&StartDate=` + StartDate + `&EndDate=` + EndDate + `&LoginId=` + LoginId)
      .pipe(
        map(data => {
          return JSON.parse(data) as PackageHeader[];
        }),
        catchError(this.handleError)
      );
  }

  public PackageIORSearchById(PackageHeaderID: number): Observable<PackageHeader> {
    return this.httpClient.get<string>(environment.baseUrl + `Package/PackageIORSearchById?PackageHeaderID=` + PackageHeaderID)
      .pipe(
        map(data => {
          return JSON.parse(data) as PackageHeader;
        }),
        catchError(this.handleError)
      );
  }

  public PackageIORApprovalBOE(obj: PackageHeader): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.LoginId = currentUser.UserId;
    obj.Action = 'BOE';
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `Package/PackageIORApproval`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  public PackageIORApprovalChecklist(obj: PackageHeader): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.LoginId = currentUser.UserId;
    obj.Action = 'Checklist';
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `Package/PackageIORApproval`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  public PackageIORApprovalSTNInvoiceStatus(obj: PackageHeader): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.LoginId = currentUser.UserId;
    obj.Action = 'STNInvoiceStatus';
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `Package/PackageIORApproval`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  //#endregion  

  //#region Package EOR  

  public PackageEORSearch(SearchBy: string, Search: string, StartDate: Date, EndDate: Date):
    Observable<PackageHeader[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let LoginId = currentUser.UserId;
    return this.httpClient.get<string>(environment.baseUrl + `Package/PackageEORSearch?&SearchBy=` +
      encodeURIComponent(SearchBy) + `&Search=` + Search
      + `&StartDate=` + StartDate + `&EndDate=` + EndDate + `&LoginId=` + LoginId)
      .pipe(
        map(data => {
          return JSON.parse(data) as PackageHeader[];
        }),
        catchError(this.handleError)
      );
  }

  public PackageEORSearchById(PackageHeaderID: number): Observable<PackageHeader> {
    return this.httpClient.get<string>(environment.baseUrl + `Package/PackageEORSearchById?PackageHeaderID=` + PackageHeaderID)
      .pipe(
        map(data => {
          return JSON.parse(data) as PackageHeader;
        }),
        catchError(this.handleError)
      );
  }

  public PackageIORApproval(obj: PackageHeader): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `Package/PackageIORApproval`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  //#endregion 

  //#region Package Seller  

  public PackageSellerSearch(SearchBy: string, Search: string, StartDate: Date, EndDate: Date):
    Observable<PackageHeader[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let SellerFormID = currentUser.SellerFormID;
    return this.httpClient.get<string>(environment.baseUrl + `Package/PackageSellerSearch?&SearchBy=` +
      encodeURIComponent(SearchBy) + `&Search=` + Search
      + `&StartDate=` + StartDate + `&EndDate=` + EndDate + `&SellerFormID=` + SellerFormID)
      .pipe(
        map(data => {
          return JSON.parse(data) as PackageHeader[];
        }),
        catchError(this.handleError)
      );
  }

  public PackageSellerSearchById(PackageHeaderID: number): Observable<PackageHeader> {
    let currentUser = this.authenticationService.currentUserValue;
    let SellerFormID = currentUser.SellerFormID;
    return this.httpClient.get<string>(environment.baseUrl + `Package/PackageSellerSearchById?PackageHeaderID=` + PackageHeaderID
      + `&SellerFormID=` + SellerFormID)
      .pipe(
        map(data => {
          return JSON.parse(data) as PackageHeader;
        }),
        catchError(this.handleError)
      );
  }

  public PackageSellerCatalogue(): Observable<PackageDetail[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let SellerFormID = currentUser.SellerFormID;
    return this.httpClient.get<string>(environment.baseUrl + `Package/PackageSellerCatalogue?SellerFormID=` + SellerFormID)
      .pipe(
        map(data => {
          return JSON.parse(data) as PackageDetail[];
        }),
        catchError(this.handleError)
      );
  }

  public PackageSellerExist(FBAShipmentID: string, PackageHeaderID: number) {
    PackageHeaderID = isNaN(PackageHeaderID) ? 0 : PackageHeaderID;
    return this.httpClient.get<Boolean>(environment.baseUrl +
      `Package/PackageSellerExist?FBAShipmentID=` + FBAShipmentID + `&PackageHeaderID=` + PackageHeaderID)
      .pipe(map(users => {
        if (users)
          return true;
        else
          return false;
      })
      );
  }
  public PackageSellerValidateInvoice(obj: InvoiceHeader): Observable<Result> {
    obj.Action = 'G';
    let currentUser = this.authenticationService.currentUserValue;
    obj.LoginId = currentUser.UserId;
    obj.SellerFormID = currentUser.SellerFormID;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `Package/PackageSellerAction`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }
  public PackageSellerGenerateInvoice(FBAShipmentID: string): Observable<InvoiceHeader[]> {
    return this.httpClient.get<string>(environment.baseUrl + `Package/PackageSellerGenerateInvoice?FBAShipmentID=` + FBAShipmentID)
      .pipe(
        map(data => {
          return JSON.parse(data) as InvoiceHeader[];
        }),
        catchError(this.handleError)
      );
  }

  public PackageSellerInsert(obj: PackageHeader): Observable<Result> {
    obj.Action = 'I';
    let currentUser = this.authenticationService.currentUserValue;
    obj.SellerFormID = currentUser.SellerFormID;
    obj.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `Package/PackageSellerAction`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  public PackageSellerUpdate(obj: PackageHeader): Observable<Result> {
    obj.Action = 'U';
    let currentUser = this.authenticationService.currentUserValue;
    obj.SellerFormID = currentUser.SellerFormID;
    obj.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `Package/PackageSellerAction`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }


  public PackageSellerDelete(obj: PackageHeader): Observable<Result> {
    obj.Action = 'D';
    let currentUser = this.authenticationService.currentUserValue;
    obj.SellerFormID = currentUser.SellerFormID;
    obj.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `Package/PackageSellerAction`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  //#endregion 

  //#region Checklist CHA  

  public ChecklistCHASearch(SearchBy: string, Search: string, StartDate: Date, EndDate: Date):
    Observable<Checklist[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let LoginId = currentUser.UserId;
    return this.httpClient.get<string>(environment.baseUrl + `Package/ChecklistCHASearch?&SearchBy=` +
      encodeURIComponent(SearchBy) + `&Search=` + Search
      + `&StartDate=` + StartDate + `&EndDate=` + EndDate + `&LoginId=` + LoginId)
      .pipe(
        map(data => {
          return JSON.parse(data) as Checklist[];
        }),
        catchError(this.handleError)
      );
  }

  public ChecklistCHASearchById(PackageHeaderID: number): Observable<PackageHeader> {
    return this.httpClient.get<string>(environment.baseUrl + `Package/ChecklistCHASearchById?PackageHeaderID=` + PackageHeaderID)
      .pipe(
        map(data => {
          return JSON.parse(data) as PackageHeader;
        }),
        catchError(this.handleError)
      );
  }

  public ChecklistCHANewChecklist(PackageHeaderID: number): Observable<Checklist[]> {
    return this.httpClient.get<string>(environment.baseUrl + `Package/ChecklistCHANewChecklist?PackageHeaderID=` + PackageHeaderID)
      .pipe(
        map(data => {
          return JSON.parse(data) as Checklist[];
        }),
        catchError(this.handleError)
      );
  }

  public ChecklistCHAInsert(obj: PackageHeader): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.Action = 'I';
    obj.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `Package/ChecklistCHAAction`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  public ChecklistCHAUpdate(obj: PackageHeader): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.Action = 'U';
    obj.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `Package/ChecklistCHAAction`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  public ChecklistCHADelete(obj: PackageHeader): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.Action = 'D';
    obj.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `Package/ChecklistCHAAction`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  //#endregion 

  //#region BOE CHA  

  public BOECHASearch(SearchBy: string, Search: string, StartDate: Date, EndDate: Date):
    Observable<BOE[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let LoginId = currentUser.UserId;
    return this.httpClient.get<string>(environment.baseUrl + `Package/BOECHASearch?&SearchBy=` +
      encodeURIComponent(SearchBy) + `&Search=` + Search
      + `&StartDate=` + StartDate + `&EndDate=` + EndDate + `&LoginId=` + LoginId)
      .pipe(
        map(data => {
          return JSON.parse(data) as BOE[];
        }),
        catchError(this.handleError)
      );
  }

  public BOECHASearchById(PackageHeaderID: number): Observable<PackageHeader> {
    return this.httpClient.get<string>(environment.baseUrl + `Package/BOECHASearchById?PackageHeaderID=` + PackageHeaderID)
      .pipe(
        map(data => {
          return JSON.parse(data) as PackageHeader;
        }),
        catchError(this.handleError)
      );
  }

  public BOECHANewBOE(PackageHeaderID: number): Observable<BOE[]> {
    return this.httpClient.get<string>(environment.baseUrl + `Package/BOECHANewBOE?PackageHeaderID=` + PackageHeaderID)
      .pipe(
        map(data => {
          return JSON.parse(data) as BOE[];
        }),
        catchError(this.handleError)
      );
  }

  public BOECHAInsert(obj: PackageHeader): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.Action = 'I';
    obj.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `Package/BOECHAAction`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  public BOECHAUpdate(obj: PackageHeader): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.Action = 'U';
    obj.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `Package/BOECHAAction`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  public BOECHADelete(obj: PackageHeader): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.Action = 'D';
    obj.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `Package/BOECHAAction`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  //#endregion 

  //#region Shipment EOR  

  public ShipmentEORSearch(SearchBy: string, Search: string, StartDate: Date, EndDate: Date):
    Observable<Shipment[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let LoginId = currentUser.UserId;
    return this.httpClient.get<string>(environment.baseUrl + `Package/ShipmentEORSearch?&SearchBy=` +
      encodeURIComponent(SearchBy) + `&Search=` + Search
      + `&StartDate=` + StartDate + `&EndDate=` + EndDate + `&LoginId=` + LoginId)
      .pipe(
        map(data => {
          return JSON.parse(data) as Shipment[];
        }),
        catchError(this.handleError)
      );
  }

  public ShipmentEORSearchById(PackageHeaderID: number): Observable<PackageHeader> {
    return this.httpClient.get<string>(environment.baseUrl + `Package/ShipmentEORSearchById?PackageHeaderID=` + PackageHeaderID)
      .pipe(
        map(data => {
          return JSON.parse(data) as PackageHeader;
        }),
        catchError(this.handleError)
      );
  }

  public ShipmentEORNewShipment(PackageHeaderID: number): Observable<Shipment[]> {
    return this.httpClient.get<string>(environment.baseUrl + `Package/ShipmentEORNewShipment?PackageHeaderID=` + PackageHeaderID)
      .pipe(
        map(data => {
          return JSON.parse(data) as Shipment[];
        }),
        catchError(this.handleError)
      );
  }

  public ShipmentEORInsert(obj: PackageHeader): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.Action = 'I';
    obj.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `Package/ShipmentEORAction`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  public ShipmentEORUpdate(obj: PackageHeader): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.Action = 'U';
    obj.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `Package/ShipmentEORAction`, this.objJsonModal)
      .pipe(catchError(this.handleError));
  }

  public ShipmentEORDelete(obj: PackageHeader): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    obj.Action = 'D';
    obj.LoginId = currentUser.UserId;
    this.objJsonModal.Json = JSON.stringify(obj);
    return this.httpClient.post<Result>(environment.baseUrl + `Package/ShipmentEORAction`, this.objJsonModal)
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
