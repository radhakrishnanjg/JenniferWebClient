import { Component, OnInit } from '@angular/core';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { StoService } from '../../_services/service/sto.service';
import { PoService } from '../../_services/service/po.service';
import { FormGroup, FormControl, Validators, FormBuilder, } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { AuthorizationGuard } from '../../_guards/Authorizationguard';
import {
  Sto, Stodetail,
  Item, UOM, Location, Dropdown, Result
} from '../../_services/model';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

const createFormGroup = dataItem => new FormGroup({
  'ItemCode': new FormControl(dataItem.ItemID),
  'ItemName': new FormControl(dataItem.ItemName),
  'CustomerItemCode': new FormControl(dataItem.CustomerItemCode),
  'Units': new FormControl(dataItem.Units, [Validators.required, Validators.min(1), Validators.max(1000000), Validators.pattern("^([0-9]+)$")]),
  'UOM': new FormControl(dataItem.UOMID, [Validators.required, Validators.min(1)]),
  'Rate': new FormControl(dataItem.Rate),
  'DiscountValue': new FormControl(dataItem.DiscountValue),
  'TaxNature': new FormControl(dataItem.TaxNature),
  'TaxRate': new FormControl(dataItem.TaxRate),
  'TaxAmount': new FormControl(dataItem.TaxAmount),
  'DirectCost': new FormControl(dataItem.DirectCost),

  'TotalAmount': new FormControl(dataItem.TotalAmount)
});

@Component({
  selector: 'app-sto',
  templateUrl: './sto.component.html',
  styleUrls: ['./sto.component.css']
})
export class StoComponent implements OnInit {

  fromlocationList: Location[];
  tolocationList: Location[];
  lstInventoryType: Dropdown[];
  lstDispatchThrough: Dropdown[];

  itemList: Item[] = [] as any;
  StoList: Sto[] = [];
  objSto: Sto = new Sto();
  objStoItem: Stodetail = new Stodetail();
  uomList: UOM[];
  itemDescription: string = '';
  customerItemCode: string = '';
  selectedRowIndex: number = -1;
  itemDetail: Item = new Item();
  uom: UOM = new UOM();
  stoForm: FormGroup;
  selectedCustomer: {};
  dtOptions: DataTables.Settings = {};
  panelTitle: string = "Add New STO";
  STONumber: string = '';
  Rate: number = 0.00;
  DisCountPer: number = 0.00;
  IsDiscountApplicable: boolean;
  IsToLocationInvoicing: boolean;
  objResult: Result = {} as any;
  //KendoUI Grid
  public gridData: any[];
  public itemFormGroup: FormGroup;
  private editedRowIndex: number;
  hideSTODate: boolean = false;
  STODate: Date;
  CustomerID: number = 0;
  maxDate: moment.Moment;
  STOMinDate: moment.Moment;
  constructor(
    private _StoService: StoService,
    private _poService: PoService,
    private _privateutilityService: PrivateutilityService,
    private _authorizationGuard: AuthorizationGuard,

    public _alertService: ToastrService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.objSto.lstItem = [] as any;
  }


  formErrors = {
    'STODate': '',
    'InventoryType': '',
    'FromLocationID': '',
    'ToLocationID': '',
    'OtherReference': '',
    'Remarks': '',
  };

  validationMessages = {
    'STODate': {
      'required': 'This Field is required.',
    },
    'InventoryType': {
      'required': 'This Field is required.',
    },
    'FromLocationID': {
      'min': 'This Field is required.',
    },
    'ToLocationID': {
      'min': 'This Field is required.',
    },
    'OtherReference': {
      'required': 'This Field is required.',
    },
    'Remarks': {
      'required': 'This Field is required.',
    }

  };

  logValidationErrors(group: FormGroup = this.stoForm): void {
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

  BindGSTClaimableDate() {
    //
    this._privateutilityService.GetGSTClimableDate().subscribe(
      (res) => {
        this.STOMinDate = moment(res).add(1, 'minutes');
        var STODate = moment(new Date(), 'YYYY-MM-DD[T]HH:mm').format('MM-DD-YYYY HH:mm').toString();
        this.stoForm.patchValue({
          STODate: { startDate: new Date(STODate) },
        });
        this.STODate = new Date();
        //
      }, (err) => {
        //
        console.log(err);
      });
  }
  ngOnInit() {
    this.objSto.lstItem = [];
    this.gridData = this.objSto.lstItem;
    this.BindGSTClaimableDate();
    this.maxDate = moment().add(0, 'days');
    //
    this._poService.getOrderUOMs().subscribe(
      (res) => {
        this.uomList = res;
        //
      }, (err) => {
        //
        console.log(err);
      });

    //this.getAllItems();
    //
    this._privateutilityService.GetValues('InventoryType')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstInventoryType = data;
          //
        },
        (err: any) => {
          //
          console.log(err);
        }
      );

    //
    this._StoService.generateSTONumber().subscribe(
      (res) => {
        this.STONumber = res;
        this.objSto.lstItem = [];
        this.gridData = this.objSto.lstItem;
        //

      }, (err) => {
        //
        console.log(err);
      });



    this.stoForm = this.fb.group({
      STODate: ['', [Validators.required]],
      InventoryType: ['SELLABLE', [Validators.required]],
      FromLocationID: [0, [Validators.min(1)]],
      ToLocationID: [0, [Validators.min(1)]],
      OtherReference: ['', [Validators.required]],
      IsDiscountApplicable: ['',],
      IsShipmentRequired: ['',],
      Remarks: ['', [Validators.required]],
    });
    this.onInventoryTypeChange('SELLABLE');
    this.objResult = new Result();
    this.objResult.Msg = '';
    this.objResult.Flag = true;
  }





  onSTODateChange(range) {
    if (this.stoForm.controls['STODate'].value.startDate == null || this.stoForm.controls['STODate'].value.startDate == undefined) {
      this._alertService.error("Please enter STO date!.");
      return;
    }
    let STODate = this.stoForm.controls['STODate'].value.startDate._d.toLocaleString();
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

  STODateUpdated(range) {
    this.STODate = range.startDate

  }

  public onFromLocationIDChange(FromLocationID: number): void {
    if (FromLocationID > 0) {
      if (this.stoForm.controls['InventoryType'].value == null || this.stoForm.controls['InventoryType'].value == '') {
        this._alertService.error("Please select Inventory Type!.");
        return;
      }
      this.objSto.FromLocationID = FromLocationID;
      let LocationID = this.fromlocationList.filter(a => a.FromLocationID == FromLocationID)[0].LocationID;
      //
      this._privateutilityService.getSTOToLocations(LocationID, this.stoForm.controls['InventoryType'].value).subscribe(
        (res) => {
          this.tolocationList = res;
          this.objSto.lstItem = [];
          //
        }, (err) => {
          //
          console.log(err);
        });
    }
  }

  public onToLocationIDChange(ToLocationID: number): void {
    this.objSto.TaxNature = this.tolocationList.filter(a => a.ToLocationID == ToLocationID)[0].TaxNature;
    this.CustomerID = this.tolocationList.filter(a => a.ToLocationID == ToLocationID)[0].CustomerID;
    this.IsToLocationInvoicing = this.tolocationList.filter(a => a.ToLocationID == ToLocationID)[0].IsInvoicing;

    this.objSto.lstItem = [];
    this.gridData = this.objSto.lstItem;
    //
    this._privateutilityService.getCustomerItemLevels(this.CustomerID).subscribe(
      (data) => {
        if (data != null) {
          this.itemList = data.filter(a => { return a.Type == 'Item' });
        }
        //
      },
      (err) => {
        this.itemList = [];
        console.log(err);
        //
      }
    );


    if (this.IsToLocationInvoicing || this.stoForm.controls['InventoryType'].value == 'UNSELLABLE') {
      this.stoForm.patchValue(
        {
          IsShipmentRequired: false,
        })
      this.stoForm.get('IsShipmentRequired').disable();
    }
    else {
      this.stoForm.get('IsShipmentRequired').enable();
    }
  }

  public onInventoryTypeChange(InventoryType: string): void {
    if (InventoryType == "Unsellable" || this.IsToLocationInvoicing) {
      this.stoForm.patchValue(
        {
          IsShipmentRequired: false,
        })
      this.stoForm.get('IsShipmentRequired').disable();
    }
    else {
      this.stoForm.get('IsShipmentRequired').enable();
    }
    //
    this._privateutilityService.getSTOFromLocations(InventoryType).subscribe(
      (res) => {
        this.fromlocationList = res;
        //

      }, (err) => {
        //
        console.log(err);
      });
  }

  onchangeIsDiscountApplicable(event: any) {
    if (event.target.checked) {
      this.IsDiscountApplicable = true;
    } else {
      this.IsDiscountApplicable = false;
    }
  }

  public onItemCodeChange(itemID): void {
    // if (this.stoForm.controls['STODate'].value.startDate == null || this.stoForm.controls['STODate'].value.startDate == undefined) {
    //   this._alertService.error("Please enter STO date!.");
    //   return;
    // }
    let STODate = new Date();
    if (this.stoForm.controls['STODate'].value.startDate._d != undefined) {
      STODate = this.stoForm.controls['STODate'].value.startDate._d.toLocaleString();

    } else {
      STODate = this.stoForm.controls['STODate'].value.startDate.toLocaleString();
    }
    if (this.stoForm.controls['FromLocationID'].value == null || this.stoForm.controls['FromLocationID'].value == 0) {
      this._alertService.error("Please select From Location!.");
      return;
    }
    if (this.stoForm.controls['ToLocationID'].value == null || this.stoForm.controls['ToLocationID'].value == 0) {
      this._alertService.error("Please select To Location!.");
      return;
    }
    if (this.stoForm.controls['InventoryType'].value == null || this.stoForm.controls['InventoryType'].value == '') {
      this._alertService.error("Please select Inventory Type!.");
      return;
    }
    if (this.objSto.lstItem != null && this.objSto.lstItem.length > 0) {
      const index = this.objSto.lstItem.findIndex(({ ItemID }) => ItemID === itemID);
      if (index >= 0 && index != this.editedRowIndex) {
        this._alertService.error("Item already added.");
        return;
      }
    }
    this.itemDetail = this.itemList.filter(a => { return a.ItemID == itemID })[0];
    this.itemFormGroup.patchValue(
      {
        ItemCode: this.itemDetail.ItemCode,
        ItemName: this.itemDetail.ItemName,
        CustomerItemCode: this.itemDetail.CustomerItemCode,
        TaxRate: this.itemDetail.TaxRate,
        TaxNature: this.objSto.TaxNature,
      });
    this.objStoItem.ItemID = itemID;
    let CustomerID = this.CustomerID;
    let InventoryType = this.stoForm.get("InventoryType").value;
    let TransactionType = "B2B";
    //
    this._privateutilityService.getSellingPriceMRP(itemID, STODate, InventoryType)
      .subscribe(
        (data) => {
          //
          if (data != null) {
            this.objStoItem.SalesRateCardID = data['SalesRateCardID'];
            this.Rate = data['SellingPrice'];
            this.itemFormGroup.controls['Rate'].setValue(this.Rate);
            let Units = this.itemFormGroup.get("Units").value;
            let MultiplierValue = this.objStoItem.MultiplierValue;
            let Qty = Units * MultiplierValue;
            let IsDiscountApplicable = this.stoForm.get("IsDiscountApplicable").value;
            this.DisCountPer = 0;
            if (IsDiscountApplicable) {
              this._privateutilityService.getDiscountAmount(itemID, STODate, CustomerID, InventoryType, TransactionType)
                .subscribe(
                  (data11) => {
                    if (data11 != null) {
                      this.DisCountPer = data11['DiscountAmount'];
                      this.objStoItem.DiscountID = data11['DiscountID'];
                      let TaxRate = this.itemFormGroup.get("TaxRate").value;
                      let DirectCost = this.Rate * Qty;
                      let TaxAmount = DirectCost * (TaxRate / 100);
                      let DiscountAmount = this.Rate * this.DisCountPer / 100 * Qty + (TaxAmount * this.DisCountPer / 100);
                      this.itemFormGroup.controls['DiscountValue'].setValue(DiscountAmount);
                      this.itemFormGroup.controls['DirectCost'].setValue(DirectCost);
                      this.itemFormGroup.controls['TaxAmount'].setValue(TaxAmount);
                      this.itemFormGroup.controls['TotalAmount'].setValue(TaxAmount + (Qty * this.Rate) - DiscountAmount);
                    }
                  },
                  (err) => { }
                );
            }
            else {
              debugger
              this.itemFormGroup.controls['DiscountValue'].setValue(0);
              this.DisCountPer = 0;
              let TaxRate = this.itemFormGroup.get("TaxRate").value;
              let DirectCost = this.Rate * Qty;
              let TaxAmount = DirectCost * (TaxRate / 100);
              this.itemFormGroup.controls['DirectCost'].setValue(DirectCost);
              this.itemFormGroup.controls['TaxAmount'].setValue(TaxAmount);
              this.itemFormGroup.controls['TotalAmount'].setValue(TaxAmount + (Qty * this.Rate) - 0);
            }
          }
          else {
            this._alertService.error('Rate is not avaible for selected STODate,Item,InventoryType!');
            return;
          }
        },
        (err) => {
          //
        }
      );
  }

  public onUnitsChanged(Units: number): void {
    if (isNaN(Units) || Units <= 0) {
      this._alertService.error("The value must greater Zero.!");
      return;
    }
    else {
      this.objStoItem.Qty = Units * this.objStoItem.MultiplierValue;
      let Ratenew = this.Rate * Units * this.objStoItem.MultiplierValue;
      let TaxRate = this.itemFormGroup.get("TaxRate").value;
      let DirectCost = Ratenew;
      let TaxAmount = DirectCost * (TaxRate / 100);

      let DiscountValue = (this.Rate * this.DisCountPer / 100 * Units * this.objStoItem.MultiplierValue)
        + (TaxAmount * this.DisCountPer / 100);
      let TotalAmountNew = TaxAmount + DirectCost - DiscountValue;
      this.itemFormGroup.patchValue(
        {
          DirectCost: DirectCost,
          TaxAmount: TaxAmount,
          DiscountValue: DiscountValue,
          TotalAmount: TotalAmountNew
        });
    }

  }

  public onUOMChanged(UOMID): void {
    if (this.uomList != null && this.uomList.length > 0) {
      let uom = this.uomList.filter(x => { return x.UOMID == UOMID })[0];
      this.objStoItem.MultiplierValue = uom.MultiplierValue;
      let Units = this.itemFormGroup.get("Units").value;
      this.objStoItem.Qty = Units * this.objStoItem.MultiplierValue;
      let Ratenew = this.Rate * Units * this.objStoItem.MultiplierValue;
      let TaxRate = this.itemFormGroup.get("TaxRate").value;
      let DirectCost = Ratenew;
      let TaxAmount = DirectCost * (TaxRate / 100);
      let DiscountValue = (this.Rate * this.DisCountPer / 100 * Units * this.objStoItem.MultiplierValue)
        + (TaxAmount * this.DisCountPer / 100);
      let TotalAmountNew = TaxAmount + DirectCost - DiscountValue;
      this.itemFormGroup.patchValue(
        {
          DirectCost: DirectCost,
          TaxAmount: TaxAmount,
          DiscountValue: DiscountValue,
          TotalAmount: TotalAmountNew
        })
    }

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
      'CustomerItemCode': '',
      'Units': 0,
      'UOM': '',
      'Rate': 0,
      'DiscountValue': 0,
      'TotalAmount': 0,
      'TaxNature': '',
      'TaxRate': 0,
      'TaxAmount': 0,
      'DirectCost': 0,
    });

    sender.addRow(this.itemFormGroup);
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    this.itemFormGroup = createFormGroup(dataItem);
    this.selectedRowIndex = rowIndex;
    this.objStoItem.ItemID = dataItem.ItemID;
    this.Rate = dataItem.Rate;
    let uom = this.uomList.filter(x => { return x.UOMID == dataItem.UOMID })[0];
    this.objStoItem.MultiplierValue = uom.MultiplierValue;
    sender.editRow(rowIndex, this.itemFormGroup);
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    if (this.stoForm.controls['InventoryType'].value == null || this.stoForm.controls['InventoryType'].value == '') {
      this._alertService.error("Please select Inventory Type!.");
      return;
    }
    const item = formGroup.value;
    this.objStoItem.ItemCode = item.ItemCode;
    this.objStoItem.ItemName = item.ItemName;
    this.objStoItem.CustomerItemCode = item.CustomerItemCode;
    this.objStoItem.UOMID = item.UOM;

    this.objStoItem.Units = item.Units;
    this.objStoItem.Rate = item.Rate;
    this.objStoItem.DiscountValue = item.DiscountValue;
    this.objStoItem.Qty = item.Units * this.objStoItem.MultiplierValue;
    this.objStoItem.TaxNature = item.TaxNature;
    this.objStoItem.TaxRate = item.TaxRate;
    this.objStoItem.DirectCost = item.DirectCost;
    this.objStoItem.TaxAmount = item.TaxAmount;
    this.objStoItem.TotalAmount = item.TotalAmount;
    let errorMessage = this.validateItem(this.objStoItem);
    if (errorMessage != null) {
      this._alertService.error(errorMessage);
      return;
    };
    if (isNew) {
      this.objSto.lstItem.splice(0, 0, this.objStoItem);
    }
    else {
      let selectedItem = this.objSto.lstItem[rowIndex];
      Object.assign(
        this.objSto.lstItem.find(({ ItemID }) => ItemID === selectedItem.ItemID),
        this.objStoItem
      );
    }
    if (this.gridData.length > 0) {
      this.stoForm.get('FromLocationID').disable();
      this.stoForm.get('ToLocationID').disable();
      this.stoForm.get('InventoryType').disable();
      this.stoForm.get('IsDiscountApplicable').disable();
      this.hideSTODate = true;
    }
    this.objStoItem = new Stodetail();
    sender.closeRow(rowIndex);
  }

  public removeHandler({ dataItem }): void {
    const index = this.objSto.lstItem.findIndex(({ ItemID }) => ItemID === dataItem.ItemID);
    this.objSto.lstItem.splice(index, 1);
    if (this.gridData.length > 0) {
      this.stoForm.get('FromLocationID').disable();
      this.stoForm.get('ToLocationID').disable();
      this.stoForm.get('InventoryType').disable();
      this.stoForm.get('IsDiscountApplicable').disable();
      this.hideSTODate = true;
    }
    else {
      this.stoForm.get('FromLocationID').enable();
      this.stoForm.get('ToLocationID').enable();
      this.stoForm.get('InventoryType').enable();
      this.stoForm.get('IsDiscountApplicable').enable();
      this.hideSTODate = false;
    }
  }

  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.itemFormGroup = undefined;
    this.objStoItem = new Stodetail();
  }

  private validateItem(orderItem: Stodetail): string {
    if (orderItem.ItemCode == null || orderItem.ItemCode == '') {
      return "ItemCode field required";
    }
    if (orderItem.Units == null || orderItem.Units == 0) {
      return "Units field required";
    }
    if (orderItem.UOMID == null || orderItem.UOMID == 0) {
      return "UOM field required";
    }
    if (orderItem.Rate == null || orderItem.Rate == 0) {
      return "Selling Price field required";
    }
    if (orderItem.TotalAmount == null || orderItem.TotalAmount == 0) {
      return "Total Value field required";
    }
    if (orderItem.Units == null || orderItem.TotalAmount <= 0) {
      return "Unit Value field must greater than zero";
    }
    return null;
  }

  public saveData(): void {

    // stop here if form is invalid
    if (this.stoForm.invalid) {
      return;
    }
    if (this._authorizationGuard.CheckAcess("StoList", "ViewEdit")) {
      return;
    }
    if (this.objSto.lstItem == null || this.objSto.lstItem.length == 0) {
      this._alertService.error("Order Item required");
      return;
    }
    this.objSto.STONumber = this.STONumber;

    if (this.stoForm.controls['STODate'].value.startDate._d != undefined) {
      this.objSto.STODate = this.stoForm.controls['STODate'].value.startDate._d.toLocaleString();
    } else {
      this.objSto.STODate = this.stoForm.controls['STODate'].value.startDate.toLocaleString();
    }
    this.objSto.FromLocationID = this.stoForm.controls['FromLocationID'].value;
    this.objSto.ToLocationID = this.stoForm.controls['ToLocationID'].value;

    this.objSto.InventoryType = this.stoForm.controls['InventoryType'].value;
    this.objSto.OtherReference = this.stoForm.controls['OtherReference'].value;
    this.objSto.Remarks = this.stoForm.controls['Remarks'].value;
    this.objSto.DiscountApplicable = this.stoForm.controls['IsDiscountApplicable'].value;
    this.objSto.IsShipmentRequired = this.stoForm.controls['IsShipmentRequired'].value;

    //
    this._StoService.Insert(this.objSto).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this._alertService.success(data.Msg);
          this.router.navigate(['/StoList']);
        }
        else {
          this._alertService.error(data.Msg);
          this.router.navigate(['/StoList']);
        }
        //
      }, (err) => {
        //
        console.log(err);
      });
    this.objSto = new Sto();
    this.itemDetail = new Item();
    this.uom = new UOM();
    this.objSto.lstItem = [];
    this.gridData = this.objSto.lstItem;
  }

  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith'
  };

}
