import { Component, OnInit } from '@angular/core';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { PoService } from '../../_services/service/po.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Poorder, Location, Vendor, Brand, ProductGroup, Category, SubCategory, Item, UOM, Poorderitem } from '../../_services/model';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthorizationGuard } from '../../_guards/Authorizationguard'


const createFormGroup = dataItem => new FormGroup({
  'ItemCode': new FormControl(dataItem.ItemID),
  'ItemName': new FormControl(dataItem.ItemName),
  'VendorItemCode': new FormControl(dataItem.VendorItemCode),
  'CaseSize': new FormControl(dataItem.CaseSize,
    [Validators.required, Validators.min(1), Validators.max(1000000), Validators.pattern("^([0-9]+)$")]),
  'UOM': new FormControl(dataItem.UOMID, [Validators.required, Validators.min(1),]),
  'Rate': new FormControl(dataItem.Rate, [Validators.required, Validators.min(1), Validators.max(99999999), Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")]),
  'TaxRate': new FormControl(dataItem.TaxRate),
  'DirectCost': new FormControl(dataItem.DirectCost),
  'TaxAmount': new FormControl(dataItem.TaxAmount),
  'TotalAmount': new FormControl(dataItem.TotalAmount, [Validators.required, Validators.min(1), Validators.max(99999999), Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")])
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
  //KendoUI Grid
  public gridData: any[];
  public itemFormGroup: FormGroup;
  private editedRowIndex: number;

  constructor(
    private _poService: PoService,
    private _privateutilityService: PrivateutilityService,
    private _spinner: NgxSpinnerService,
    public _alertService: ToastrService,
    private activatedroute: ActivatedRoute,
    private _authorizationGuard: AuthorizationGuard,
    private router: Router,
    private fb: FormBuilder,
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
    'Location': '',
    'Vendor': '',
    'OtherReference': '',
    'AgainstReference': '',
    'PaymentReference': '',
    'Remarks': '',
    'CaseSize': '',
    'UOM': '',
    'Rate': '',
    'TotalAmount': ''
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
    });

    this.gridData = this.poOrder.lstItem; 
    this.getUOMs();
    this.poMinDate = moment().add(0, 'days');
    var end = moment().endOf('day');
    var currentend = new Date();
    var differ = end.diff(currentend, 'minutes');
    this.poMaxDate = moment().add(differ, 'minutes');
    this.poDeliveryMinDate = moment().add(0, 'days');
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


  private editPO(poID): void {
    this.poOrder.POID = poID;
    this.panelTitle = "Update PO";
    this._spinner.show();
    this._poService.searchById(poID)
      .subscribe(
        (data: Poorder) => {
          this.getLocations();
          this.getVendors();
          this.poOrder = data;
          debugger
          this.poForm.get('IsShipmentRequired').disable();
          this.gridData = this.poOrder.lstItem;
          var PODate = moment(data.PODate, 'YYYY-MM-DD[T]HH:mm').format('MM-DD-YYYY HH:mm').toString();
          var PODeliveryDate = moment(data.PODeliveryDate, 'YYYY-MM-DD[T]HH:mm').format('MM-DD-YYYY HH:mm').toString();
          var VendorID = data.VendorID.toString();
          var LocationID = data.LocationID.toString();
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
            Remarks: data.Remarks
          });
          this.onVendorChanged(this.poOrder.VendorID);
          this._spinner.hide();


        },
        (err: any) => {
          console.log(err);
          this._spinner.hide();
        }
      );
  }

  //Get PurchaseOrder Number
  public onLocationChange(locationID): void {
    this.poOrder.LocationID = locationID;
    if (locationID > 0) {
      this._spinner.show();
      this._poService.getPONumber(locationID).subscribe(
        (res) => {
          this.poOrder.PONumber = res;
          this._spinner.hide();
        }, (err) => {
          this._spinner.hide();
          console.log(err);
        });
    }
  }

  //Get Locations
  public getLocations(): void {
    this._spinner.show();
    this._privateutilityService.getLocations().subscribe(
      (data) => {
        this.locationList = data;
        this._spinner.hide();
      },
      (err) => {
        this._spinner.hide();
        console.log(err);
      }
    );
  }

  //Get Vendors
  public getVendors(): void {
    this._spinner.show();
    this._privateutilityService.getVendors().subscribe(
      (res) => {
        this.vendorList = res;
        this._spinner.hide();
      }, (err) => {
        this._spinner.hide();
        console.log(err);
      });
  }

  //Get Brands
  public getBrands(): void {
    this._spinner.show();
    this._poService.getOrderBrands().subscribe(
      (res) => {
        this.brandList = res;
        this._spinner.hide();
      }, (err) => {
        this._spinner.hide();
        console.log(err);
      });
  }

  //Get Product Groups
  public getProductGroups(brandID: number): void {
    this._spinner.show();
    this._poService.getOrderProductGroups(brandID).subscribe(
      (res) => {
        this.productGroups = res;
        this._spinner.hide();
      }, (err) => {
        this._spinner.hide();
        console.log(err);
      });
  }

  // Get Category List
  public getCategories(brandID: number, productGroupdID: number): void {
    this._spinner.show();
    this._poService.getOrderCategories(brandID, productGroupdID).subscribe(
      (res) => {
        this.categoryList = res;
        this._spinner.hide();
      }, (err) => {
        this._spinner.hide();
        console.log(err);
      });
  }

  // Get SubCategory List
  public getSubCategories(brandID: number, categoryID: number): void {
    this._spinner.show();
    this._poService.getOrderSubCategories(brandID, categoryID).subscribe(
      (res) => {
        this.subCategoryList = res;
        this._spinner.hide();
      }, (err) => {
        this._spinner.hide();
        console.log(err);
      });
  }
  // Get Item List
  public onVendorChanged(vendorID: number): void {
    this._spinner.show();
    if (vendorID > 0) {
      this._poService.getVendorItemLevels(vendorID).subscribe(
        (res) => {
          if (res != null) {
            this.itemList = res.filter(e => { return e.Type == "Item" });
          }
          this._spinner.hide();
        }, (err) => {
          this.itemList = [];
          this._spinner.hide();
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
    this._spinner.show();
    this._poService.getOrderUOMs().subscribe(
      (res) => {
        this.uomList = res;
        this._spinner.hide();
      }, (err) => {
        this._spinner.hide();
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
          DirectCost: DirectCost,
          TaxAmount: TaxAmount,
          TotalAmount: TotalAmount
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
      let TaxAmount = DirectCost * (TaxRate / 100);
      let TotalAmount = DirectCost + TaxAmount;
      this.itemFormGroup.patchValue(
        {
          DirectCost: DirectCost,
          TaxAmount: TaxAmount,
          TotalAmount: TotalAmount
        })
      this.totalAmountFieldDisabled = Rate > 0;
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
      let Rate = DirectCost / (CaseSize * this.poOrderItem.MultiplierValue);
      this.itemFormGroup.patchValue(
        {
          DirectCost: DirectCost,
          TaxAmount: TaxAmount,
          Rate: Rate
        })
      this.rateFieldDisabled = TotalAmount > 0;
    }
  }

  //submit POOrder
  public saveData(): void {

    if (this._authorizationGuard.CheckAcess("Polist", "ViewEdit")) {
      return;
    }
    if (this.poForm.invalid) {
      return;
    }
    // let errorMessage = this.validatePO();
    // this.poOrder.PODate = this.poOrder.PODate.startDate;
    // this.poOrder.PODeliveryDate = this.poOrder.PODeliveryDate.startDate;
    if (this.poOrder.PONumber == null || this.poOrder.PONumber == "") {
      this._alertService.error("PO Number required");
      return;
    }
    if (this.poOrder.lstItem == null || this.poOrder.lstItem.length == 0) {
      this._alertService.error("Order Item required");
      return;
    }
    if (this.poOrder.POID > 0) {
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
    } else {
      this.poOrder.PODate = this.poForm.controls['PODate'].value.startDate._d.toLocaleString();
      this.poOrder.PODeliveryDate = this.poForm.controls['PODeliveryDate'].value.startDate._d.toLocaleString();
    }

    this.poOrder.LocationID = this.poForm.controls['LocationID'].value;
    this.poOrder.VendorID = this.poForm.controls['VendorID'].value;
    this.poOrder.IsEventPurchase = this.poForm.controls['IsEventPurchase'].value;
    this.poOrder.IsShipmentRequired = this.poForm.controls['IsShipmentRequired'].value;
    this.poOrder.OtherReference = this.poForm.controls['OtherReference'].value;
    this.poOrder.AgainstReference = this.poForm.controls['AgainstReference'].value;
    this.poOrder.PaymentReference = this.poForm.controls['PaymentReference'].value;
    this.poOrder.Remarks = this.poForm.controls['Remarks'].value;

    // if (errorMessage != null) {
    //   this._alertService.error(errorMessage);
    //   return;
    // };
    this._spinner.show();
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
        this._spinner.hide();
      }, (err) => {
        this._spinner.hide();
        console.log(err);
      });
    this.poOrder = new Poorder();
    this.itemDetail = new Item();
    this.uom = new UOM();
    this.poOrder.lstItem = [];
    this.gridData = this.poOrder.lstItem;
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
    }
    else {
      this.poForm.get('VendorID').enable();
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

  private validatePO(): string {
    if (this.poOrder.PONumber == null || this.poOrder.PONumber == "") {
      return "PO Number required";
    }
    if (this.poOrder.LocationID == null || this.poOrder.LocationID == 0) {
      return "Location field required";
    }
    if (this.poOrder.VendorID == null || this.poOrder.VendorID == 0) {
      return "Vendor field required";
    }

    if (this.poOrder.OtherReference == null || this.poOrder.OtherReference.trim().length == 0) {
      return "Other Reference field required";
    }

    if (this.poOrder.OtherReference.trim().length > 50) {
      return "Other Reference must be within 50 characters";
    }

    if (this.poOrder.AgainstReference != null && this.poOrder.AgainstReference.trim().length > 50) {
      return "Against Reference must be within 50 characters";
    }

    if (this.poOrder.PaymentReference != null && this.poOrder.PaymentReference.trim().length > 50) {
      return "Payment Reference must be within 50 characters";
    }

    if (this.poOrder.Remarks != null && this.poOrder.Remarks.trim().length > 50) {
      return "Remarks must be within 250 characters";
    }
    if (this.poOrder.lstItem.length == 0) {
      return "Please add atleast one item";
    }
    return null;
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

    // if (orderItem.TaxRate == null || orderItem.TaxRate == 0) {
    //   return "TaxRate field required";
    // }

    if (orderItem.TotalAmount == null || orderItem.TotalAmount <= 0) {
      return "TotalAmount field must be greater than zero";
    }
    return null;
  }
}
