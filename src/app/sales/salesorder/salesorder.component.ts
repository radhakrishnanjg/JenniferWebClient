import { Component, OnInit } from '@angular/core';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { SalesorderService } from '../../_services/service/salesorder.service';
import { PoService } from '../../_services/service/po.service';
import { FormGroup, FormControl, Validators, FormBuilder, } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthorizationGuard } from '../../_guards/Authorizationguard';
import {
  Salesorder, Brand, ProductGroup, Category, SubCategory,
  Item, UOM, Customer, Customerwarehouse, Dropdown, PaymentTermType,
  SalesorderItem
} from '../../_services/model';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';

const createFormGroup = dataItem => new FormGroup({
  'ItemCode': new FormControl(dataItem.ItemID),
  'ItemName': new FormControl(dataItem.ItemName),
  'CustomerItemCode': new FormControl(dataItem.CustomerItemCode),
  'Units': new FormControl(dataItem.Units, [Validators.required, Validators.min(1), Validators.max(1000000), Validators.pattern("^([0-9]+)$")]),
  'UOM': new FormControl(dataItem.UOMID, [Validators.required, Validators.min(1)]),
  'SellingPrice': new FormControl(dataItem.SellingPrice),
  'ShippingCharges': new FormControl(dataItem.ShippingCharges, [Validators.min(0), Validators.max(1000000), Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")]),
  'MRP': new FormControl(dataItem.MRP),
  'Discountamt': new FormControl(dataItem.Discountamt),
  'TotalValue': new FormControl(dataItem.TotalValue, Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")),
  'TaxRate': new FormControl(dataItem.TaxRate),
  'TaxAmount': new FormControl(dataItem.TaxAmount),
});

@Component({
  selector: 'app-salesorder',
  templateUrl: './salesorder.component.html',
  styleUrls: ['./salesorder.component.css']
})
export class SalesorderComponent implements OnInit {

  customerList: Customer[];
  customerWarehouseList: Customerwarehouse[];
  //lstInventoryType: Dropdown[];
  lstDispatchThrough: Dropdown[];
  lstPaymentTermsID: PaymentTermType[];

  brandList: Brand[];
  productGroups: ProductGroup[];
  categoryList: Category[];
  subCategoryList: SubCategory[];
  itemList: Item[] = [] as any;
  salesOrderList: Salesorder[] = [];
  objSalesOrder: Salesorder = new Salesorder();
  objSalesorderItem: SalesorderItem = new SalesorderItem();
  uomList: UOM[];
  itemDescription: string = '';
  customerItemCode: string = '';
  selectedRowIndex: number = -1;
  itemDetail: Item = new Item();
  uom: UOM = new UOM();
  salesForm: FormGroup;
  selectedCustomer: {};
  dtOptions: DataTables.Settings = {};
  panelTitle: string = "Add New SalesOrder";
  orderDate: { startDate: moment.Moment, endDate: moment.Moment };
  IsBillTo_SameAs_ShipTo: boolean = true;
  OrderID: string = '';
  ShipTo: string = '';
  BilledTo: string = '';
  SellingPrice: number = 0.00;
  DisCountPer: number = 0.00;
  IsDiscountApplicable: boolean;
  IsDisableMasterControls: boolean = true;
  //KendoUI Grid
  public gridData: any[];
  public itemFormGroup: FormGroup;
  private editedRowIndex: number;
  action: boolean;
  identity: number = 0;
  TotalCaseSize: number = 0;
  TotalMultiplierValue: number = 0;
  TotalQty: number = 0;
  TotalSellingPrice: number = 0;
  TotalMRP: number = 0;
  TotalShippingCharges: number = 0;
  TotalDiscountamt: number = 0;
  TotalTaxAmount: number = 0;
  TotalTotalAmount: number = 0;
  hideOrderDate: boolean = false;
  OrderDate: Date;
  constructor(
    private _salesService: SalesorderService,
    private _poService: PoService,
    private _privateutilityService: PrivateutilityService,
    private _authorizationGuard: AuthorizationGuard,
    private _spinner: NgxSpinnerService,
    public _alertService: ToastrService,
    private fb: FormBuilder,
    private router: Router,
    private aroute: ActivatedRoute,
  ) {
    this.objSalesOrder.lstItem = [] as any;
  }

  formErrors = {
    'OrderDate': '',
    'CustomerID': '',
    'InventoryType': '',
    'PaymentTermsID': '',
    'DispatchThrough': '',
    'BuyerOrderNo': '',
    'DeliveryNote': '',
    'TermsOfDelivery': '',
    'Remarks': '',
    'ItemCode': '',
    'Qty': '',
    'UOM': '',
    'ShippingCharge': '',
    'MRP': '',
    'CustomerWarehouseID': '',
  };

  validationMessages = {
    'OrderDate': {
      'required': 'This Field is required.',
      //'invalidDate': 'This Field must be date format(MM-DD-YYYY HH:mm).',
    },
    'CustomerID': {
      'min': 'This Field is required.',
    },
    'InventoryType': {
      'required': 'This Field is required.',
    },
    'PaymentTermsID': {
      'min': 'This Field is required.',
    },
    'DispatchThrough': {
      'required': 'This Field is required.',
    },
    'BuyerOrderNo': {
      'required': 'This Field is required.',
    },
    'DeliveryNote': {
      'required': 'This Field is required.',
    },
    'TermsOfDelivery': {
      'required': 'This Field is required.',
    },
    'Remarks': {
      'required': 'This Field is required.',
    },
    'CustomerWarehouseID': {
      'min': 'This Field is required.',
    },

  };

  logValidationErrors(group: FormGroup = this.salesForm): void {
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


  OrderDateUpdated(range) {
    this.OrderDate = range.startDate
  }
  ngOnInit() {


    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
      if (this.identity > 0) {
        this.panelTitle = "View SalesOrder";
        this.action = false;
        this._spinner.show();
        this._salesService.searchById(this.identity)
          .subscribe(
            (data: Salesorder) => {
              this._spinner.hide();
              this.OrderID = data.OrderID
              this.objSalesOrder = data;
              this.BilledTo = this.objSalesOrder.BilledTo;
              this.ShipTo = this.objSalesOrder.ShipTo;

              this.TotalCaseSize = data.lstItem.reduce((acc, a) => acc + a.Units, 0);
              this.TotalMultiplierValue = data.lstItem.reduce((acc, a) => acc + a.MultiplierValue, 0);
              this.TotalQty = data.lstItem.reduce((acc, a) => acc + a.Qty, 0);
              this.TotalSellingPrice = data.lstItem.reduce((acc, a) => acc + a.SellingPrice, 0);
              this.TotalMRP = data.lstItem.reduce((acc, a) => acc + a.MRP, 0);
              this.TotalShippingCharges = data.lstItem.reduce((acc, a) => acc + a.ShippingCharges, 0);
              this.TotalDiscountamt = data.lstItem.reduce((acc, a) => acc + a.Discountamt, 0);
              this.TotalTaxAmount = data.lstItem.reduce((acc, a) => acc + a.TaxAmount, 0);
              this.TotalTotalAmount = data.lstItem.reduce((acc, a) => acc + a.TotalValue, 0);
            },
            (err) => {
              this._spinner.hide();
              console.log(err);
            }
          );
      } else {
        this.action = true;
        this.objSalesOrder.lstItem = [];
        this.gridData = this.objSalesOrder.lstItem;
        this._spinner.show();
        this._privateutilityService.getCustomersSales().subscribe(
          (data) => {
            if (data != null) {
              this.customerList = data;
            }
            this._spinner.hide();
          },
          (err) => {
            this._spinner.hide();
            console.log(err);
          }
        );
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
        // this._spinner.show();
        // this._privateutilityService.GetValues('InventoryType')
        //   .subscribe(
        //     (data: Dropdown[]) => {
        //       this.lstInventoryType = data;
        //       this._spinner.hide();
        //     },
        //     (err: any) => {
        //       this._spinner.hide();
        //       console.log(err);
        //     }
        //   );
        this._spinner.show();
        this._privateutilityService.GetValues('Courier')
          .subscribe(
            (data: Dropdown[]) => {
              this.lstDispatchThrough = data;
              this._spinner.hide();
            },
            (err: any) => {
              this._spinner.hide();
              console.log(err);
            }
          );
        this._spinner.show();
        this._privateutilityService.getPaymentTerms().subscribe(
          (data: PaymentTermType[]) => {
            this.lstPaymentTermsID = data;
            this._spinner.hide();
          },
          (err: any) => {
            this._spinner.hide();
            console.log(err);
          }
        );
      }
    });

    this.salesForm = this.fb.group({
      OrderDate: ['', [Validators.required]],
      CustomerID: [0, [Validators.min(1)]],
      InventoryType: ['Sellable', [Validators.required]],
      PaymentTermsID: [0, [Validators.min(1)]],
      DispatchThrough: ['', [Validators.required]],

      BuyerOrderNo: ['', [Validators.required]],
      DeliveryNote: ['', [Validators.required]],
      TermsOfDelivery: ['', [Validators.required]],
      Remarks: ['', [Validators.required]],
      CustomerWarehouseID: [0, [Validators.min(1)]],
      IsBillTo_SameAs_ShipTo: ['',],
      IsDiscountApplicable: ['',],

    });
  }

  public onCustomerChange(customerID: number): void {
    console.log("customerID=" + customerID);
    this.objSalesOrder.CustomerID = customerID;
    this._spinner.show();
    this._salesService.getOrderID(customerID).subscribe(
      (res) => {
        this.OrderID = res;
        this.objSalesOrder.lstItem = [];
        this.gridData = this.objSalesOrder.lstItem;
        this._spinner.hide();
      }, (err) => {
        this._spinner.hide();
        console.log(err);
      });
    this.getCustomerAddress(customerID);
    this.getCustomerWarehouse(customerID);
    this._privateutilityService.getCustomerItemLevels(customerID).subscribe(
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
  }

  public getCustomerAddress(customerID: number): void {
    if (customerID != 0) {
      this._spinner.show();
      this._privateutilityService.getCustomerAddress(customerID).subscribe(
        (data) => {
          if (data != null) {
            this.BilledTo = data['Address1'];
          }
          this._spinner.hide();
        },
        (err) => {
          this._spinner.hide();
          console.log(err);
        }
      );
    }
  }

  public getCustomerWarehouse(customerID: number): void {
    if (customerID != 0) {
      this._spinner.show();
      this._privateutilityService.getCustomerWarehouse(customerID).subscribe(
        (data) => {
          if (data != null) {
            this.customerWarehouseList = data;
          }
          this._spinner.hide();
        },
        (err) => {
          this._spinner.hide();
          console.log(err);
        }
      );
    }
  }

  public onCustomerWarehouseIDChange(customerWarehouseID: number): void {
    if (customerWarehouseID != 0) {
      this._spinner.show();
      this._privateutilityService.getCustomerWarehouseAddress(customerWarehouseID).subscribe(
        (data) => {
          if (data != null) {
            this.ShipTo = data['Address1'];
          }
          this.onchangeIsBillTo_SameAs_ShipTo1();
          this._spinner.hide();
        }, (err) => {
          this._spinner.hide();
          console.log(err);
        });
    }
  }

  onchangeIsBillTo_SameAs_ShipTo(event: any) {
    if (event.target.checked) {
      this.IsBillTo_SameAs_ShipTo = true;
      this.BilledTo = this.ShipTo;
    } else {
      this.IsBillTo_SameAs_ShipTo = false;
      let customerID = this.salesForm.controls['CustomerID'].value;
      this.getCustomerAddress(customerID);
    }
  }

  onchangeIsBillTo_SameAs_ShipTo1() {
    // this.IsBillTo_SameAs_ShipTo = this.salesForm.controls['IsBillTo_SameAs_ShipTo'].value;
    if (this.IsBillTo_SameAs_ShipTo) {
      this.IsBillTo_SameAs_ShipTo = true;
      this.BilledTo = this.ShipTo;
    } else {
      this.IsBillTo_SameAs_ShipTo = false;
      let customerID = this.salesForm.controls['CustomerID'].value;
      this.getCustomerAddress(customerID);
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
    if (this.salesForm.controls['OrderDate'].value.startDate == null || this.salesForm.controls['OrderDate'].value.startDate == undefined) {
      this._alertService.error("Please enter order date!.");
      return;
    }
    if (this.salesForm.controls['CustomerID'].value == null || this.salesForm.controls['CustomerID'].value == 0) {
      this._alertService.error("Please enter Customer!.");
      return;
    }
    if (this.salesForm.controls['InventoryType'].value == null || this.salesForm.controls['InventoryType'].value == 0) {
      this._alertService.error("Please enter Inventory Type!.");
      return;
    }
    if (this.objSalesOrder.lstItem != null && this.objSalesOrder.lstItem.length > 0) {
      const index = this.objSalesOrder.lstItem.findIndex(({ ItemID }) => ItemID === itemID);
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
      });
    this.objSalesorderItem.ItemID = itemID;
    let OrderDate = this.salesForm.controls['OrderDate'].value.startDate._d.toLocaleString();
    let CustomerID = this.salesForm.get("CustomerID").value;
    let InventoryType = this.salesForm.get("InventoryType").value;
    let TransactionType = this.customerList.filter(x => { return x.CustomerID == this.salesForm.controls['CustomerID'].value })[0].CustomerType;
    this._spinner.show();
    this._privateutilityService.getSellingPriceMRP(itemID, OrderDate.toString(), InventoryType)
      .subscribe(
        (data) => {
          this._spinner.hide();
          if (data != null) {
            this.SellingPrice = data['SellingPrice'];
            this.itemFormGroup.controls['SellingPrice'].setValue(this.SellingPrice);
            this.itemFormGroup.controls['MRP'].setValue(data['MRP']);
            let Units = this.itemFormGroup.get("Units").value;
            let MultiplierValue = this.objSalesOrder.MultiplierValue;
            let Qty = Units * MultiplierValue;
            let ShippingCharges = this.itemFormGroup.get("ShippingCharges").value;
            if (this.IsDiscountApplicable) {
              this._spinner.show();
              this._privateutilityService.getDiscountAmount(itemID, OrderDate.toString(), CustomerID, InventoryType, TransactionType)
                .subscribe(
                  (data11) => {
                    if (data11 != null) {
                      this.DisCountPer = data11['DiscountAmount'];
                      this.objSalesorderItem.DiscountID = data11['DiscountID'];
                      let DiscountAmount = this.SellingPrice * this.DisCountPer / 100 * Qty;
                      this.itemFormGroup.controls['Discountamt'].setValue(DiscountAmount);
                      this.itemFormGroup.controls['TaxAmount'].setValue(Qty * this.SellingPrice *
                        this.itemFormGroup.get("TaxRate").value / 100);
                      this.itemFormGroup.controls['TotalValue'].setValue((Qty * this.SellingPrice) -
                        DiscountAmount + this.itemFormGroup.get("TaxAmount").value + ShippingCharges);
                    }
                    this._spinner.hide();
                  },
                  (err) => {
                    this._spinner.hide();
                  }
                );
            }
            else {
              this.itemFormGroup.controls['TaxAmount'].setValue(Qty * this.SellingPrice *
                this.itemFormGroup.get("TaxRate").value / 100);
              this.itemFormGroup.controls['TotalValue'].setValue((Qty * this.SellingPrice) +
                + this.itemFormGroup.get("TaxAmount").value + ShippingCharges);
            }
          }
          else {
            this._alertService.error('Selling Price is not avaible for selected OrderDate,Item,InventoryType!');
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
      this.objSalesorderItem.Qty = Units * this.objSalesOrder.MultiplierValue;
      let SellingPricenew = this.SellingPrice * Units * this.objSalesOrder.MultiplierValue;
      let ShippingCharges = this.itemFormGroup.get("ShippingCharges").value;
      let Discountamt = (this.SellingPrice * this.DisCountPer / 100 * Units * this.objSalesOrder.MultiplierValue);
      let TaxAmountnew = (this.SellingPrice * this.itemFormGroup.get("TaxRate").value / 100 * Units * this.objSalesOrder.MultiplierValue);
      let TotalValueNew = SellingPricenew - Discountamt + TaxAmountnew + ShippingCharges;

      this.itemFormGroup.patchValue(
        {
          Discountamt: Discountamt,
          TotalValue: TotalValueNew,
          TaxAmount: TaxAmountnew
        });
    }

  }

  public onUOMChanged(UOMID): void {
    if (this.uomList != null && this.uomList.length > 0) {
      let uom = this.uomList.filter(x => { return x.UOMID == UOMID })[0];
      this.objSalesOrder.MultiplierValue = uom.MultiplierValue;
      let Units = this.itemFormGroup.get("Units").value;
      this.objSalesorderItem.Qty = Units * this.objSalesOrder.MultiplierValue;
      let ShippingCharges = this.itemFormGroup.get("ShippingCharges").value;
      let SellingPricenew = this.SellingPrice * Units * this.objSalesOrder.MultiplierValue;
      let Discountamt = (this.SellingPrice * this.DisCountPer / 100 * Units * this.objSalesOrder.MultiplierValue);
      let TaxAmountnew = (this.SellingPrice * this.itemFormGroup.get("TaxRate").value / 100 * Units * this.objSalesOrder.MultiplierValue);
      let TotalValueNew = SellingPricenew - Discountamt + TaxAmountnew + ShippingCharges;
      this.itemFormGroup.patchValue(
        {
          Discountamt: Discountamt,
          TotalValue: TotalValueNew,
          TaxAmount: TaxAmountnew
        })
    }

  }

  public onShippingChargesChanged(ShippingCharges: number): void {
    if (isNaN(ShippingCharges) || ShippingCharges < 0) {
      this._alertService.error("The value must greater or equal to Zero.!");
      return;
    }
    else {
      let uom = this.uomList.filter(x => { return x.UOMID == this.itemFormGroup.get("UOM").value })[0];
      this.objSalesOrder.MultiplierValue = uom.MultiplierValue;
      let Units = this.itemFormGroup.get("Units").value;
      let SellingPricenew = this.SellingPrice * Units * this.objSalesOrder.MultiplierValue;
      let Discountamt = (this.SellingPrice * this.DisCountPer / 100 * Units * this.objSalesOrder.MultiplierValue);
      let TaxAmountnew = (this.SellingPrice * this.itemFormGroup.get("TaxRate").value / 100 * Units * this.objSalesOrder.MultiplierValue);
      let TotalValueNew = SellingPricenew - Discountamt + TaxAmountnew + ShippingCharges;
      this.itemFormGroup.patchValue(
        {
          Discountamt: Discountamt,
          TotalValue: TotalValueNew
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
      'SellingPrice': 0,
      'ShippingCharges': 0,
      'MRP': 0,
      'Discountamt': 0,
      'TotalValue': 0,
      'TaxRate': 0,
      'TaxAmount': 0
    });

    sender.addRow(this.itemFormGroup);
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    this.itemFormGroup = createFormGroup(dataItem);
    this.selectedRowIndex = rowIndex;
    this.objSalesorderItem.ItemID = dataItem.ItemID;
    this.objSalesorderItem.TaxRate = dataItem.TaxRate;
    this.objSalesorderItem.TaxAmount = dataItem.TaxAmount;
    this.SellingPrice = dataItem.SellingPrice;
    sender.editRow(rowIndex, this.itemFormGroup);
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    const item = formGroup.value;
    this.objSalesorderItem.ItemCode = item.ItemCode;
    this.objSalesorderItem.ItemName = item.ItemName;
    this.objSalesorderItem.CustomerItemCode = item.CustomerItemCode;
    this.objSalesorderItem.UOMID = item.UOM;

    this.objSalesorderItem.Units = item.Units;
    this.objSalesorderItem.SellingPrice = item.SellingPrice;
    this.objSalesorderItem.ShippingCharges = item.ShippingCharges;
    this.objSalesorderItem.MRP = item.MRP;
    this.objSalesorderItem.Discountamt = item.Discountamt;
    this.objSalesorderItem.Qty = item.Units * this.objSalesOrder.MultiplierValue;
    this.objSalesorderItem.TaxRate = item.TaxRate;
    this.objSalesorderItem.TaxAmount = item.TaxAmount;
    this.objSalesorderItem.TotalValue = item.TotalValue;
    let errorMessage = this.validateItem(this.objSalesorderItem);
    if (errorMessage != null) {
      this._alertService.error(errorMessage);
      return;
    };
    if (isNew) {
      this.objSalesOrder.lstItem.splice(0, 0, this.objSalesorderItem);
    }
    else {

      let selectedItem = this.objSalesOrder.lstItem[rowIndex];
      Object.assign(
        this.objSalesOrder.lstItem.find(({ ItemID }) => ItemID === selectedItem.ItemID),
        this.objSalesOrder
      );
    }
    if (this.gridData.length > 0) {
      this.salesForm.get('CustomerID').disable();
      this.salesForm.get('InventoryType').disable();
      this.salesForm.get('IsDiscountApplicable').disable();
      this.hideOrderDate = true;
    }
    this.objSalesorderItem = new SalesorderItem();
    sender.closeRow(rowIndex);
  }

  public removeHandler({ dataItem }): void {
    const index = this.objSalesOrder.lstItem.findIndex(({ ItemID }) => ItemID === dataItem.ItemID);
    this.objSalesOrder.lstItem.splice(index, 1);
    if (this.gridData.length > 0) {
      this.salesForm.get('CustomerID').disable();
      this.salesForm.get('InventoryType').disable();
      this.salesForm.get('IsDiscountApplicable').disable();
      this.hideOrderDate = true;
    }
    else {
      this.salesForm.get('CustomerID').enable();
      this.salesForm.get('InventoryType').enable();
      this.salesForm.get('IsDiscountApplicable').enable();
      this.hideOrderDate = false;
    }
  }

  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.itemFormGroup = undefined;
    this.objSalesorderItem = new SalesorderItem();
  }

  private validateItem(orderItem: SalesorderItem): string {
    if (orderItem.ItemCode == null || orderItem.ItemCode == '') {
      return "ItemCode field required";
    }
    if (orderItem.Units == null || orderItem.Units == 0) {
      return "Units field required";
    }
    if (orderItem.UOMID == null || orderItem.UOMID == 0) {
      return "UOM field required";
    }
    if (orderItem.SellingPrice == null || orderItem.SellingPrice == 0) {
      return "Selling Price field required";
    }
    // if (orderItem.ShippingCharges == null || orderItem.ShippingCharges == 0) {
    //   return "ShippingCharges field required";
    // } 
    // if (orderItem.Discountamt == null || orderItem.Discountamt == 0) {
    //   return "Discount Amt field required";
    // }
    if (orderItem.TotalValue == null || orderItem.TotalValue == 0) {
      return "Total Value field required";
    }
    return null;
  }

  public saveData(): void {

    if (this._authorizationGuard.CheckAcess("Salesorderlist", "ViewEdit")) {
      return;
    }
    this.objSalesOrder.OrderID = this.OrderID;
    this.objSalesOrder.OrderDate = this.salesForm.controls['OrderDate'].value.startDate._d.toLocaleString();
    this.objSalesOrder.CustomerID = this.salesForm.controls['CustomerID'].value;
    this.objSalesOrder.CustomerWarehouseID = this.salesForm.controls['CustomerWarehouseID'].value;
    this.objSalesOrder.ShipTo = this.ShipTo;


    this.objSalesOrder.BilledTo = this.BilledTo;
    this.objSalesOrder.InventoryType = this.salesForm.controls['InventoryType'].value;
    this.objSalesOrder.PaymentTermsID = this.salesForm.controls['PaymentTermsID'].value;
    this.objSalesOrder.DispatchThrough = this.salesForm.controls['DispatchThrough'].value;
    this.objSalesOrder.BuyerOrderNo = this.salesForm.controls['BuyerOrderNo'].value;

    this.objSalesOrder.TransactionType = this.customerList.filter(x => { return x.CustomerID == this.salesForm.controls['CustomerID'].value })[0].CustomerType;
    this.objSalesOrder.DeliveryNote = this.salesForm.controls['DeliveryNote'].value;
    this.objSalesOrder.TermsOfDelivery = this.salesForm.controls['TermsOfDelivery'].value;
    this.objSalesOrder.Remarks = this.salesForm.controls['Remarks'].value;
    this.objSalesOrder.IsBillTo_SameAs_ShipTo = this.salesForm.controls['IsBillTo_SameAs_ShipTo'].value;

    this._spinner.show();
    this._salesService.Insert(this.objSalesOrder).subscribe(
      (data) => {
        this._spinner.hide();
        if (data != null && data.Flag == true) {
          this._alertService.success(data.Msg);
          this.router.navigate(['/Salesorderlist']);
        }
        else {
          this._alertService.error(data.Msg);
          this.router.navigate(['/Salesorderlist']);
        }
      }, (err) => {
        this._spinner.hide();
        console.log(err);
      });
    this.objSalesOrder = new Salesorder();
    this.itemDetail = new Item();
    this.uom = new UOM();
    this.objSalesOrder.lstItem = [];
    this.gridData = this.objSalesOrder.lstItem;
  }
}
