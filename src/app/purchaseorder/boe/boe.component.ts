import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsernameValidator } from '../../_validators/username';
import { ToastrService } from 'ngx-toastr';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { Vendorwarehouse, State, BOEHeader, Poorder, BOEDetail } from '../../_services/model';
import { BoeService } from '../../_services/service/BOE.service';
import * as moment from 'moment';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-boe',
  templateUrl: './boe.component.html',
  styleUrls: ['./boe.component.css']
})
export class BoeComponent implements OnInit {

  boeform: FormGroup;
  lstVendorwarehouse: Vendorwarehouse[];
  lst: BOEHeader[];
  obj: BOEHeader = {} as any;
  lstItem: BOEDetail[];
  panelTitle: string;
  action: boolean;
  identity: number = 0;
  Searchaction: boolean = true;
  PurchaseID: number = 0;
  editField: string;
  TotalDutyAmount: number = 0;
  TotalIGSTValue: number = 0;
  TotalTotalValue: number = 0;
  TotalSumTotalValue: number = 0;
  BOEDate: any;
  IsEditable: boolean = true;
  IsShowAll: boolean = false;
  constructor(
    private alertService: ToastrService,
    private fb: FormBuilder,
    private _router: Router,
    private aroute: ActivatedRoute,
    public _spinner: NgxSpinnerService,
    private usernameValidator: UsernameValidator,
    private _BoeService: BoeService,
    private _authorizationGuard: AuthorizationGuard

  ) { }

  formErrors = {
    'BOENumber': '',
    'BOEDate': '',
    'PortCode': '',
    'ReferenceDetail': '',
  };

  validationMessages = {

    'BOENumber': {
      'required': 'This Field is required.',
      'maxlength': 'This Field must be less than or equal to 20 charecters.',
      'BOENumberInUse': 'This Value is already registered!',
    },
    'BOEDate': {
      'required': 'This Field is required.',
    },

    'PortCode': {
      'required': 'This Field is required.',
    },
    'ReferenceDetail': {
      'required': 'This Field is required.',
    },
  };

  logValidationErrors(group: FormGroup = this.boeform): void {
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

  ngOnInit() {

    this.IsEditable = true;
    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
      this.PurchaseID = +params.get('PurchaseId');
      if (this.identity > 0) {
        this.panelTitle = "Edit BOE";
        this.action = false;
        this._spinner.show();
        this._BoeService.searchById(this.PurchaseID, this.identity)
          .subscribe(
            (data: BOEHeader) => {
              this.obj = data;
              this.lstItem = data.lstDetail;
              this.TotalDutyAmount = this.lstItem.reduce((acc, a) => acc + a.DutyAmount, 0);
              this.TotalIGSTValue = this.lstItem.reduce((acc, a) => acc + a.IGSTValue, 0);
              this.TotalTotalValue = this.lstItem.reduce((acc, a) => acc + a.TotalValue, 0);
              this.TotalSumTotalValue = this.lstItem.reduce((acc, a) => acc + a.SumTotalValue, 0);
              this._spinner.hide();
              this.IsEditable = data.IsEditable;
              this.boeform.get('BOENumber').disable();
              var BOEDate1 = moment(data.BOEDate, 'YYYY-MM-DD[T]HH:mm').
                format('MM-DD-YYYY HH:mm').toString();
              this.BOEDate = { startDate: new Date(BOEDate1) }; 

              this.boeform.patchValue({
                BOENumber: data.BOENumber,
                PODate: { startDate: new Date(BOEDate1) },
                PortCode: data.PortCode,
                ReferenceDetail: data.ReferenceDetail,
              });
            },
            (err: any) => {
              this._spinner.hide();
              console.log(err);
            }
          );
      }
      else {
        this.action = true;
        this.panelTitle = "Add New BOE";
        this._spinner.show();
        this._BoeService.newBOE(this.PurchaseID)
          .subscribe(
            (data: BOEHeader) => {
              this.obj = data;
              this.lstItem = data.lstDetail;
              this.TotalDutyAmount = this.lstItem.reduce((acc, a) => acc + a.DutyAmount, 0);
              this.TotalIGSTValue = this.lstItem.reduce((acc, a) => acc + a.IGSTValue, 0);
              this.TotalTotalValue = this.lstItem.reduce((acc, a) => acc + a.TotalValue, 0);
              this.TotalSumTotalValue = this.lstItem.reduce((acc, a) => acc + a.SumTotalValue, 0);
              this._spinner.hide(); 
              var BOEDate1 = moment(data.InvoiceDate, 'YYYY-MM-DD[T]HH:mm').
                format('MM-DD-YYYY HH:mm').toString();
              this.BOEDate = { startDate: new Date(BOEDate1) };
            },
            (err: any) => {
              this._spinner.hide();
              console.log(err);
            }
          );
      }

    });

    this.boeform = this.fb.group({
      BOENumber: ['', [Validators.required,],
        this.usernameValidator.existBOENumber(this.identity)],
      BOEDate: ['', [Validators.required,]],
      PortCode: ['', [Validators.required]],
      ReferenceDetail: ['', []],
    });
  }

  updateList(id: number, property: string, value: number) {
    const editField = parseFloat(value.toString());
    let HSNCode = (this.lstItem[id]["HSNCode"].toString())
    if (editField < 0) {
      this.alertService.error('Entered Duty Amount must be greater than or equal to zero.!');
      return;
    }
    else {
      this.lstItem[id][property] = editField;
      if (this.lstItem[id]["IsGSTApplicable"]) {
        this.lstItem[id]["IGSTValue"] = this.lstItem[id]["DutyAmount"] *
          parseFloat(this.lstItem[id]["IGSTRate"].toString()) / 100;
      }
      else {
        this.lstItem[id]["IGSTValue"] = 0;
      }
      this.lstItem[id]["DutyPercentage"] = editField / this.obj.PIValue * 100;

      let a = this.lstItem[id]["DutyAmount"] + this.lstItem[id]["IGSTValue"];
      this.lstItem[id]["TotalValue"] = a;
      this.lstItem[id]["SumTotalValue"] = this.lstItem.filter(a => a.HSNCode == HSNCode).reduce((aa, a) => aa + a.TotalValue, 0);
      this.TotalDutyAmount = this.lstItem.reduce((acc, a) => acc + a.DutyAmount, 0);
      this.TotalIGSTValue = this.lstItem.reduce((acc, a) => acc + a.IGSTValue, 0);
      this.TotalTotalValue = this.TotalDutyAmount + this.TotalIGSTValue;
      this.TotalSumTotalValue = this.lstItem.reduce((acc, a) => acc + a.SumTotalValue, 0);
    }
  }

  updateListIsGST(id: number, property: string, value: boolean) {
    let DutyAmount = parseFloat(this.lstItem[id]["DutyAmount"].toString())
    let HSNCode = (this.lstItem[id]["HSNCode"].toString())
    if (DutyAmount < 0) {
      this.alertService.error('Entered Duty Amount must be greater than or equal to zero.!');
      return;
    }
    else {
      this.lstItem[id][property] = value;
      if (value) {
        this.lstItem[id]["IGSTValue"] = this.lstItem[id]["DutyAmount"] *
          parseFloat(this.lstItem[id]["IGSTRate"].toString()) / 100;
      }
      else {
        this.lstItem[id]["IGSTValue"] = 0;
      }
      this.lstItem[id]["DutyPercentage"] = DutyAmount / this.obj.PIValue * 100;
      let a = this.lstItem[id]["DutyAmount"] + this.lstItem[id]["IGSTValue"];
      this.lstItem[id]["TotalValue"] = a;
      this.lstItem[id]["SumTotalValue"] = this.lstItem.filter(a => a.HSNCode == HSNCode).reduce((aa, a) => aa + a.TotalValue, 0);
      this.TotalDutyAmount = this.lstItem.reduce((acc, a) => acc + a.DutyAmount, 0);
      this.TotalIGSTValue = this.lstItem.reduce((acc, a) => acc + a.IGSTValue, 0);
      this.TotalTotalValue = this.TotalDutyAmount + this.TotalIGSTValue;
      this.TotalSumTotalValue = this.lstItem.reduce((acc, a) => acc + a.SumTotalValue, 0);
    }
  }

  mergecells(HSNCode: string, IGSTRate: number, i: number) {
    let ii = i + 1;
    
    let c = this.lstItem.filter(a => a.HSNCode == HSNCode && a.IGSTRate == IGSTRate).length;
    let rem = this.lstItem.length % c;
    return ii % c == rem ? true : false;
  }

  mergecellsclass(HSNCode: string, i) {
    let ii = i + 1;
    let c = this.lstItem.filter(a => a.HSNCode == HSNCode).length;
    let rem = this.lstItem.length % c;
    let a = ii % c;
    let b = rem;
    return a / 2 == b / 2 ? true : false;
  }



  filter(HSNCode: string) {
    return this.lstItem.filter(a => a.HSNCode == HSNCode);
  }

  getlength(HSNCode: string) {
    let c = this.lstItem.filter(a => a.HSNCode == HSNCode).length;
    return c;
  }

  getSum(HSNCode: string) {
    return this.lstItem.filter(a => a.HSNCode == HSNCode).
      reduce((acc, a) => acc + a.DutyAmount, 0) +
      this.lstItem.filter(a => a.HSNCode == HSNCode).reduce((acc, a) => acc + a.IGSTValue, 0);
  }
  BOEDateUpdated(range) {
    this.logValidationErrors();
  }
  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("BOElist", "ViewEdit")) {
      return;
    }
    // stop here if form is invalid
    if (this.boeform.invalid) {
      return;
    }

    let InvoiceDate: Date = new Date(moment(new Date(this.obj.InvoiceDate)).format("MM-DD-YYYY HH:mm"));
    let BOEDate: Date = new Date();
    if (this.boeform.controls['BOEDate'].value.startDate._d != undefined) {
      BOEDate = new Date(moment(new Date(this.boeform.controls['BOEDate'].
        value.startDate._d.toLocaleString())).format("MM-DD-YYYY HH:mm"));
    } else {
      BOEDate = new Date(moment(new Date(this.boeform.controls['BOEDate'].
        value.startDate.toLocaleString())).format("MM-DD-YYYY HH:mm"));
    }

    let currentdate: Date = new Date(moment(new Date()).format("MM-DD-YYYY HH:mm"));
    if (!(BOEDate > InvoiceDate && BOEDate <= currentdate)) {
      this.alertService.error('The BOE date must be between Invoice Date and current datetime.!');
      return;
    }
    else if (this.lstItem.filter(a => a.DutyAmount > 0).length == 0) {
      this.alertService.error('Required order items.!');
      return;
    }
    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
    });
    if (this.identity > 0) {
      this.Update();
    }
    else {
      this.Insert();
    }
  }

  Insert() {

    this.obj.BOENumber = this.boeform.controls['BOENumber'].value;
    this.obj.BOEDate = this.boeform.controls['BOEDate'].value.startDate._d.toLocaleString();
    this.obj.PortCode = this.boeform.controls['PortCode'].value;
    this.obj.ReferenceDetail = this.boeform.controls['ReferenceDetail'].value;
    this.obj.PurchaseID = this.PurchaseID;
    this.obj.lstDetail = this.lstItem.filter(a => a.DutyAmount > 0);
    this._spinner.show();

    this._BoeService.upsert(this.obj).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this._spinner.hide();
          this.alertService.success(data.Msg);
          this._router.navigate(['/BOElist']);
        }
        else {
          this._spinner.hide();
          this.alertService.error(data.Msg);
          this._router.navigate(['/BOElist']);
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
    this.obj.PurchaseID = this.identity;
    this.obj.BOENumber = this.boeform.controls['BOENumber'].value;
    if (this.boeform.controls['BOEDate'].value.startDate._d != undefined) {
      this.obj.BOEDate = this.boeform.controls['BOEDate'].value.startDate._d.toLocaleString();
    } else {
      this.obj.BOEDate = this.boeform.controls['BOEDate'].value.startDate.toLocaleString();
    }

    this.obj.PortCode = this.boeform.controls['PortCode'].value;
    this.obj.ReferenceDetail = this.boeform.controls['ReferenceDetail'].value;
    this.obj.PurchaseID = this.PurchaseID;
    this.obj.lstDetail = this.lstItem.filter(a => a.DutyAmount > 0);
    this._spinner.show();
    this._BoeService.upsert(this.obj).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this._spinner.hide();
          this.alertService.success(data.Msg);
          this._router.navigate(['/BOElist']);
        }
        else {
          this._spinner.hide();
          this.alertService.error(data.Msg);
          this._router.navigate(['/BOElist']);
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
