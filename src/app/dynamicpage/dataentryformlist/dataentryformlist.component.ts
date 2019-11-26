import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { RequestForm } from '../../_services/model';
import { DynamicformService } from '../../_services/service/dynamicform.service';
@Component({
  selector: 'app-dataentryformlist',
  templateUrl: './dataentryformlist.component.html',
  styleUrls: ['./dataentryformlist.component.css']
})
export class DataentryformlistComponent implements OnInit {
  lst: RequestForm[];
  constructor(
    private _DynamicformService: DynamicformService) { }
  // tools = [{
  //   id: 0,
  //   title: 'Title 0',
  //   desc: 'Description',
  //   cat: 'Category 1'
  // },
  // {
  //   id: 1,
  //   title: 'Title 1',
  //   desc: 'Description',
  //   cat: 'Category 1'
  // },
  // {
  //   id: 2,
  //   title: 'Title 2',
  //   desc: 'Description',
  //   cat: 'Category 2'
  // },
  // {
  //   id: 3,
  //   title: 'Title 3',
  //   desc: 'Description',
  //   cat: 'Category 3'
  // },
  // {
  //   id: 4,
  //   title: 'Title 4',
  //   desc: 'Description',
  //   cat: 'Category 1'
  // }
  // ]
  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this._DynamicformService.GetLiveForms('DE')
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
