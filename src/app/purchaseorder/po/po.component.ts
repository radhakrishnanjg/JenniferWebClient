import { Component, OnInit } from '@angular/core';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { PoService } from '../../_services/service/po.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { isNumeric } from "rxjs/util/isNumeric"
import {
  Poorder, Location, Vendor, Brand, ProductGroup, Category, SubCategory,
  Item, UOM, Poorderitem, Apisettings, Dropdown, Vendorwarehouse
} from '../../_services/model';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

import { MasteruploadService } from 'src/app/_services/service/masterupload.service';
import { InvoiceService } from 'src/app/_services/service/invoice.service';
const createFormGroup = dataItem => new FormGroup({
  'ItemCode': new FormControl(dataItem.ItemID),
  'ItemName': new FormControl(dataItem.ItemName),
  'VendorItemCode': new FormControl(dataItem.VendorItemCode),
  'CaseSize': new FormControl(dataItem.CaseSize,
    [Validators.required, Validators.min(1), Validators.max(1000000), Validators.pattern("^([0-9]+)$")]),
  'UOM': new FormControl(dataItem.UOMID, [Validators.required, Validators.min(1),]),
  'Rate': new FormControl(dataItem.Rate, [Validators.required, Validators.min(0.01), Validators.max(999999999), Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")]),
  'TaxRate': new FormControl(dataItem.TaxRate),
  'DirectCost': new FormControl(dataItem.DirectCost),
  'TaxAmount': new FormControl(dataItem.TaxAmount),
  'TotalAmount': new FormControl(dataItem.TotalAmount, [Validators.required, Validators.min(0.01), Validators.max(999999999),])
});

@Component({
  selector: 'app-po',
  templateUrl: './po.component.html',
  styleUrls: ['./po.component.css']
})
export class PoComponent implements OnInit {
  poMinDate: moment.Moment;
  poMaxDate: moment.Moment;
  poDeliveryMinDate: moment.Moment;
  poDeliveryMaxDate: moment.Moment;
  poOrderList: Poorder[] = [];
  brandList: Brand[];
  productGroups: ProductGroup[];
  categoryList: Category[];
  subCategoryList: SubCategory[];
  itemList: Item[] = [];
  uomList: UOM[];
  itemDescription: string = '';
  vendorItemCode: string = '';
  poOrder: Poorder = new Poorder();
  poOrderItem: Poorderitem = new Poorderitem();
  selectedRowIndex: number = -1;
  itemDetail: Item = new Item();
  uom: UOM = new UOM();
  locationList: Location[];
  vendorList: Vendor[];
  rateFieldDisabled: boolean;
  totalAmountFieldDisabled: boolean;
  poForm: FormGroup;
  selectedVendor: {};
  dtOptions: DataTables.Settings = {};
  panelTitle: string = "Add New PO";
  poDate: { startDate: moment.Moment, endDate: moment.Moment };

  TotalQty: number = 0.00;
  TotalTotalAmount: number = 0.00;
  //KendoUI Grid
  public gridData: any[];
  public itemFormGroup: FormGroup;
  private editedRowIndex: number;

  constructor(
    private _poService: PoService,
    private _PrivateutilityService: PrivateutilityService,

    public _alertService: ToastrService,
    private activatedroute: ActivatedRoute,
    private _authorizationGuard: AuthorizationGuard,
    private router: Router,
    private fb: FormBuilder,
    public _masteruploadService: MasteruploadService,
    private _invoiceService: InvoiceService,

  ) {
    this.poOrder.lstItem = [];
    this.poOrder.lstApproval = [];
    this.rateFieldDisabled = false;
    this.totalAmountFieldDisabled = false;

    console.log(this.poOrder.PODate);
  }

  formErrors = {
    'PODate': '',
    'PODeliveryDate': '',
    'LocationID': '',
    'VendorID': '',
    'OtherReference': '',
    'AgainstReference': '',
    'PaymentReference': '',
    'Remarks': '',
    'CaseSize': '',
    'UOM': '',
    'Rate': '',
    'TotalAmount': '',
    'CurrencyType': '',
    'VendorWarehouseID': '',
  };

  validationMessages = {
    'PODate': {
      'required': 'This Field is required.',
      'invalidDate': 'This Field must be date format(MM-DD-YYYY HH:mm).',
    },
    'PODeliveryDate': {
      'required': 'This Field is required.',
      'invalidDate': 'This Field must be date format(MM-DD-YYYY HH:mm).',
    },
    'LocationID': {
      'min': 'This Field is required.',
    },
    'VendorID': {
      'min': 'This Field is required.',
    },
    'OtherReference': {
      'required': 'This Field is required.',
      'minlength': 'This Field must be greater than 3 characters.',
      'maxlength': 'This Field must be less than 50 characters.'
    },
    'AgainstReference': {
      'minlength': 'This Field must be greater than 3 characters.',
      'maxlength': 'This Field must be less than 50 characters.'
    },
    'PaymentReference': {
      'minlength': 'This Field must be greater than 3 characters.',
      'maxlength': 'This Field must be less than 50 characters.'
    },
    'Remarks': {
      'minlength': 'This Field must be greater than 3 characters.',
      'maxlength': 'This Field must be less than 250 characters.'
    },
    'CurrencyType': {
      'required': 'This Field is required.',
    },
    'VendorWarehouseID': {
      'min': 'This Field is required.',
    },
  };

  logValidationErrors(group: FormGroup = this.poForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      this.formErrors[key] = '';
      if (abstractControl && !abstractControl.valid
        && (abstractControl.touched || abstractControl.dirty)) {
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

    this.poForm = this.fb.group({
      PODate: ['', [Validators.required]],
      PODeliveryDate: ['', [Validators.required]],
      LocationID: [0, [Validators.min(1)]],
      VendorID: [0, [Validators.min(1)]],
      IsShipmentRequired: ['', []],
      IsEventPurchase: ['', []],

      OtherReference: ['', [Validators.required]],
      AgainstReference: ['', []],
      PaymentReference: ['', []],
      Remarks: ['', []],
      CurrencyType: ['INR', [Validators.required]],
      VendorWarehouseID: [0, [Validators.min(1)]],
    });

    this.getCurrentServerDateTime();
    this.gridData = this.poOrder.lstItem;
    this.getUOMs();
    this.GetCurrencyType();
    var end = moment().endOf('day');
    var currentend = new Date();
    var differ = end.diff(currentend, 'minutes');
    this.poMaxDate = moment().add(differ, 'minutes');
    this.poDeliveryMaxDate = moment().add(1, 'years');

    this.activatedroute.paramMap.subscribe(params => {
      let queryString = +params.get('id');
      if (queryString != null && queryString != undefined && queryString > 0) {
        this.editPO(queryString);
      } else {
        this.poOrder.LocationID = 0;
        this.poOrder.VendorID = 0;
        this.poOrder.POID = 0;
        this.getLocations();
        this.getVendors();
      }
    });
  }

  private getCurrentServerDateTime() {
    this._PrivateutilityService.getCurrentDate()
      .subscribe(
        (data: Date) => {
          var mcurrentDate = moment(data, 'YYYY-MM-DD[T]HH:mm').format('MM-DD-YYYY HH:mm').toString();
          this.poForm.patchValue({
            PODate: { startDate: new Date(mcurrentDate) },
            PODeliveryDate: { startDate: new Date(mcurrentDate) },
          });
          this.poMinDate = moment(data).subtract(7, 'days');
          this.poDeliveryMinDate = moment(data).add(0, 'days');
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  private editPO(poID): void {
    this.poOrder.POID = poID;
    this.panelTitle = "Update PO";
    this._poService.searchById(poID)
      .subscribe(
        (data: Poorder) => {
          this.getLocations();
          this.getVendors();
          this.poOrder = data;

          this.poForm.get('IsShipmentRequired').disable();
          this.gridData = this.poOrder.lstItem;
          this.TotalQty = this.gridData.reduce((acc, a) => acc + a.Qty, 0);
          this.TotalTotalAmount = this.gridData.reduce((acc, a) => acc + a.TotalAmount, 0);
          var PODate = moment(data.PODate, 'YYYY-MM-DD[T]HH:mm').format('MM-DD-YYYY HH:mm').toString();
          var PODeliveryDate = moment(data.PODeliveryDate, 'YYYY-MM-DD[T]HH:mm').format('MM-DD-YYYY HH:mm').toString();
          var VendorID = data.VendorID.toString();
          var LocationID = data.LocationID.toString();
          var VendorWarehouseID = data.VendorWarehouseID.toString();
          this.poForm.patchValue({
            PONumber: data.PONumber,
            PODate: { startDate: new Date(PODate) },
            PODeliveryDate: { startDate: new Date(PODeliveryDate) },
            LocationID: LocationID,
            VendorID: VendorID,
            IsEventPurchase: data.IsEventPurchase,
            IsShipmentRequired: data.IsShipmentRequired,
            OtherReference: data.OtherReference,
            AgainstReference: data.AgainstReference,
            PaymentReference: data.PaymentReference,
            Remarks: data.Remarks,
            CurrencyType: data.CurrencyType,
            VendorWarehouseID:VendorWarehouseID
          });
          this.onVendorChanged(this.poOrder.VendorID); 
          this.onVendorChangedforwarehouse(this.poOrder.VendorID);
          this.DisbableShipmentCheckbox(data.LocationID);
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  //Get PurchaseOrder Number
  public onLocationChange(locationID): void {
    this.poOrder.LocationID = locationID;
    if (locationID > 0) {
      this.DisbableShipmentCheckbox(locationID);
      this._poService.getPONumber(locationID).subscribe(
        (res) => {
          this.poOrder.PONumber = res;
        }, (err) => {
          console.log(err);
        });

    }
  }
  //disble shipment checkbox for is 
  private DisbableShipmentCheckbox(locationID: number) {
    if (this.locationList.filter(a => a.LocationID == locationID)[0].IsInvoicing) {
      this.poForm.patchValue(
        {
          IsShipmentRequired: false,
        })
      this.poForm.get('IsShipmentRequired').disable();
    }
    else {
      this.poForm.get('IsShipmentRequired').enable();
    }
  }
  lstCurrencyType: Dropdown[] = [] as any;
  public GetCurrencyType(): void {
    this._PrivateutilityService.GetValues('CurrencyType')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstCurrencyType = data;
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  //Get Locations
  public getLocations(): void {
    this._PrivateutilityService.getLocations().subscribe(
      (data) => {
        this.locationList = data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  //Get Vendors
  public getVendors(): void {
    //
    this._PrivateutilityService.getVendors().subscribe(
      (res) => {
        this.vendorList = res;
      }, (err) => {
        console.log(err);
      });
  }

  //Get Brands
  public getBrands(): void {
    this._poService.getOrderBrands().subscribe(
      (res) => {
        this.brandList = res;
      }, (err) => {
        console.log(err);
      });
  }

  //Get Product Groups
  public getProductGroups(brandID: number): void {
    this._poService.getOrderProductGroups(brandID).subscribe(
      (res) => {
        this.productGroups = res;
      }, (err) => {
        console.log(err);
      });
  }

  // Get Category List
  public getCategories(brandID: number, productGroupdID: number): void {
    //
    this._poService.getOrderCategories(brandID, productGroupdID).subscribe(
      (res) => {
        this.categoryList = res;
      }, (err) => {
        console.log(err);
      });
  }

  // Get SubCategory List
  public getSubCategories(brandID: number, categoryID: number): void {
    this._poService.getOrderSubCategories(brandID, categoryID).subscribe(
      (res) => {
        this.subCategoryList = res;
      }, (err) => {
        console.log(err);
      });
  }
  // Get Item List
  public onVendorChanged(vendorID: number): void {
    if (vendorID > 0) {
      this._poService.getVendorItemLevels(vendorID).subscribe(
        (res) => {
          if (res != null) {
            this.itemList = res.filter(e => { return e.Type == "Item" });
          }
        }, (err) => {
          this.itemList = [];
          console.log(err);
        }); 
    }
  }

  // Get Item Description
  public getItemDescription(itemID): void {
    const index = this.poOrder.lstItem.findIndex(({ ItemID }) => ItemID === itemID);
    if (index >= 0 && index != this.editedRowIndex) {
      this._alertService.error("Item already added.");
      return;
    }

    this.itemDetail = this.itemList.filter(a => { return a.ItemID == itemID })[0];
    this.itemFormGroup.patchValue(
      {
        ItemCode: this.itemDetail.ItemCode,
        ItemName: this.itemDetail.ItemName,
        VendorItemCode: this.itemDetail.VendorItemCode,
        TaxRate: this.itemDetail.TaxRate
      });
    this.poOrderItem.ItemID = itemID;
  }

  // Get Item Description
  public getUOMs(): void {
    this._poService.getOrderUOMs().subscribe(
      (res) => {
        this.uomList = res;
      }, (err) => {
        console.log(err);
      });
  }


  //DirectCost, TaxAmount, TotalAmount calculation while CaseSize value entered
  public onCaseSizeChanged(CaseSize: number): void {
    if (isNaN(CaseSize) || CaseSize < 0) {
      this._alertService.error("The value must greater or equal to Zero.!");
      return;
    }
    else {
      let uomid = this.itemFormGroup.get("UOM").value == null ? 1 : this.itemFormGroup.get("UOM").value;
      let uom = this.uomList.filter(x => { return x.UOMID == uomid })[0];
      this.poOrderItem.MultiplierValue = uom.MultiplierValue;
      this.poOrderItem.Qty = CaseSize * this.poOrderItem.MultiplierValue
      this.poOrderItem.CaseSize = CaseSize;
      let Rate = this.itemFormGroup.get("Rate").value;
      let TaxRate = this.itemFormGroup.get("TaxRate").value;
      let DirectCost = Rate * CaseSize * this.poOrderItem.MultiplierValue;
      let TaxAmount = DirectCost * (TaxRate / 100);
      let TotalAmount = DirectCost + TaxAmount;
      this.itemFormGroup.patchValue(
        {
          DirectCost: Number(DirectCost.toFixed(2)),
          TaxAmount: Number(TaxAmount.toFixed(2)),
          TotalAmount: Number(TotalAmount.toFixed(2))
        })
    }
  }

  public onUOMChanged(UOMID): void {
    let uom = this.uomList.filter(x => { return x.UOMID == UOMID })[0];
    this.poOrderItem.MultiplierValue = uom.MultiplierValue;
    let CaseSize = this.itemFormGroup.get("CaseSize").value;
    this.poOrderItem.Qty = CaseSize * this.poOrderItem.MultiplierValue
    this.onCaseSizeChanged(CaseSize);
  }



  //DirectCost, TaxAmount, TotalAmount calculation while rate value entered
  public onRateChanged(Rate: number): void {
    if (isNaN(Rate) || Rate < 0) {
      this._alertService.error("The value must greater than Zero.!");
      return;
    }
    else {
      let CaseSize = this.itemFormGroup.get("CaseSize").value;
      let TaxRate = this.itemFormGroup.get("TaxRate").value;
      let DirectCost = Rate * CaseSize * this.poOrderItem.MultiplierValue;
      let TaxAmount = (DirectCost * (TaxRate / 100));
      let TotalAmount = DirectCost + TaxAmount;
      this.itemFormGroup.patchValue(
        {
          DirectCost: Number(DirectCost.toFixed(2)),
          TaxAmount: Number(TaxAmount.toFixed(2)),
          TotalAmount: Number(TotalAmount.toFixed(2))
        })
    }
  }

  //DirectCost, TaxAmount, Rate calculation while TotalAmount value entered
  public onTotalAmountChanged(TotalAmount): void {
    if (isNaN(TotalAmount) || TotalAmount < 0) {
      this._alertService.error("The value must greater than Zero.!");
      return;
    }
    else {
      let CaseSize = this.itemFormGroup.get("CaseSize").value;
      let TaxRate = this.itemFormGroup.get("TaxRate").value;
      let DirectCost = TotalAmount / (1 + TaxRate / 100);
      let TaxAmount = TotalAmount - DirectCost;
      let Rate = (DirectCost / (CaseSize * this.poOrderItem.MultiplierValue));

      this.itemFormGroup.patchValue(
        {
          DirectCost: Number(DirectCost.toFixed(2)),
          TaxAmount: Number(TaxAmount.toFixed(2)),
          Rate: Number(Rate.toFixed(2))
        })
    }
  }
  lstVendorwarehouse: Vendorwarehouse[] = [] as any;
  public onVendorChangedforwarehouse(VendorID: number) {
    this._invoiceService.getVendorWarehouses(VendorID)
      .subscribe(
        (data: Vendorwarehouse[]) => {
          this.lstVendorwarehouse = data;
        },
        (err: any) => {
          console.log(err);
        }
      );
  }
  //submit POOrder
  public saveData(): void {

    if (this._authorizationGuard.CheckAcess("Polist", "ViewEdit")) {
      return;
    }
    if (this.poForm.invalid) {
      return;
    }
    if (this.poOrder.PONumber == null || this.poOrder.PONumber == "") {
      this._alertService.error("PO Number required");
      return;
    }
    if (this.poOrder.lstItem == null || this.poOrder.lstItem.length == 0) {
      this._alertService.error("Order Item required");
      return;
    }
    if (this.poForm.controls['PODate'].value.startDate._d != undefined) {
      this.poOrder.PODate = this.poForm.controls['PODate'].value.startDate._d.toLocaleString();
    } else {
      this.poOrder.PODate = this.poForm.controls['PODate'].value.startDate.toLocaleString();
    }
    if (this.poForm.controls['PODeliveryDate'].value.startDate._d != undefined) {
      this.poOrder.PODeliveryDate = this.poForm.controls['PODeliveryDate'].value.startDate._d.toLocaleString();
    } else {
      this.poOrder.PODeliveryDate = this.poForm.controls['PODeliveryDate'].value.startDate.toLocaleString();
    }
    let PODate = new Date(moment(new Date(this.poOrder.PODate)).format("MM-DD-YYYY HH:mm"));
    let PODeliveryDate = new Date(moment(new Date(this.poOrder.PODeliveryDate)).format("MM-DD-YYYY HH:mm"));
    if (PODate > PODeliveryDate) {
      this._alertService.error('The PO Delivery Date must be greater than or equal to the PODate!');
      return;
    }

    this.poOrder.LocationID = this.poForm.controls['LocationID'].value;
    this.poOrder.VendorID = this.poForm.controls['VendorID'].value;
    this.poOrder.IsEventPurchase = this.poForm.controls['IsEventPurchase'].value;
    this.poOrder.IsShipmentRequired = this.poForm.controls['IsShipmentRequired'].value;
    this.poOrder.OtherReference = this.poForm.controls['OtherReference'].value;
    this.poOrder.AgainstReference = this.poForm.controls['AgainstReference'].value;
    this.poOrder.PaymentReference = this.poForm.controls['PaymentReference'].value;
    this.poOrder.Remarks = this.poForm.controls['Remarks'].value;
    this.poOrder.CurrencyType = this.poForm.controls['CurrencyType'].value;
    this.poOrder.VendorWarehouseID = this.poForm.controls['VendorWarehouseID'].value;
    if (this.poOrder.POID > 0) {
      this.Update();

    } else {
      this.Insert();
    }
  }

  Insert() {
    this._poService.InsertOrUpdate(this.poOrder).subscribe(
      (res) => {
        if (res.Flag) {
          this._poService.UpdateFile(
            this.SelectedFiles, this.poOrder.PONumber).subscribe(
              (data1) => {
                this.poOrder = new Poorder();
                this.itemDetail = new Item();
                this.uom = new UOM();
                this.poOrder.lstItem = [];
                this.gridData = this.poOrder.lstItem;
              },
              (error: any) => {
                console.log(error);
              }
            )
          this._alertService.success(res.Msg);
          this.router.navigate(['/Polist']);
        }
        else {
          this._alertService.error(res.Msg);
          this.router.navigate(['/Polist']);
        }
      }, (err) => {
        console.log(err);
      });
  }

  Update() {
    this._poService.InsertOrUpdate(this.poOrder).subscribe(
      (res) => {
        if (res.Flag) {
          this._alertService.success(res.Msg);
          this.router.navigate(['/Polist']);
        }
        else {
          this._alertService.error(res.Msg);
          this.router.navigate(['/Polist']);
        }

        this.poOrder = new Poorder();
        this.itemDetail = new Item();
        this.uom = new UOM();
        this.poOrder.lstItem = [];
        this.gridData = this.poOrder.lstItem;
      }, (err) => {
        console.log(err);
      });
  }
  PODateUpdated(range) {
    let PODate: Date = new Date(moment(new Date(range.startDate._d)).format("MM-DD-YYYY HH:mm"));
    this.poOrder.PODate = PODate;
  }

  PODeliveryDateUpdated(range) {
    let PODeliveryDate: Date = new Date(moment(new Date(range.startDate._d)).format("MM-DD-YYYY HH:mm"));
    this.poOrder.PODeliveryDate = PODeliveryDate;
  }

  public item(id): any {
    return this.itemList.find(x => x.ItemID == id);
  }

  public uomDetail(id): any {
    return this.uomList.find(x => x.UOMID == id);
  }

  public addHandler({ sender }) {
    this.closeEditor(sender, this.selectedRowIndex);

    this.itemFormGroup = createFormGroup({
      'ItemCode': '',
      'ItemName': '',
      'VendorItemCode': '',
      'CaseSize': 0,
      'UOM': '',
      'Rate': 0,
      'TaxRate': 0,
      'DirectCost': 0,
      'TaxAmount': 0,
      'TotalAmount': 0
    });

    sender.addRow(this.itemFormGroup);
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    this.itemFormGroup = createFormGroup(dataItem);
    this.selectedRowIndex = rowIndex;
    this.poOrderItem.ItemID = dataItem.ItemID;
    this.poOrderItem.MultiplierValue = this.uomList.filter(x => x.UOMID == dataItem.UOMID)[0].MultiplierValue
    sender.editRow(rowIndex, this.itemFormGroup);
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    const item = formGroup.value;
    this.poOrderItem.VendorItemCode = item.VendorItemCode;
    this.poOrderItem.ItemCode = item.ItemCode;
    this.poOrderItem.ItemName = item.ItemName;
    this.poOrderItem.CaseSize = item.CaseSize;
    this.poOrderItem.UOMID = item.UOM;
    this.poOrderItem.Rate = item.Rate;
    this.poOrderItem.TaxRate = item.TaxRate;
    this.poOrderItem.DirectCost = item.DirectCost;
    this.poOrderItem.TaxAmount = item.TaxAmount;
    this.poOrderItem.TotalAmount = item.TotalAmount;
    let errorMessage = this.validateItem(this.poOrderItem);
    if (errorMessage != null) {
      this._alertService.error(errorMessage);
      return;
    };
    if (isNew) {
      this.poOrder.lstItem.splice(0, 0, this.poOrderItem);
    }
    else {
      let selectedItem = this.poOrder.lstItem[rowIndex];
      Object.assign(
        this.poOrder.lstItem.find(({ ItemID }) => ItemID === selectedItem.ItemID),
        this.poOrderItem
      );
    }
    if (this.gridData.length > 0) {
      this.poForm.get('VendorID').disable();
      this.TotalQty = this.gridData.reduce((acc, a) => acc + a.Qty, 0);
      this.TotalTotalAmount = this.gridData.reduce((acc, a) => acc + a.TotalAmount, 0);
    }
    this.poOrderItem = new Poorderitem();
    this.totalAmountFieldDisabled = false;
    this.rateFieldDisabled = false;
    sender.closeRow(rowIndex);
  }

  public removeHandler({ dataItem }): void {
    const index = this.poOrder.lstItem.findIndex(({ ItemID }) => ItemID === dataItem.ItemID);
    this.poOrder.lstItem.splice(index, 1);
    if (this.gridData.length > 0) {
      this.poForm.get('VendorID').disable();
      this.TotalQty = this.gridData.reduce((acc, a) => acc + a.Qty, 0);
      this.TotalTotalAmount = this.gridData.reduce((acc, a) => acc + a.TotalAmount, 0);
    }
    else {
      this.poForm.get('VendorID').enable();
      this.TotalQty = 0;
      this.TotalTotalAmount = 0;
    }
  }

  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.itemFormGroup = undefined;
    this.poOrderItem = new Poorderitem();
    this.totalAmountFieldDisabled = false;
    this.rateFieldDisabled = false;
  }

  private validateItem(orderItem: Poorderitem): string {
    if (orderItem.ItemID == null || orderItem.ItemID == 0) {
      return "ItemCode field required";
    }
    if (orderItem.CaseSize == null || orderItem.CaseSize < 0) {
      return "Unit field must be greater than zero";
    }

    if (orderItem.UOMID == null || orderItem.UOMID == 0) {
      return "UOM field required";
    }
    if (orderItem.Rate == null || orderItem.Rate <= 0) {
      return "Rate field must be greater than zero";
    }
    if (orderItem.TotalAmount == null || orderItem.TotalAmount <= 0) {
      return "TotalAmount field must be greater than zero";
    }
    return null;
  }

  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith'
  };

  onDownloadTemplate() {
    let filetype = 'POBulk'
    this._masteruploadService.getFileTemplate(filetype)
      .subscribe(data => {
        saveAs(data, filetype + '.xlsx')
      },
        (err) => {
          console.log(err);
        }
      );
  }


  onClickBulkUpload() {
    if (this._authorizationGuard.CheckAcess("Polist", "ViewEdit")) {
      return;
    }
    $('#modalpopupbulkupload').modal('show');
  }

  BulkString: string;

  public onClickValidate() {
    this.poOrder.BulkString = this.BulkString;
    const csvSeparator = '|';
    let flag: boolean = true;
    const lines = this.poOrder.BulkString.split('\n');
    if (lines == null || lines.length == 0) {
      this._alertService.error("Item details required to proceed further!");
      flag = false;
      return;
    }
    else if (lines.length > 500) {
      this._alertService.error("You can add maximum of 500 rows using bulk upload option.!");
      flag = false;
      return;
    }
    lines.forEach(element => {
      const cols: string[] = element.split(csvSeparator);
      if (cols[1] == null || cols[1] == '' || !isNumeric(cols[1]) || parseInt(cols[1]) < 0) {
        this._alertService.error("Units column value must be a positive integer.!");
        flag = false;
        return;
      }
      else if (cols[2] == null || cols[2] == '' || !isNumeric(cols[2]) || parseInt(cols[2]) < 0) {
        this._alertService.error("UOMID column value must be a positive integer.!");
        flag = false;
        return;
      }
      if (cols[3] == null || cols[3] == '' || !isNumeric(cols[3]) || parseInt(cols[3]) < 0) {
        this._alertService.error("Rate column value must be a positive integer.!");
        flag = false;
        return;
      }
    });
    if (flag) {
      this.poOrder.VendorID = this.poForm.controls['VendorID'].value;
      this.poOrder.BulkString = this.BulkString;
      this._poService.bulkUpsert(this.poOrder).subscribe(
        (res: Poorderitem[]) => {
          this.poOrder.lstItem = res;
          this.gridData = this.poOrder.lstItem;
          if (this.gridData.length > 0) {
            this.poForm.get('VendorID').disable();

            this.TotalQty = this.gridData.reduce((acc, a) => acc + a.Qty, 0);
            this.TotalTotalAmount = this.gridData.reduce((acc, a) => acc + a.TotalAmount, 0);
          }
          if (res.length > 0) {
            this._alertService.success("Validated successfully");
          }
          else if (lines.length > res.length) {
            this._alertService.warning("Partial records validated successfully. Some of itemcode/UOM ID are not available.!");
          }
          else {
            this._alertService.error("Itemcode/UOM ID are not matched with available data.!");
          }

          $('#modalpopupbulkupload').modal('hide');
        },
        (err) => {
          $('#modalpopupbulkupload').modal('hide');
          console.log(err);
        });
    }
  }
  FileFlag: boolean = false;
  SelectedFiles: File[] = [] as any;
  onFileChanged1(e: any) {
    this.SelectedFiles = e.target.files;
    if (this.SelectedFiles != null) {
      let i = 0;
      this.FileFlag = false;
      if (this.SelectedFiles.length > 10) {
        this._alertService.error("You can't select more than 10 files");
        this.FileFlag = true;
        return;
      } else {
        for (i = 0; i < this.SelectedFiles.length; i++) {
          let singlefile = this.SelectedFiles[i];
          var filesizeMB1 = Math.round(singlefile.size / 1024 / 1024);
          var fileexte1 = singlefile.name.split('.').pop();
          if (!this.isInArray(Apisettings.CommonFiles_Ext, fileexte1)) {
            this._alertService.error("Selected File  must be extension with " + Apisettings.CommonFiles_Ext);
            this.FileFlag = true;
            return;
          }
          else if (filesizeMB1 > parseInt(Apisettings.CommonFiles_Fileszie.toString().toString())) {
            this._alertService.error("Selected File size must be less than or equal to " +
              parseInt(Apisettings.CommonFiles_Fileszie.toString()) + " MB.!");
            this.FileFlag = true;
            return;
          }
        }
      }
    }
  }
  isInArray(array, word) {
    return array.indexOf(word.toLowerCase()) > -1;
  }

}
