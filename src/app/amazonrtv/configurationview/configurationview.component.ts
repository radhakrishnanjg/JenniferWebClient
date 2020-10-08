import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AmazonAutoRTVOrder } from '../../_services/model';
import { AmazonautortvService } from '../../_services/service/amazonautortv.service';
@Component({
  selector: 'app-configurationview',
  templateUrl: './configurationview.component.html',
  styleUrls: ['./configurationview.component.css']
})
export class ConfigurationviewComponent implements OnInit {

  constructor(
    private aroute: ActivatedRoute,
    private _amazonautortvService: AmazonautortvService,) { }

  obj: AmazonAutoRTVOrder = {} as any;
  BatchId: string = '';
  TotalQuantity: number = 0;
  TotalTotalValue: number = 0;
  ngOnInit() {
    this.aroute.paramMap.subscribe(params => {
      this.BatchId = params.get('id');
    });
    this._amazonautortvService.BulkSearchById(this.BatchId)
      .subscribe(
        (data: AmazonAutoRTVOrder) => {
          this.obj = data;
          this.TotalQuantity = data.lstRTVDetail.reduce((acc, a) => acc + a.Quantity, 0);
          this.TotalTotalValue = data.lstRTVDetail.reduce((acc, a) => acc + a.TotalValue, 0);
        },
        (err: any) => {
          console.log(err);
        }
      );

  }


}
