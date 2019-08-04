import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
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

  constructor(
    private alertService: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    private _router: Router,
    private aroute: ActivatedRoute,
    public _spinner: NgxSpinnerService,
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
      'StoreNameInUse': 'Store Name already used.',
    },
    'BusinessLaunchDate': {
      'required': 'This field is required.',
      'invalidDate': 'This field must be date format(MM-DD-YYYY).',
    },
    'MarketPlaceSellerID': {
      'required': 'This field is required.',
      'SellerIDInUse': 'Seller ID already used.',
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
      if (abstractControl && abstractControl.value && abstractControl.value.length > 0 && !abstractControl.value.replace(/\s/g, '').length) {
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
    this._spinner.show();
    this._PrivateutilityService.getMarketPlaces()
      .subscribe(
        (data: Marketplace[]) => {
          this.marketplaces = data;
          this._spinner.hide();
        },
        (err: any) => {
          console.log(err);
          this._spinner.hide();
        }
      );

    this.maxDate = moment().add(0, 'days');
    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
      if (this.identity > 0) {
        this.panelTitle = "Edit Store";
        this.action = false;
        this._spinner.show();
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
              this._spinner.hide();
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

  SaveData(): void {

    if (this._authorizationGuard.CheckAcess("Companydetaillist", "ViewEdit")) {
      return;
    }

    // stop here if form is invalid
    if (this.companyDetailsform.invalid) {
      return;
    }
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

  Insert() {
    //this.onStoreadded.emit(this.obj);
    this.obj.StoreName = this.companyDetailsform.controls['StoreName'].value;
    this.obj.BusinessLaunchDate = this.companyDetailsform.controls['BusinessLaunchDate'].value.startDate._d.toLocaleString();
    this.obj.MarketPlaceSellerID = this.companyDetailsform.controls['MarketPlaceSellerID'].value;
    this.obj.MarketPlaceAPIToken = this.companyDetailsform.controls['MarketPlaceAPIToken'].value;
    this.obj.MarketplaceID = this.companyDetailsform.controls['MarketplaceID'].value;
    this.obj.IsActive = this.companyDetailsform.controls['IsActive'].value;

    this._spinner.show();
    this._companydetailService.add(this.obj).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this._spinner.hide();
          this._CompanydetailService.changeMessage(this.obj);
          this.alertService.success(data.Msg);
          this._router.navigate(['/Companydetaillist']);
        }
        else {
          this._spinner.hide();
          this.alertService.error(data.Msg);
          this._router.navigate(['/Companydetaillist']);
        }
        this.identity = 0;
      },
      (error: any) => {
        this._spinner.hide();
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
    this._spinner.show();
    this._companydetailService.update(this.obj).subscribe(
      (data) => {
        if (data != null && data == true) {
          this._spinner.hide();
          this.alertService.success('Store detail data has been updated successful');
          this._router.navigate(['/Companydetaillist']);
        }
        else {
          this._spinner.hide();
          this.alertService.error('Store detail not saved!');
          this._router.navigate(['/Companydetaillist']);
        }
        this.identity = 0;
      },
      (error: any) => {
        this._spinner.hide();
        console.log(error);
      }
    );
  }
}

