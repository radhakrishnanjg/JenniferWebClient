import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { StatementService } from '../../_services/service/statement.service';
import { Statement } from '../../_services/model';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-statementview',
  templateUrl: './statementview.component.html',
  styleUrls: ['./statementview.component.css']
})
export class StatementviewComponent implements OnInit {

  obj: Statement;
  identity: string = '';
  dtOptions: DataTables.Settings = {};
  constructor(
    public _statementService: StatementService,
    public _alertService: ToastrService,
    
    private aroute: ActivatedRoute) { }

  ngOnInit() {
    this.aroute.paramMap.subscribe(params => {
      this.identity = params.get('id');
      if (this.identity != '') {
        //
        this._statementService.searchById(this.identity)
          .subscribe(
            (data: Statement) => {
              this.obj = data;
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
