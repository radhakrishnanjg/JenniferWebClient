import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { RequestForm } from '../../_services/model';
import { DynamicformService } from '../../_services/service/dynamicform.service';
@Component({
  selector: 'app-workflowformlist',
  templateUrl: './workflowformlist.component.html',
  styleUrls: ['./workflowformlist.component.css']
})
export class WorkflowformlistComponent implements OnInit {

  lst: RequestForm[];
  constructor(
    private _DynamicformService: DynamicformService
  ) { }
  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this._DynamicformService.GetLiveForms('WF')
      .subscribe(
        (data: RequestForm[]) => {
          this.lst = data;
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

}
