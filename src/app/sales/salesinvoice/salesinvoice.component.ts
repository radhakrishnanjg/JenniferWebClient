import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, } from '@angular/router';
import { PicklistService } from '../../_services/service/picklist.service';

import { SalesInvoiceHeader, } from '../../_services/model';
@Component({
  selector: 'app-salesinvoice',
  templateUrl: './salesinvoice.component.html',
  styleUrls: ['./salesinvoice.component.css']
})

export class SalesinvoiceComponent implements OnInit {

  objSalesInvoiceHeader: SalesInvoiceHeader = new SalesInvoiceHeader();
  public breakParagraphs = false;
  public get keepTogether(): string {
    return this.breakParagraphs ? '' : 'div';
  }
  public repeatHeaders = true;
  TotalQty: number = 0;
  TotalTaxableValue: number = 0
  TotalIGSTTaxAmount: number = 0;
  TotalCGSTTaxAmount: number = 0;
  TotalSGSTTaxAmount: number = 0;
  TotalTaxAmount: number = 0;

  constructor(
    private aroute: ActivatedRoute,
    private _PicklistService: PicklistService,

  ) { }
  TCS_Amount: number=0;
  Grand_Total:number=0;
  ngOnInit() {
    this.aroute.paramMap.subscribe(params => {
      let PickListNumber = +params.get('id'); 
      this._PicklistService.InvoiceDownload(PickListNumber)
        .subscribe(data => {
          this.objSalesInvoiceHeader = data;
          this.TotalQty = data.lstDetail.reduce((acc, a) => acc + a.Qty, 0);
          //hsn total
          this.TotalTaxableValue = data.lstHSNCode.reduce((acc, a) => acc + a.TaxableValue, 0);
          this.TotalIGSTTaxAmount = data.lstHSNCode.reduce((acc, a) => acc + a.IGSTTaxAmount, 0);
          this.TotalCGSTTaxAmount = data.lstHSNCode.reduce((acc, a) => acc + a.CGSTTaxAmount, 0);
          this.TotalSGSTTaxAmount = data.lstHSNCode.reduce((acc, a) => acc + a.SGSTTaxAmount, 0);
          this.TotalTaxAmount = data.lstHSNCode.reduce((acc, a) => acc + a.TaxAmount, 0);
          this.TCS_Amount = data.TCS_Amount;
          this.Grand_Total= data.TotalAmount + data.TCS_Amount;
        },
          (err) => { 
            console.log(err);
          });
    });
  }
}
