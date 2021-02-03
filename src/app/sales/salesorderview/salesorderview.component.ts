import { Component, OnInit } from '@angular/core';
import { SalesorderService } from '../../_services/service/salesorder.service';

import { ToastrService } from 'ngx-toastr';
import {  Salesorder,} from '../../_services/model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-salesorderview',
  templateUrl: './salesorderview.component.html',
  styleUrls: ['./salesorderview.component.css']
})
export class SalesorderviewComponent implements OnInit {

  objSalesOrder: Salesorder = new Salesorder();

  IsDiscountApplicable: boolean;
  identity: number = 0;
  TotalCaseSize: number = 0;
  TotalMultiplierValue: number = 0;
  TotalQty: number = 0;
  TotalItemRate: number = 0;
  TotalMRP: number = 0;
  TotalShippingCharges: number = 0;
  TotalDiscountamt: number = 0;
  TotalTaxAmount: number = 0;
  TotalTotalAmount: number = 0;
  panelTitle: string = "Add New SalesOrder";
  constructor(
    private _salesService: SalesorderService,
    
    public _alertService: ToastrService,
    private aroute: ActivatedRoute,
  ) {
    this.objSalesOrder.lstItem = [] as any;
  }
  TotalAdd_DiscRK: number = 0;
  TotalAdd_DiscAmazon: number = 0;
  ngOnInit() {

    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
      if (this.identity > 0) {
        this.panelTitle = "View Sales Order";
        //
        this._salesService.searchById(this.identity)
          .subscribe(
            (data: Salesorder) => { 
              this.objSalesOrder = data; 
              this.TotalCaseSize = data.lstItem.reduce((acc, a) => acc + a.Units, 0);
              this.TotalMultiplierValue = data.lstItem.reduce((acc, a) => acc + a.MultiplierValue, 0);
              this.TotalQty = data.lstItem.reduce((acc, a) => acc + a.Qty, 0);
              this.TotalItemRate = data.lstItem.reduce((acc, a) => acc + a.ItemRate, 0);
              this.TotalMRP = data.lstItem.reduce((acc, a) => acc + a.MRP, 0);
              this.TotalShippingCharges = data.lstItem.reduce((acc, a) => acc + a.ShippingCharges, 0);
              this.TotalDiscountamt = data.lstItem.reduce((acc, a) => acc + a.Discountamt, 0);
              this.TotalTaxAmount = data.lstItem.reduce((acc, a) => acc + a.TaxAmount, 0);
              this.TotalTotalAmount = data.lstItem.reduce((acc, a) => acc + a.TotalValue, 0);
              this.TotalAdd_DiscRK = this.objSalesOrder.lstItem.reduce((acc, a) => acc + a.Add_DiscRK, 0);
              this.TotalAdd_DiscAmazon = this.objSalesOrder.lstItem.reduce((acc, a) => acc + a.Add_DiscAmazon, 0);
            },
            (err) => { 
              console.log(err);
            }
          );
      }
    });
  }

}
