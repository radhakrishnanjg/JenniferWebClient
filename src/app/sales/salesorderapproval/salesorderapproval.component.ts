import { Component, OnInit } from '@angular/core';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { SalesorderService } from '../../_services/service/salesorder.service';
import { FormGroup, FormBuilder, } from '@angular/forms';
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

@Component({
  selector: 'app-salesorderapproval',
  templateUrl: './salesorderapproval.component.html',
  styleUrls: ['./salesorderapproval.component.css']
})
export class SalesorderapprovalComponent implements OnInit {
  objSalesOrder: Salesorder = new Salesorder();
  salesapprovalForm: FormGroup;
  panelTitle: string = "Sales Order Approval";
  orderDate: { startDate: moment.Moment, endDate: moment.Moment };
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

  constructor(
    private _salesService: SalesorderService, 
    private _authorizationGuard: AuthorizationGuard,
    private _spinner: NgxSpinnerService,
    public _alertService: ToastrService,
    private fb: FormBuilder,
    private router: Router,
    private aroute: ActivatedRoute,
  ) {
    this.objSalesOrder.lstItem = [] as any;
  }

  ngOnInit() {

    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
      if (this.identity > 0) {
        this.panelTitle = "Sales Order Approval";
        this.action = false;
        this._spinner.show();
        this._salesService.searchById(this.identity)
          .subscribe(
            (data: Salesorder) => {
              this._spinner.hide();
              this.objSalesOrder = data;
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
      }
    });
  }



  saveData(buttonType): void {
    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
    });
    let ApprovalStatus = buttonType == "Approve" ? 'Approved' : 'Rejected';
    this._spinner.show();
    this._salesService.approval(this.identity, ApprovalStatus).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this._alertService.success(data.Msg);
        } else {
          this._alertService.error(data.Msg);
        }
        this.router.navigate(['/Salesorderapprovallist']);
        this._spinner.hide();
      },
      (error: any) => {
        this._spinner.hide();
        console.log(error);
      }
    ); 
  }


}
