import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { Poorder, Poorderitem } from '../../_services/model/poorder';
import { PoService } from '../../_services/service/po.service';
import { AuthorizationGuard } from '../../_guards/Authorizationguard';
import { a } from '@angular/core/src/render3';

@Component({
  selector: 'app-poview',
  templateUrl: './poview.component.html',
  styleUrls: ['./poview.component.css']
})
export class PoviewComponent implements OnInit {

  obj: Poorder = {} as any;
  lst: Poorder[];
  lstItem: Poorderitem[];
  identity: number = 0;
  TotalUnits: number = 0;
  TotalRate: number = 0.00;
  TotalMultiplierValue: number = 0.00;
  TotalDirectCost: number = 0.00;
  TotalTaxAmount: number = 0.00;
  TotalTotalAmount: number = 0.00;

  constructor(
    
    private _poService: PoService,
    private aroute: ActivatedRoute,
    private _authorizationGuard: AuthorizationGuard,
    private _alertService: ToastrService
  ) { }

  ngOnInit() {

    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
      if (this.identity > 0) {
        //
        this._poService.searchById(this.identity).subscribe(
          (data: Poorder) => {
            this.obj = data;

            //
            this._poService.getItems(this.identity).subscribe(
              (data: Poorderitem[]) => {
                this.lstItem = data;
                this.TotalUnits = this.lstItem.reduce((acc, a) => acc + a.CaseSize, 0);
                this.TotalRate = this.lstItem.reduce((acc, a) => acc + a.Rate, 0);
                this.TotalMultiplierValue = this.lstItem.reduce((acc, a) => acc + a.MultiplierValue, 0);
                this.TotalDirectCost = this.lstItem.reduce((acc, a) => acc + a.DirectCost, 0);
                this.TotalTaxAmount = this.lstItem.reduce((acc, a) => acc + a.TaxAmount, 0);
                this.TotalTotalAmount = this.lstItem.reduce((acc, a) => acc + a.TotalAmount, 0);
                //
              },
              (err: any) => {
                //
                console.log(err);
              }
            );
          },
          (err: any) => {
            //
            console.log(err);
          }
        );
      }
    });
  }
}
