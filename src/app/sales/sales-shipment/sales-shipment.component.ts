import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SalesShipmentService } from '../../_services/service/sales-shipment.service';
import { PoService } from '../../_services/service/po.service';
import { UsernameValidator } from '../../_validators/username';

import { SalesShipment, Dropdown, UOM, InvoiceNumber } from '../../_services/model';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { AuthenticationService } from '../../_services/service/authentication.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-sales-shipment',
  templateUrl: './sales-shipment.component.html',
  styleUrls: ['./sales-shipment.component.css']
})

export class SalesShipmentComponent implements OnInit {

  lst: SalesShipment[] = [];
  obj: SalesShipment = {} as any;
  salesShipmentForm: FormGroup;
  panelTitle: string;
  action: boolean;
  identity: number = 0;
  serial: string = '';
  dtOptions: DataTables.Settings = {};
  lstCourier: Dropdown[];
  lstUOM: UOM[];
  invoiceNumbers: InvoiceNumber[] = [];
  lstInvoiceNumber: InvoiceNumber[] = [] as any;
  invoiceNumberList: string[] = [];
  weightPattern = "^[0-9]+(\.[0-9]{1,4})$";
  SalesInvoiceID: number = 0;

  constructor(
    private alertService: ToastrService,
    private _router: Router,
    private _salesShipmentService: SalesShipmentService,
    private _authenticationService: AuthenticationService,
    private fb: FormBuilder,
    private _spinner: NgxSpinnerService,
    private _authorizationGuard: AuthorizationGuard,
    private usernameValidator: UsernameValidator,
    private aroute: ActivatedRoute,
    private PrivateutilityService: PrivateutilityService,
    private _poService: PoService
  ) { }

  //#region Validation Start
  formErrors = {
    'SalesShipmentID': '',
    'InvoiceNumber': '',
    'CourierName': '',
    'CourierTrackingID': '',
    'AirwayBillNumber': '',
    'Weight': '',
    'UOMID': ''
  };

  // This object contains all the validation messages for this form
  validationMessages = {

    'SalesShipmentID': {
      'required': 'This Field is required.'
    },

    'InvoiceNumber': {
      'required': 'This Field is required.'
    },

    'CourierName': {
      'required': 'This Field is required.'
    },

    'CourierTrackingID': {
      'required': 'This Field is required.',
      'CourierTrackingIDInUse': 'This Tracking Id is already registered!'
    },

    'AirwayBillNumber': {
      'required': 'This Field is required.'
    },

    'Weight': {
      'required': 'This Field is required.',
      'pattern': 'This Field should be decimal with a precision of 4'
    },

    'UOMID': {
      'min': 'This Field is required.'
    }
  };

  logValidationErrors(group: FormGroup = this.salesShipmentForm): void {
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
  //#endregion Validation End

  ngOnInit() {
    this.getSalesShipmentID();
    this.getUOMs();
    this.getInvoiceNumbers();
    this._spinner.show();
    this.PrivateutilityService.GetValues('Courier')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstCourier = data;
          this._spinner.hide();
        },
        (err: any) => {
          console.log(err)
          this._spinner.hide();
        }
      );

    this.panelTitle = 'Add New Sales Shipment';
    this.identity = 0;
    this.serial = '';
    this.salesShipmentForm = this.fb.group({
      SalesShipmentID: ['', [Validators.required]],
      InvoiceNumber: ['', [Validators.required]],
      CourierName: ['', [Validators.required]],
      CourierTrackingID: ['', [Validators.required],
        this.usernameValidator.existCourierTrackingID(this.identity)],
      AirwayBillNumber: ['', [Validators.required]],
      Weight: ['', [Validators.required, Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")]],
      UOMID: [0, [Validators.min(1)]]
    });
  }

  public getSalesShipmentID(): void {
    this._spinner.show();
    this._salesShipmentService.generateSalesShipment().subscribe(
      (res) => {
        this.obj.SalesShipmentID = res;
        this.salesShipmentForm.controls['SalesShipmentID'].setValue(res);
        this._spinner.hide();
        console.log(this.obj.SalesShipmentID)
      }, (err) => {
        this._spinner.hide();
        console.log(err);
      });
  }

  public getInvoiceNumbers(): void {
    this._spinner.show();
    this.PrivateutilityService.getInvoiceNumbers().subscribe(
      (res) => {
        this.invoiceNumbers = res;
        this.lstInvoiceNumber = res;
        this.invoiceNumbers.forEach(obj => { this.invoiceNumberList.push(obj.InvoiceNumber) });
        this._spinner.hide();
        console.log(this.invoiceNumbers)
      }, (err) => {
        this._spinner.hide();
        console.log(err);
      });
  }

  public getUOMs(): void {
    this._spinner.show();
    this._poService.getOrderUOMs().subscribe(
      (res) => {
        this.lstUOM = res;
        this._spinner.hide();
        //console.log(this.uomList)
      }, (err) => {
        this._spinner.hide();
        console.log(err);
      });
  }

  SaveData(): void {
    // stop here if form is invalid 
    if (this.salesShipmentForm.invalid) {
      return;
    }
    if (this._authorizationGuard.CheckAcess("Salesshipmentlist", "ViewEdit")) {
      return;
    }
    if (this.lstInvoiceNumber == null || this.lstInvoiceNumber.filter(a => a.InvoiceNumber ==
      this.salesShipmentForm.controls['InvoiceNumber'].value).length == 0) {
      this.alertService.error('Please select a valid InvoiceNumber!');
      return;
    }
    else {
      this.Insert();
    }
  }

  Insert() {
    this.obj.SalesShipmentID = this.salesShipmentForm.controls['SalesShipmentID'].value;
    this.obj.InvoiceNumber = this.salesShipmentForm.controls['InvoiceNumber'].value;
    this.obj.CourierName = this.salesShipmentForm.controls['CourierName'].value;
    this.obj.CourierTrackingID = this.salesShipmentForm.controls['CourierTrackingID'].value;
    this.obj.AirwayBillNumber = this.salesShipmentForm.controls['AirwayBillNumber'].value;
    this.obj.Weight = this.salesShipmentForm.controls['Weight'].value;
    this.obj.UOMID = this.salesShipmentForm.controls['UOMID'].value;

    this._spinner.show();
    this._salesShipmentService.add(this.obj).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this._spinner.hide();
          this.alertService.success(data.Msg);
          this._router.navigate(['/Salesshipmentlist']);
        }
        else {
          this._spinner.hide();
          this.alertService.error(data.Msg);
          this._router.navigate(['/Salesshipmentlist']);
        }
      },
      (error: any) => {
        this._spinner.hide();
        console.log(error);
      }
    );
  }

  formatter = (result: string) => result.toUpperCase();

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? []
        : this.invoiceNumberList.filter(v => v.toLowerCase().
          indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )
} 