import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsernameValidator } from '../../_validators/username';
import { ToastrService } from 'ngx-toastr';
import { Marketplace, Companydetails } from '../../_services/model';

import { CompanydetailService } from '../../_services/service/companydetail.service';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import * as moment from 'moment';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
@Component({
  selector: 'app-companydetails',
  templateUrl: './companydetails.component.html',
  styleUrls: ['./companydetails.component.css'],
})
export class CompanydetailsComponent implements OnInit {
  companyDetailsform: FormGroup;
  marketplaces: Marketplace[];
  lst: Companydetails[];
  obj: Companydetails = {} as any;
  panelTitle: string;
  action: boolean;
  maxDate: moment.Moment;
  identity: number = 0;
  BusinessLaunchDate: any;
  public value: Date = new Date(2000, 2, 10, 13, 30, 0);
  validateflag: boolean = false;
  constructor(
    private alertService: ToastrService,
    private fb: FormBuilder,
    private _router: Router,
    private aroute: ActivatedRoute,
    
    private usernameValidator: UsernameValidator,
    private _companydetailService: CompanydetailService,
    private _PrivateutilityService: PrivateutilityService,
    private _authorizationGuard: AuthorizationGuard,
    private _CompanydetailService: CompanydetailService
  ) {
  }

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
  logValidationErrors(group: FormGroup = this.companyDetailsform): void {
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

  ngOnInit() {
    //
    this._PrivateutilityService.getMarketPlaces()
      .subscribe(
        (data: Marketplace[]) => {
          this.marketplaces = data;
          //
        },
        (err: any) => {
          console.log(err);
          //
        }
      );

    this.maxDate = moment().add(0, 'days');
    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
      if (this.identity > 0) {
        this.panelTitle = "Edit Store";
        this.action = false;
        //
        this.validateflag = true;
        this._companydetailService.searchById(this.identity)
          .subscribe(
            (data: Companydetails) => {

              var MarketplaceID = data.MarketplaceID.toString();
              this.companyDetailsform.get('MarketplaceID').disable();
              this.companyDetailsform.get('StoreName').disable();
              this.companyDetailsform.get('MarketPlaceSellerID').disable();
              this.companyDetailsform.get('MarketPlaceAPIToken').disable();
              var BusinessLaunchDate1 = moment(data.BusinessLaunchDate, 'YYYY-MM-DD[T]HH:mm').format('MM-DD-YYYY HH:mm').toString();
              this.BusinessLaunchDate = { startDate: new Date(BusinessLaunchDate1) };

              this.companyDetailsform.patchValue({
                StoreName: data.StoreName,
                BusinessLaunchDate: { startDate: new Date(BusinessLaunchDate1) },
                MarketPlaceSellerID: data.MarketPlaceSellerID,
                MarketPlaceAPIToken: data.MarketPlaceAPIToken,
                MarketplaceID: MarketplaceID,
                IsActive: data.IsActive,
              });
            },
            (err: any) => {
              console.log(err);
              //
            }
          );
      }
      else {
        this.action = true;
        this.panelTitle = "Add New Store";
      }
    });
    this.companyDetailsform = this.fb.group({
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


  SaveData(buttonType): void {
    if (this._authorizationGuard.CheckAcess("Companydetaillist", "ViewEdit")) {
      return;
    }
    // stop here if form is invalid
    if (this.companyDetailsform.invalid) {
      return;
    }
    if (this.companyDetailsform.pristine) {
      this.alertService.error('Please change the value for any one control to proceed further!');
      return;
    }
    if (buttonType === "Validate") {
      this.obj.MarketplaceID = this.companyDetailsform.controls['MarketplaceID'].value;
      this.obj.MarketPlaceSellerID = this.companyDetailsform.controls['MarketPlaceSellerID'].value;
      this.obj.MarketPlaceAPIToken = this.companyDetailsform.controls['MarketPlaceAPIToken'].value;
      //
      this._companydetailService.validate(this.obj).subscribe(
        (data) => {
          //
          if (data != null && data.Flag == true) {
            this.alertService.success(data.Msg);
            this.validateflag = true;
            this.companyDetailsform.get('MarketPlaceSellerID').disable();
            this.companyDetailsform.get('MarketPlaceAPIToken').disable();
          }
          else {
            this.alertService.error(data.Msg);
            this.validateflag = false;
          }
        },
        (error: any) => {
          //
          console.log(error);
        }
      );
    }
    if (buttonType === "Save") {
      this.aroute.paramMap.subscribe(params => {
        this.identity = +params.get('id');
      });
      if (this.identity > 0) {
        this.Update()
      }
      else {
        this.Insert();
      }
    }

  }

  Insert() {
    //this.onStoreadded.emit(this.obj);
    this.obj.StoreName = this.companyDetailsform.controls['StoreName'].value;
    this.obj.BusinessLaunchDate = this.companyDetailsform.controls['BusinessLaunchDate'].value.startDate._d.toLocaleString();
    this.obj.MarketPlaceSellerID = this.companyDetailsform.controls['MarketPlaceSellerID'].value;
    this.obj.MarketPlaceAPIToken = this.companyDetailsform.controls['MarketPlaceAPIToken'].value;
    this.obj.MarketplaceID = this.companyDetailsform.controls['MarketplaceID'].value;
    this.obj.IsActive = this.companyDetailsform.controls['IsActive'].value;

    //
    this._companydetailService.add(this.obj).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          //
          this._CompanydetailService.changeMessage(this.obj);
          this.alertService.success(data.Msg);
          this._router.navigate(['/Companydetaillist']);
        }
        else {
          //
          this.alertService.error(data.Msg);
          this._router.navigate(['/Companydetaillist']);
        }
        this.identity = 0;
      },
      (error: any) => {
        //
        console.log(error);
      }
    );
  }

  Update() {

    this.obj.CompanyDetailID = this.identity;
    this.obj.StoreName = this.companyDetailsform.controls['StoreName'].value;
    if (this.companyDetailsform.controls['BusinessLaunchDate'].value.startDate._d != undefined) {
      this.obj.BusinessLaunchDate = this.companyDetailsform.controls['BusinessLaunchDate'].value.startDate._d.toLocaleString();
    } else {
      this.obj.BusinessLaunchDate = this.companyDetailsform.controls['BusinessLaunchDate'].value.startDate.toLocaleString();
    }
    this.obj.MarketPlaceSellerID = this.companyDetailsform.controls['MarketPlaceSellerID'].value;
    this.obj.MarketPlaceAPIToken = this.companyDetailsform.controls['MarketPlaceAPIToken'].value;
    this.obj.MarketplaceID = this.companyDetailsform.controls['MarketplaceID'].value;
    this.obj.IsActive = this.companyDetailsform.controls['IsActive'].value;
    //
    this._companydetailService.update(this.obj).subscribe(
      (data) => {
        if (data != null && data == true) {
          //
          this.alertService.success('Store detail data has been updated successful');
          this._router.navigate(['/Companydetaillist']);
        }
        else {
          //
          this.alertService.error('Store detail not saved!');
          this._router.navigate(['/Companydetaillist']);
        }
        this.identity = 0;
      },
      (error: any) => {
        //
        console.log(error);
      }
    );
  }
}

