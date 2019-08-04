import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { Dropdown } from '../../_services/model';
import { GoodsReceipt, GoodsReceiptDetail, PONumber } from '../../_services/model/goodsreceipt.model';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { GoodsReceiptService } from '../../_services/service/goods-receipt.service';
import * as moment from 'moment';
@Component({
  selector: 'app-goods-receipt',
  templateUrl: './goods-receipt.component.html',
  styleUrls: ['./goods-receipt.component.css']
})
export class GoodsReceiptComponent implements OnInit {
  goodsForm: FormGroup;
  ItemDetails: FormArray;
  objGoodsReceipt: GoodsReceipt = new GoodsReceipt();
  inventoryTypes: Dropdown[] = [];
  poNumbers: PONumber[] = [];
  lstGoodsReceiptDetail: GoodsReceiptDetail[] = [];

  panelTitle: string = "Goods Receipts";
  LocationName: string = '';
  VendorName: string = '';
  PODate: Date;
  GRNMinDate: moment.Moment;
  GRNMaxDate: moment.Moment;
  action: boolean;
  identity: number = 0;
  poNumberList: string[] = [];
  lstPONumber: PONumber[] = [] as any;
  selectedRowIndex: number = -1;
  Searchaction: boolean = true;
  public itemFormGroup: FormGroup;
  constructor(
    private fb: FormBuilder,
    public _spinner: NgxSpinnerService,
    private _goodsReceiptService: GoodsReceiptService,
    private alertService: ToastrService,
    private _authorizationGuard: AuthorizationGuard,
    private _router: Router
  ) { }

  formErrors = {
    'GRNNumber': '',
    'PONumber': '',
    'InvoiceNumber': '',
    'LocationID': '',
    'VendorID': '',
    'GRNDate': '',
    'VehicleNumber': '',
    'InventoryType': '',
    'OtherReference': '',
    'VechicleNumber': '',
    'EwayBillNumber': '',
    'Remarks': '',
  }
  validationMessages = {
    'PONumber': {
      'required': 'This Field is required'
    },
    'InvoiceNumber': {
      'required': 'This Field is required'
    },
    'GRNDate': {
      'required': 'This Field is required',
    },
    'InventoryType': {
      'required': 'This Field is required',
    },
    'VechicleNumber': {
      'maxlength': 'Vehicle Number must be less than or equal to 15 charecters.'
    },
    'EwayBillNumber': {
      'maxlength': 'Eway Bill Number must be less than or equal to 20 charecters.',
    },
    'OtherReference': {
      'maxlength': 'Other Reference Number must be less than or equal to 30 charecters.',
    },
    'Remarks': {
      'maxlength': 'Remarks must be less than or equal to 250 charecters.',
    },
  }

  logValidationErrors(group: FormGroup = this.goodsForm): void {
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

    this.GRNMaxDate = moment().add(0, 'days');

    this.getGRNNumber();
    this.getPONumbers();
    this.getInventoryTypes();
    this.goodsForm = this.fb.group({
      PONumber: ['', [Validators.required]],
      InvoiceNumber: ['', [Validators.required,]],
      LocationID: [''],
      VendorID: [''],
      GRNDate: ['', [Validators.required]],
      InventoryType: ['', [Validators.required]],
      VehicleNumber: ['', []],
      EwayBillNumber: ['', []],
      OtherReference: ['', []],
      Remarks: ['', []],
    });
  }

  public getGRNNumber(): void {
    this._spinner.show();
    this._goodsReceiptService.getGRNNumber().subscribe(
      (res) => {
        this.objGoodsReceipt.GRNNumber = res;
        this._spinner.hide();
      }, (err) => {
        this._spinner.hide();
        console.log(err);
      });
  }

  public getPONumbers(): void {
    this._spinner.show();
    this._goodsReceiptService.getPONumbers().subscribe(
      (res) => {
        this.poNumbers = res;
        this.lstPONumber = res;
        this.poNumbers.forEach(obj => { this.poNumberList.push(obj.PONumber) });
        this._spinner.hide();
      }, (err) => {
        this._spinner.hide();
        console.log(err);
      });
  }
  // auto compelet controls
  formatter = (result: string) => result.toUpperCase();

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? []
        : this.poNumberList.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  public getInventoryTypes(): void {
    this._spinner.show();
    this._goodsReceiptService.getInventoryType().subscribe(
      (res) => {
        this.inventoryTypes = res;
        this._spinner.hide();
      }, (err) => {
        this._spinner.hide();
        console.log(err);
      });
  }

  public onPONumberChange(): void {
    let selectedPONumber = this.goodsForm.controls["PONumber"].value;
    this.goodsForm.controls["LocationID"].setValue(0);
    this.goodsForm.controls["VendorID"].setValue(0);
    this.lstGoodsReceiptDetail = [];
    if (selectedPONumber != "") {
      let poDetail = this.poNumbers.filter(x => { return x.PONumber == selectedPONumber })[0];
      if (poDetail != null) {
        this.LocationName = poDetail.LocationName;
        this.VendorName = poDetail.VendorName;
        this.PODate = poDetail.PODate;
        var Podatemom = moment(poDetail.PODate);
        var diff = Podatemom.diff(new Date());
        this.GRNMinDate = moment().add(diff, 'days');
        this.goodsForm.controls["LocationID"].setValue(poDetail.LocationID);
        this.goodsForm.controls["VendorID"].setValue(poDetail.VendorID);
        this._spinner.show();
        this._goodsReceiptService.getItems(poDetail.POID).subscribe(
          (res) => {
            this.lstGoodsReceiptDetail = res;
            this._spinner.hide();
          }, (err) => {
            this._spinner.hide();
            console.log(err);
          });
      }

    }
  }

  public onInventorySellableQtyChange(index, key, value: number): void {
    const AvailableQty = parseInt(this.lstGoodsReceiptDetail[index]['AvailableQty'].toString());
    const InventoryShortageQty = parseInt(this.lstGoodsReceiptDetail[index]['InventoryShortageQty'].toString());
    const InventoryDamageQty = parseInt(this.lstGoodsReceiptDetail[index]['InventoryDamageQty'].toString());
    const InventoryOthersQty = parseInt(this.lstGoodsReceiptDetail[index]['InventoryOthersQty'].toString());
    const editField = InventoryShortageQty + InventoryDamageQty + InventoryOthersQty + parseInt(value.toString());

    if (parseInt(value.toString()) < 0) {
      this.alertService.error('Entered Qty must be greater than or equal to zero.!');
      return;
    }
    else if (editField > AvailableQty) {
      this.alertService.error('Entered Qty must be less than or equal to sum of PO Qty.!');
      return;
    }
    else {
      this.lstGoodsReceiptDetail[index][key] = value;
      this.lstGoodsReceiptDetail[index].TotalReceivedQty = +this.lstGoodsReceiptDetail[index].InventorySellableQty
        + +this.lstGoodsReceiptDetail[index].InventoryShortageQty
        + +this.lstGoodsReceiptDetail[index].InventoryDamageQty
        + +this.lstGoodsReceiptDetail[index].InventoryOthersQty;
    }
  }

  public onInventoryShortageQtyChange(index, key, value: number): void {
    const AvailableQty = parseInt(this.lstGoodsReceiptDetail[index]['AvailableQty'].toString());
    const InventorySellableQty = parseInt(this.lstGoodsReceiptDetail[index]['InventorySellableQty'].toString());
    const InventoryDamageQty = parseInt(this.lstGoodsReceiptDetail[index]['InventoryDamageQty'].toString());
    const InventoryOthersQty = parseInt(this.lstGoodsReceiptDetail[index]['InventoryOthersQty'].toString());
    const editField = InventorySellableQty + InventoryDamageQty + InventoryOthersQty + parseInt(value.toString());

    if (parseInt(value.toString()) < 0) {
      this.alertService.error('Entered Qty must be greater than or equal to zero.!');
      return;
    }
    else if (editField > AvailableQty) {
      this.alertService.error('Entered Qty must be less than or equal to sum of PO Qty.!');
      return;
    }
    else {
      this.lstGoodsReceiptDetail[index][key] = value;
      this.lstGoodsReceiptDetail[index].TotalReceivedQty = +this.lstGoodsReceiptDetail[index].InventorySellableQty
        + +this.lstGoodsReceiptDetail[index].InventoryShortageQty
        + +this.lstGoodsReceiptDetail[index].InventoryDamageQty
        + +this.lstGoodsReceiptDetail[index].InventoryOthersQty;
    }
  }

  public onInventoryDamageQtyChange(index, key, value: number): void {
    const AvailableQty = parseInt(this.lstGoodsReceiptDetail[index]['AvailableQty'].toString());
    const InventorySellableQty = parseInt(this.lstGoodsReceiptDetail[index]['InventorySellableQty'].toString());
    const InventoryShortageQty = parseInt(this.lstGoodsReceiptDetail[index]['InventoryShortageQty'].toString());
    const InventoryOthersQty = parseInt(this.lstGoodsReceiptDetail[index]['InventoryOthersQty'].toString());
    const editField = InventoryShortageQty + InventorySellableQty + InventoryOthersQty + parseInt(value.toString());

    if (parseInt(value.toString()) < 0) {
      this.alertService.error('Entered Qty must be greater than or equal to zero.!');
      return;
    }
    else if (editField > AvailableQty) {
      this.alertService.error('Entered Qty must be less than or equal to sum of PO Qty.!');
      return;
    }
    else {
      this.lstGoodsReceiptDetail[index][key] = value;
      this.lstGoodsReceiptDetail[index].TotalReceivedQty = +this.lstGoodsReceiptDetail[index].InventorySellableQty
        + +this.lstGoodsReceiptDetail[index].InventoryShortageQty
        + +this.lstGoodsReceiptDetail[index].InventoryDamageQty
        + +this.lstGoodsReceiptDetail[index].InventoryOthersQty;
    }
  }

  public onInventoryOthersQtyChange(index, key, value: number): void {
    const AvailableQty = parseInt(this.lstGoodsReceiptDetail[index]['AvailableQty'].toString());
    const InventorySellableQty = parseInt(this.lstGoodsReceiptDetail[index]['InventorySellableQty'].toString());
    const InventoryShortageQty = parseInt(this.lstGoodsReceiptDetail[index]['InventoryShortageQty'].toString());
    const InventoryDamageQty = parseInt(this.lstGoodsReceiptDetail[index]['InventoryDamageQty'].toString());
    const editField = InventoryShortageQty + InventoryDamageQty + InventorySellableQty + parseInt(value.toString());

    if (parseInt(value.toString()) < 0) {
      this.alertService.error('Entered Qty must be greater than or equal to zero.!');
      return;
    }
    else if (editField > AvailableQty) {
      this.alertService.error('Entered Qty must be less than or equal to sum of PO Qty.!');
      return;
    }
    else {
      this.lstGoodsReceiptDetail[index][key] = value;
      this.lstGoodsReceiptDetail[index].TotalReceivedQty = +this.lstGoodsReceiptDetail[index].InventorySellableQty
        + +this.lstGoodsReceiptDetail[index].InventoryShortageQty
        + +this.lstGoodsReceiptDetail[index].InventoryDamageQty
        + +this.lstGoodsReceiptDetail[index].InventoryOthersQty;
    }
  }

  public onRemarksChange(index, key, value: string): void {
    if (value.length > 100) {
      this.alertService.error(key + " this value must be less than or equal to 100 characters!");
      return;
    }
    this.lstGoodsReceiptDetail[index][key] = value;
  }

  public saveData(): void {

    // stop here if form is invalid
    if (this.goodsForm.invalid) {
      return;
    }
    if (this._authorizationGuard.CheckAcess("Goodsreceiptlist", "ViewEdit")) {
      return;
    }
    if (this.lstGoodsReceiptDetail.filter(a => a.TotalReceivedQty > 0).length == 0) {
      this.alertService.error("Total Received Qty must be greater than 0 for atleast one item.!");
      return;
    }
    // else if (this.lstGoodsReceiptDetail.filter(a => a.InventorySellableQty <= 0).length >= 0) {
    //   this.alertService.error("Inventory Sellable Qty must be greater than or equal to 0.!");
    //   return;
    // }
    // else if (this.lstGoodsReceiptDetail.filter(a => a.InventoryShortageQty <= 0).length >= 0) {
    //   this.alertService.error("Inventory Shortage Qty must be greater than or equal to 0.!");
    //   return;
    // }
    // else if (this.lstGoodsReceiptDetail.filter(a => a.InventoryDamageQty <= 0).length >= 0) {
    //   this.alertService.error("Inventory  Damage Qty must be greater than or equal to 0.!");
    //   return;
    // }
    // else if (this.lstGoodsReceiptDetail.filter(a => a.InventoryOthersQty <= 0).length >= 0) {
    //   this.alertService.error("Inventory Others Qty must be greater than or equal to 0.!");
    //   return;
    // }
    this.objGoodsReceipt.ItemDetails = this.lstGoodsReceiptDetail;
    if (this.lstPONumber.filter(x => { return x.PONumber == this.goodsForm.controls['PONumber'].value }).length > 0) {
      this.objGoodsReceipt.POID = this.lstPONumber.filter(x => { return x.PONumber == this.goodsForm.controls['PONumber'].value })[0].POID;

      this.objGoodsReceipt.LocationID = this.goodsForm.controls["LocationID"].value;
      this.objGoodsReceipt.VendorID = this.goodsForm.controls["VendorID"].value;
    }
    else {
      this.alertService.error("Please select valid PO Number in the list.!");
      return;
    }
    this.objGoodsReceipt.InvoiceNumber = this.goodsForm.controls["InvoiceNumber"].value;
    //this.objGoodsReceipt.GRNDate = this.goodsForm.controls["GRNDate"].value.startDate._d.toLocalDateString();

    let GRNDate: Date = new Date(moment(new Date(this.goodsForm.controls['GRNDate'].value.startDate._d)).format("MM-DD-YYYY HH:mm"));
    this.objGoodsReceipt.GRNDate = GRNDate;
    this.objGoodsReceipt.VehicleNumber = this.goodsForm.controls["VehicleNumber"].value;
    this.objGoodsReceipt.EwayBillNumber = this.goodsForm.controls["EwayBillNumber"].value;
    this.objGoodsReceipt.InventoryType = this.goodsForm.controls["InventoryType"].value;
    this.objGoodsReceipt.OtherReference = this.goodsForm.controls["OtherReference"].value;
    this.objGoodsReceipt.Remarks = this.goodsForm.controls["Remarks"].value;
    this.insert();

  }

  insert(): void {
    this._spinner.show();
    this._goodsReceiptService.Insert(this.objGoodsReceipt).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          $('#modalgrnconfimation').modal('hide');
          this.alertService.success(data.Msg);
          this._router.navigate(['/Goodsreceiptlist']);
        }
        else {
          this.alertService.error(data.Msg);
          this._router.navigate(['/Goodsreceiptlist']);
        }
        this._spinner.hide();
        this.identity = 0;
      },
      (error: any) => {
        this._spinner.hide();
        console.log(error);
      }
    );
  }


}
