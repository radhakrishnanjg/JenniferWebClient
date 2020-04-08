import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SellerregistrationService } from '../../_services/service/crossborder/sellerregistration.service';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { SellerRegistration } from '../../_services/model/crossborder';
import { Marketplace } from '../../_services/model/index';
import { MasteruploadService } from '../../_services/service/masterupload.service';
import { AuthenticationService } from 'src/app/_services/service/authentication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthorizationGuard } from 'src/app/_guards/Authorizationguard';
import { UsernameValidator } from 'src/app/_validators/username';
import { Companydetails } from 'src/app/_services/model';
import { CompanydetailService } from 'src/app/_services/service/companydetail.service';

@Component({
  selector: 'app-sellerprofile',
  templateUrl: './sellerprofile.component.html',
  styleUrls: ['./sellerprofile.component.css']
})
export class SellerprofileComponent implements OnInit {
  obj: SellerRegistration = {} as any;
  identity: number = 0;
  sellerProfileForm: FormGroup;
  sellerMarketPlaceForm: FormGroup;
  marketplaces: Marketplace[];
  action: boolean;
  panelTitle: string;
  validateflag: boolean = false;
  lst: Companydetails[];
  objCompanydetails: Companydetails = {} as any;

  constructor(
    private alertService: ToastrService,
    private usernameValidator: UsernameValidator,
    private _sellerregistrationService: SellerregistrationService,
    private _jsonprivateutility: PrivateutilityService,
    public _authenticationService: AuthenticationService,
    private _masteruploadService: MasteruploadService,
    private _authorizationGuard: AuthorizationGuard,
    private fb: FormBuilder,
    private _companydetailService: CompanydetailService
  ) { }

  //#region  Validation 
  formErrors = {
    'StoreName': '',
    'BusinessLaunchDate': '',
    'MarketPlaceSellerID': '',
    'MarketPlaceAPIToken': '',
    'MarketplaceID': '',
    'IsActive': '',
  };
  validationMessages = {
    'StoreName': {
      'required': 'This field is required.',
      'StoreNameInUse': 'Store Name is already registered!',
    },
    'BusinessLaunchDate': {
      'required': 'This field is required.',
      'invalidDate': 'This field must be date format(MM-DD-YYYY).',
    },
    'MarketPlaceSellerID': {
      'required': 'This field is required.',
      'SellerIDInUse': 'Seller ID is already registered!',
    },
    'MarketPlaceAPIToken': {
      'required': 'This field is required.',
    },
    'MarketplaceID': {
      'min': 'This field is required.',
    },
  };

  logValidationErrors(group: FormGroup = this.sellerMarketPlaceForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl && abstractControl.value && abstractControl.value.length > 0 && !abstractControl.value.replace(/^\s+|\s+$/gm, '').length) {
        abstractControl.setValue('');
      }
      this.formErrors[key] = '';
      if (abstractControl && !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty)) {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }
    });
  }

  //#endregion 

  isOTPSent: boolean;
  searchSellerById() {
    let currentUser = this._authenticationService.currentUserValue;
    this._sellerregistrationService.SearchById(currentUser.SellerFormID).subscribe(
      (data: SellerRegistration) => {
        this.obj = data;
        this.isOTPSent = data.IsOTPSent;
        if (this.isOTPSent != true) {
          this.sellerMarketPlaceForm.get('MarketplaceID').disable();
          this.sellerMarketPlaceForm.get('StoreName').disable();
          this.sellerMarketPlaceForm.get('BusinessLaunchDate').disable();
          this.sellerMarketPlaceForm.get('MarketPlaceSellerID').disable();
          this.sellerMarketPlaceForm.get('MarketPlaceAPIToken').disable();
        }
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  ngOnInit() {
    this.action = true;
    this.getMarketPlaces();

    this.searchSellerById();

    this.sellerMarketPlaceForm = this.fb.group({
      StoreName: ['', [Validators.required,],
        this.usernameValidator.existStoreName(this.identity)],
      BusinessLaunchDate: ['', [Validators.required,]],
      MarketPlaceSellerID: ['', [Validators.required,],
        this.usernameValidator.existSellerID(this.identity)],
      MarketPlaceAPIToken: ['', [Validators.required,]],
      MarketplaceID: [0, [Validators.min(1)]],
      IsActive: [0,],
    });
  }

  getMarketPlaces() {
    this._jsonprivateutility.getMarketPlaces()
      .subscribe(
        (data: Marketplace[]) => {
          this.marketplaces = data;
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  DownloadButtonClick(ObjectId: string) {
    if (ObjectId != "") {
      this._masteruploadService.DownloadObjectFile(ObjectId)
        .subscribe(data => {
          this.alertService.success("File downloaded succesfully.!");
          saveAs(data, ObjectId)
        },
          (err) => {
            console.log(err);
          }
        );
    }
  }

  SaveData(buttonType): void {

    if (this._authorizationGuard.CheckAcess("Sellerlist", "ViewEdit")) {
      return;
    }
    // stop here if form is invalid
    if (this.sellerMarketPlaceForm.invalid) {
      return;
    }
    if (this.sellerMarketPlaceForm.pristine) {
      this.alertService.error('Please change the value for any one control to proceed further!');
      return;
    }
    if (buttonType === "Validate") {
      this.objCompanydetails.MarketplaceID = this.sellerMarketPlaceForm.controls['MarketplaceID'].value;
      this.objCompanydetails.MarketPlaceSellerID = this.sellerMarketPlaceForm.controls['MarketPlaceSellerID'].value;
      this.objCompanydetails.MarketPlaceAPIToken = this.sellerMarketPlaceForm.controls['MarketPlaceAPIToken'].value;
      this._companydetailService.validate(this.objCompanydetails).subscribe(
        (data) => {
          if (data != null && data.Flag == true) {
            this.alertService.success(data.Msg);
            this.validateflag = true;
            this.sellerMarketPlaceForm.get('MarketPlaceSellerID').disable();
            this.sellerMarketPlaceForm.get('MarketPlaceAPIToken').disable();
          }
          else {
            this.alertService.error(data.Msg);
            this.validateflag = false;
          }
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
    if (buttonType === "Save") {
      this.Insert();
    }

  }

  Insert() {
    let currentUser = this._authenticationService.currentUserValue;
    this.obj.SellerFormID = currentUser.SellerFormID;
    this.obj.StoreName = this.sellerMarketPlaceForm.controls['StoreName'].value;
    this.obj.BusinessLaunchDate = this.sellerMarketPlaceForm.controls['BusinessLaunchDate'].value;
    this.obj.MarketPlaceSellerID = this.sellerMarketPlaceForm.controls['MarketPlaceSellerID'].value;
    this.obj.MarketPlaceAPIToken = this.sellerMarketPlaceForm.controls['MarketPlaceAPIToken'].value;
    this.obj.MarketPlaceID = this.sellerMarketPlaceForm.controls['MarketplaceID'].value;
    this.obj.IsActive = this.sellerMarketPlaceForm.controls['IsActive'].value;

    this._sellerregistrationService.marketPlaceUpdate(this.obj).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this._companydetailService.changeMessage(this.objCompanydetails);
          this.alertService.success(data.Msg);
          this.searchSellerById();
        }
        else {
          this.alertService.error(data.Msg);
        }
        this.identity = 0;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  RequestMobile() {
    this._sellerregistrationService.mobileRequest(this.obj).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.alertService.success(data.Msg);
          this.searchSellerById();
        }
        else {
          this.alertService.error(data.Msg);
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
