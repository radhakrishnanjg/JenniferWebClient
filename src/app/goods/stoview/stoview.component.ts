import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { StoService } from '../../_services/service/sto.service';
import { Sto, Stodetail } from '../../_services/model';

@Component({
  selector: 'app-stoview',
  templateUrl: './stoview.component.html',
  styleUrls: ['./stoview.component.css']
})
export class StoviewComponent implements OnInit {
  obj: Sto;
  lstItem: Stodetail[];
  identity: number = 0;
  TotalUnits: number = 0;
  TotalItemRate: number = 0;
  TotalDiscountValue: number = 0;
  TotalMultiplierValue: number = 0;
  TotalDirectCost: number = 0;
  TotalTaxAmount: number = 0;
  TotalTotalAmount: number = 0;
  TotalQty: number = 0;
  constructor(
    public _stoService: StoService,
    public _alertService: ToastrService,
    
    private aroute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
      if (this.identity > 0) {
        //
        this._stoService.searchById(this.identity)
          .subscribe(
            (data: Sto) => {
              this.obj = data;
              //this.TotalUnits = data.lstItem.reduce((acc, a) => acc + a.Units, 0);
              // this.TotalMultiplierValue = data.lstItem.reduce((acc, a) => acc + a.MultiplierValue, 0);
              this.TotalItemRate = data.lstItem.reduce((acc, a) => acc + a.ItemRate, 0);
              this.TotalDirectCost = data.lstItem.reduce((acc, a) => acc + a.DirectCost, 0);
              this.TotalDiscountValue = data.lstItem.reduce((acc, a) => acc + a.DiscountValue, 0);
              this.TotalTaxAmount = data.lstItem.reduce((acc, a) => acc + a.TaxAmount, 0);
              this.TotalTotalAmount = data.lstItem.reduce((acc, a) => acc + a.TotalAmount, 0);
              this.TotalQty = this.obj.lstItem.reduce((acc, a) => acc + a.Qty, 0);
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
