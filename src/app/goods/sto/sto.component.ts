import { Component, OnInit } from '@angular/core';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { StoService } from '../../_services/service/sto.service';
import { PoService } from '../../_services/service/po.service';
import { FormGroup, FormControl, Validators, FormBuilder, } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthorizationGuard } from '../../_guards/Authorizationguard';
import {
  Sto, Stodetail,
  Item, UOM, Location, Dropdown, Result
} from '../../_services/model';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';

const createFormGroup = dataItem => new FormGroup({
  'ItemCode': new FormControl(dataItem.ItemID),
  'ItemName': new FormControl(dataItem.ItemName),
  'CustomerItemCode': new FormControl(dataItem.CustomerItemCode),
  'Units': new FormControl(dataItem.Units),
  'UOM': new FormControl(dataItem.UOMID),
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
  constructor(
    private _StoService: StoService,
    private _poService: PoService,
    private _privateutilityService: PrivateutilityService,
    private _authorizationGuard: AuthorizationGuard,
    private _spinner: NgxSpinnerService,
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

  ngOnInit() {
    this.objSto.lstItem = [];
    this.gridData = this.objSto.lstItem;

    this._spinner.show();
    this._poService.getOrderUOMs().subscribe(
      (res) => {
        this.uomList = res;
        this._spinner.hide();
      }, (err) => {
        this._spinner.hide();
        console.log(err);
      });

    //this.getAllItems();
    this._spinner.show();
    this._privateutilityService.GetValues('InventoryType')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstInventoryType = data;
          this._spinner.hide();
        },
        (err: any) => {
          this._spinner.hide();
          console.log(err);
        }
      );

    this._spinner.show();
    this._StoService.generateSTONumber().subscribe(
      (res) => {
        this.STONumber = res;
        this.objSto.lstItem = [];
        this.gridData = this.objSto.lstItem;
        this._spinner.hide();

      }, (err) => {
        this._spinner.hide();
        console.log(err);
      });

    this._spinner.show();
    this._privateutilityService.getSTOFromLocations().subscribe(
      (res) => {
        this.fromlocationList = res;
        this._spinner.hide();

      }, (err) => {
        this._spinner.hide();
        console.log(err);
      });

    this.stoForm = this.fb.group({
      STODate: ['', [Validators.required]],
      InventoryType: ['', [Validators.required]],
      FromLocationID: [0, [Validators.min(1)]],
      ToLocationID: [0, [Validators.min(1)]],
      OtherReference: ['', [Validators.required]],
      IsDiscountApplicable: ['',],
      IsShipmentRequired: ['',],
      Remarks: ['', [Validators.required]],

    });
  }

  onSTODateChange(range) {
    if (this.stoForm.controls['STODate'].value.startDate == null || this.stoForm.controls['STODate'].value.startDate == undefined) {
      this._alertService.error("Please enter STO date!.");
      return;
    }
    let STODate = this.stoForm.controls['STODate'].value.startDate._d.toLocaleString();
    this._spinner.show();
    this._privateutilityService.getCheckSTODateValidation(STODate).subscribe(
      (res) => {
        this.objResult = res;
        this._spinner.hide();
      }, (err) => {
        this._spinner.hide();
        console.log(err);
      });
  }

  STODateUpdated(range) {
    this.STODate = range.startDate

  }

  public onFromLocationIDChange(FromLocationID: number): void {
    if (FromLocationID > 0) {
      this.objSto.FromLocationID = FromLocationID;
      let LocationID = this.fromlocationList.filter(a => a.FromLocationID == FromLocationID)[0].LocationID;
      this._spinner.show();
      this._privateutilityService.getSTOToLocations(LocationID).subscribe(
        (res) => {
          this.tolocationList = res;
          this.objSto.lstItem = [];
          this._spinner.hide();
        }, (err) => {
          this._spinner.hide();
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
    this._privateutilityService.getCustomerItemLevels(this.CustomerID).subscribe(
      (data) => {
        if (data != null) {
          this.itemList = data.filter(a => { return a.Type == 'Item' });
        }
        this._spinner.hide();
      },
      (err) => {
        this.itemList = [];
        console.log(err);
        this._spinner.hide();
      }
    );


    if (this.IsToLocationInvoicing || this.stoForm.controls['InventoryType'].value == 'Unsellable') {
      this.stoForm.patchValue(
        {
          IsShipmentRequired: false,
        })
      this.stoForm.get('IsShipmentRequired').disable();
    }
    else {
      this.stoForm.get('IsShipmentRequired').enable();
    }
    // if (this.objSto.lstItem.length > 0) {
    //   this.objSto.lstItem.map(a => a.TaxNature = this.objSto.TaxNature);
    // }
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
  }

  onchangeIsDiscountApplicable(event: any) {
    if (event.target.checked) {
      this.IsDiscountApplicable = true;
    } else {
      this.IsDiscountApplicable = false;
    }
  }

  public onItemCodeChange(itemID): void {
    if (this.stoForm.controls['STODate'].value.startDate == null || this.stoForm.controls['STODate'].value.startDate == undefined) {
      this._alertService.error("Please enter STO date!.");
      return;
    }
    if (this.stoForm.controls['FromLocationID'].value == null || this.stoForm.controls['FromLocationID'].value == 0) {
      this._alertService.error("Please select From Location!.");
      return;
    }
    if (this.stoForm.controls['ToLocationID'].value == null || this.stoForm.controls['ToLocationID'].value == 0) {
      this._alertService.error("Please select To Location!.");
      return;
    }
    if (this.stoForm.controls['InventoryType'].value == null || this.stoForm.controls['InventoryType'].value == 0) {
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
    let STODate = this.stoForm.controls['STODate'].value.startDate._d.toLocaleString();
    let CustomerID = this.CustomerID;
    let InventoryType = this.stoForm.get("InventoryType").value;
    let TransactionType = "B2B";
    this._spinner.show();
    this._privateutilityService.getSellingPriceMRP(itemID, STODate.toString(), InventoryType)
      .subscribe(
        (data) => {
          this._spinner.hide();
          if (data != null) {
            this.Rate = data['SellingPrice'];
            this.itemFormGroup.controls['Rate'].setValue(this.Rate);
            let Units = this.itemFormGroup.get("Units").value;
            let MultiplierValue = this.objStoItem.MultiplierValue;
            let Qty = Units * MultiplierValue;
            if (this.IsDiscountApplicable) {
              this._spinner.show();

              this._privateutilityService.getDiscountAmount(itemID, STODate.toString(), CustomerID, InventoryType, TransactionType)
                .subscribe(
                  (data11) => {
                    if (data11 != null) {
                      this.DisCountPer = data11['DiscountAmount'];
                      //this.objStoItem.DiscountID = data11['DiscountID'];
                      let DiscountAmount = this.Rate * this.DisCountPer / 100 * Qty;
                      this.itemFormGroup.controls['DiscountValue'].setValue(DiscountAmount);
                      let TaxRate = this.itemFormGroup.get("TaxRate").value;
                      let DirectCost = this.Rate * Qty;
                      let TaxAmount = DirectCost * (TaxRate / 100);
                      this.itemFormGroup.controls['DirectCost'].setValue(DirectCost);
                      this.itemFormGroup.controls['TaxAmount'].setValue(TaxAmount);
                      this.itemFormGroup.controls['TotalAmount'].setValue(TaxAmount + (Qty * this.Rate) - DiscountAmount);
                    }
                    this._spinner.hide();
                  },
                  (err) => {
                    this._spinner.hide();
                  }
                );
            }
            else {
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
          this._spinner.hide();
        }
      );
  }

  public onUnitsChanged(Units: number): void {
    if (isNaN(Units) || Units < 0) {
      this._alertService.error("The value must greater or equal to Zero.!");
      return;
    }
    else {
      this.objStoItem.Qty = Units * this.objStoItem.MultiplierValue;
      let Ratenew = this.Rate * Units * this.objStoItem.MultiplierValue;

      let DiscountValue = (this.Rate * this.DisCountPer / 100 * Units * this.objStoItem.MultiplierValue);

      let TaxRate = this.itemFormGroup.get("TaxRate").value;
      let DirectCost = Ratenew;
      let TaxAmount = DirectCost * (TaxRate / 100);
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
      let DiscountValue = (this.Rate * this.DisCountPer / 100 * Units * this.objStoItem.MultiplierValue);
      let TaxRate = this.itemFormGroup.get("TaxRate").value;
      let DirectCost = Ratenew;
      let TaxAmount = DirectCost * (TaxRate / 100);
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
    sender.editRow(rowIndex, this.itemFormGroup);
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
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
        this.objSto
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
    return null;
  }

  public saveData(): void {

    if (this._authorizationGuard.CheckAcess("StoList", "ViewEdit")) {
      return;
    }
    this.objSto.STONumber = this.STONumber;
    this.objSto.STODate = this.stoForm.controls['STODate'].value.startDate._d.toLocaleString();
    this.objSto.FromLocationID = this.stoForm.controls['FromLocationID'].value;
    this.objSto.ToLocationID = this.stoForm.controls['ToLocationID'].value;

    this.objSto.InventoryType = this.stoForm.controls['InventoryType'].value;
    this.objSto.OtherReference = this.stoForm.controls['OtherReference'].value;
    this.objSto.Remarks = this.stoForm.controls['Remarks'].value;
    this.objSto.DiscountApplicable = this.stoForm.controls['IsDiscountApplicable'].value;
    this.objSto.IsShipmentRequired = this.stoForm.controls['IsShipmentRequired'].value;

    this._spinner.show();
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
        this._spinner.hide();
      }, (err) => {
        this._spinner.hide();
        console.log(err);
      });
    this.objSto = new Sto();
    this.itemDetail = new Item();
    this.uom = new UOM();
    this.objSto.lstItem = [];
    this.gridData = this.objSto.lstItem;
  }

}
