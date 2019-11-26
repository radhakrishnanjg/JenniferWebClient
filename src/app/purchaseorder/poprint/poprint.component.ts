import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PoService } from '../../_services/service/po.service';
import { Poprint, Poorderitem } from '../../_services/model';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-poprint',
  templateUrl: './poprint.component.html',
  styleUrls: ['./poprint.component.css']
})
export class PoprintComponent implements OnInit {
  obj: Poprint;
  lst: Poorderitem[];
  identity: number = 0;
  dtOptions: DataTables.Settings = {};
  Qty: number;
  Total: number = 0.00;
  repeatHeaders: boolean = true;
  constructor(
    public _poService: PoService,
    public _alertService: ToastrService,
    public _spinner: NgxSpinnerService,
    private aroute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
      if (this.identity > 0) {
        this._spinner.show();
        this._poService.poPrint(this.identity)
          .subscribe(
            (data: Poprint) => {
              this.obj = data;
              this.lst = data.lstItem;
              this.Qty = this.lst.reduce((acc, a) => acc + a.Qty, 0);
              this.Total = this.lst.reduce((acc, a) => acc + a.Total, 0);
              this._spinner.hide();
            },
            (err: any) => {
              console.log(err);
              this._spinner.hide();
            }
          );
      }
    });
  }

}
