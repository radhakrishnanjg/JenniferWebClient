import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { Dropdown, Apisettings } from '../../_services/model';
import { GoodsReceipt, GoodsReceiptDetail, PONumber } from '../../_services/model/goodsreceipt.model';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { GoodsReceiptService } from '../../_services/service/goods-receipt.service';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { Location, Vendorwarehouse, Result } from '../../_services/model';
import { UsernameValidator } from '../../_validators/username';
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
  selectedFile1: File;
  selectedFile2: File;
  selectedFile3: File;
  selectedFile4: File;

  GRNType: string = '';
  TrackingNumber: string = '';

  locationList: Location[];
  Vendorwarehouselist: Vendorwarehouse[];
  VendorWarehouseID: number = 0;
  objResult: Result = {} as any;
  TotalPOQty: number = 0;
  TotalAvailableQty: number = 0;
  TotalInventorySellableQty: number = 0;
  TotalInventoryShortageQty: number = 0;
  TotalInventoryDamagedQty: number = 0;
  TotalInventoryOthersQty: number = 0;
  TotalTotalReceivedQty: number = 0;
  constructor(
    private fb: FormBuilder,

    private _goodsReceiptService: GoodsReceiptService,
    private alertService: ToastrService,
    private _authorizationGuard: AuthorizationGuard,
    private _privateutilityService: PrivateutilityService,
    private _router: Router,
    private usernameValidator: UsernameValidator,
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
    'FileData1': '',
    'FileData2': '',
  }
  validationMessages = {
    'PONumber': {
      'required': 'This Field is required'
    },
    'InvoiceNumber': {
      'required': 'This Field is required',
      'GRNInvoiceNumberInUse': 'This Value is already registered!',
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
    'FileData1': {
      'required': 'This Field is required',
    },
    'FileData2': {
      'required': 'This Field is required',
    },
    'LocationID': {
      'min': 'This Field is required.',
    },
    'VendorID': {
      'min': 'This Field is required.',
    },
  }

  logValidationErrors(group: FormGroup = this.goodsForm): void {
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
    this.objResult = new Result();
    this.objResult.Msg = '';
    this.objResult.Flag = true;
    this.GRNMinDate = moment().subtract(7, 'days');
    this.GRNMaxDate = moment().add(0, 'days');

    this.getGRNNumber();
    this.getPONumbers();
    this.getInventoryTypes();
    this.goodsForm = this.fb.group({
      PONumber: ['', [Validators.required]],
      InvoiceNumber: ['', [Validators.required,],
        this.usernameValidator.existGRNInvoiceNumber(this.identity)],
      LocationID: [0, [Validators.min(1)]],
      VendorID: [0, [Validators.min(1)]],
      GRNDate: ['', [Validators.required]],
      InventoryType: ['', [Validators.required]],
      VehicleNumber: ['', []],
      EwayBillNumber: ['', []],
      OtherReference: ['', []],
      Remarks: ['', []],
      FileData1: ['', [Validators.required]],
      FileData2: ['', [Validators.required]],
      FileData3: ['', []],
      FileData4: ['', []],
    });

    var GRNDate = moment(new Date(), 'YYYY-MM-DD[T]HH:mm').format('MM-DD-YYYY HH:mm').toString();
    this.goodsForm.patchValue({
      GRNDate: { startDate: new Date(GRNDate) },
    });
  }

  public getGRNNumber(): void {
    //
    this._goodsReceiptService.getGRNNumber().subscribe(
      (res) => {
        this.objGoodsReceipt.GRNNumber = res;
        //
      }, (err) => {
        //
        console.log(err);
      });
  }

  public getPONumbers(): void {
    //
    this._goodsReceiptService.getPONumbers().subscribe(
      (res) => {
        this.poNumbers = res;
        this.lstPONumber = res;
        // debugger
         this.poNumbers.forEach(obj => { this.poNumberList.push(obj.PONumber) });
        //
      }, (err) => {
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
        : this.poNumberList.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 1000))
    )

  public getInventoryTypes(): void {
    //
    this._goodsReceiptService.getInventoryType().subscribe(
      (res) => {
        this.inventoryTypes = res;
        //
      }, (err) => {
        //
        console.log(err);
      });
  }

  public onPONumberChange(): void {
    let selectedPONumber = this.goodsForm.controls["PONumber"].value;
    this.lstGoodsReceiptDetail = [];
    if (selectedPONumber != "") {
      let poDetail = this.poNumbers.filter(x => { return x.PONumber == selectedPONumber })[0];
      if (poDetail != null) {
        this.LocationName = poDetail.LocationName;
        this.VendorName = poDetail.VendorName;
        this.PODate = poDetail.PODate;
        this.GRNType = poDetail.GRNType;
        if (poDetail.GRNType == 'S') {
          this.TrackingNumber = poDetail.PONumber;
          this.getLocations();
          this.getVendorwarehouses();
        }
        else {

          this.TrackingNumber = '';
          this.goodsForm.controls["LocationID"].setValue(poDetail.LocationID);
          this.goodsForm.controls["VendorID"].setValue(poDetail.VendorID);
        }
        debugger
        if (poDetail.InventoryType != '') {
          this.goodsForm.controls["InventoryType"].setValue(poDetail.InventoryType);
          this.goodsForm.get('InventoryType').disable();
        }
        else {
          this.goodsForm.get('InventoryType').enable();
        }
        this.GRNMinDate = moment(poDetail.PODate).add(1, 'minutes');//moment().subtract(diff, 'days');
        //
        this._goodsReceiptService.getItems(poDetail.POID, this.GRNType, this.TrackingNumber).subscribe(
          (res) => {
            this.lstGoodsReceiptDetail = res;
            this.TotalPOQty = this.lstGoodsReceiptDetail.reduce((acc, a) => acc + a.POQTY, 0);
            this.TotalAvailableQty = this.lstGoodsReceiptDetail.reduce((acc, a) => acc + a.AvailableQty, 0);
            this.TotalInventorySellableQty = this.lstGoodsReceiptDetail.reduce((acc, a) => acc + a.InventorySellableQty, 0);
            this.TotalInventoryShortageQty = this.lstGoodsReceiptDetail.reduce((acc, a) => acc + a.InventoryShortageQty, 0);
            this.TotalInventoryDamagedQty = this.lstGoodsReceiptDetail.reduce((acc, a) => acc + a.InventoryDamageQty, 0);
            this.TotalInventoryOthersQty = this.lstGoodsReceiptDetail.reduce((acc, a) => acc + a.InventoryOthersQty, 0);
            this.TotalTotalReceivedQty = this.lstGoodsReceiptDetail.reduce((acc, a) => acc + a.TotalReceivedQty, 0);
            //
          }, (err) => {
            //
            console.log(err);
          });
      }

    }
  }

  //Get Locations
  public getLocations(): void {
    //
    this._privateutilityService.getSTOGRNLocation().subscribe(
      (data) => {
        this.locationList = data;
        //
      },
      (err) => {
        //
        console.log(err);
      }
    );
  }

  //Get Vendors
  public getVendorwarehouses(): void {
    //
    this._privateutilityService.getSTOGRNVendorWarehouse().subscribe(
      (res) => {
        this.Vendorwarehouselist = res;
        //
      }, (err) => {
        //
        console.log(err);
      });
  }

  public onInventorySellableQtyChange(index, key, value: number): void {
    const AvailableQty = parseInt(this.lstGoodsReceiptDetail[index]['AvailableQty'].toString());
    const InventoryShortageQty = parseInt(this.lstGoodsReceiptDetail[index]['InventoryShortageQty'].toString());
    const InventoryDamageQty = parseInt(this.lstGoodsReceiptDetail[index]['InventoryDamageQty'].toString());
    const InventoryOthersQty = parseInt(this.lstGoodsReceiptDetail[index]['InventoryOthersQty'].toString());
    const editField = InventoryShortageQty + InventoryDamageQty + InventoryOthersQty + parseInt(value.toString());
    const InventorySellableQty = parseInt(this.lstGoodsReceiptDetail[index]['InventorySellableQty'].toString());
    const ItemID = this.lstGoodsReceiptDetail[index]['ItemID'].toString();
    if (parseInt(value.toString()) < 0) {
      this.alertService.error('Entered Qty must be greater than or equal to zero.!');
      $('#i' + ItemID).val(InventorySellableQty);
      return;
    }
    else if (editField > AvailableQty) {
      this.alertService.error('Entered Qty must be less than or equal to sum of PO Qty.!');
      $('#i' + ItemID).val(InventorySellableQty);
      return;
    }
    else {
      this.lstGoodsReceiptDetail[index][key] = parseInt(value.toString());
      this.lstGoodsReceiptDetail[index].TotalReceivedQty = +this.lstGoodsReceiptDetail[index].InventorySellableQty
        + this.lstGoodsReceiptDetail[index].InventoryShortageQty
        + this.lstGoodsReceiptDetail[index].InventoryDamageQty
        + this.lstGoodsReceiptDetail[index].InventoryOthersQty;

      this.TotalPOQty = this.lstGoodsReceiptDetail.reduce((acc, a) => acc + a.POQTY, 0);
      this.TotalAvailableQty = this.lstGoodsReceiptDetail.reduce((acc, a) => acc + a.AvailableQty, 0);
      this.TotalInventorySellableQty = this.lstGoodsReceiptDetail.reduce((acc, a) => acc + a.InventorySellableQty, 0);
      this.TotalInventoryShortageQty = this.lstGoodsReceiptDetail.reduce((acc, a) => acc + a.InventoryShortageQty, 0);
      this.TotalInventoryDamagedQty = this.lstGoodsReceiptDetail.reduce((acc, a) => acc + a.InventoryDamageQty, 0);
      this.TotalInventoryOthersQty = this.lstGoodsReceiptDetail.reduce((acc, a) => acc + a.InventoryOthersQty, 0);
      this.TotalTotalReceivedQty = this.lstGoodsReceiptDetail.reduce((acc, a) => acc + a.TotalReceivedQty, 0);
    }
  }

  public onInventoryShortageQtyChange(index, key, value: number): void {
    const AvailableQty = parseInt(this.lstGoodsReceiptDetail[index]['AvailableQty'].toString());
    const InventorySellableQty = parseInt(this.lstGoodsReceiptDetail[index]['InventorySellableQty'].toString());
    const InventoryDamageQty = parseInt(this.lstGoodsReceiptDetail[index]['InventoryDamageQty'].toString());
    const InventoryOthersQty = parseInt(this.lstGoodsReceiptDetail[index]['InventoryOthersQty'].toString());
    const editField = InventorySellableQty + InventoryDamageQty + InventoryOthersQty + parseInt(value.toString());
    const InventoryShortageQty = parseInt(this.lstGoodsReceiptDetail[index]['InventoryShortageQty'].toString());
    const ItemID = this.lstGoodsReceiptDetail[index]['ItemID'].toString();
    if (parseInt(value.toString()) < 0) {
      this.alertService.error('Entered Qty must be greater than or equal to zero.!');
      $('#s' + ItemID).val(InventoryShortageQty);
      return;
    }
    else if (editField > AvailableQty) {
      this.alertService.error('Entered Qty must be less than or equal to sum of PO Qty.!');
      $('#s' + ItemID).val(InventoryShortageQty);
      return;
    }
    else {
      this.lstGoodsReceiptDetail[index][key] = parseInt(value.toString());
      this.lstGoodsReceiptDetail[index].TotalReceivedQty = +this.lstGoodsReceiptDetail[index].InventorySellableQty
        + this.lstGoodsReceiptDetail[index].InventoryShortageQty
        + this.lstGoodsReceiptDetail[index].InventoryDamageQty
        + this.lstGoodsReceiptDetail[index].InventoryOthersQty;

      this.TotalPOQty = this.lstGoodsReceiptDetail.reduce((acc, a) => acc + a.POQTY, 0);
      this.TotalAvailableQty = this.lstGoodsReceiptDetail.reduce((acc, a) => acc + a.AvailableQty, 0);
      this.TotalInventorySellableQty = this.lstGoodsReceiptDetail.reduce((acc, a) => acc + a.InventorySellableQty, 0);
      this.TotalInventoryShortageQty = this.lstGoodsReceiptDetail.reduce((acc, a) => acc + a.InventoryShortageQty, 0);
      this.TotalInventoryDamagedQty = this.lstGoodsReceiptDetail.reduce((acc, a) => acc + a.InventoryDamageQty, 0);
      this.TotalInventoryOthersQty = this.lstGoodsReceiptDetail.reduce((acc, a) => acc + a.InventoryOthersQty, 0);
      this.TotalTotalReceivedQty = this.lstGoodsReceiptDetail.reduce((acc, a) => acc + a.TotalReceivedQty, 0);
    }
  }

  public onInventoryDamageQtyChange(index, key, value: number): void {
    const AvailableQty = parseInt(this.lstGoodsReceiptDetail[index]['AvailableQty'].toString());
    const InventorySellableQty = parseInt(this.lstGoodsReceiptDetail[index]['InventorySellableQty'].toString());
    const InventoryShortageQty = parseInt(this.lstGoodsReceiptDetail[index]['InventoryShortageQty'].toString());
    const InventoryOthersQty = parseInt(this.lstGoodsReceiptDetail[index]['InventoryOthersQty'].toString());
    const editField = InventoryShortageQty + InventorySellableQty + InventoryOthersQty + parseInt(value.toString());
    const InventoryDamageQty = parseInt(this.lstGoodsReceiptDetail[index]['InventoryDamageQty'].toString());
    const ItemID = this.lstGoodsReceiptDetail[index]['ItemID'].toString();
    if (parseInt(value.toString()) < 0) {
      this.alertService.error('Entered Qty must be greater than or equal to zero.!');
      $('#d' + ItemID).val(InventoryDamageQty);
      return;
    }
    else if (editField > AvailableQty) {
      this.alertService.error('Entered Qty must be less than or equal to sum of PO Qty.!');
      $('#d' + ItemID).val(InventoryDamageQty);
      return;
    }
    else {
      this.lstGoodsReceiptDetail[index][key] = parseInt(value.toString());
      this.lstGoodsReceiptDetail[index].TotalReceivedQty = +this.lstGoodsReceiptDetail[index].InventorySellableQty
        + this.lstGoodsReceiptDetail[index].InventoryShortageQty
        + this.lstGoodsReceiptDetail[index].InventoryDamageQty
        + this.lstGoodsReceiptDetail[index].InventoryOthersQty;

      this.TotalPOQty = this.lstGoodsReceiptDetail.reduce((acc, a) => acc + a.POQTY, 0);
      this.TotalAvailableQty = this.lstGoodsReceiptDetail.reduce((acc, a) => acc + a.AvailableQty, 0);
      this.TotalInventorySellableQty = this.lstGoodsReceiptDetail.reduce((acc, a) => acc + a.InventorySellableQty, 0);
      this.TotalInventoryShortageQty = this.lstGoodsReceiptDetail.reduce((acc, a) => acc + a.InventoryShortageQty, 0);
      this.TotalInventoryDamagedQty = this.lstGoodsReceiptDetail.reduce((acc, a) => acc + a.InventoryDamageQty, 0);
      this.TotalInventoryOthersQty = this.lstGoodsReceiptDetail.reduce((acc, a) => acc + a.InventoryOthersQty, 0);
      this.TotalTotalReceivedQty = this.lstGoodsReceiptDetail.reduce((acc, a) => acc + a.TotalReceivedQty, 0);
    }
  }

  public onInventoryOthersQtyChange(index, key, value: number): void {
    const AvailableQty = parseInt(this.lstGoodsReceiptDetail[index]['AvailableQty'].toString());
    const InventorySellableQty = parseInt(this.lstGoodsReceiptDetail[index]['InventorySellableQty'].toString());
    const InventoryShortageQty = parseInt(this.lstGoodsReceiptDetail[index]['InventoryShortageQty'].toString());
    const InventoryDamageQty = parseInt(this.lstGoodsReceiptDetail[index]['InventoryDamageQty'].toString());
    const editField = InventoryShortageQty + InventoryDamageQty + InventorySellableQty + parseInt(value.toString());
    const InventoryOthersQty = parseInt(this.lstGoodsReceiptDetail[index]['InventoryOthersQty'].toString());
    const ItemID = this.lstGoodsReceiptDetail[index]['ItemID'].toString();
    if (parseInt(value.toString()) < 0) {
      this.alertService.error('Entered Qty must be greater than or equal to zero.!');
      $('#o' + ItemID).val(InventoryOthersQty);
      return;
    }
    else if (editField > AvailableQty) {
      this.alertService.error('Entered Qty must be less than or equal to sum of PO Qty.!');
      $('#o' + ItemID).val(InventoryOthersQty);
      return;
    }
    else {
      this.lstGoodsReceiptDetail[index][key] = parseInt(value.toString());
      this.lstGoodsReceiptDetail[index].TotalReceivedQty = +this.lstGoodsReceiptDetail[index].InventorySellableQty
        + this.lstGoodsReceiptDetail[index].InventoryShortageQty
        + this.lstGoodsReceiptDetail[index].InventoryDamageQty
        + this.lstGoodsReceiptDetail[index].InventoryOthersQty;

      this.TotalPOQty = this.lstGoodsReceiptDetail.reduce((acc, a) => acc + a.POQTY, 0);
      this.TotalAvailableQty = this.lstGoodsReceiptDetail.reduce((acc, a) => acc + a.AvailableQty, 0);
      this.TotalInventorySellableQty = this.lstGoodsReceiptDetail.reduce((acc, a) => acc + a.InventorySellableQty, 0);
      this.TotalInventoryShortageQty = this.lstGoodsReceiptDetail.reduce((acc, a) => acc + a.InventoryShortageQty, 0);
      this.TotalInventoryDamagedQty = this.lstGoodsReceiptDetail.reduce((acc, a) => acc + a.InventoryDamageQty, 0);
      this.TotalInventoryOthersQty = this.lstGoodsReceiptDetail.reduce((acc, a) => acc + a.InventoryOthersQty, 0);
      this.TotalTotalReceivedQty = this.lstGoodsReceiptDetail.reduce((acc, a) => acc + a.TotalReceivedQty, 0);
    }
  }

  public onRemarksChange(index, key, value: string): void {
    if (value.length > 100) {
      this.alertService.error(key + " this value must be less than or equal to 100 characters!");
      return;
    }
    this.lstGoodsReceiptDetail[index][key] = value;
  }

  onFileChanged1(e: any) {
    this.selectedFile1 = e.target.files[0];
  }

  onFileChanged2(e: any) {
    this.selectedFile2 = e.target.files[0];
  }

  onFileChanged3(e: any) {
    this.selectedFile3 = e.target.files[0];
  }

  onFileChanged4(e: any) {
    this.selectedFile4 = e.target.files[0];
  }


  onSTODateChange(range) {
    if (this.GRNType == 'S') {
      if (this.goodsForm.controls['GRNDate'].value.startDate == null ||
        this.goodsForm.controls['GRNDate'].value.startDate == undefined) {
        this.alertService.error("Please enter GRN date!.");
        return;
      }
      let STODate = this.goodsForm.controls['GRNDate'].value.startDate._d.toLocaleString();
      //
      this._privateutilityService.getCheckSTODateValidation(STODate).subscribe(
        (res) => {
          this.objResult = res;
          //
        }, (err) => {
          //
          console.log(err);
        });
    }
    else {
      this.objResult = new Result();
      this.objResult.Msg = '';
      this.objResult.Flag = true;
    }
  }

  public saveData(): void {
    if (this._authorizationGuard.CheckAcess("Goodsreceiptlist", "ViewEdit")) {
      return;
    }
    // stop here if form is invalid
    if (this.goodsForm.invalid) {
      return;
    }
    if (this.selectedFile1 != null) {
      var filesizeMB1 = Math.round(this.selectedFile1.size / 1024 / 1024);
      var fileexte1 = this.selectedFile1.name.split('.').pop();
      if (!this.isInArray(Apisettings.IMGFiles_Ext, fileexte1)) {
        this.alertService.error("File 1 must be extension with " + Apisettings.IMGFiles_Ext);
        return;
      }
      else if (filesizeMB1 > parseInt(Apisettings.IMGFiles_Fileszie.toString().toString())) {
        this.alertService.error("File 1 size must be less than or equal to " + parseInt(Apisettings.IMGFiles_Fileszie.toString()) + " MB.!");
        return;
      }
    }

    if (this.selectedFile2 != null) {
      var filesizeMB2 = Math.round(this.selectedFile2.size / 1024 / 1024);
      var fileexte2 = this.selectedFile2.name.split('.').pop();
      if (!this.isInArray(Apisettings.IMGFiles_Ext, fileexte2)) {
        this.alertService.error("File 2 must be extension with " + Apisettings.IMGFiles_Ext);
        return;
      }
      else if (filesizeMB2 > parseInt(Apisettings.IMGFiles_Fileszie.toString())) {
        this.alertService.error("File 2 size must be less than or equal to " + parseInt(Apisettings.IMGFiles_Fileszie.toString()) + " MB.!");
        return;
      }
    }

    if (this.selectedFile3 != null) {
      var filesizeMB3 = Math.round(this.selectedFile3.size / 1024 / 1024);
      var fileexte3 = this.selectedFile3.name.split('.').pop();
      if (!this.isInArray(Apisettings.IMGFiles_Ext, fileexte3)) {
        this.alertService.error("File 3 must be extension with " + Apisettings.IMGFiles_Ext);
        return;
      }
      else if (filesizeMB3 > parseInt(Apisettings.IMGFiles_Fileszie.toString())) {
        this.alertService.error("File 3 size must be less than or equal to " + parseInt(Apisettings.IMGFiles_Fileszie.toString()) + " MB.!");
        return;
      }
    }

    if (this.selectedFile4 != null) {
      var filesizeMB4 = Math.round(this.selectedFile4.size / 1024 / 1024);
      var fileexte4 = this.selectedFile4.name.split('.').pop();
      if (!this.isInArray(Apisettings.IMGFiles_Ext, fileexte4)) {
        this.alertService.error("File 4 must be extension with " + Apisettings.IMGFiles_Ext);
        return;
      }
      else if (filesizeMB4 > parseInt(Apisettings.IMGFiles_Fileszie.toString())) {
        this.alertService.error("File 4 size must be less than or equal to " + parseInt(Apisettings.IMGFiles_Fileszie.toString()) + " MB.!");
        return;
      }
    }
    if (this._authorizationGuard.CheckAcess("Goodsreceiptlist", "ViewEdit")) {
      return;
    }
    if (this.lstGoodsReceiptDetail.filter(a => a.TotalReceivedQty > 0).length == 0) {
      this.alertService.error("Total Received Qty must be greater than 0 for atleast one item.!");
      return;
    }
    this.objGoodsReceipt.ItemDetails = this.lstGoodsReceiptDetail;
    if (this.lstPONumber.filter(x => { return x.PONumber == this.goodsForm.controls['PONumber'].value }).length > 0) {
      this.objGoodsReceipt.POID = this.lstPONumber.filter(x => { return x.PONumber == this.goodsForm.controls['PONumber'].value })[0].POID;
      this.objGoodsReceipt.LocationID = this.goodsForm.controls["LocationID"].value;
      if (this.GRNType == 'P') {
        this.objGoodsReceipt.VendorID = this.goodsForm.controls["VendorID"].value;
      } else {
        this.objGoodsReceipt.VendorWarehouseID = this.goodsForm.controls["VendorID"].value;
        this.objGoodsReceipt.VendorID =
          this.Vendorwarehouselist.filter(x => { return x.VendorWarehouseID == this.goodsForm.controls['VendorID'].value })[0].VendorID;

      }
      this.objGoodsReceipt.TrackingNumber = this.TrackingNumber;
      this.objGoodsReceipt.GRNType = this.GRNType;
    }
    else {
      this.alertService.error("Please select valid PO Number in the list.!");
      return;
    }
    if (this.GRNType == 'S') {
      if (this.TotalPOQty != this.TotalTotalReceivedQty) {
        this.alertService.error("The sum of PO Qty and sum of Total Received Qty must be same to proceed further.!");
        return;
      }
    }
    this.objGoodsReceipt.InvoiceNumber = this.goodsForm.controls["InvoiceNumber"].value;
    if (this.goodsForm.controls['GRNDate'].value.startDate._d != undefined) {
      this.objGoodsReceipt.GRNDate = this.goodsForm.controls['GRNDate'].value.startDate._d.toLocaleString();

    } else {
      this.objGoodsReceipt.GRNDate = this.goodsForm.controls['GRNDate'].value.startDate.toLocaleString();
    }
    let GRN_Date = new Date(moment(new Date(this.objGoodsReceipt.GRNDate)).format("MM-DD-YYYY HH:mm"));
    let currentdate: Date = new Date(moment(new Date()).format("MM-DD-YYYY HH:mm"));
    let PODate: Date = new Date(moment(new Date(this.lstPONumber.filter(x => { return x.PONumber == this.goodsForm.controls['PONumber'].value })[0].PODate)).format("MM-DD-YYYY HH:mm"));
    if (!(GRN_Date > PODate && GRN_Date <= currentdate)) {
      this.alertService.error('The GRN Date must be between PO Date and current datetime.!');
      return;
    }
    this.objGoodsReceipt.VehicleNumber = this.goodsForm.controls["VehicleNumber"].value;
    this.objGoodsReceipt.EwayBillNumber = this.goodsForm.controls["EwayBillNumber"].value;
    this.objGoodsReceipt.InventoryType = this.goodsForm.controls["InventoryType"].value;
    this.objGoodsReceipt.OtherReference = this.goodsForm.controls["OtherReference"].value;
    this.objGoodsReceipt.Remarks = this.goodsForm.controls["Remarks"].value;
    this.insert();

  }


  insert(): void {
    //
    this._goodsReceiptService.Insert(this.objGoodsReceipt).subscribe(
      (data) => {
        $('#modalgrnconfimation').modal('hide');
        if (data != null && data.Flag == true) {
          //
          this._goodsReceiptService.updateImage(
            this.selectedFile1, this.selectedFile2, this.selectedFile3, this.selectedFile4,
            this.objGoodsReceipt.GRNNumber).subscribe(
              (data1) => {
                if (data1 && data1 == true) {
                  this.alertService.success(data.Msg);
                }
                else {
                  this.alertService.error(data.Msg);
                }
                //
                this._router.navigate(['/Goodsreceiptlist']);
              },
              (error: any) => {
                //
                console.log(error);
              }
            )
        }
        else {
          this.alertService.error(data.Msg);
          this._router.navigate(['/Goodsreceiptlist']);
        }
        //
        this.identity = 0;
      },
      (error: any) => {
        //
        console.log(error);
      }
    );
  }

  isInArray(array, word) {
    return array.indexOf(word.toLowerCase()) > -1;
  }
}
