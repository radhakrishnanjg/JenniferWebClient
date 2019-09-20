import { Component, OnInit, } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthorizationGuard } from '../../_guards/Authorizationguard';
import { Goodsinward, Dropdown, Item } from '../../_services/model';
import { GoodsinwardService } from '../../_services/service/goodsinward.service';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { AuthenticationService } from '../../_services/service/authentication.service';

import { UsernameValidator } from '../../_validators/username';

@Component({
  selector: 'app-goodsinward',
  templateUrl: './goodsinward.component.html',
  styleUrls: ['./goodsinward.component.css']
})
export class GoodsinwardComponent implements OnInit {

  goodsinwardform: FormGroup;
  lstVendorItemSerialType: Dropdown[];
  itemlist: Item[] = [];
  lstGoodsinward: Goodsinward[] = [] as any;
  obj: Goodsinward = {} as any;
  panelTitle: string;
  action: boolean;
  identity: number = 0;
  dtOptions: DataTables.Settings = {};
  serial: string = '';
  InventoryType: string = '';
  ItemName: string = '';
  GRNNumber: string = '';
  constructor(
    private alertService: ToastrService,
    private fb: FormBuilder,
    private _router: Router,
    public _spinner: NgxSpinnerService,
    private _goodsinwardService: GoodsinwardService,
    private _PrivateutilityService: PrivateutilityService,
    private _authorizationGuard: AuthorizationGuard,
    private _authenticationService: AuthenticationService,
    private usernameValidator: UsernameValidator
  ) { }

  formErrors = {
    'JenniferItemSerial': '',
    'VendorItemSerialType': '',
    'VendorItemSerialNumber': ''
  };

  validationMessages = {
    'JenniferItemSerial': {
      'required': 'This field is required',
      'JenniferSerialNumberInUse': 'Jennifer Serial Number is invalid or used',
    },
    'VendorItemSerialType': {
      'required': 'This field is required'
    },
    'VendorItemSerialNumber': {
      'required': 'This field is required'
    }

  }

  logValidationErrors(group: FormGroup = this.goodsinwardform): void {
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

  ngOnInit() {
    this._spinner.show();
    this._PrivateutilityService.GetValues('VendorItemSerialType')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstVendorItemSerialType = data;
          this._spinner.hide();
        },
        (err: any) => {
          this._spinner.hide();
          console.log(err);
        }
      );

    this.panelTitle = 'Update Goods Inward';
    this.identity = 0;
    this.serial = '';
    this.goodsinwardform = this.fb.group({
      JenniferItemSerial: ['', [Validators.required,],
        // this.usernameValidator.validateInwardJenniferSerialNumber(this.identity)
      ],
      VendorItemSerialType: ['', [Validators.required]],
      VendorItemSerialNumber: ['', [Validators.required,]]
    });
  }

  public getGoodsInwardDisplay(): void {
    let JenniferItemSerial = this.goodsinwardform.controls['JenniferItemSerial'].value;
    if (JenniferItemSerial != "") {
      this._spinner.show();
      this._PrivateutilityService.GetGoodsInwardDisplay(JenniferItemSerial).subscribe(
        (data) => {
          if (data != null) {
            this.ItemName = data.ItemName;
            this.GRNNumber = data.GRNNumber;
            this.InventoryType = data.InventoryType;
          }
          else {
            this.ItemName = '';
            this.GRNNumber = '';
            this.InventoryType = '';
          }
          this._spinner.hide();
          // console.log(this.lst);
        },
        (err) => {
          this._spinner.hide();
          console.log(err);
        }
      );
    }
  }

  JenniferItemSerialonChange(): void {
    if (this.goodsinwardform.valid) {
      this.obj = new Goodsinward();
      this.obj.JenniferItemSerial = this.goodsinwardform.controls['JenniferItemSerial'].value;
      this.obj.VendorItemSerialType = this.goodsinwardform.controls['VendorItemSerialType'].value;
      this.obj.VendorItemSerialNumber = this.goodsinwardform.controls['VendorItemSerialNumber'].value;
      this.obj.GRNNumber = this.GRNNumber;
      this.obj.InventoryType = this.InventoryType;
      this.obj.ItemName = this.ItemName;

      this._spinner.show();
      this._goodsinwardService.exist(0, this.goodsinwardform.controls['JenniferItemSerial'].value).subscribe(
        (data) => {
          this._spinner.hide();
          if (!data) {
            this.alertService.error('Jennifer Serial Number is invalid or used.!');
          }
          else {
            if (this.lstGoodsinward.filter(a => a.JenniferItemSerial == this.obj.JenniferItemSerial).length == 0) {
              if ((this.GRNNumber != null && this.GRNNumber.length > 0) &&
                (this.ItemName != null && this.ItemName.length > 0) &&
                (this.obj.JenniferItemSerial != null && this.obj.JenniferItemSerial.length > 0) &&
                (this.obj.VendorItemSerialType != null && this.obj.VendorItemSerialType.length > 0) &&
                (this.obj.VendorItemSerialNumber != null && this.obj.VendorItemSerialNumber.length > 0)) {
                let currentUser = this._authenticationService.currentUserValue;
                this.obj.CompanyDetailID = currentUser.CompanyDetailID;
                this.obj.LoginId = currentUser.UserId;
                this.lstGoodsinward.push(this.obj);
                this.Clear();
                $('#VendorItemSerialNumber').focus();
              }
            }
            else {
              this.alertService.error('Jennifer Item Serial Number is already exist in the list.!');
              return;
            }
          } 
        },
        (error: any) => {
          this._spinner.hide();
          console.log(error);
        }
      );
    }
  }

  VendorItemSerialTypeonChange(): void {
    if (this.goodsinwardform.valid) {
      this.obj = new Goodsinward();
      this.obj.JenniferItemSerial = this.goodsinwardform.controls['JenniferItemSerial'].value;
      this.obj.VendorItemSerialType = this.goodsinwardform.controls['VendorItemSerialType'].value;
      this.obj.VendorItemSerialNumber = this.goodsinwardform.controls['VendorItemSerialNumber'].value;
      this.obj.GRNNumber = this.GRNNumber;
      this.obj.InventoryType = this.InventoryType;
      this.obj.ItemName = this.ItemName;
      this._spinner.show();
      this._goodsinwardService.exist(0, this.goodsinwardform.controls['JenniferItemSerial'].value).subscribe(
        (data) => {
          this._spinner.hide();
          if (!data) {
            this.alertService.error('Jennifer Serial Number is invalid or used.!');
          }
          else {
            if (this.lstGoodsinward.filter(a => a.JenniferItemSerial == this.obj.JenniferItemSerial).length == 0) {
              if ((this.GRNNumber != null && this.GRNNumber.length > 0) &&
                (this.ItemName != null && this.ItemName.length > 0) &&
                (this.obj.JenniferItemSerial != null && this.obj.JenniferItemSerial.length > 0) &&
                (this.obj.VendorItemSerialType != null && this.obj.VendorItemSerialType.length > 0) &&
                (this.obj.VendorItemSerialNumber != null && this.obj.VendorItemSerialNumber.length > 0)) {
                let currentUser = this._authenticationService.currentUserValue;
                this.obj.CompanyDetailID = currentUser.CompanyDetailID;
                this.obj.LoginId = currentUser.UserId;
                this.lstGoodsinward.push(this.obj);
                this.Clear();
                $('#VendorItemSerialNumber').focus();
              }
            }
            else {
              this.alertService.error('Jennifer Item Serial Number is already exist in the list.!');
              return;
            }
          } 
        },
        (error: any) => {
          this._spinner.hide();
          console.log(error);
        }
      );
    }
  }
  VendorItemSerialNumberonChange(): void {
    if (this.goodsinwardform.valid) {
      this.obj = new Goodsinward();
      this.obj.JenniferItemSerial = this.goodsinwardform.controls['JenniferItemSerial'].value;
      this.obj.VendorItemSerialType = this.goodsinwardform.controls['VendorItemSerialType'].value;
      this.obj.VendorItemSerialNumber = this.goodsinwardform.controls['VendorItemSerialNumber'].value;
      this.obj.GRNNumber = this.GRNNumber;
      this.obj.InventoryType = this.InventoryType;
      this.obj.ItemName = this.ItemName;
      this._spinner.show();
      this._goodsinwardService.exist(0, this.goodsinwardform.controls['JenniferItemSerial'].value).subscribe(
        (data) => { 
          this._spinner.hide();
          if (!data) {
            this.alertService.error('Jennifer Serial Number is invalid or used.!');
          }
          else {
            if (this.lstGoodsinward.filter(a => a.JenniferItemSerial == this.obj.JenniferItemSerial).length == 0) {
              if ((this.GRNNumber != null && this.GRNNumber.length > 0) &&
                (this.ItemName != null && this.ItemName.length > 0) &&
                (this.obj.JenniferItemSerial != null && this.obj.JenniferItemSerial.length > 0) &&
                (this.obj.VendorItemSerialType != null && this.obj.VendorItemSerialType.length > 0) &&
                (this.obj.VendorItemSerialNumber != null && this.obj.VendorItemSerialNumber.length > 0)) {
                let currentUser = this._authenticationService.currentUserValue;
                this.obj.CompanyDetailID = currentUser.CompanyDetailID;
                this.obj.LoginId = currentUser.UserId;
                this.lstGoodsinward.push(this.obj);
                this.Clear();
                $('#JenniferItemSerial').focus();
              }
            }
            else {
              this.alertService.error('Jennifer Item Serial Number is already exist in the list.!');
              return;
            }
          }
        },
        (error: any) => {
          this._spinner.hide();
          console.log(error);
        }
      );
    }
  }

  Clear(): void {
    this.ItemName = '';
    this.GRNNumber = '';
    this.InventoryType = '';
    this.goodsinwardform.controls['JenniferItemSerial'].setValue('');
    //this.goodsinwardform.controls['VendorItemSerialType'].setValue('');
    this.goodsinwardform.controls['VendorItemSerialNumber'].setValue('');
  }

  removeRow(index): void {
    this.lstGoodsinward.splice(index, 1);
  }


  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("Goodsinwardlist", "ViewEdit")) {
      return;
    }
    this._spinner.show();
    this._goodsinwardService.VendorUpdate(this.lstGoodsinward).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this._spinner.hide();
          this.alertService.success(data.Msg);
          this._router.navigate(['/Goodsinwardlist']);
        }
        else {
          this._spinner.hide();
          this.alertService.error(data.Msg);
          this._router.navigate(['/Goodsinwardlist']);
        }
        $('#modalpopup_goodsinward').modal('hide');
        this.identity = 0;
      },
      (error: any) => {
        this._spinner.hide();
        console.log(error);
      }
    )
  }
}
