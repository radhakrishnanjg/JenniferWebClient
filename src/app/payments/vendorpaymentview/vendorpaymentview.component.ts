import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { VendorpaymentService } from '../../_services/service/vendorpayment.service';
import { VendorPaymentHeader } from 'src/app/_services/model';

@Component({
  selector: 'app-vendorpaymentview',
  templateUrl: './vendorpaymentview.component.html',
  styleUrls: ['./vendorpaymentview.component.css']
})
export class VendorpaymentviewComponent implements OnInit {
  obj: VendorPaymentHeader = {} as any;
  identity: number = 0;
  PaymentID: number = 0;
  constructor(
    private _vendorpaymentService: VendorpaymentService,
    private aroute: ActivatedRoute,
  ) { }

  TotalPaidAmt: number = 0;
  TotalPaidAmtHistory: number = 0;
  ngOnInit() {
    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
      if (this.identity > 0) {
        this._vendorpaymentService.SearchById(this.identity).subscribe(
          (data: VendorPaymentHeader) => {
            this.obj = data;
            this.TotalPaidAmt = this.obj.lstVendorPaymentDetail.reduce((acc, a) => acc + a.PaidAmt, 0);
            this.TotalPaidAmtHistory = this.obj.lstVendorPaymentDetailHistory.reduce((acc, a) => acc + a.PaidAmt, 0);
          },
          (err: any) => {
            console.log(err);
          }
        );
      }
    });
  }

}


