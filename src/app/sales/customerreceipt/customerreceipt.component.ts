import { Component, OnInit } from '@angular/core';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { CustomerreceiptService } from '../../_services/service/customerreceipt.service';
import { CustomerReceiptHeader, Dropdown, CustomerReceiptDetail, Customer } from 'src/app/_services/model';
import { process, State, orderBy } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import * as moment from 'moment';

@Component({
  selector: 'app-customerreceipt',
  templateUrl: './customerreceipt.component.html',
  styleUrls: ['./customerreceipt.component.css']
})
export class CustomerreceiptComponent implements OnInit {

  obj: CustomerReceiptHeader = {} as any;

  CustomerReceiptForm: FormGroup;
  panelTitle: string;
  action: boolean;
  identity: number = 0;


  constructor(
    private _customerreceiptService: CustomerreceiptService,
    private alertService: ToastrService,
    private fb: FormBuilder,
    private _router: Router,
    private _authorizationGuard: AuthorizationGuard,
    private _PrivateutilityService: PrivateutilityService,
  ) { }

  formErrors = {
    'CustomerID': '',
    'PaymentMode': '',
    'CustomerType': '',
    'TransactionDate': '',
    'TransactionNumber': '',
    'TotalReceivedAmount': '',

  };

  validationMessages = {

    'CustomerID': {
      'min': 'This field is required.',
    },

    'PaymentMode': {
      'required': 'This field is required.',
    },

    'CustomerType': {
      'required': 'This field is required.',
    },

    'TransactionDate': {
      'required': 'This field is required.',

    },

    'TransactionNumber': {
      'required': 'This field is required.',

    },

    'TotalReceivedAmount': {
      'required': 'This field is required.',

    },

  };

  logValidationErrors(group: FormGroup = this.CustomerReceiptForm): void {
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



  CustomerReciptMinDate: moment.Moment;
  CustomerReciptMaxDate: moment.Moment;
  ngOnInit() {

    var end = moment().endOf('day');
    var currentend = new Date();
    var differ = end.diff(currentend, 'minutes');
    this.CustomerReciptMaxDate = moment().add(differ, 'minutes');

    this.CustomerReceiptForm = this.fb.group({
      PaymentMode: ['', [Validators.required]],
      CustomerID: [0, [Validators.min(1)]],
      CustomerType: ['', [Validators.required]],
      TransactionDate: ['', [Validators.required]],
      TransactionNumber: ['', []],
      TotalReceivedAmount: ['', [Validators.required]],
      Remarks: [],
    });

    this.getCurrentServerDateTime();
    this.GetCustomerType();
    this.GetpaymentModes();
  }

  private getCurrentServerDateTime() {
    this._PrivateutilityService.getCurrentDate()
      .subscribe(
        (data: Date) => {
          var mcurrentDate = moment(data, 'YYYY-MM-DD[T]HH:mm').format('MM-DD-YYYY HH:mm').toLocaleString();
          this.CustomerReceiptForm.patchValue({
            TransactionDate: { startDate: new Date(mcurrentDate) },
          });
          this.CustomerReciptMinDate = moment(data).add(0, 'days');
        },
        (err: any) => {
          console.log(err);
        }
      );
  }


  lstCustomerType: Dropdown[];
  GetCustomerType() {
    this._PrivateutilityService.GetValues('CustomerType')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstCustomerType = data;
        },
        (err: any) => {
          console.log(err);
        }
      );

  }

  lstCustomerName: Customer[];
  onchangecustomertype(selectedValue: string) {
    let customertype = selectedValue;
    if (customertype != '') {
      this._PrivateutilityService.getCustomersBasedType(customertype).subscribe(
        (data: Customer[]) => {
          this.lstCustomerName = data;
        },
        (err: any) => {
          console.log(err);
        }
      );
    }
  }

  lstCustomerReceiptDetail: CustomerReceiptDetail[] = [] as any;
  onchangeCustomerId(selectedValue: string) {
    let CustomerId = parseInt(selectedValue);
    if (CustomerId > 0) {
      this._customerreceiptService.SearchByCustomerId(CustomerId).subscribe(
        (data: CustomerReceiptDetail[]) => {
          this.lstCustomerReceiptDetail = data;
          this.loadItems();
        },
        (err: any) => {
          console.log(err);
        }
      );
    }
  }

  PaymentMode: string;
  onchangePaymentMode(selectedValue: string) {
    this.PaymentMode = selectedValue;
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

  TotalReceivedAmt: number = 0;
  TotalPendingAmt: number = 0;
  TotalReceivableAmt: number = 0;
  updateList(id: number, property: string, value: number) {
    const editField = parseFloat(value.toString());
    const ReceivedAmt = parseFloat(this.lstCustomerReceiptDetail[id]['ReceivedAmt'].toString());
    const PendingAmt = parseFloat(this.lstCustomerReceiptDetail[id]['PendingAmt'].toString());
    const SalesOrderID = this.lstCustomerReceiptDetail[id]['SalesOrderID'].toString();

    if (editField < 0) {
      this.alertService.error('Entered Amount must be greater than or equal to zero.!');
      $('#' + SalesOrderID).val(ReceivedAmt);
      return;

    }

    else if (editField > PendingAmt) {
      this.alertService.error('Entered Amount must be less than or equal to Pending Amount.!');
      $('#' + SalesOrderID).val(ReceivedAmt);
      return;
    }
    else {
      this.lstCustomerReceiptDetail[id][property] = editField;
      this.TotalReceivableAmt = this.lstCustomerReceiptDetail.reduce((acc, a) => acc + a.ReceivableAmt, 0);
      this.TotalPendingAmt = this.lstCustomerReceiptDetail.reduce((acc, a) => acc + a.PendingAmt, 0);
      this.TotalReceivedAmt = this.lstCustomerReceiptDetail.reduce((acc, a) => acc + a.ReceivedAmt, 0);
    }
  }

  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("Customerreceiptlist", "ViewEdit")) {
      return;
    }

    let TotalReceivedAmount = parseFloat(this.CustomerReceiptForm.controls['TotalReceivedAmount'].value).toFixed(2);
    let downTotalPaidAmount = parseFloat(this.TotalReceivedAmt.toString()).toFixed(2);
    if (this.lstCustomerReceiptDetail.filter(a => a.ReceivedAmt > 0).length == 0) {
      this.alertService.error("Please Enter Atleast one Receipt Amount.!");
      return;
    }
    if (TotalReceivedAmount != downTotalPaidAmount) {
      this.alertService.error("The Total Paid Amount and Sum of Paid Amount must be equal.!");
      return;
    }
    if (this.CustomerReceiptForm.controls['PaymentMode'].value == 'ONLINE' &&
      this.CustomerReceiptForm.controls['TransactionNumber'].value == '') {
      this.alertService.error("Please Enter the UTR Number!");
      return;
    }
    this.Insert();
  }
  public gridView: GridDataResult;
  private loadItems(): void {
    this.gridView = {
      data: this.lstCustomerReceiptDetail,
      total: this.lstCustomerReceiptDetail.length
    };
  }
  public onFilter(inputValue: string): void {
    this.gridView = process(this.lstCustomerReceiptDetail, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'OrderID',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ReceivableAmt',
            operator: 'contains',
            value: inputValue
          },
        ],
      }
    });
  }
  Insert() {
    this.obj = new CustomerReceiptHeader();
    this.obj.CustomerID = this.CustomerReceiptForm.controls['CustomerID'].value;
    this.obj.PaymentMode = this.CustomerReceiptForm.controls['PaymentMode'].value;
    this.obj.TransactionNumber = this.CustomerReceiptForm.controls['TransactionNumber'].value;
    if (this.CustomerReceiptForm.controls['TransactionDate'].value.startDate._d != undefined) {
      let TransactionDate = new Date(moment(
        new Date(this.CustomerReceiptForm.controls['TransactionDate'].value.startDate._d.toLocaleString())).format("MM-DD-YYYY HH:mm"));
      this.obj.TransactionDate = TransactionDate;

    } else {
      let TransactionDate = new Date(moment(new Date(this.CustomerReceiptForm.controls['TransactionDate'].value.startDate.toLocaleString())).format("MM-DD-YYYY HH:mm"));
      this.obj.TransactionDate = TransactionDate;
    }

    this.obj.TotalReceivedAmount = this.CustomerReceiptForm.controls['TotalReceivedAmount'].value;
    this.obj.Remarks = this.CustomerReceiptForm.controls['Remarks'].value;
    this.obj.lstCustomerReceiptDetail = this.lstCustomerReceiptDetail.filter(a => a.ReceivedAmt > 0);

    this._customerreceiptService.Insert(this.obj).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.alertService.success(data.Msg);
          this._router.navigate(['/Customerreceiptlist']);
        }
        else {
          this.alertService.error(data.Msg);
          this._router.navigate(['/Customerreceiptlist']);
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
