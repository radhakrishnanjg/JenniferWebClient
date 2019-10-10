import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { GoodsstorageService } from '../../_services/service/goodsstorage.service';
import { UsernameValidator } from '../../_validators/username';
import { Goodsstorage } from '../../_services/model';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { AuthenticationService } from '../../_services/service/authentication.service';

@Component({
  selector: 'app-goodsstorage',
  templateUrl: './goodsstorage.component.html',
  styleUrls: ['./goodsstorage.component.css']
})
export class GoodsstorageComponent implements OnInit {
  lstGoodsstorage: Goodsstorage[] = [] as any;
  obj: Goodsstorage = {} as any;
  goodsstorageform: FormGroup;
  panelTitle: string;
  action: boolean;
  identity: number = 0;
  serial: string = '';
  dtOptions: DataTables.Settings = {};

  constructor(
    private alertService: ToastrService,
    private _router: Router,
    private _goodsstorageService: GoodsstorageService,
    private _authenticationService: AuthenticationService,
    private fb: FormBuilder,
    private _spinner: NgxSpinnerService,
    private _authorizationGuard: AuthorizationGuard,
    private usernameValidator: UsernameValidator,
  ) { }

  //#region Validation Start
  formErrors = {
    'JenniferItemSerial': '',
    'WarehouseLocation': '',
    'WarehouseRack': '',
    'WarehouseBin': '',
  };

  // This object contains all the validation messages for this form
  validationMessages = {

    'JenniferItemSerial': {
      'required': 'This Field is required.',
      'maxlength': 'This field can not exceed 30 characters.',
      'JenniferSerialNumberInUse': 'Jennifer Serial Number is invalid or used',
    },

    'WarehouseLocation': {
      'required': 'This Field is required.',
      'maxlength': 'This field can not exceed 30 characters.'
    },

    'WarehouseRack': {
      'required': 'This Field is required.',
      'maxlength': 'This field can not exceed 30 characters.'
    },

    'WarehouseBin': {
      'required': 'This Field is required.',
      'maxlength': 'This field can not exceed 30 characters.'
    },
  };

  logValidationErrors(group: FormGroup = this.goodsstorageform): void {
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
  //#endregion Validation End

  ngOnInit() {
    this.panelTitle = 'Add New Storage location';
    this.identity = 0;
    this.serial = '';
    this.goodsstorageform = this.fb.group({
      JenniferItemSerial: ['', [Validators.required, Validators.maxLength(30)],
        //this.usernameValidator.existJenniferSerialNumber(this.identity),
      ],
      WarehouseLocation: ['', [Validators.required, Validators.maxLength(30)]],
      WarehouseRack: ['', [Validators.required, Validators.maxLength(30)]],
      WarehouseBin: ['', [Validators.required, Validators.maxLength(30)]],
    });
  }


  onChangeJenniferItemSerial(): void {

    if (this.goodsstorageform.invalid) {
      return;
    }
    this.obj = new Goodsstorage();
    this.obj.JenniferItemSerial = this.goodsstorageform.controls['JenniferItemSerial'].value;
    this.obj.WarehouseLocation = this.goodsstorageform.controls['WarehouseLocation'].value;
    this.obj.WarehouseRack = this.goodsstorageform.controls['WarehouseRack'].value;
    this.obj.WarehouseBin = this.goodsstorageform.controls['WarehouseBin'].value;
    this._spinner.show();
    this._goodsstorageService.exist(0, this.goodsstorageform.controls['JenniferItemSerial'].value).subscribe(
      (data) => {
        this._spinner.hide();
        if (!data) {
          this.alertService.error('Jennifer Serial Number is invalid or used.!');
        }
        else {
          if (this.lstGoodsstorage.filter(a => a.JenniferItemSerial == this.obj.JenniferItemSerial).length == 0) {
            if ((this.obj.JenniferItemSerial != null && this.obj.JenniferItemSerial.length > 0) &&
              (this.obj.WarehouseLocation != null && this.obj.WarehouseLocation.length > 0) &&
              (this.obj.WarehouseRack != null && this.obj.WarehouseRack.length > 0) &&
              (this.obj.WarehouseBin != null && this.obj.WarehouseBin.length > 0)) {
              let currentUser = this._authenticationService.currentUserValue;
              this.obj.CompanyDetailID = currentUser.CompanyDetailID;
              this.obj.LoginId = currentUser.UserId;
              this.lstGoodsstorage.push(this.obj);
              this.goodsstorageform.controls['JenniferItemSerial'].setValue('');
              $('#JenniferItemSerial').focus();
              this.goodsstorageform.controls['JenniferItemSerial'].value.fu
            }
          }
          else {
            this.alertService.error('Jennifer Item Serial already exist in the list.!');
            return;
          }
        }
        $('#modalpopup_goodsstorage').modal('hide');
        this.identity = 0;
      },
      (error: any) => {
        this._spinner.hide();
        console.log(error);
      }
    );

  }

  clearValue(value): void {
    this.goodsstorageform.controls[value].setValue('');
  }

  removeRow(index): void {
    this.lstGoodsstorage.splice(index, 1);
  }

  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("Goodsstoragelist", "ViewEdit")) {
      return;
    }
    this.Insert();
  }

  Insert() {
    this._spinner.show();
    this._goodsstorageService.add(this.lstGoodsstorage).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this._spinner.hide();
          this.alertService.success(data.Msg);
          this._router.navigate(['/Goodsstoragelist']);
        }
        else {
          this._spinner.hide();
          this.alertService.error(data.Msg);
          this._router.navigate(['/Goodsstoragelist']);
        }
        $('#modalpopup_goodsstorage').modal('hide');
        this.identity = 0;
      },
      (error: any) => {
        this._spinner.hide();
        console.log(error);
      }
    );
  }

}