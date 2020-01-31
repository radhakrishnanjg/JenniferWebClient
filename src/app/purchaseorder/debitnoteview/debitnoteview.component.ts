import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DebitnoteService } from '../../_services/service/debitnote.service';
import { DebitNoteHeader, DebitNoteDetail } from 'src/app/_services/model';

@Component({
  selector: 'app-debitnoteview',
  templateUrl: './debitnoteview.component.html',
  styleUrls: ['./debitnoteview.component.css']
})
export class DebitnoteviewComponent implements OnInit {
  obj: DebitNoteHeader = {} as any;
  lstItem: DebitNoteDetail[];
  identity: number = 0;
  dntype: string;
  constructor(
    private _debitnoteService: DebitnoteService,
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
      this.dntype = params.get('dntype');
      if (this.identity > 0) {
        this._debitnoteService.SearchById(this.dntype, this.identity).subscribe(
          (data: DebitNoteHeader) => { 
            this.obj = data; 
            this.TotalQty = this.obj.lstDebitNoteDetail.reduce((acc, a) => acc + a.Qty, 0);
            this.InvoiceTotalQtyTotal = this.obj.lstDebitNoteDetail.reduce((acc, a) => acc + a.InvoiceQty, 0);
            this.PendingQtyTotal = this.obj.lstDebitNoteDetail.reduce((acc, a) => acc + a.PendingQty, 0);
            this.TotalTotalAmount = this.obj.lstDebitNoteDetail.reduce((acc, a) => acc + a.TotalAmount, 0);
            this.InvoiceTotalAmountTotal = this.obj.lstDebitNoteDetail.reduce((acc, a) => acc + a.InvoiceTotalAmount, 0);
            this.PendingAmountTotal = this.obj.lstDebitNoteDetail.reduce((acc, a) => acc + a.PendingTotalAmount, 0);
          },
          (err: any) => {
            console.log(err);
          }
        );
      }
    });

  }

}
