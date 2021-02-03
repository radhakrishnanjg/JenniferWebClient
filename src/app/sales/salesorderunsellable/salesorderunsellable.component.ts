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
  selector: 'app-salesorderunsellable',
  templateUrl: './salesorderunsellable.component.html',
  styleUrls: ['./salesorderunsellable.component.css']
})
export class SalesorderunsellableComponent implements OnInit {

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
  TotalTotalAmount: number = 0;
  TotalTaxAmount: number = 0;
  hideOrderDate: boolean = false;
  OrderDate: Date;
  orderMinDate: moment.Moment;
  orderMaxDate: moment.Moment;
  objunsell: SalesorderunsellableQty = new SalesorderunsellableQty();
  ispickitems: boolean = false;
  isadditems: boolean = false;
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
    //
    this._PrivateutilityService.getCustomersSales().subscribe(
      (data) => {
        if (data != null) {
          this.customerList = data;
        }
        //
      },
      (err) => {
        //
        console.log(err);
      }
    );
    //
    this._poService.getOrderUOMs().subscribe(
      (res) => {
        this.uomList = res;
        //
      }, (err) => {
        //
        console.log(err);
      });
    //
    this._PrivateutilityService.GetValues('Courier')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstDispatchThrough = data;
          //
        },
        (err: any) => {
          //
          console.log(err);
        }
      );
    //
    this._PrivateutilityService.getPaymentTerms().subscribe(
      (data: PaymentTermType[]) => {
        this.lstPaymentTermsID = data;
        //
      },
      (err: any) => {
        //
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

      // BuyerOrderNo: ['', [Validators.required]],
      // DeliveryNote: ['', [Validators.required]],
      TermsOfDelivery: ['', [Validators.required]],
      Remarks: ['', [Validators.required]],
      // IsDiscountApplicable: ['',],

    });
    this.ispickitems = false;
    this.isadditems = false;
    localStorage.removeItem("Unsellableqty");

    this.getCurrentServerDateTime();
    // this.orderMinDate = moment().add(0, 'days');
    // var OrderDate = moment(new Date(), 'YYYY-MM-DD[T]HH:mm').format('MM-DD-YYYY HH:mm').toString();
    // this.salesForm.patchValue({
    //   OrderDate: { startDate: new Date(OrderDate) },
    // });
    // this.OrderDate = new Date(OrderDate);
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
          //
        },
        (err: any) => {
          console.log(err);

          //
        }
      );
  }

  public onCustomerChange(customerID: number): void {
    console.log("customerID=" + customerID);
    this.objSalesOrder.CustomerID = customerID;
    //
    this._salesService.getOrderID(customerID).subscribe(
      (res) => {
        this.OrderID = res;
        this.objSalesOrder.lstItem = [];
        this.gridData = this.objSalesOrder.lstItem;
        //
      }, (err) => {
        //
        console.log(err);
      });
    this.getCustomerAddress(customerID);
    this.getCustomerWarehouse(customerID);
    //
    this._PrivateutilityService.getCustomerItemLevels(customerID).subscribe(
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
  }

  public getCustomerAddress(customerID: number): void {
    if (customerID != 0) {
      //
      this._PrivateutilityService.getCustomerAddress(customerID).subscribe(
        (data) => {
          if (data != null) {
            this.BilledTo = data['Address1'];
          }
          //
        },
        (err) => {
          //
          console.log(err);
        }
      );
    }
  }

  public getCustomerWarehouse(customerID: number): void {
    if (customerID != 0) {
      //
      this._PrivateutilityService.getCustomerWarehouse(customerID).subscribe(
        (data) => {
          if (data != null) {
            this.customerWarehouseList = data;
          }
          //
        },
        (err) => {
          //
          console.log(err);
        }
      );
    }
  }

  public onCustomerWarehouseIDChange(customerWarehouseID: number): void {
    if (customerWarehouseID != 0) {
      //
      this._PrivateutilityService.getCustomerWarehouseAddress(customerWarehouseID).subscribe(
        (data) => {
          if (data != null) {
            this.ShipTo = data['Address1'];
          }
          this.onchangeIsBillTo_SameAs_ShipTo1();
          //
        }, (err) => {
          //
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

    if (localStorage.getItem("Unsellableqty") == null) {
      let OrderDate = '';
      if (this.salesForm.controls['OrderDate'].value.startDate._d != undefined) {
        OrderDate = this.salesForm.controls['OrderDate'].value.startDate._d.toLocaleString();
      } else {
        OrderDate = this.salesForm.controls['OrderDate'].value.startDate.toLocaleString();
      }
      //let OrderDate = OrderDate1;
      let CustomerID = this.salesForm.get("CustomerID").value;
      let TransactionType = this.customerList.filter(x => { return x.CustomerID == this.salesForm.controls['CustomerID'].value })[0].CustomerType;
      //
      this._salesService.getUnsellableQty(CustomerID, TransactionType, OrderDate).subscribe(
        (data) => {
          if (data != null) {
            this.objunsell = data;
            localStorage.setItem("Unsellableqty", JSON.stringify(data.lstunsellqty));
            this.ClearAll();
            this.ispickitems = true;
            this.isadditems = false;

            this.dtOptions = {
              paging: false,
              scrollY: '400px',
              "language": {
                "search": 'Filter',
              },
            };
          }
          //
        }, (err) => {
          //
          console.log(err);
        });
    } else {
      this.ispickitems = true;
      this.isadditems = false;
    }
  }

  onchangeBrand(selectedValue: string) {
    selectedValue = selectedValue == "Brand" ? "" : selectedValue;
    let lstunsellqty = JSON.parse(localStorage.getItem("Unsellableqty"));
    if (selectedValue != "") {
      lstunsellqty = lstunsellqty.filter(a => a.BrandName == selectedValue);
    }
    this.objunsell.lstunsellqty = lstunsellqty;
  }

  onchangeProductGroupID(selectedValue: string) {

    selectedValue = selectedValue == "ProductGroup" ? "" : selectedValue;
    let lstunsellqty = JSON.parse(localStorage.getItem("Unsellableqty"));
    if (selectedValue != "") {
      lstunsellqty = lstunsellqty.filter(a => a.ProductGroupName == selectedValue);
    }
    this.objunsell.lstunsellqty = lstunsellqty;
  }

  onchangeCategoryID(selectedValue: string) {
    selectedValue = selectedValue == "Category" ? "" : selectedValue;
    let lstunsellqty = JSON.parse(localStorage.getItem("Unsellableqty"));
    if (selectedValue != "") {
      lstunsellqty = lstunsellqty.filter(a => a.CategoryName == selectedValue);
    }
    this.objunsell.lstunsellqty = lstunsellqty;
  }

  onchangeSubCategoryID(selectedValue: string) {
    selectedValue = selectedValue == "SubCategory" ? "" : selectedValue;
    let lstunsellqty = JSON.parse(localStorage.getItem("Unsellableqty"));
    if (selectedValue != "") {
      lstunsellqty = lstunsellqty.filter(a => a.SubCategoryName == selectedValue);
    }
    this.objunsell.lstunsellqty = lstunsellqty;

  }

  public updateList(id: number, property: string, value: number) {
    const editField = parseInt(value.toString());
    const AvailableQty = parseInt(this.objunsell.lstunsellqty[id]['AvailableQty'].toString());
    if (editField < 0) {
      this._alertService.error('Entered Qty must be greater than or equal to zero.!');
      return;
    }
    else if (editField > AvailableQty) {
      this._alertService.error('Entered Qty must be less than or equal to Available Qty.!');
      return;
    }
    else {
      this.objunsell.lstunsellqty[id][property] = editField;
      localStorage.setItem("Unsellableqty", JSON.stringify(this.objunsell.lstunsellqty))
    }
  }

  public addtolist() {
    let lstunsellqty = JSON.parse(localStorage.getItem("Unsellableqty"));
    lstunsellqty = lstunsellqty.filter(a => a.Qty > 0);

    if (lstunsellqty.length > 0) {
      const itemids = [];
      const map = new Map();
      for (const item of lstunsellqty) {
        if (!map.has(item.ItemID)) {
          map.set(item.ItemID, true);    // set any value to Map
          itemids.push(item.ItemID);
        }
      }
      this.objSalesOrder = new Salesorder();
      itemids.forEach(a => {
        let element = a;
        this.objSalesorderItem = new SalesorderItem();
        this.objSalesorderItem.ItemID = element;
        this.objSalesorderItem.ItemCode = lstunsellqty.filter(a => a.ItemID == element)[0].ItemCode;
        this.objSalesorderItem.ItemName = lstunsellqty.filter(a => a.ItemID == element)[0].ItemName;
        this.objSalesorderItem.CustomerItemCode = lstunsellqty.filter(a => a.ItemID == element)[0].CustomerItemCode;
        let wa: number = 0;
        //let DiscountAmount: number = 0;
        lstunsellqty.filter(a => a.ItemID == element).forEach((w, index) => {
          wa += lstunsellqty.filter(a => a.ItemID == w.ItemID)[index].SellingPrice *
            lstunsellqty.filter(a => a.ItemID == w.ItemID)[index].Qty;
        });
        this.objSalesorderItem.ItemRate = wa /
          lstunsellqty.filter(a => a.ItemID == element).reduce((acc, a) => acc + a.Qty, 0);
        this.objSalesorderItem.Qty = lstunsellqty.filter(a => a.ItemID == element).reduce((acc, a) => acc + a.Qty, 0);
        this.objSalesorderItem.DiscountID = lstunsellqty.filter(a => a.ItemID == element)[0].DiscountID;
        this.objSalesorderItem.TaxRate = lstunsellqty.filter(a => a.ItemID == element)[0].TaxRate;

        let LiquidationPercent = lstunsellqty.filter(a => a.ItemID == element)[0].LiquidationPercent;
        if (this.objSalesorderItem.DiscountID > 0) {
          this.objSalesorderItem.Discountamt =
            ((this.objSalesorderItem.ItemRate * this.objSalesorderItem.Qty)) *
            ((100 - LiquidationPercent) / 100);
        } else {
          this.objSalesorderItem.Discountamt = 0;
        }
        this.objSalesorderItem.TaxAmount =
          ((((this.objSalesorderItem.ItemRate * this.objSalesorderItem.Qty) - this.objSalesorderItem.Discountamt) /
            ((100 + this.objSalesorderItem.TaxRate) / 100)) * this.objSalesorderItem.TaxRate) / 100
        this.objSalesorderItem.Add_DiscRK = 0;
        this.objSalesorderItem.Add_DiscAmazon = 0;
        this.objSalesorderItem.TotalValue =
          ((this.objSalesorderItem.ItemRate * this.objSalesorderItem.Qty) - this.objSalesorderItem.Discountamt);

        this.objSalesOrder.lstItem.push(this.objSalesorderItem);
        this.TotalQty = this.objSalesOrder.lstItem.reduce((acc, a) => acc + a.Qty, 0);
        this.TotalSellingPrice = this.objSalesOrder.lstItem.reduce((acc, a) => acc + a.ItemRate, 0);
        this.TotalMRP = this.objSalesOrder.lstItem.reduce((acc, a) => acc + a.MRP, 0);
        this.TotalDiscountamt = this.objSalesOrder.lstItem.reduce((acc, a) => acc + a.Discountamt, 0);
        this.TotalTaxAmount = this.objSalesOrder.lstItem.reduce((acc, a) => acc + a.TaxAmount, 0);
        this.TotalTotalAmount = this.objSalesOrder.lstItem.reduce((acc, a) => acc + a.TotalValue, 0);
        this.TotalAdd_DiscRK = this.objSalesOrder.lstItem.reduce((acc, a) => acc + a.Add_DiscRK, 0);
        this.TotalAdd_DiscAmazon = this.objSalesOrder.lstItem.reduce((acc, a) => acc + a.Add_DiscAmazon, 0);
        if (this.objSalesOrder.lstItem.length > 0) {
          this.salesForm.get('CustomerID').disable();
          this.salesForm.get('InventoryType').disable();
          this.hideOrderDate = true;
        }
      });
      this.ispickitems = false;
      this.isadditems = true;
    }
    else {
      this.ispickitems = true;
      this.isadditems = false;
      this._alertService.error("Please enter quantity for atleast one item to proceed!.");
      return;
    }
  }

  public addtolistCancel() {
    this.ispickitems = true;
    this.isadditems = false;
  }

  public ClearAll() {
    $('#BrandID').val('Brand');
    $('#ProductGroupID').val('ProductGroup');
    $('#CategoryID').val('Category');
    $('#SubCategoryID').val('SubCategory');
    let lstunsellqty = JSON.parse(localStorage.getItem("Unsellableqty"));
    lstunsellqty.forEach((element, index) => {
      lstunsellqty[index].Qty = 0;
    });
    this.objunsell.lstunsellqty = lstunsellqty;
    localStorage.setItem("Unsellableqty", JSON.stringify(this.objunsell.lstunsellqty));
  }

  updateListAdd_DiscRK(id: number, property: string, value: number) {
    const editField = parseFloat(value.toString());
    const ItemRate = parseFloat(this.objSalesOrder.lstItem[id]['ItemRate'].toString());
    const Qty = parseFloat(this.objSalesOrder.lstItem[id]['Qty'].toString());
    const Add_DiscRK = parseFloat(this.objSalesOrder.lstItem[id].Add_DiscRK == undefined ? "0" : this.objSalesOrder.lstItem[id].Add_DiscRK.toString());
    const ItemID = this.objSalesOrder.lstItem[id]['ItemID'].toString();
    const Add_DiscAmazon = parseFloat(this.objSalesOrder.lstItem[id].Add_DiscAmazon == undefined ? "0" : this.objSalesOrder.lstItem[id].Add_DiscAmazon.toString());

    if (editField < 0) {
      this._alertService.error('Entered Additional Discount (RK) must be greater than or equal to zero.!');
      $('#Add_DiscRK' + ItemID).val(Add_DiscRK);
      return;
    }
    else if (editField > (ItemRate * Qty) - Add_DiscAmazon) {
      this._alertService.error('Entered Additional Discount (RK) must be less than or equal to (ItemRate * Qty ) - Additional Discount (Amazon).!');
      $('#Add_DiscRK' + ItemID).val(Add_DiscRK);
      return;
    }
    else {
      this.objSalesOrder.lstItem[id][property] = editField;
      this.objSalesOrder.lstItem[id].TaxAmount =
        ((((this.objSalesOrder.lstItem[id].ItemRate * this.objSalesOrder.lstItem[id].Qty) -
          this.objSalesOrder.lstItem[id].Discountamt -
          this.objSalesOrder.lstItem[id].Add_DiscRK -
          this.objSalesOrder.lstItem[id].Add_DiscAmazon) /
          ((100 + this.objSalesOrder.lstItem[id].TaxRate) / 100)) * this.objSalesOrder.lstItem[id].TaxRate) / 100
      this.objSalesorderItem.TotalValue =
        ((this.objSalesorderItem.ItemRate * this.objSalesorderItem.Qty) -
          this.objSalesorderItem.Discountamt -
          this.objSalesOrder.lstItem[id].Add_DiscRK -
          this.objSalesOrder.lstItem[id].Add_DiscAmazon);
      //sum of all columns 
      this.TotalSellingPrice = this.objSalesOrder.lstItem.reduce((acc, a) => acc + a.ItemRate, 0);
      this.TotalTaxAmount = this.objSalesOrder.lstItem.reduce((acc, a) => acc + a.TaxAmount, 0);
      this.TotalDiscountamt = this.objSalesOrder.lstItem.reduce((acc, a) => acc + a.Discountamt, 0);
      this.TotalAdd_DiscRK = this.objSalesOrder.lstItem.reduce((acc, a) => acc + a.Add_DiscRK, 0);
      this.TotalAdd_DiscAmazon = this.objSalesOrder.lstItem.reduce((acc, a) => acc + a.Add_DiscAmazon, 0);
      this.TotalTotalAmount = this.objSalesOrder.lstItem.reduce((acc, a) => acc + a.TotalValue, 0);
    }
  }
  TotalAdd_DiscRK: number = 0;
  TotalAdd_DiscAmazon: number = 0;
  updateListAdd_DiscAmazon(id: number, property: string, value: number) {
    const editField = parseFloat(value.toString());
    const ItemRate = parseFloat(this.objSalesOrder.lstItem[id]['ItemRate'].toString());
    const Qty = parseFloat(this.objSalesOrder.lstItem[id]['Qty'].toString());
    const Add_DiscAmazon = parseFloat(this.objSalesOrder.lstItem[id].Add_DiscAmazon == undefined ? "0" : this.objSalesOrder.lstItem[id].Add_DiscAmazon.toString());
    const ItemID = this.objSalesOrder.lstItem[id]['ItemID'].toString();
    const Add_DiscRK = parseFloat(this.objSalesOrder.lstItem[id].Add_DiscRK == undefined ? "0" : this.objSalesOrder.lstItem[id].Add_DiscRK.toString());
    if (editField < 0) {
      this._alertService.error('Entered Additional Discount (Amazon) must be greater than or equal to zero.!');
      $('#Add_DiscAmazon' + ItemID).val(Add_DiscAmazon);
      return;
    }
    else if (editField > (ItemRate * Qty) - Add_DiscRK) {
      this._alertService.error('Entered Additional Discount (Amazon) must be less than or equal to (ItemRate * Qty ) - Additional Discount (Amazon).!');
      $('#Add_DiscAmazon' + ItemID).val(Add_DiscAmazon);
      return;
    }
    else {
      this.objSalesOrder.lstItem[id][property] = editField;
      this.objSalesOrder.lstItem[id].TaxAmount =
        ((((this.objSalesOrder.lstItem[id].ItemRate * this.objSalesOrder.lstItem[id].Qty) -
          this.objSalesOrder.lstItem[id].Discountamt -
          this.objSalesOrder.lstItem[id].Add_DiscRK -
          this.objSalesOrder.lstItem[id].Add_DiscAmazon) /
          ((100 + this.objSalesOrder.lstItem[id].TaxRate) / 100)) * this.objSalesOrder.lstItem[id].TaxRate) / 100
      this.objSalesorderItem.TotalValue =
        ((this.objSalesorderItem.ItemRate * this.objSalesorderItem.Qty) -
          this.objSalesorderItem.Discountamt -
          this.objSalesOrder.lstItem[id].Add_DiscRK -
          this.objSalesOrder.lstItem[id].Add_DiscAmazon);
      //sum of all columns 
      this.TotalSellingPrice = this.objSalesOrder.lstItem.reduce((acc, a) => acc + a.ItemRate, 0);
      this.TotalTaxAmount = this.objSalesOrder.lstItem.reduce((acc, a) => acc + a.TaxAmount, 0);
      this.TotalDiscountamt = this.objSalesOrder.lstItem.reduce((acc, a) => acc + a.Discountamt, 0);
      this.TotalAdd_DiscRK = this.objSalesOrder.lstItem.reduce((acc, a) => acc + a.Add_DiscRK, 0);
      this.TotalAdd_DiscAmazon = this.objSalesOrder.lstItem.reduce((acc, a) => acc + a.Add_DiscAmazon, 0);
      this.TotalTotalAmount = this.objSalesOrder.lstItem.reduce((acc, a) => acc + a.TotalValue, 0);
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

    if (this.objSalesOrder.lstItem == null || this.objSalesOrder.lstItem.length == 0) {
      this._alertService.error("Order Items is Empty.Please add items to proceed!.");
      return;
    }
    if (this.TotalTotalAmount == 0 || isNaN(this.TotalTotalAmount)) {
      this._alertService.error("Please enter additional discounts as zero if not required!.");
      return;
    }
    this.objSalesOrder.lstItemUnsellable = this.objunsell.lstunsellqty.filter(a => a.Qty > 0);
    this.objSalesOrder.OrderID = this.OrderID;
    if (this.salesForm.controls['OrderDate'].value.startDate._d != undefined) {
      this.objSalesOrder.OrderDate = this.salesForm.controls['OrderDate'].value.startDate._d.toLocaleString();
    } else {
      this.objSalesOrder.OrderDate = this.salesForm.controls['OrderDate'].value.startDate.toLocaleString();
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

    //
    this._salesService.Insert(this.objSalesOrder).subscribe(
      (data) => {
        //
        if (data != null && data.Flag == true) {
          this._alertService.success(data.Msg);
          this.router.navigate(['/Salesorderlist']);
        }
        else {
          this._alertService.error(data.Msg);
          this.router.navigate(['/Salesorderlist']);
        }
        localStorage.removeItem("Unsellableqty");
      }, (err) => {
        //
        console.log(err);
      });
    this.objSalesOrder = new Salesorder();
    this.itemDetail = new Item();
    this.uom = new UOM();
    this.objSalesOrder.lstItem = [];
    this.gridData = this.objSalesOrder.lstItem;
  }

}
