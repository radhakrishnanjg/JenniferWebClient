import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CreditnoteService } from '../../_services/service/creditnote.service';
import { CreditNoteHeader, CreditNoteDetail } from 'src/app/_services/model';

@Component({
  selector: 'app-creditnoteview',
  templateUrl: './creditnoteview.component.html',
  styleUrls: ['./creditnoteview.component.css']
})
export class CreditnoteviewComponent implements OnInit {
  obj: CreditNoteHeader = {} as any;
  lstItem: CreditNoteDetail[];
  identity: number = 0;
  cntype: string;
  constructor(
    private _creditnoteService: CreditnoteService,
    private aroute: ActivatedRoute,
  ) { }
  TotalQty:number=0;
  InvoiceTotalQtyTotal: number = 0;
  PendingQtyTotal: number = 0;
  TotalTotalAmount: number = 0.00;
  InvoiceTotalAmountTotal: number = 0.00;
  PendingAmountTotal: number = 0.00;
  ngOnInit() {
    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
      this.cntype = params.get('cntype');
      if (this.identity > 0) {
        this._creditnoteService.SearchById(this.cntype, this.identity).subscribe(
          (data: CreditNoteHeader) => { 
            this.obj = data; 
            this.TotalQty = this.obj.lstCreditNoteDetail.reduce((acc, a) => acc + a.Qty, 0);
            this.InvoiceTotalQtyTotal = this.obj.lstCreditNoteDetail.reduce((acc, a) => acc + a.InvoiceQty, 0);
            this.PendingQtyTotal = this.obj.lstCreditNoteDetail.reduce((acc, a) => acc + a.PendingQty, 0);
            this.TotalTotalAmount = this.obj.lstCreditNoteDetail.reduce((acc, a) => acc + a.TotalAmount, 0);
            this.InvoiceTotalAmountTotal = this.obj.lstCreditNoteDetail.reduce((acc, a) => acc + a.InvoiceTotalAmount, 0);
            this.PendingAmountTotal = this.obj.lstCreditNoteDetail.reduce((acc, a) => acc + a.PendingAmount, 0);
          },
          (err: any) => {
            console.log(err);
          }
        );
      }
    });
  }
}
