import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BadRequest } from '../../common/bad-request';
import { NotFoundError } from '../../common/not-found-error';
import { AppError } from '../../common/app-error';

import { AuthenticationService } from './authentication.service';
import {
  CompanyRegister, Companydetails, Marketplace,
  Brand, Category, SubCategory,
  UOM, ProductGroup, Dropdown,
  Vendor, Vendorwarehouse, Customer, Item, Location, Emailtemplate,
  Customerwarehouse, InvoiceNumber,
  PaymentTermType, Salesratecard, Discount, Result
} from '../../_services/model';

import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})

export class PrivateutilityService {
  constructor(private httpClient: HttpClient,
    private authenticationService: AuthenticationService) {
  }
  public GetMasterDropdowns(): Observable<Dropdown[]> {
    return this.httpClient.get<Dropdown[]>(environment.baseUrl + `PrivateUtility/GetMasterDropdowns`)
      .pipe(catchError(this.handleError));
  }

  public GetValues(Type: string): Observable<Dropdown[]> {
    if (Type != "") {
      return this.httpClient.get<Dropdown[]>(environment.baseUrl + `PrivateUtility/GetValues?Type=` + encodeURIComponent(Type))
        .pipe(catchError(this.handleError));
    }
  }

  public getComanyUsers(CompanyID: number): Observable<CompanyRegister[]> {
    return this.httpClient.get<CompanyRegister[]>(environment.baseUrl + `PrivateUtility/ComanyUsers?CompanyID=` + CompanyID)
      .pipe(catchError(this.handleError));
  }

  public getComanyDetails(): Observable<Companydetails[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Companydetails[]>(environment.baseUrl + `PrivateUtility/GetComanyDetails?CompanyID=` + CompanyID)
      .pipe(catchError(this.handleError));
  }

  public getUserComanyDetails(): Observable<Companydetails[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let UserId = currentUser.UserId;
    return this.httpClient.get<Companydetails[]>(environment.baseUrl + `PrivateUtility/GetUserComanyDetails?UserId=` + UserId)
      .pipe(catchError(this.handleError));
  }
  public getEditUserStores(UserId: number): Observable<Companydetails[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Companydetails[]>(environment.baseUrl + `PrivateUtility/UserStores?UserId=` + UserId + `&CompanyID=` + CompanyID)
      .pipe(catchError(this.handleError));
  }

  public getMarketPlaces(): Observable<Marketplace[]> {
    return this.httpClient.get<Marketplace[]>(environment.baseUrl + `PrivateUtility/GetMarketPlaces`)
      .pipe(catchError(this.handleError));
  }

  public getBrands(): Observable<Brand[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Brand[]>(environment.baseUrl + `PrivateUtility/GetBrands?CompanyID=` + CompanyID)
      .pipe(catchError(this.handleError));
  }
  public getProductGroups(): Observable<ProductGroup[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<ProductGroup[]>(environment.baseUrl + `PrivateUtility/GetProductGroups?CompanyID=` + CompanyID)
      .pipe(catchError(this.handleError));
  }

  public getCategories(ProductGroupID: number): Observable<Category[]> {
    if (ProductGroupID != 0) {
      let currentUser = this.authenticationService.currentUserValue;
      let CompanyID = currentUser.CompanyID;
      return this.httpClient.get<Category[]>(environment.baseUrl + `PrivateUtility/GetCategories?CompanyID=` + CompanyID +
        `&ProductGroupID=` + ProductGroupID)
        .pipe(catchError(this.handleError));
    }
  }

  public getSubCategories(CategoryID: number): Observable<SubCategory[]> {
    if (CategoryID != 0) {
      let currentUser = this.authenticationService.currentUserValue;
      let CompanyID = currentUser.CompanyID;
      return this.httpClient.get<SubCategory[]>(environment.baseUrl + `PrivateUtility/GetSubCategories?CompanyID=` + CompanyID +
        `&CategoryID=` + CategoryID)
        .pipe(catchError(this.handleError));
    }
  }

  public getUOMs(): Observable<UOM[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<UOM[]>(environment.baseUrl + `PrivateUtility/GetUOMs?CompanyID=` + CompanyID)
      .pipe(catchError(this.handleError));
  }

  public getVendors(): Observable<Vendor[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Vendor[]>(environment.baseUrl + `PrivateUtility/GetVendors?CompanyID=` + CompanyID)
      .pipe(catchError(this.handleError));
  }

  public getCustomers(): Observable<Customer[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Customer[]>(environment.baseUrl + `PrivateUtility/GetCustomers?CompanyID=` + CompanyID)
      .pipe(catchError(this.handleError));
  }

  public getItems(SubCategoryID: number): Observable<Item[]> {
    if (SubCategoryID != 0) {
      let currentUser = this.authenticationService.currentUserValue;
      let CompanyDetailID = currentUser.CompanyDetailID;
      return this.httpClient.get<Item[]>(environment.baseUrl + `PrivateUtility/GetItems?CompanyDetailID=` + CompanyDetailID +
        `&SubCategoryID=` + SubCategoryID)
        .pipe(catchError(this.handleError));
    }
  }

  public getLocations(): Observable<Location[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Location[]>(environment.baseUrl + `PrivateUtility/GetLocations?CompanyID=` + CompanyID)
      .pipe(catchError(this.handleError));
  }

  public getTopCompanies(): Observable<CompanyRegister[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let UserId = currentUser.UserId;
    return this.httpClient.get<CompanyRegister[]>(environment.baseUrl + `PrivateUtility/GetTopCompanies?UserId=` + UserId)
      .pipe(catchError(this.handleError));
  }

  public getTopUserStores(CompanyID: number): Observable<Companydetails[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let UserId = currentUser.UserId;
    return this.httpClient.get<Companydetails[]>(environment.baseUrl + `PrivateUtility/GetTopUserStores?CompanyID=` + CompanyID +
      `&UserId=` + UserId)
      .pipe(catchError(this.handleError));
  }
  public getItemLevels(): Observable<object[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<object[]>(environment.baseUrl + `PrivateUtility/GetItemLevels?CompanyDetailID=` + CompanyDetailID)
      .pipe(catchError(this.handleError));
  }

  public getEmailTemplates(): Observable<Emailtemplate[]> {
    return this.httpClient.get<Emailtemplate[]>(environment.baseUrl + `PrivateUtility/GetEmailTemplates`)
      .pipe(catchError(this.handleError));
  }


  public GetGoodsInwardDisplay(JenniferItemSerial: string): Observable<Item> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Item>(environment.baseUrl + `PrivateUtility/GetGoodsInwardDisplay?CompanyDetailID=` + CompanyDetailID +
      `&JenniferItemSerial=` + encodeURIComponent(JenniferItemSerial))
      .pipe(catchError(this.handleError));
  }

  public getCustomersSales(): Observable<Customer[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Customer[]>(environment.baseUrl + `PrivateUtility/GetCustomersSales?CompanyID=` + CompanyID)
      .pipe(catchError(this.handleError));
  }

  public getCustomerWarehouse(CustomerID: number): Observable<Customerwarehouse[]> {
    if (CustomerID != 0) {
      let currentUser = this.authenticationService.currentUserValue;
      let CompanyID = currentUser.CompanyID;
      return this.httpClient.get<Customerwarehouse[]>(environment.baseUrl + `PrivateUtility/GetCustomerWarehouse?CompanyID=` + CompanyID +
        `&CustomerID=` + CustomerID)
        .pipe(catchError(this.handleError));
    }
  }

  public getPaymentTerms(): Observable<PaymentTermType[]> {
    return this.httpClient.get<PaymentTermType[]>(environment.baseUrl + `PrivateUtility/GetPaymentTerms`)
      .pipe(catchError(this.handleError));
  }

  public getCustomerWarehouseAddress(CustomerWarehouseID: number): Observable<object> {
    if (CustomerWarehouseID != 0) {
      let currentUser = this.authenticationService.currentUserValue;
      let CompanyID = currentUser.CompanyID;
      return this.httpClient.get<object>(environment.baseUrl + `PrivateUtility/GetCustomerWarehouseAddress?CompanyID=` + CompanyID +
        `&CustomerWarehouseID=` + CustomerWarehouseID)
        .pipe(catchError(this.handleError));
    }
  }

  public getCustomerAddress(CustomerID: number): Observable<Customer[]> {
    if (CustomerID != 0) {
      let currentUser = this.authenticationService.currentUserValue;
      let CompanyID = currentUser.CompanyID;
      return this.httpClient.get<Customer[]>(environment.baseUrl + `PrivateUtility/GetCustomerAddress?CompanyID=` + CompanyID +
        `&CustomerID=` + CustomerID)
        .pipe(catchError(this.handleError));
    }
  }

  public getInvoiceNumbers(): Observable<InvoiceNumber[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<InvoiceNumber[]>(environment.baseUrl + `PrivateUtility/GetInvoiceNumbers?CompanyDetailID=` + CompanyDetailID)
      .pipe(catchError(this.handleError));
  }

  public getSellingPriceMRP(ItemID: number, OrderDate: Date, InventoryType: string): Observable<Salesratecard[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Salesratecard[]>(environment.baseUrl + `PrivateUtility/GetSalesOrderSellingPriceMRP?CompanyDetailID=` +
      CompanyDetailID + `&ItemID=` + ItemID + `&OrderDate=` + OrderDate + `&InventoryType=` + InventoryType
    )
      .pipe(catchError(this.handleError));
  }

  public getDiscountAmount(ItemID: number, OrderDate: Date, CustomerID: number, InventoryType: string, TransactionType: string): Observable<Discount[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Discount[]>(environment.baseUrl + `PrivateUtility/GetDiscountAmount?CompanyDetailID=` +
      CompanyDetailID + `&ItemID=` + ItemID + `&OrderDate=` + OrderDate + `&CustomerID=` + CustomerID + `&InventoryType=` + InventoryType + `&TransactionType=` + TransactionType
    )
      .pipe(catchError(this.handleError));
  }

  public getSTOFromLocations(InventoryType: string): Observable<Location[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Location[]>(environment.baseUrl + `PrivateUtility/GetSTOFromLocations?CompanyID=` + CompanyID + `&InventoryType=` + InventoryType)
      .pipe(catchError(this.handleError));
  }

  public getSTOToLocations(LocationID: number, InventoryType: string): Observable<Location[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Location[]>(environment.baseUrl +
      `PrivateUtility/GetSTOToLocations?CompanyID=` + CompanyID
      + `&LocationID=` + LocationID
      + `&InventoryType=` + InventoryType)
      .pipe(catchError(this.handleError));
  }

  public getCheckSTODateValidation(STODate: Date): Observable<Result> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Result>(environment.baseUrl + `PrivateUtility/GetCheckSTODateValidation?CompanyID=` + CompanyID
      + `&STODate=` + STODate)
      .pipe(catchError(this.handleError));
  }

  public GetGSTClimableDate(): Observable<Date> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID; 
    return this.httpClient.get<Date>(environment.baseUrl + `PrivateUtility/GetGSTClimableDate?CompanyID=` + CompanyID )
      .pipe(catchError(this.handleError));
  }

  public getCustomersBasedType(customertype: string): Observable<Customer[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Customer[]>(environment.baseUrl +
      `PrivateUtility/GetCustomersBasedType?CompanyID=` + CompanyID
      + `&Type=` + customertype)
      .pipe(catchError(this.handleError));
  }

  public getCustomerItemDescription(ItemID: number, CustomerID: number): Observable<Item> {
    if (ItemID != 0) {
      let currentUser = this.authenticationService.currentUserValue;
      let CompanyDetailID = currentUser.CompanyDetailID;
      return this.httpClient.get<Item>(environment.baseUrl + `PrivateUtility/GetCustomerItemDescription?CompanyDetailID=` + CompanyDetailID +
        `&ItemID=` + ItemID + `&CustomerID=` + CustomerID)
        .pipe(catchError(this.handleError));
    }
  }

  public getCustomerItemLevels(customerID: number): Observable<Item[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyDetailID = currentUser.CompanyDetailID;
    return this.httpClient.get<Item[]>(environment.baseUrl + `PrivateUtility/GetCustomerItemLevels?CompanyDetailID=` +
      CompanyDetailID + `&CustomerID=` + customerID
    )
      .pipe(catchError(this.handleError));
  }

  public getCurrentDate(): Observable<Date> {
    return this.httpClient.get<Date>(environment.baseUrl + `PrivateUtility/GetCurrentDate`)
      .pipe(catchError(this.handleError));
  }

  public getSTOGRNLocation(): Observable<Location[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Location[]>(environment.baseUrl + `PrivateUtility/GetSTOGRNLocation?CompanyID=` + CompanyID)
      .pipe(catchError(this.handleError));
  }

  public getSTOGRNVendorWarehouse(): Observable<Vendorwarehouse[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Vendorwarehouse[]>(environment.baseUrl + `PrivateUtility/GetSTOGRNVendorWarehouse?CompanyID=` + CompanyID)
      .pipe(catchError(this.handleError));
  }

  public getAllCustomersBasedType(customertype: string): Observable<Customer[]> {
    let currentUser = this.authenticationService.currentUserValue;
    let CompanyID = currentUser.CompanyID;
    return this.httpClient.get<Customer[]>(environment.baseUrl +
      `PrivateUtility/GetAllCustomersBasedType?CompanyID=` + CompanyID
      + `&Type=` + customertype)
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
