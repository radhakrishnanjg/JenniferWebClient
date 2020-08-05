import { Component, OnInit } from '@angular/core';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { CreditnoteService } from '../../_services/service/creditnote.service';
import * as moment from 'moment';
import { CreditNoteHeader, Customer, Dropdown, Location, PendingSalesInvoice, CreditNoteDetail } from 'src/app/_services/model';

@Component({
  selector: 'app-creditnote',
  templateUrl: './creditnote.component.html',
  styleUrls: ['./creditnote.component.css']
})
export class CreditnoteComponent implements OnInit {
  obj: CreditNoteHeader = {} as any;
  identity: number = 0;
  CreditNoteform: FormGroup;
  CNType: string;
  MinDate: moment.Moment;
  LocationName: string;
  constructor(
    private _creditnoteService: CreditnoteService,
    private aroute: ActivatedRoute,
    private alertService: ToastrService,
    private fb: FormBuilder,
    private _router: Router,
    private _authorizationGuard: AuthorizationGuard,
    private _PrivateutilityService: PrivateutilityService,
  ) { }

  formErrors = {
    'CNDate': '',
    'CustomerType': '',
    'CustomerID': '',
    'SalesOrderID': '',
    'CNNumber': '',
    'CNType': '',
    'ReasonForReturn': '',
    'ReferenceDetail': '',
    'Remarks': '',
  };

  validationMessages = {
    'CNDate': {
      'required': 'This field is required.',
    },
    'CustomerType': {
      'required': 'This field is required.',
    },
    'ReasonForReturn': {
      'required': 'This field is required.',
    },
    'CustomerID': {
      'min': 'This field is required.',
    },
    'SalesOrderID': {
      'min': 'This field is required.',
    },
  };

  logValidationErrors(group: FormGroup = this.CreditNoteform): void {
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
    this.getCurrentServerDateTime();
    this.getlocations();
    this.getCustomerType(); 
    this.aroute.paramMap.subscribe(params => {
      this.CNType = params.get('CNType');
    });

    this.CreditNoteform = this.fb.group({
      CNDate: ['', [Validators.required]],
      CustomerType: ['', [Validators.required]],
      CustomerID: [0, [Validators.min(1)]],
      SalesOrderID: [0, [Validators.min(1)]],
      CNNumber: [0, [Validators.required]],
      CNType: [0, [Validators.required]],
      ReasonForReturn: ['', [Validators.required]],
      ReferenceDetail: [],
      Remarks: [],
    });
  }

  private getCurrentServerDateTime() {
    this._PrivateutilityService.getCurrentDate()
      .subscribe(
        (data: Date) => {
          var mcurrentDate = moment(data, 'YYYY-MM-DD[T]HH:mm').format('MM-DD-YYYY HH:mm').toString();
          this.CreditNoteform.patchValue({
            CNDate: { startDate: new Date(mcurrentDate) },
          });
          this.MinDate = moment(data).add(0, 'days');
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  lstCustomerType: Dropdown[];
  getCustomerType() {
    this._PrivateutilityService.GetValues('CustomerType').subscribe(
      (data) => {
        this.lstCustomerType = data;
      },
      (err) => {
        console.log(err);
      }
    )
  }

  locationList: Location[];
  getlocations(): void {
    this._PrivateutilityService.getLocations().subscribe(
      (data) => {
        this.locationList = data;
      },
      (err) => {
        console.log(err);
      }
    );

  }

  lstCustomer: Customer[];
  onchangeCustomerType(selectedValue: string) {
    let customertype = selectedValue;
    if (customertype != '') {
      this._PrivateutilityService.getCustomersBasedType(customertype).subscribe(
        (data: Customer[]) => {
          this.lstCustomer = data;
        },
        (err: any) => {
          console.log(err);
        }
      );
    }
  }

  lstPendingSalesInvoice: PendingSalesInvoice[];
  onchangegetCustomerName(selectedValue: string) {
    let CustomerID = parseInt(selectedValue);
    if (CustomerID > 0) {
      this._creditnoteService.PendingSalesByCustomerId(this.CNType, CustomerID)
        .subscribe(
          (data: PendingSalesInvoice[]) => {
            this.lstPendingSalesInvoice = data;
          },
          (err: any) => {
            console.log(err);
          }
        );
    }
  }

  OrderDate: Date;
  InvoiceValue: number = 0.00;
  InvoicePaymentStatus: string;
  PaymentReceiptNumber: string;
  ExistingAmount: number = 0.00;
  onchangegetSalesInvoice(selectedValue: string) {
    let SalesOrderID = parseInt(selectedValue);
    if (SalesOrderID > 0) {
      this._creditnoteService.SearchBySalesOrderID(this.CNType, SalesOrderID)
        .subscribe(
          (data: CreditNoteDetail[]) => {
            this.obj.lstCreditNoteDetail = data;
            this.OrderDate = this.lstPendingSalesInvoice.filter(a => { return a.SalesOrderID == SalesOrderID })[0].OrderDate;
            this.InvoiceValue = this.lstPendingSalesInvoice.filter(a => { return a.SalesOrderID == SalesOrderID })[0].INTotalAmount;
            // this.LocationName = this.lstPendingSalesInvoice.filter(a => { return a.SalesOrderID == SalesOrderID })[0].LocationName;
          },
          (err: any) => {
            console.log(err);
          }
        );
    }
  }

  TotalQty: number = 0;
  TotalCreditNoteAmount: number = 0.00;
  updateListQty(id: number, property: string, value: number) {
    const editField = parseInt(value.toString());
    const PendingQty = parseInt(this.obj.lstCreditNoteDetail[id]['PendingQty'].toString());
    const Qty = parseInt(this.obj.lstCreditNoteDetail[id]['Qty'].toString());
    const ItemID = this.obj.lstCreditNoteDetail[id]['ItemID'].toString();
    if (editField < 0) {
      this.alertService.error('Entered Qty must be greater than or equal to zero.!');
      $('#' + ItemID).val(Qty);
      return;
    }
    else if (editField > PendingQty) {
      this.alertService.error('Entered Qty must be less than or equal to Credit Note Qty.!');
      $('#' + ItemID).val(Qty);
      return;
    }
    else {
      this.obj.lstCreditNoteDetail[id][property] = editField;
      this.obj.lstCreditNoteDetail[id]["TotalAmount"] = (this.obj.lstCreditNoteDetail[id]["PendingTotalAmount"] /
        this.obj.lstCreditNoteDetail[id]["PendingQty"]) * this.obj.lstCreditNoteDetail[id]["Qty"];
      this.TotalQty = this.obj.lstCreditNoteDetail.reduce((acc, a) => acc + a.Qty, 0);
      this.TotalCreditNoteAmount = this.obj.lstCreditNoteDetail.reduce((acc, a) => acc + a.TotalAmount, 0);
    }
  }

  TotalTotalAmount: number = 0.00;
  updateListTotalAmount(id: number, property: string, value: number) {
    const editField = parseFloat(value.toString());
    const PendingTotalAmount = parseFloat(this.obj.lstCreditNoteDetail[id]['PendingTotalAmount'].toString());
    const TotalAmount = parseFloat(this.obj.lstCreditNoteDetail[id]['TotalAmount'].toString());
    const ItemID = this.obj.lstCreditNoteDetail[id]['ItemID'].toString();
    if (editField < 0) {
      this.alertService.error('Entered Total Amount must be greater than or equal to zero.!');
      $('#' + ItemID).val(TotalAmount);
      return;
    }
    else if (editField > PendingTotalAmount) {
      this.alertService.error('Entered Total Amount must be less than or equal to Credit Note Total Amount.!');
      $('#' + ItemID).val(TotalAmount);
      return;
    }
    else {
      this.obj.lstCreditNoteDetail[id][property] = editField;
      this.TotalTotalAmount = this.obj.lstCreditNoteDetail.reduce((acc, a) => acc + a.TotalAmount, 0);
    }
  }

  public onReasonChange(index, key, value: string): void {
    this.obj.lstCreditNoteDetail[index][key] = value;
  }

  CNDateUpdated(range) {
    let CNDate: Date = new Date(moment(new Date(range.startDate._d)).format("MM-DD-YYYY HH:mm"));
    this.obj.CNDate = CNDate;
  }

  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("Creditnotelist", "ViewEdit")) {
      return;
    }

    if (this.CreditNoteform.invalid) {
      return;
    }

    let totalAmount = parseFloat(this.TotalTotalAmount.toString());
    let totalQty = parseFloat(this.TotalQty.toString());
    if (this.CNType == 'FCN') {
      if (totalAmount == 0 || isNaN(totalAmount)) {
        this.alertService.error("Please enter atleast one Invoice Paid Amount.!");
        return;
      }
    }
    else {
      if (totalQty == 0 || isNaN(totalQty)) {
        this.alertService.error("Please enter atleast one Qty.!");
        return;
      }
    }

    this.Insert();

  }

  Insert() {
    if (this.CreditNoteform.controls['CNDate'].value.startDate._d != undefined) {
      let CNDate = this.CreditNoteform.controls['CNDate'].value.startDate._d.toLocaleString();
      this.obj.CNDate = new Date(moment(new Date(CNDate)).format("MM-DD-YYYY HH:mm"));
      // this.obj.CNDate = this.CreditNoteform.controls['CNDate'].value.startDate._d.toLocaleString();
      // let CNDate = new Date(moment(new Date(this.obj.CNDate)).format("MM-DD-YYYY HH:mm"));
    } else {
      let CNDate = this.CreditNoteform.controls['CNDate'].value.startDate.toLocaleString();
      this.obj.CNDate = new Date(moment(new Date(CNDate)).format("MM-DD-YYYY HH:mm"));
    }

    this.obj.SalesOrderID = this.CreditNoteform.controls['SalesOrderID'].value;
    this.obj.CNType = this.CNType;
    this.obj.CustomerID = this.CreditNoteform.controls['CustomerID'].value;
    this.obj.ReferenceDetail = this.CreditNoteform.controls['ReferenceDetail'].value;
    this.obj.Reason = this.CreditNoteform.controls['ReasonForReturn'].value;
    this.obj.Remarks = this.CreditNoteform.controls['Remarks'].value;

    if (this.CNType == 'CN') {
      this.obj.lstCreditNoteDetail = this.obj.lstCreditNoteDetail.filter(a => a.Qty > 0);
    }
    else {
      this.obj.lstCreditNoteDetail = this.obj.lstCreditNoteDetail.filter(a => a.TotalAmount > 0);
    }

    this._creditnoteService.Insert(this.obj).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.alertService.success(data.Msg);
          this._router.navigate(['/Creditnotelist']);
        }
        else {
          this.alertService.error(data.Msg);
          this._router.navigate(['/Creditnotelist']);
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
