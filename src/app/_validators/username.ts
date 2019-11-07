import { Injectable } from '@angular/core';

import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { AccountService } from '../_services/service/account.service';
import { UserService } from '../_services/service/user.service';
import { CompanydetailService } from '../_services/service/companydetail.service';
import { LocationService } from '../_services/service/location.service';
import { ItemService } from '../_services/service/item.service';
import { UomService } from '../_services/service/uom.service';
import { BrandService } from '../_services/service/brand.service';
import { ProductgroupService } from '../_services/service/productgroup.service';
import { MarketplaceService } from '../_services/service/marketplace.service';


import { CustomerService } from '../_services/service/customer.service';
import { CustomeritemService } from '../_services/service/customeritem.service';
import { VendorService } from '../_services/service/vendor.service';
import { VendoritemService } from '../_services/service/vendoritem.service';

import { PoshipmentService } from '../_services/service/poshipment.service';
import { InvoiceService } from '../_services/service/invoice.service';
import { ContactService } from '../_services/service/contact.service';

import { GoodsinwardService } from '../_services/service/goodsinward.service';
import { GoodsstorageService } from '../_services/service/goodsstorage.service';
import { SalesShipmentService } from '../_services/service/sales-shipment.service';

import { GoodsDisputeService } from '../_services/service/goods-dispute.service';
import { BoeService } from '../_services/service/BOE.service';
import { GoodsReceiptService } from '../_services/service/goods-receipt.service';
import { ValidatorFn, Validators } from '@angular/forms';

import 'rxjs/add/operator/map';
function isEmptyInputValue(value: any): boolean {
  // we don't check for string here so it also works with arrays
  return value == null || value.length === 0;
}

@Injectable({ providedIn: 'root' })
export class UsernameValidator {

  debouncer: any;

  constructor(
    private _accountService: AccountService,
    private _userService: UserService,
    private _companydetailService: CompanydetailService,
    private _locationService: LocationService,
    private _itemService: ItemService,
    private _uomService: UomService,

    private _brandService: BrandService,
    private _productgroupService: ProductgroupService,
    private _marketplaceService: MarketplaceService,
    private _customerService: CustomerService,
    private _customeritemService: CustomeritemService,
    private _vendorService: VendorService,
    private _vendoritemService: VendoritemService,
    private _poshipmentService: PoshipmentService,

    private _invoiceService: InvoiceService,
    private _contactService: ContactService,
    private _goodsinwardService: GoodsinwardService,
    private _goodsstorageService: GoodsstorageService,
    private _goodsDisputeService: GoodsDisputeService,
    private _salesShipmentService: SalesShipmentService,
    private _BoeService: BoeService,
    private _goodsReceiptService: GoodsReceiptService,
  ) {
  }


  checkUsername(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this._accountService.isEmailRegisterd(encodeURIComponent(control.value))
        .pipe(
          map(res => {
            if (res) {
              return { 'EmailIdInUse': true };
            }
          })
        );
    };
  }
  CheckUserEmail(UserID: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this._userService.isEmailRegisterd(UserID, encodeURIComponent(control.value))
        .pipe(
          map(res => {
            if (res) {
              return { 'EmailIdInUse': true };
            }
          })
        );
    };
  }


  checkCompanyName(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {

      return this._accountService.ExistCompanyName(encodeURIComponent(control.value))
        .pipe(
          map(res => {
            if (res) {
              return { 'CompanyNameInUse': true };
            }
          })
        );
    };
  }

  existCompanyEmail(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this._accountService.ExistCompanyEmail(encodeURIComponent(control.value))
        .pipe(
          map(res => {
            if (res) {
              return { 'CompanyEmailInUse': true };
            }
          })
        );
    };
  }

  existCompanyPrimaryGST(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this._accountService.ExistCompanyPrimaryGST(encodeURIComponent(control.value))
        .pipe(
          map(res => {
            if (res) {
              return { 'CompanyPrimaryGSTInUse': true };
            }
          })
        );
    };
  }

  existCompanySecondaryGST(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this._accountService.ExistCompanySecondaryGST(encodeURIComponent(control.value))
        .pipe(
          map(res => {
            if (res) {
              return { 'CompanySecondaryGSTInUse': true };
            }
          })
        );
    };
  }

  existStoreName(CompanyDetailID: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this._companydetailService.Exist(CompanyDetailID, encodeURIComponent(control.value))
        .pipe(
          map(res => {
            if (res) {
              return { 'StoreNameInUse': true };
            }
          })
        );
    };
  }

  existSellerID(CompanyDetailID: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this._companydetailService.ExistSellerID(CompanyDetailID, encodeURIComponent(control.value))
        .pipe(
          map(res => {
            if (res) {
              return { 'SellerIDInUse': true };
            }
          })
        );
    };
  }

  existLocationName(LocationID: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this._locationService.existLocationName(LocationID, encodeURIComponent(control.value))
        .pipe(
          map(res => {
            if (res) {
              return { 'LocationNameInUse': true };
            }
          })
        );
    };
  }

  existLocationGSTNumber(LocationID: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this._locationService.existGSTNumber(LocationID, encodeURIComponent(control.value))
        .pipe(
          map(res => {
            if (res) {
              return { 'GSTNumberInUse': true };
            }
          })
        );
    };
  }

  existItemCode(ItemID: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this._itemService.existItemCode(ItemID, encodeURIComponent(control.value))
        .pipe(
          map(res => {
            if (res) {
              return { 'ItemCodeInUse': true };
            }
          })
        );
    };
  }

  // existUOM(identity: number): AsyncValidatorFn { 
  //   return (control: AbstractControl): Observable<{ [key: string]: any } | null> => { 
  //     return this._uomService.existUOM(identity,encodeURIComponent(control.value) )
  //       .pipe(
  //         map(res => {
  //           if (res) {
  //             return { 'UOMInUse': true };
  //           }
  //         })
  //       );
  //   };
  // }

  existBrand(identity: number, controlid: string): AsyncValidatorFn {

    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      debugger
      return this._brandService.exist(identity, encodeURIComponent(control.value), controlid)
        .pipe(
          map(res => {
            if (res) {
              return { 'BrandInUse': true };
            }
          })
        );
    };
  }



  existProductGroup(identity: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this._productgroupService.exist(identity, encodeURIComponent(control.value))
        .pipe(
          map(res => {
            if (res) {
              return { 'ProductGroupInUse': true };
            }
          })
        );
    };
  }

  existMarketPlace(identity: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this._marketplaceService.exist(identity, encodeURIComponent(control.value))
        .pipe(
          map(res => {
            if (res) {
              return { 'MarketPlaceInUse': true };
            }
          })
        );
    };
  }

  existCustomerName(identity: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this._customerService.exist(identity, encodeURIComponent(control.value))
        .pipe(
          map(res => {
            if (res) {
              return { 'CustomerNameInUse': true };
            }
          })
        );
    };
  }

  existCustomerItemCode(identity: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this._customeritemService.existCustomerItemCode(identity, encodeURIComponent(control.value))
        .pipe(
          map(res => {
            if (res) {
              return { 'CustomerItemCodeInUse': true };
            }
          })
        );
    };
  }

  existVendorName(identity: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this._vendorService.exist(identity, encodeURIComponent(control.value))
        .pipe(
          map(res => {
            if (res) {
              return { 'VendorNameInUse': true };
            }
          })
        );
    };
  }

  existVendorItemCode(identity: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this._vendoritemService.existVendorItemCode(identity, encodeURIComponent(control.value))
        .pipe(
          map(res => {
            if (res) {
              return { 'VendorItemCodeInUse': true };
            }
          })
        );
    };
  }

  existShipmentNumber(identity: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this._poshipmentService.existShipmentNumber(identity, encodeURIComponent(control.value))
        .pipe(
          map(res => {
            if (res) {
              return { 'ShipmentNumberInUse': true };
            }
          })
        );
    };
  }

  existInvoiceNumber(identity: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this._invoiceService.exist(identity, encodeURIComponent(control.value))
        .pipe(
          map(res => {
            if (res) {
              return { 'InvoiceNumberInUse': true };
            }
          })
        );
    };
  }

  existContact_Email(identity: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this._contactService.exist(identity, encodeURIComponent(control.value))
        .pipe(
          map(res => {
            if (res) {
              return { 'Contact_EmailInUse': true };
            }
          })
        );
    };
  }
  existContact_Mobile(identity: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this._contactService.existMobile(identity, encodeURIComponent(control.value))
        .pipe(
          map(res => {
            if (res) {
              return { 'Contact_MobileInUse': true };
            }
          })
        );
    };
  }

  validateInwardJenniferSerialNumber(identity: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this._goodsinwardService.exist(identity, encodeURIComponent(control.value))
        .pipe(
          map(res => {
            if (!res) {
              return { 'JenniferSerialNumberInUse': true };
            }
          })
        );
    };
  }


  existJenniferSerialNumber(identity: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this._goodsstorageService.exist(identity, encodeURIComponent(control.value))
        .pipe(
          map(res => {
            if (!res) {
              return { 'JenniferSerialNumberInUse': true };
            }
          })
        );
    };
  }

  existCourierTrackingID(identity: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this._salesShipmentService.existCourierTrackingID(identity, encodeURIComponent(control.value))
        .pipe(
          map(res => {
            if (res) {
              return { 'CourierTrackingIDInUse': true };
            }
          })
        );
    };
  }

  notexistCourierTrackingID(identity: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this._salesShipmentService.existCourierTrackingID(identity, encodeURIComponent(control.value))
        .pipe(
          map(res => {
            if (!res) {
              return { 'CourierTrackingIDInUse': true };
            }
          })
        );
    };
  }

  existJenniferSerialNumberinDispute(identity: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this._goodsDisputeService.exist(identity, encodeURIComponent(control.value))
        .pipe(
          map(res => {
            if (!res) {
              return { 'JenniferSerialNumberInUse': true };
            }
          })
        );
    };
  }
  existBOENumber(identity: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this._BoeService.exist(identity, encodeURIComponent(control.value))
        .pipe(
          map(res => {
            if (res) {
              return { 'BOENumberInUse': true };
            }
          })
        );
    };
  }
  existGRNInvoiceNumber(identity: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this._goodsReceiptService.exist(identity, encodeURIComponent(control.value))
        .pipe(
          map(res => {
            if (res) {
              return { 'GRNInvoiceNumberInUse': true };
            }
          })
        );
    };
  }



}