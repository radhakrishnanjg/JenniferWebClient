import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { PicklistService } from '../../_services/service/picklist.service';
import { Picklistview } from '../../_services/model';

@Component({
  selector: 'app-picklistview',
  templateUrl: './picklistview.component.html',
  styleUrls: ['./picklistview.component.css']
})
export class PicklistviewComponent implements OnInit {
  objPicklistview: Picklistview = {} as any;
  identity: number = 0;
  constructor(
    private _picklistService: PicklistService,
    private _spinner: NgxSpinnerService,
    private aroute: ActivatedRoute,
  ) { }

  ngOnInit() {

    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
    });
    this._spinner.show();
    return this._picklistService.PicklistView(this.identity).subscribe(
      (data) => {
        if (data != null) {
          this.objPicklistview = data;
          this._spinner.show();
        }
        this._spinner.hide();
      },
      (err) => {
        this._spinner.hide();
        console.log(err);
      }
    );
  }

}
