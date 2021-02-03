import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, } from '@angular/router';
import { AmazonAutoRTVOrder, SalesInvoiceHeader, } from '../../_services/model';
import { JsonPrivateUtilityService } from 'src/app/_services/service/crossborder/jsonprivateutility.service';
import { AmazonautortvService } from 'src/app/_services/service/amazonautortv.service';
@Component({
  selector: 'app-configurationinvoice',
  templateUrl: './configurationinvoice.component.html',
  styleUrls: ['./configurationinvoice.component.css']
})
export class ConfigurationinvoiceComponent implements OnInit {

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
  TCS_Amount: number = 0;
  Grand_Total: number = 0; 
  constructor(
    private aroute: ActivatedRoute,
    private _JsonPrivateUtilityService: JsonPrivateUtilityService,
    private _amazonautortvService: AmazonautortvService,

  ) { }
  lstInvoiceNumber: AmazonAutoRTVOrder[] = [] as any;
  SalesInvoiceID: number;
  ngOnInit() {
    this.SalesInvoiceID = 0;
    this.aroute.paramMap.subscribe(params => {
      let OrderID = params.get('id');
      this._JsonPrivateUtilityService.GetRTVGenerateInvoices(OrderID)
        .subscribe(data => {
          this.lstInvoiceNumber = data;
        },
          (err) => {
            console.log(err);
          });
    });
  }
  onchange_SalesInvoiceID(selectedValue: number) {
    if (selectedValue > 0) {
      this._amazonautortvService.InvoiceDownload(selectedValue)
        .subscribe(data => {
          this.objSalesInvoiceHeader = data;
          this.TotalQty = data.lstDetail.reduce((acc, a) => acc + a.Qty, 0);
          this.TotalTaxableValue = data.lstHSNCode.reduce((acc, a) => acc + a.TaxableValue, 0);
          this.TotalIGSTTaxAmount = data.lstHSNCode.reduce((acc, a) => acc + a.IGSTTaxAmount, 0);
          this.TotalCGSTTaxAmount = data.lstHSNCode.reduce((acc, a) => acc + a.CGSTTaxAmount, 0);
          this.TotalSGSTTaxAmount = data.lstHSNCode.reduce((acc, a) => acc + a.SGSTTaxAmount, 0);
          this.TotalTaxAmount = data.lstHSNCode.reduce((acc, a) => acc + a.TaxAmount, 0);
          this.TCS_Amount = data.TCS_Amount;
          this.Grand_Total = data.TotalAmount +data.TCS_Amount;
        },
          (err) => {
            console.log(err);
          });
    }
  }
}
