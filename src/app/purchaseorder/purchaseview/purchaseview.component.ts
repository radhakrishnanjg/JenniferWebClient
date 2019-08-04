import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
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
  lstItem: Invoiceitem[];
  TotalQty: number = 0;
  TotalRate: number = 0;
  TotalMRP: number = 0;
  TotalTaxRate: number = 0;
  TotalDirectCost: number = 0;
  TotalTaxAmount: number = 0;
  TotalTotalAmount: number = 0;
  InvoiceDate: any;

  constructor(
    public _invoiceService: InvoiceService,
    public _privateutilityService: PrivateutilityService,
    public _alertService: ToastrService,
    public _spinner: NgxSpinnerService,
    private aroute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
      this.POID = +params.get('PoId');
      if (this.identity > 0) {
        this._spinner.show();
        this._invoiceService.searchById(this.identity, this.POID)
          .subscribe(
            (data: Invoice) => {
              this.obj = data;

              this._spinner.show();
              this._invoiceService.getInvoiceItems(this.identity)
                .subscribe(
                  (data: Invoiceitem[]) => {
                    this.lstItem = data;
                    this.TotalQty = this.lstItem.reduce((acc, a) => acc + a.Qty, 0);
                    this.TotalRate = this.lstItem.reduce((acc, a) => acc + a.Rate, 0);
                    this.TotalMRP = this.lstItem.reduce((acc, a) => acc + a.MRP, 0);
                    this.TotalTaxRate = this.lstItem.reduce((acc, a) => acc + a.TaxRate, 0);
                    this.TotalTaxAmount = this.lstItem.reduce((acc, a) => acc + a.TaxAmount, 0);
                    this.TotalDirectCost = this.lstItem.reduce((acc, a) => acc + a.DirectCost, 0);
                    this.TotalTotalAmount = this.lstItem.reduce((acc, a) => acc + a.TotalAmount, 0);
                    this._spinner.hide();
                  },
                  (err: any) => {
                    this._spinner.hide();
                    console.log(err);
                  }
                );

              this._spinner.hide();
            },
            (err: any) => {
              console.log(err);
              this._spinner.hide();
            }
          );
      }
    });
  }

}
