import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsernameValidator } from '../../_validators/username';
import { ToastrService } from 'ngx-toastr';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { Vendorwarehouse, State, Invoice, Poorder, Invoiceitem } from '../../_services/model';
import { InvoiceService } from '../../_services/service/invoice.service';
import * as moment from 'moment';
@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {

  invoiceform: FormGroup;
  lstVendorwarehouse: Vendorwarehouse[];
  lst: Invoice[];
  obj: Invoice = {} as any;
  panelTitle: string;
  action: boolean;
  identity: number = 0;
  Searchaction: boolean = true;
  POID: number = 0;
  PONumber: string = '';
  LocationName: string = '';
  LocationID: number = 0;
  VendorID: number = 0;
  VendorName: string = '';
  PODate: Date;
  editField: string;
  TotalQty: number = 0;
  TotalRate: number = 0;
  TotalMRP: number = 0;
  TotalTaxRate: number = 0;
  TotalDirectCost: number = 0;
  TotalTaxAmount: number = 0;
  TotalTotalAmount: number = 0;
  InvoiceDate: any;
  IsEditable: boolean = true;
  InvoiceMinDate: moment.Moment;
  InvoiceMaxDate: moment.Moment;
  constructor(
    private alertService: ToastrService,
    private fb: FormBuilder,
    private _router: Router,
    private aroute: ActivatedRoute,
    
    private usernameValidator: UsernameValidator,
    private _invoiceService: InvoiceService,
    private _authorizationGuard: AuthorizationGuard

  ) { }

  formErrors = {
    'InvoiceNumber': '',
    'InvoiceDate': '',
    'VendorWarehouseID': '',
    'Remarks': '',
  };

  validationMessages = {

    'InvoiceNumber': {
      'required': 'This Field is required.',
      'maxlength': 'This Field must be less than or equal to 30 charecters.',
      'InvoiceNumberInUse': 'This Field is already registered!',
    },
    'InvoiceDate': {
      'required': 'This Field is required.',
    },

    'VendorWarehouseID': {
      'min': 'This Field is required.',
    },
    'Remarks': {
      'required': 'This Field is required.',
      'maxlength': 'This Field must be less than or equal to 250 charecters.',
    },
  };

  logValidationErrors(group: FormGroup = this.invoiceform): void {
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
      this.POID = +params.get('PoId');
      //
      this._invoiceService.GetPoHeaderByPOID(this.POID)
        .subscribe(
          (data: Poorder) => {
            this.PONumber = data.PONumber;
            this.PODate = data.PODate;
            this.LocationID = data.LocationID;
            this.LocationName = data.LocationName;
            this.VendorID = data.VendorID;
            this.VendorName = data.VendorName;
            this.InvoiceMinDate = moment(this.PODate).add(1, 'minutes');
            this.InvoiceMaxDate = moment().add(0, 'days');
            //
            //
            this._invoiceService.getVendorWarehouses(this.VendorID)
              .subscribe(
                (data: Vendorwarehouse[]) => {
                  this.lstVendorwarehouse = data;
                  //
                },
                (err: any) => {
                  //
                  console.log(err);
                }
              );
            if (this.identity > 0) {
              this.panelTitle = "Edit Invoice";
              this.action = false;
              //
              this._invoiceService.searchById(this.identity, this.POID)
                .subscribe(
                  (data: Invoice) => {
                    this.obj = data;
                    this.TotalQty = this.obj.lstItem.reduce((acc, a) => acc + a.Qty, 0);
                    this.TotalRate = this.obj.lstItem.reduce((acc, a) => acc + a.Rate, 0);
                    this.TotalMRP = this.obj.lstItem.reduce((acc, a) => acc + a.MRP, 0);
                    this.TotalTaxRate = this.obj.lstItem.reduce((acc, a) => acc + a.TaxRate, 0);
                    this.TotalTaxAmount = this.obj.lstItem.reduce((acc, a) => acc + a.TaxAmount, 0);
                    this.TotalDirectCost = this.obj.lstItem.reduce((acc, a) => acc + a.DirectCost, 0);
                    this.TotalTotalAmount = this.obj.lstItem.reduce((acc, a) => acc + a.TotalAmount, 0);
                    //
                    var VendorWarehouseID = data.VendorWarehouseID.toString();
                    this.invoiceform.patchValue({
                      InvoiceNumber: data.InvoiceNumber,
                      //InvoiceDate: data.InvoiceDate,
                      VendorWarehouseID: VendorWarehouseID,
                      Remarks: data.Remarks,
                    });
                    this.IsEditable = data.IsEditable;
                    this.invoiceform.get('InvoiceNumber').disable();
                    var InvoiceDate1 = moment(data.InvoiceDate, 'YYYY-MM-DD[T]HH:mm').
                      format('MM-DD-YYYY HH:mm').toString();
                    this.InvoiceDate = { startDate: new Date(InvoiceDate1) };

                  },
                  (err: any) => {
                    //
                    console.log(err);
                  }
                );
            }
            else {
              this.action = true;
              this.panelTitle = "Add New Invoice";
              //
              this._invoiceService.getNewInvoice(this.POID)
                .subscribe(
                  (data: Invoiceitem[]) => {
                    this.obj.lstItem = data;
                    this.TotalQty = this.obj.lstItem.reduce((acc, a) => acc + a.Qty, 0);
                    this.TotalRate = this.obj.lstItem.reduce((acc, a) => acc + a.Rate, 0);
                    this.TotalMRP = this.obj.lstItem.reduce((acc, a) => acc + a.MRP, 0);
                    this.TotalTaxRate = this.obj.lstItem.reduce((acc, a) => acc + a.TaxRate, 0);
                    this.TotalTaxAmount = this.obj.lstItem.reduce((acc, a) => acc + a.TaxAmount, 0);
                    this.TotalDirectCost = this.obj.lstItem.reduce((acc, a) => acc + a.DirectCost, 0);
                    this.TotalTotalAmount = this.obj.lstItem.reduce((acc, a) => acc + a.TotalAmount, 0);

                    //
                  },
                  (err: any) => {
                    //
                    console.log(err);
                  }
                );
            }

          },
          (err: any) => {
            //
            console.log(err);
          }
        );

    });

    this.invoiceform = this.fb.group({
      InvoiceNumber: ['', [Validators.required, Validators.maxLength(30),],
        this.usernameValidator.existInvoiceNumber(this.identity)],
      InvoiceDate: ['', [Validators.required,]],
      VendorWarehouseID: [0, [Validators.min(1),]],
      Remarks: ['', [Validators.required, Validators.maxLength(250)]],
    });
  }

  updateList(id: number, property: string, value: number) {
    const editField = parseInt(value.toString());
    const AvailableQty = parseInt(this.obj.lstItem[id]['AvailableQty'].toString());
    if (editField < 0) {
      this.alertService.error('Entered Qty must be greater than or equal to zero.!');
      return;
    }
    else if (editField > AvailableQty) {
      this.alertService.error('Entered Qty must be less than or equal to Available Qty.!');
      return;
    }
    else {
      this.obj.lstItem[id][property] = editField;
      this.obj.lstItem[id]["DirectCost"] = editField * this.obj.lstItem[id]["Rate"];
      this.obj.lstItem[id]["TaxAmount"] = this.obj.lstItem[id]["DirectCost"] * this.obj.lstItem[id]["TaxRate"] / 100;
      this.obj.lstItem[id]["TotalAmount"] = parseFloat(this.obj.lstItem[id]["DirectCost"].toString()) +
        parseFloat(this.obj.lstItem[id]["TaxAmount"].toString());
      this.TotalQty = this.obj.lstItem.reduce((acc, a) => acc + a.Qty, 0);
      this.TotalRate = this.obj.lstItem.reduce((acc, a) => acc + a.Rate, 0);
      this.TotalMRP = this.obj.lstItem.reduce((acc, a) => acc + a.MRP, 0);
      this.TotalTaxRate = this.obj.lstItem.reduce((acc, a) => acc + a.TaxRate, 0);
      this.TotalTaxAmount = this.obj.lstItem.reduce((acc, a) => acc + a.TaxAmount, 0);
      this.TotalDirectCost = this.obj.lstItem.reduce((acc, a) => acc + a.DirectCost, 0);
      this.TotalTotalAmount = this.obj.lstItem.reduce((acc, a) => acc + a.TotalAmount, 0);
    }
  }

  onchangeVendorWarehouseID(selectedValue: string) {
    let VendorWarehouseID = parseInt(selectedValue);
    if (VendorWarehouseID > 0) {
      let LocationID = this.LocationID;
      //
      this._invoiceService.getGSTType(VendorWarehouseID, LocationID)
        .subscribe(
          (data) => {
            if (data != null) {
              this.obj.lstItem.map(a => a.TaxNature = data);
            }
            //
          },
          (err: any) => {
            //
            console.log(err);
          }
        );
    }
  }

  InvoiceDateUpdated(range) {
    this.logValidationErrors();
  }


  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("Purchaselist", "ViewEdit")) {
      return;
    }
    // stop here if form is invalid
    if (this.invoiceform.invalid) {
      return;
    } 
    let PODate: Date = new Date(moment(new Date(this.PODate)).format("MM-DD-YYYY HH:mm"));
    let InvoiceDate: Date = new Date();
    if (this.invoiceform.controls['InvoiceDate'].value.startDate._d != undefined) {
      InvoiceDate = new Date(moment(new Date(this.invoiceform.controls['InvoiceDate'].
        value.startDate._d.toLocaleString())).format("MM-DD-YYYY HH:mm"));
    } else {
      InvoiceDate = new Date(moment(new Date(this.invoiceform.controls['InvoiceDate'].
        value.startDate.toLocaleString())).format("MM-DD-YYYY HH:mm"));
    } 
    let currentdate: Date = new Date(moment(new Date()).format("MM-DD-YYYY HH:mm"));
    if (!(InvoiceDate > PODate && InvoiceDate <= currentdate)) {
      this.alertService.error('The invoice date must be between PO Date and current datetime.!');
      return;
    }
    else if (this.obj.lstItem.filter(a => a.Qty > 0).length == 0) {
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

    this.obj.InvoiceNumber = this.invoiceform.controls['InvoiceNumber'].value;
    this.obj.InvoiceDate = this.invoiceform.controls['InvoiceDate'].value.startDate._d.toLocaleString();
    this.obj.VendorWarehouseID = this.invoiceform.controls['VendorWarehouseID'].value;
    this.obj.Remarks = this.invoiceform.controls['Remarks'].value;
    this.obj.LocationID = this.LocationID;
    this.obj.POID = this.POID;
    this.obj.lstItem = this.obj.lstItem.filter(a => a.Qty > 0);
    //

    this._invoiceService.upsert(this.obj).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          //
          this.alertService.success(data.Msg);
          this._router.navigate(['/Purchaselist']);
        }
        else {
          //
          this.alertService.error(data.Msg);
          this._router.navigate(['/Purchaselist']);
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
    this.obj.PurchaseID = this.identity;
    this.obj.InvoiceNumber = this.invoiceform.controls['InvoiceNumber'].value; 
    if (this.invoiceform.controls['InvoiceDate'].value.startDate._d != undefined) {
      this.obj.InvoiceDate = this.invoiceform.controls['InvoiceDate'].value.startDate._d.toLocaleString();
    } else {
      this.obj.InvoiceDate = this.invoiceform.controls['InvoiceDate'].value.startDate.toLocaleString();
    }

    this.obj.VendorWarehouseID = this.invoiceform.controls['VendorWarehouseID'].value;
    this.obj.Remarks = this.invoiceform.controls['Remarks'].value;
    this.obj.LocationID = this.LocationID;
    this.obj.POID = this.POID;
    this.obj.lstItem = this.obj.lstItem.filter(a => a.Qty > 0);
    //

    this._invoiceService.upsert(this.obj).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          //
          this.alertService.success(data.Msg);
          this._router.navigate(['/Purchaselist']);
        }
        else {
          //
          this.alertService.error(data.Msg);
          this._router.navigate(['/Purchaselist']);
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
