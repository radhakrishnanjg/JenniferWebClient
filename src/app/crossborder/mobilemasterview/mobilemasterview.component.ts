import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MobileMasterService } from '../../_services/service/crossborder/mobilemaster.service';
import { MobileMaster } from '../../_services/model/crossborder';

@Component({
  selector: 'app-mobilemasterview',
  templateUrl: './mobilemasterview.component.html',
  styleUrls: ['./mobilemasterview.component.css']
})
export class MobilemasterviewComponent implements OnInit {

  obj: MobileMaster = {} as any;
  identity: number = 0;
  constructor(
    private _mobileMasterService: MobileMasterService,
    private aroute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
      if (this.identity > 0) {
        this._mobileMasterService.SearchById(this.identity).subscribe(
          (data: MobileMaster) => {
            this.obj = data;
          },
          (err: any) => {
            console.log(err);
          }
        );
      }
    });
  }

}
