import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CustomerreceiptService } from '../../_services/service/customerreceipt.service';
import { CustomerReceiptHeader } from 'src/app/_services/model';

@Component({
  selector: 'app-customerreceiptview',
  templateUrl: './customerreceiptview.component.html',
  styleUrls: ['./customerreceiptview.component.css']
})
export class CustomerreceiptviewComponent implements OnInit {

  obj: CustomerReceiptHeader = {} as any;
  identity: number = 0;
  constructor(
    private _customerreceiptService: CustomerreceiptService,
    private aroute: ActivatedRoute,
  ) { }

  TotalReceivedAmt: number = 0;
  TotalReceivableAmt: number = 0;
  ngOnInit() {
    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
      if (this.identity > 0) {
        this._customerreceiptService.SearchById(this.identity).subscribe(
          (data: CustomerReceiptHeader) => {
            this.obj = data;
            this.TotalReceivableAmt = this.obj.lstCustomerReceiptDetail.
            reduce((acc, a) => acc + a.ReceivableAmt, 0);
            this.TotalReceivedAmt = this.obj.lstCustomerReceiptDetail.reduce((acc, a) => acc + a.ReceivedAmt, 0);
          },
          (err: any) => {
            console.log(err);
          }
        );
      }
    });
  }


}
