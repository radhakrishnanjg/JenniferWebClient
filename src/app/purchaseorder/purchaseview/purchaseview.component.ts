import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { InvoiceService } from '../../_services/service/invoice.service';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { Invoice, Invoiceitem } from '../../_services/model';

@Component({
  selector: 'app-purchaseview',
  templateUrl: './purchaseview.component.html',
  styleUrls: ['./purchaseview.component.css']
})
export class PurchaseviewComponent implements OnInit {
  obj: Invoice;
  identity: number = 0;
  POID: number = 0; 
  TotalQty: number = 0;
  TotalRate: number = 0;
  TotalMRP: number = 0;
  TotalDirectCost: number = 0;
  TotalTaxAmount: number = 0;
  TotalTotalAmount: number = 0;
  InvoiceDate: any;

  constructor(
    public _invoiceService: InvoiceService,
    public _privateutilityService: PrivateutilityService,
    public _alertService: ToastrService,
    
    private aroute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
      this.POID = +params.get('PoId');
      if (this.identity > 0) {
        //
        this._invoiceService.searchById(this.identity, this.POID)
          .subscribe(
            (data: Invoice) => {
              this.obj = data; 
              this.TotalQty = this.obj.lstItem.reduce((acc, a) => acc + a.Qty, 0);
              this.TotalRate = this.obj.lstItem.reduce((acc, a) => acc + a.Rate, 0);
              this.TotalMRP = this.obj.lstItem.reduce((acc, a) => acc + a.MRP, 0);
              this.TotalTaxAmount = this.obj.lstItem.reduce((acc, a) => acc + a.TaxAmount, 0);
              this.TotalDirectCost = this.obj.lstItem.reduce((acc, a) => acc + a.DirectCost, 0);
              this.TotalTotalAmount = this.obj.lstItem.reduce((acc, a) => acc + a.TotalAmount, 0);
              //
            },
            (err: any) => {
              console.log(err);
              //
            }
          );
      }
    });
  }

}
