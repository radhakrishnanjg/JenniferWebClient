import { Component, OnInit } from '@angular/core';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { SalesorderService } from '../../_services/service/salesorder.service';
import { PoService } from '../../_services/service/po.service';
import { FormGroup, Validators, FormBuilder, } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { AuthorizationGuard } from '../../_guards/Authorizationguard';
import {
  Salesorder, Brand, ProductGroup, Category, SubCategory,
  Item, UOM, Customer, Customerwarehouse, Dropdown, PaymentTermType,
  SalesorderItem, SalesorderunsellableQty,
} from '../../_services/model';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-salesorderunsellable-dispute',
  templateUrl: './salesorderunsellable-dispute.component.html',
  styleUrls: ['./salesorderunsellable-dispute.component.css']
})
export class SalesorderunsellableDisputeComponent implements OnInit {

  customerList: Customer[];
  customerWarehouseList: Customerwarehouse[];
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
  TotalTotalAmount: number = 0;
  TotalTaxAmount: number = 0;
  hideOrderDate: boolean = false;
  OrderDate: Date;
  orderMinDate: moment.Moment;
  orderMaxDate: moment.Moment;
  constructor(
    private _salesService: SalesorderService,
    private _poService: PoService,
    private _PrivateutilityService: PrivateutilityService,
    private _authorizationGuard: AuthorizationGuard,

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


  OrderDateUpdated(range) {
    this.OrderDate = range.startDate
  }

  ngOnInit() {


    this.action = true;
    this.objSalesOrder.lstItem = [];
    this.gridData = this.objSalesOrder.lstItem;
    this._PrivateutilityService.getCustomersSales().subscribe(
      (data) => {
        if (data != null) {
          this.customerList = data;
        }
      },
      (err) => {
        console.log(err);
      }
    );
    this._poService.getOrderUOMs().subscribe(
      (res) => {
        this.uomList = res;
        //
      }, (err) => {
        //
        console.log(err);
      });
    this._PrivateutilityService.GetValues('Courier')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstDispatchThrough = data;
        },
        (err: any) => {
          console.log(err);
        }
      );
    this._PrivateutilityService.getPaymentTerms().subscribe(
      (data: PaymentTermType[]) => {
        this.lstPaymentTermsID = data;
      },
      (err: any) => {
        console.log(err);
      }
    );


    var end = moment().endOf('day');
    var currentend = new Date();
    var differ = end.diff(currentend, 'minutes');
    this.orderMaxDate = moment().add(differ, 'minutes');

    this.salesForm = this.fb.group({
      CustomerID: [0, [Validators.min(1)]],
      CustomerWarehouseID: [0, [Validators.min(1)]],
      OrderDate: [currentend, [Validators.required]],


      IsBillTo_SameAs_ShipTo: ['',],
      InventoryType: ['UNSELLABLE', [Validators.required]],
      PaymentTermsID: [0, [Validators.min(1)]],
      DispatchThrough: ['', [Validators.required]],
      TermsOfDelivery: ['', [Validators.required]],
      Remarks: ['', [Validators.required]],
    });
    this.getCurrentServerDateTime();
  }

  private getCurrentServerDateTime() {
    //
    this._PrivateutilityService.getCurrentDate()
      .subscribe(
        (data: Date) => {
          var mcurrentDate = moment(data, 'YYYY-MM-DD[T]HH:mm').format('MM-DD-YYYY HH:mm').toString();
          this.salesForm.patchValue({
            OrderDate: { startDate: new Date(mcurrentDate) },
          });
          this.orderMinDate = moment(data).add(0, 'days');
          this.OrderDate = new Date(mcurrentDate);
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  public onCustomerChange(customerID: number): void {
    console.log("customerID=" + customerID);
    this.objSalesOrder.CustomerID = customerID;
    this._salesService.getOrderID(customerID).subscribe(
      (res) => {
        this.OrderID = res;
        this.objSalesOrder.lstItem = [];
        this.gridData = this.objSalesOrder.lstItem;
      }, (err) => {
        console.log(err);
      });
    this.getCustomerAddress(customerID);
    this.getCustomerWarehouse(customerID);
    this._PrivateutilityService.getCustomerItemLevels(customerID).subscribe(
      (data) => {
        if (data != null) {
          this.itemList = data.filter(a => { return a.Type == 'Item' });
        }
      },
      (err) => {
        this.itemList = [];
        console.log(err);
        //
      }
    );
  }

  public getCustomerAddress(customerID: number): void {
    if (customerID != 0) {
      this._PrivateutilityService.getCustomerAddress(customerID).subscribe(
        (data) => {
          if (data != null) {
            this.BilledTo = data['Address1'];
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  public getCustomerWarehouse(customerID: number): void {
    if (customerID != 0) {
      this._PrivateutilityService.getCustomerWarehouse(customerID).subscribe(
        (data) => {
          if (data != null) {
            this.customerWarehouseList = data;
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  public onCustomerWarehouseIDChange(customerWarehouseID: number): void {
    if (customerWarehouseID != 0) {
      this._PrivateutilityService.getCustomerWarehouseAddress(customerWarehouseID).subscribe(
        (data) => {
          if (data != null) {
            this.ShipTo = data['Address1'];
          }
          this.onchangeIsBillTo_SameAs_ShipTo1();
        }, (err) => {
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
    if (this.IsBillTo_SameAs_ShipTo) {
      this.IsBillTo_SameAs_ShipTo = true;
      this.BilledTo = this.ShipTo;
    } else {
      this.IsBillTo_SameAs_ShipTo = false;
      let customerID = this.salesForm.controls['CustomerID'].value;
      this.getCustomerAddress(customerID);
    }
  }


  public chooseitems(): void {
    //stop here if form is invalid
    if (this.salesForm.invalid) {
      return;
    }

    if (this._authorizationGuard.CheckAcess("Salesorderlist", "ViewEdit")) {
      return;
    }

    let OrderDate = '';
    if (this.salesForm.controls['OrderDate'].value.startDate._d != undefined) {
      OrderDate = this.salesForm.controls['OrderDate'].value.startDate._d.toLocaleString();
    } else {
      OrderDate = this.salesForm.controls['OrderDate'].value.startDate.toLocaleString();
    }
    //let OrderDate = OrderDate1;
    let CustomerID = this.salesForm.get("CustomerID").value;
    let TransactionType = this.customerList.filter(x => { return x.CustomerID == this.salesForm.controls['CustomerID'].value })[0].CustomerType;
    this._salesService.GetDisputeSalesDropDown(CustomerID, TransactionType, OrderDate).subscribe(
      (data: SalesorderItem[]) => {
        if (data != null) {
          this.objSalesOrder.lstItem = data;
          this.TotalActualItemRate = this.objSalesOrder.lstItem.reduce((acc, a) => acc + a.ActualItemRate, 0);
          this.TotalAvailableQty = this.objSalesOrder.lstItem.reduce((acc, a) => acc + a.AvailableQty, 0);
        }
      }, (err) => {
        console.log(err);
      });
  }
  TotalActualItemRate: number = 0;
  TotalAvailableQty = 0;
  TotalTotalValue: number = 0;
  TotalItemRate: number = 0;
  public updateItemRateList(id: number, property: string, value: number) {
    const editField = parseInt(value.toString());
    const ActualItemRate = parseInt(this.objSalesOrder.lstItem[id]['ActualItemRate'].toString());
    const ItemRate = parseInt(this.objSalesOrder.lstItem[id]['ItemRate'].toString());
    const ItemID = id.toString();
    if (editField < 0) {
      $('#ItemRate' + ItemID).val(ItemRate);
      this._alertService.error('Entered Liquidation Price must be greater than or equal to zero.!');
      return;
    }
    else if (editField > 100000) {
      this._alertService.error('Entered Liquidation Price must be less than or equal to 100000.!');
      $('#ItemRate' + ItemID).val(ItemRate);
      return;
    }
    else {
      this.objSalesOrder.lstItem[id][property] = editField;
      this.objSalesOrder.lstItem[id]["TotalValue"] = editField * this.objSalesOrder.lstItem[id]["AvailableQty"];
      this.TotalItemRate = this.objSalesOrder.lstItem.reduce((acc, a) => acc + a.ItemRate, 0);
      this.TotalTotalValue = this.objSalesOrder.lstItem.reduce((acc, a) => acc + a.TotalValue, 0);
    }
  }

  public saveData(): void {
    // stop here if form is invalid
    if (this.salesForm.invalid) {
      return;
    }
    if (this._authorizationGuard.CheckAcess("Salesorderlist", "ViewEdit")) {
      return;
    }
    if (this.objSalesOrder.lstItem == null || this.objSalesOrder.lstItem.filter(a => a.ItemRate > 0).length == 0) {
      this._alertService.error("Order Items is Empty.Please enter Liquidation Price to proceed further!.");
      return;
    }
    this.objSalesOrder.lstItem.filter(a => a.ItemRate > 0).forEach(element => {
      element.Qty = 1;
    });
    this.objSalesOrder.lstItem = this.objSalesOrder.lstItem.filter(a => a.ItemRate > 0);
    this.objSalesOrder.OrderID = this.OrderID;
    if (this.salesForm.controls['OrderDate'].value.startDate._d != undefined) {
      let OrderDate = this.salesForm.controls['OrderDate'].value.startDate._d.toLocaleString();
      this.objSalesOrder.OrderDate = new Date(moment(new Date(OrderDate)).format("MM-DD-YYYY HH:mm"));
    } else {
      let OrderDate = this.salesForm.controls['OrderDate'].value.startDate.toLocaleString();
      this.objSalesOrder.OrderDate = new Date(moment(new Date(OrderDate)).format("MM-DD-YYYY HH:mm"));
    }
    this.objSalesOrder.CustomerID = this.salesForm.controls['CustomerID'].value;
    this.objSalesOrder.CustomerWarehouseID = this.salesForm.controls['CustomerWarehouseID'].value;
    this.objSalesOrder.ShipTo = this.ShipTo;

    this.objSalesOrder.BilledTo = this.BilledTo;
    this.objSalesOrder.InventoryType = this.salesForm.controls['InventoryType'].value;
    this.objSalesOrder.PaymentTermsID = this.salesForm.controls['PaymentTermsID'].value;
    this.objSalesOrder.DispatchThrough = this.salesForm.controls['DispatchThrough'].value;

    this.objSalesOrder.TransactionType = this.customerList.filter(x => { return x.CustomerID == this.salesForm.controls['CustomerID'].value })[0].CustomerType;
    this.objSalesOrder.TermsOfDelivery = this.salesForm.controls['TermsOfDelivery'].value;
    this.objSalesOrder.Remarks = this.salesForm.controls['Remarks'].value;
    this.objSalesOrder.IsBillTo_SameAs_ShipTo = this.salesForm.controls['IsBillTo_SameAs_ShipTo'].value;
    this._salesService.InsertDisputeSalesOrder(this.objSalesOrder).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this._alertService.success(data.Msg);
          this.objSalesOrder = new Salesorder();
          this.itemDetail = new Item();
          this.uom = new UOM();
          this.objSalesOrder.lstItem = [];
          this.gridData = this.objSalesOrder.lstItem;
          this.router.navigate(['/Salesorderlist']);
        }
        else {
          this._alertService.error(data.Msg);
        }
      }, (err) => {
        console.log(err);
      });
  }


}
