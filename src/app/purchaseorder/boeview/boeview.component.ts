import { Component, OnInit } from '@angular/core';

import { FormBuilder, } from '@angular/forms';
import { ActivatedRoute, } from '@angular/router';
import { BOEHeader, BOEDetail } from '../../_services/model';
import { BoeService } from '../../_services/service/BOE.service';
@Component({
  selector: 'app-boeview',
  templateUrl: './boeview.component.html',
  styleUrls: ['./boeview.component.css']
})
export class BoeviewComponent implements OnInit {
  obj: BOEHeader = {} as any;
  lstItem: BOEDetail[];
  panelTitle: string;
  identity: number = 0;
  PurchaseID: number = 0;
  TotalDutyAmount: number = 0;
  TotalIGSTValue: number = 0;
  TotalTotalValue: number = 0;
  TotalSumTotalValue: number = 0;
  constructor(
    private fb: FormBuilder,
    private aroute: ActivatedRoute,
    
    private _BoeService: BoeService,

  ) { }

  ngOnInit() {

    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
      this.PurchaseID = +params.get('PurchaseId');
      if (this.identity > 0) {
        this.panelTitle = "View BOE";
        //
        this._BoeService.searchById(this.PurchaseID, this.identity)
          .subscribe(
            (data: BOEHeader) => {
              this.obj = data;
              this.lstItem = data.lstDetail;//.filter(a => a.DutyAmount > 0)
              this.TotalDutyAmount = this.lstItem.reduce((acc, a) => acc + a.DutyAmount, 0);
              this.TotalIGSTValue = this.lstItem.reduce((acc, a) => acc + a.IGSTValue, 0);
              this.TotalTotalValue = this.lstItem.reduce((acc, a) => acc + a.TotalValue, 0);
              this.TotalSumTotalValue = this.lstItem.reduce((acc, a) => acc + a.SumTotalValue, 0);
              //
            },
            (err: any) => {
              //
              console.log(err);
            }
          );
      }
    });
  }

  mergecells(HSNCode: string,IGSTRate:number, i:number) {
    let ii = i + 1;
    
    let c = this.lstItem.filter(a => a.HSNCode == HSNCode && a.IGSTRate ==IGSTRate).length;
    let rem = this.lstItem.length % c;
    return ii % c == rem ? true : false;
  }

  getSum(HSNCode: string) {
    return this.lstItem.filter(a => a.HSNCode == HSNCode).
      reduce((acc, a) => acc + a.DutyAmount, 0) +
      this.lstItem.filter(a => a.HSNCode == HSNCode).reduce((acc, a) => acc + a.IGSTValue, 0);
  }

  Download(PurchaseID: number) {
    //
    this._BoeService.DownloadSKUWiseData(PurchaseID)
      .subscribe(data => {
        
          saveAs(data, PurchaseID + '.xlsx')
      },
        (err) => {
          //
          console.log(err);
        }
      );
  }


}


