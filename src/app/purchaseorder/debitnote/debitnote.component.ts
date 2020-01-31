import { Component, OnInit } from '@angular/core';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { DebitnoteService } from '../../_services/service/debitnote.service';
import * as moment from 'moment';
import { DebitNoteHeader, Vendor, Dropdown, Location, PendingPurchaseInvoice, DebitNoteDetail } from 'src/app/_services/model';

@Component({
  selector: 'app-debitnote',
  templateUrl: './debitnote.component.html',
  styleUrls: ['./debitnote.component.css']
})
export class DebitnoteComponent implements OnInit {
  obj: DebitNoteHeader = {} as any;
  identity: number = 0;
  DebitNoteform: FormGroup;
  DNType: string;
  MinDate: moment.Moment;
  LocationName: string;
  constructor(
    private _debitnoteService: DebitnoteService,
    private aroute: ActivatedRoute,
    private alertService: ToastrService,
    private fb: FormBuilder,
    private _router: Router,
    private _authorizationGuard: AuthorizationGuard,
    private _PrivateutilityService: PrivateutilityService,
  ) { }

  formErrors = {
    'VendorID': '',
    'PurchaseID': '',
    'DNDate': '',
    'DNNumber': '',
    'DNType': '', 
    'ReferenceDetail': '',
    'Remarks': '',
  };

  validationMessages = {
    'VendorID': {
      'min': 'This field is required.',
    },
    'PurchaseID': {
      'min': 'This field is required.',
    },
    'DNDate': {
      'required': 'This field is required.',

    }, 
  };

  logValidationErrors(group: FormGroup = this.DebitNoteform): void {
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
    this.getVendorName();
    this.aroute.paramMap.subscribe(params => {
      this.DNType = params.get('DNType');
    });

    this.DebitNoteform = this.fb.group({
      VendorID: [0, [Validators.min(1)]],
      PurchaseID: [0, [Validators.min(1)]],
      DNDate: ['', [Validators.required]],
      DNNumber: [0, [Validators.required]],
      DNType: [0, [Validators.required]], 
      ReferenceDetail: [],
      Remarks: [],
    });
  }

  private getCurrentServerDateTime() {
    this._PrivateutilityService.getCurrentDate()
      .subscribe(
        (data: Date) => {
          var mcurrentDate = moment(data, 'YYYY-MM-DD[T]HH:mm').format('MM-DD-YYYY HH:mm').toString();
          this.DebitNoteform.patchValue({
            DNDate: { startDate: new Date(mcurrentDate) },
          });
          this.MinDate = moment(data).add(0, 'days');
        },
        (err: any) => {
          console.log(err);
        }
      );
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

  lstVendor: Vendor[];
  getVendorName() {
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

  lstPendingPurchaseInvoice: PendingPurchaseInvoice[];
  InvoiceDate: Date;
  onchangegetVendorName(selectedValue: string) {
    let VendorID = parseInt(selectedValue);
    if (VendorID > 0) {
      this._debitnoteService.PendingInvoicesByVendorId(this.DNType, VendorID)
        .subscribe(
          (data: PendingPurchaseInvoice[]) => {
            this.lstPendingPurchaseInvoice = data;
          },
          (err: any) => {
            console.log(err);
          }
        );
    }
  }

  onchangegetPurchaseInvoice(selectedValue: string) {
    let PurchaseID = parseInt(selectedValue);
    if (PurchaseID > 0) {
      this._debitnoteService.SearchByPurchaseID(this.DNType, PurchaseID)
        .subscribe(
          (data: DebitNoteDetail[]) => {
            this.obj.lstDebitNoteDetail = data;
            this.InvoiceDate = this.lstPendingPurchaseInvoice.filter(a => { return a.PurchaseID == PurchaseID })[0].InvoiceDate;
            this.LocationName = this.lstPendingPurchaseInvoice.filter(a => { return a.PurchaseID == PurchaseID })[0].LocationName;
          },
          (err: any) => {
            console.log(err);
          }
        );
    }
  }

  TotalQty: number = 0;
  TotalDebitNoteAmount: number = 0.00;
  updateListQty(id: number, property: string, value: number) {
    const editField = parseInt(value.toString());
    const PendingQty = parseInt(this.obj.lstDebitNoteDetail[id]['PendingQty'].toString());
    const Qty = parseInt(this.obj.lstDebitNoteDetail[id]['Qty'].toString());
    const ItemID = this.obj.lstDebitNoteDetail[id]['ItemID'].toString();
    if (editField < 0) {
      this.alertService.error('Entered Qty must be greater than or equal to zero.!');
      $('#' + ItemID).val(Qty);
      return;
    }
    else if (editField > PendingQty) {
      this.alertService.error('Entered Qty must be less than or equal to Debit Note Qty.!');
      $('#' + ItemID).val(Qty);
      return;
    }
    else {
      this.obj.lstDebitNoteDetail[id][property] = editField;
      this.obj.lstDebitNoteDetail[id]["TotalAmount"] = (this.obj.lstDebitNoteDetail[id]["PendingTotalAmount"]/
      this.obj.lstDebitNoteDetail[id]["PendingQty"]) * this.obj.lstDebitNoteDetail[id]["Qty"];
      this.TotalQty = this.obj.lstDebitNoteDetail.reduce((acc, a) => acc + a.Qty, 0);
      this.TotalDebitNoteAmount = this.obj.lstDebitNoteDetail.reduce((acc, a) => acc + a.TotalAmount, 0);
    }
  } 

  TotalTotalAmount: number = 0.00;
  updateListTotalAmount(id: number, property: string, value: number) {
    const editField = parseFloat(value.toString());
    const PendingTotalAmount = parseFloat(this.obj.lstDebitNoteDetail[id]['PendingTotalAmount'].toString());
    const TotalAmount = parseFloat(this.obj.lstDebitNoteDetail[id]['TotalAmount'].toString());
    const ItemID = this.obj.lstDebitNoteDetail[id]['ItemID'].toString();
    if (editField < 0) {
      this.alertService.error('Entered Total Amount must be greater than or equal to zero.!');
      $('#' + ItemID).val(TotalAmount);
      return;
    }
    else if (editField > PendingTotalAmount) {
      this.alertService.error('Entered Total Amount must be less than or equal to Debit Note Total Amount.!');
      $('#' + ItemID).val(TotalAmount);
      return;
    }
    else {
      this.obj.lstDebitNoteDetail[id][property] = editField;
      this.TotalTotalAmount = this.obj.lstDebitNoteDetail.reduce((acc, a) => acc + a.TotalAmount, 0);
    }
  }

  public onReasonChange(index, key, value: string): void {
    this.obj.lstDebitNoteDetail[index][key] = value;
  }

  DNDateUpdated(range) {
    let DNDate: Date = new Date(moment(new Date(range.startDate._d)).format("MM-DD-YYYY HH:mm"));
    this.obj.DNDate = DNDate;
  }

  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("Debitnotelist", "ViewEdit")) {
      return;
    }

    if (this.DebitNoteform.invalid) {
      return;
    }

    let totalAmount = parseFloat(this.TotalTotalAmount.toString());
    let totalQty = parseFloat(this.TotalQty.toString());
    if (this.DNType == 'FDN') {
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
    if (this.DebitNoteform.controls['DNDate'].value.startDate._d != undefined) {
      let DNDate = this.DebitNoteform.controls['DNDate'].value.startDate._d.toLocaleString();
      this.obj.DNDate = new Date(moment(new Date(DNDate)).format("MM-DD-YYYY HH:mm"));
      // this.obj.DNDate = this.DebitNoteform.controls['DNDate'].value.startDate._d.toLocaleString();
      // let DNDate = new Date(moment(new Date(this.obj.DNDate)).format("MM-DD-YYYY HH:mm"));
    } else {
      let DNDate = this.DebitNoteform.controls['DNDate'].value.startDate.toLocaleString();
      this.obj.DNDate = new Date(moment(new Date(DNDate)).format("MM-DD-YYYY HH:mm"));
    }

    this.obj.PurchaseID = this.DebitNoteform.controls['PurchaseID'].value;
    this.obj.DNType = this.DNType;
    this.obj.LocationID = this.lstPendingPurchaseInvoice.filter(a => a.PurchaseID == this.DebitNoteform.controls['PurchaseID'].value)[0].LocationID;
    this.obj.ReferenceDetail = this.DebitNoteform.controls['ReferenceDetail'].value;
    this.obj.Remarks = this.DebitNoteform.controls['Remarks'].value;

    if(this.DNType == 'DN')
    {
      this.obj.lstDebitNoteDetail =  this.obj.lstDebitNoteDetail.filter(a => a.Qty > 0);
    }
    else {
      this.obj.lstDebitNoteDetail =  this.obj.lstDebitNoteDetail.filter(a => a.TotalAmount > 0);
    }

    this._debitnoteService.Insert(this.obj).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.alertService.success(data.Msg);
          this._router.navigate(['/Debitnotelist']);
        }
        else {
          this.alertService.error(data.Msg);
          this._router.navigate(['/Debitnotelist']);
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }




}
