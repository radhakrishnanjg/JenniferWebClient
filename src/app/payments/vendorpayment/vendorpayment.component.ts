import { Component, OnInit } from '@angular/core';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { VendorpaymentService } from '../../_services/service/vendorpayment.service';
import { VendorPaymentHeader, Vendor, Dropdown, VendorPaymentDetail } from 'src/app/_services/model';
import * as moment from 'moment';

@Component({
  selector: 'app-vendorpayment',
  templateUrl: './vendorpayment.component.html',
  styleUrls: ['./vendorpayment.component.css']
})
export class VendorpaymentComponent implements OnInit {
  obj: VendorPaymentHeader = {} as any;

  VendorPaymentform: FormGroup;
  panelTitle: string;
  action: boolean;
  identity: number = 0;

  constructor(
    private _vendorpaymentService: VendorpaymentService,
    private alertService: ToastrService,
    private fb: FormBuilder,
    private _router: Router,
    private _authorizationGuard: AuthorizationGuard,
    private _PrivateutilityService: PrivateutilityService,
    private aroute: ActivatedRoute,
  ) { }
  formErrors = {

    'VendorID': '',
    'PaymentMode': '',
    'TransactionNumber': '',
    'PaymentDate': '',
    'TotalPaidAmount': '',

  };

  validationMessages = {

    'VendorID': {
      'min': 'This field is required.',

    },
    'PaymentMode': {
      'required': 'This field is required.',
    },

    'TransactionNumber': {
      'required': 'This field is required.',

    },
    'PaymentDate': {
      'required': 'This field is required.',

    },

    'TotalPaidAmount': {
      'required': 'This field is required.',

    },

  };

  logValidationErrors(group: FormGroup = this.VendorPaymentform): void {
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

  vendorMinDate: moment.Moment;
  vendorMaxDate: moment.Moment;
  PendingAmount: number = 0;
  ngOnInit() {
    this.identity = 0;
    this.action = true;
    var end = moment().endOf('day');
    var currentend = new Date();
    var differ = end.diff(currentend, 'minutes');
    this.vendorMaxDate = moment().add(differ, 'minutes');

    this.VendorPaymentform = this.fb.group({
      VendorID: [0, [Validators.min(1)]],
      PaymentMode: ['', [Validators.required]],
      TransactionNumber: ['', []],
      PaymentDate: ['', [Validators.required]],
      TotalPaidAmount: ['', [Validators.required]],
      Remarks: [],
    });

    this.getCurrentServerDateTime();
    this.GetpaymentVendors();
    this.GetpaymentModes();

    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
      this.action = false;
      if (this.identity > 0) {
        this._vendorpaymentService.SearchById(this.identity).subscribe(
          (data: VendorPaymentHeader) => {
            this.obj = data;
            this.PendingAmount = data.PendingAmount;
            var VendorID = data.VendorID.toString();
            var PaymentDate = moment(data.PaymentDate, 'YYYY-MM-DD[T]HH:mm').format('MM-DD-YYYY HH:mm').toString();
            this.VendorPaymentform.patchValue({
              VendorID: VendorID,
              PaymentMode: data.PaymentMode,
              TransactionNumber: data.TransactionNumber,
              PaymentDate: { startDate: new Date(PaymentDate) },
              TotalPaidAmount: data.TotalPaidAmount,
              Remarks: data.Remarks,
            });
            this.VendorPaymentform.get('VendorID').disable();
            this.VendorPaymentform.get('PaymentMode').disable();
            this.VendorPaymentform.get('TransactionNumber').disable();
            //this.VendorPaymentform.get('PaymentDate').disable();
            this.VendorPaymentform.get('TotalPaidAmount').disable();
            this.VendorPaymentform.get('Remarks').disable();
            this.onchangeVendorID(VendorID);
          },
          (err: any) => {
            console.log(err);
          }
        );
      }
    });
    if (isNaN(this.identity)) {
      this.identity = 0;
    }
  }

  private getCurrentServerDateTime() {
    this._PrivateutilityService.getCurrentDate()
      .subscribe(
        (data: Date) => {
          var mcurrentDate = moment(data, 'YYYY-MM-DD[T]HH:mm').format('MM-DD-YYYY HH:mm').toLocaleString();
          this.VendorPaymentform.patchValue({
            PaymentDate: { startDate: new Date(mcurrentDate) },
          });
          this.vendorMinDate = moment(data).add(0, 'days');
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  lstVendor: Vendor[];
  GetpaymentVendors() {
    this._PrivateutilityService.getVendors()
      .subscribe(
        (data: Vendor[]) => {
          this.lstVendor = data;
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  lstPaymentMode: Dropdown[];
  GetpaymentModes() {
    this._PrivateutilityService.GetValues('PaymentMode')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstPaymentMode = data;
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  lstVendorPaymentDetail: VendorPaymentDetail[] = [] as any;
  onchangeVendorID(selectedValue: string) {
    let VendorID = parseInt(selectedValue);
    if (VendorID > 0) {
      this._vendorpaymentService.SearchByVendorId(VendorID).subscribe(
        (data: VendorPaymentDetail[]) => {
          this.lstVendorPaymentDetail = data;
          // this.obj.lstVendorPaymentDetail.forEach(element => {
          //   // let element.PurchaseID = this.obj.lstVendorPaymentDetail.fi 
          // });
          this.TotalPaidAmt = this.lstVendorPaymentDetail.reduce((acc, a) => acc + a.PaidAmt, 0);
        },
        (err: any) => {
          console.log(err);
        }
      );
    }
  }

  TotalPaidAmt: number = 0;
  updateList(id: number, property: string, value: number) {
    const editField = parseFloat(value.toString());
    const PaidAmt = parseFloat(this.lstVendorPaymentDetail[id]['PaidAmt'].toString());
    const PendingAmt = parseFloat(this.lstVendorPaymentDetail[id]['PendingAmt'].toString());
    const PurchaseID = this.lstVendorPaymentDetail[id]['PurchaseID'].toString();

    if (editField < 0) {
      this.alertService.error('Entered Amount must be greater than or equal to zero.!');
      $('#' + PurchaseID).val(PaidAmt);
      return;

    }

    else if (editField > PendingAmt) {
      this.alertService.error('Entered Amount must be less than or equal to Pending Amount.!');
      $('#' + PurchaseID).val(PaidAmt);
      return;
    }
    else {
      this.lstVendorPaymentDetail[id][property] = editField;
      this.TotalPaidAmt = this.lstVendorPaymentDetail.reduce((acc, a) => acc + a.PaidAmt, 0);
    }
  }
  PaymentMode: string = '';
  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("Vendorpaymentlist", "ViewEdit")) {
      return;
    }
    if (this.identity == 0 || isNaN(this.identity)) {
      let TotalPaidAmount = parseFloat(this.VendorPaymentform.controls['TotalPaidAmount'].value.toString()).toFixed(2);
      let downTotalPaidAmount = parseFloat(this.TotalPaidAmt.toString()).toFixed(2);
      if ((this.VendorPaymentform.controls['PaymentMode'].value == 'ONLINE' ||
        this.VendorPaymentform.controls['PaymentMode'].value == 'CASH') && downTotalPaidAmount == "") {
        this.alertService.error("Please Enter Atleast one Invoice Paid Amount.!");
        return;
      }
      if ((this.VendorPaymentform.controls['PaymentMode'].value == 'ONLINE' ||
        this.VendorPaymentform.controls['PaymentMode'].value == 'CASH') && TotalPaidAmount != downTotalPaidAmount) {
        this.alertService.error("The Total Paid Amount and Sum of Paid Amount must be equal.!");
        return;
      }
      if (this.VendorPaymentform.controls['PaymentMode'].value == 'ONLINE' &&
        this.VendorPaymentform.controls['TransactionNumber'].value == '') {
        this.alertService.error("Please Enter the UTR Number!");
        return;
      }
      this.Insert();
    }
    else {
      let PendingAmount = parseFloat(this.PendingAmount.toString()).toFixed(2);
      let downTotalPaidAmount = parseFloat(this.TotalPaidAmt.toString()).toFixed(2);
      if (this.identity >0 && this.lstVendorPaymentDetail.filter(a => a.PaidAmt > 0).length == 0) {
        this.alertService.error("Please enter atleast one Invoice Paid Amount.!");
        return;
      }
      if (this.identity >0 &&  parseFloat(downTotalPaidAmount) > parseFloat(PendingAmount)) {
        this.alertService.error("The Total Paid Amount and less than or equal to Pending Amount.!");
        return;
      }
      this.Update();
    }
  }

  Insert() {
    this.obj = new VendorPaymentHeader();
    this.obj.VendorID = this.VendorPaymentform.controls['VendorID'].value;
    this.obj.PaymentMode = this.VendorPaymentform.controls['PaymentMode'].value;
    this.obj.TransactionNumber = this.VendorPaymentform.controls['TransactionNumber'].value;
    if (this.VendorPaymentform.controls['PaymentDate'].value.startDate._d != undefined) {
      let PaymentDate = new Date(moment(
        new Date(this.VendorPaymentform.controls['PaymentDate'].value.startDate._d.toLocaleString())).format("MM-DD-YYYY HH:mm"));
      this.obj.PaymentDate = PaymentDate;

    } else {
      let PaymentDate = new Date(moment(new Date(this.VendorPaymentform.controls['PaymentDate'].value.startDate.toLocaleString())).format("MM-DD-YYYY HH:mm"));
      this.obj.PaymentDate = PaymentDate;
    }

    this.obj.TotalPaidAmount = this.VendorPaymentform.controls['TotalPaidAmount'].value;
    this.obj.Remarks = this.VendorPaymentform.controls['Remarks'].value;
    this.obj.lstVendorPaymentDetail = this.lstVendorPaymentDetail.filter(a => a.PaidAmt > 0);

    this._vendorpaymentService.Insert(this.obj).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.alertService.success(data.Msg);
          this._router.navigate(['/Vendorpaymentlist']);
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


  Update() {
    this.obj = new VendorPaymentHeader();
    this.obj.PaymentID = this.identity;
    this.obj.TransactionNumber = this.VendorPaymentform.controls['TransactionNumber'].value;
    if (this.VendorPaymentform.controls['PaymentDate'].value.startDate._d != undefined) {
      let PaymentDate = new Date(moment(
        new Date(this.VendorPaymentform.controls['PaymentDate'].value.startDate._d.toLocaleString())).format("MM-DD-YYYY HH:mm"));
      this.obj.PaymentDate = PaymentDate;

    } else {
      let PaymentDate = new Date(moment(new Date(this.VendorPaymentform.controls['PaymentDate'].value.startDate.toLocaleString())).format("MM-DD-YYYY HH:mm"));
      this.obj.PaymentDate = PaymentDate;
    }
    this.obj.lstVendorPaymentDetail = this.lstVendorPaymentDetail.filter(a => a.PaidAmt > 0);

    this._vendorpaymentService.Update(this.obj).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.alertService.success(data.Msg);
          this._router.navigate(['/Vendorpaymentlist']);
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


