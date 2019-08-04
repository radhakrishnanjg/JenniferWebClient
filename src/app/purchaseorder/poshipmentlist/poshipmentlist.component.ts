import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PoshipmentService } from '../../_services/service/poshipment.service';
import { Poshipment } from '../../_services/model';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'

import * as moment from 'moment';
@Component({
  selector: 'app-poshipmentlist',
  templateUrl: './poshipmentlist.component.html',
  styleUrls: ['./poshipmentlist.component.css']
})
export class PoshipmentlistComponent implements OnInit {

  //#region variable declartion

  lst: Poshipment[];
  obj: Poshipment;

  selectedDeleteId: number;
  selectedPOID: number;
  dtOptions: DataTables.Settings = {};
  deleteColumn: string;
  SearchBy: string = '';
  SearchKeyword: string = '';
  Searchaction: boolean = true;
  selectedDateRange: any;
  Searchranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  }
  lstitemlevels: object[];
  //#endregion

  constructor(
    private alertService: ToastrService,
    private router: Router,
    private _poshipmentService: PoshipmentService,
    private _spinner: NgxSpinnerService,
    private _authorizationGuard: AuthorizationGuard
  ) { }

  ngOnInit() {
    this.SearchBy = '';
    this.SearchKeyword = '';
    this.selectedDateRange = { startDate: moment().subtract(0, 'months').date(1), endDate: moment().subtract(1, 'days') };
    this.onLoad(this.SearchBy, this.SearchKeyword);
  }


  onLoad(SearchBy: string, Search: string, ) {
    let startdate: Date = this.selectedDateRange.startDate._d.toISOString().substring(0, 10);
    let enddate: Date = this.selectedDateRange.endDate._d.toISOString().substring(0, 10);
    this._spinner.show();
    return this._poshipmentService.search(SearchBy, Search, startdate, enddate).subscribe(
      (data) => {
        this.lst = data;
        this.dtOptions = {
          pagingType: 'full_numbers',
          "language": {
            "search": 'Filter',
          },
        };

        this._spinner.hide();
      },
      (err) => {
        this._spinner.hide();
        console.log(err);
      }
    );
  }

  onChange(range) {
    let startdate: string = range.startDate._d.toISOString().substring(0, 10);
    let enddate: string = range.endDate._d.toISOString().substring(0, 10);
  }
  Search(): void {
    this.onLoad(this.SearchBy, this.SearchKeyword);
  }

  Refresh(): void {
    this.SearchBy = '';
    this.SearchKeyword = '';
  }

  editButtonClick(id: number, PoId: number) {
    if (this._authorizationGuard.CheckAcess("Poshipmentlist", "ViewEdit")) {
      return;
    }
    this.router.navigate(['/Poshipment', id, PoId]);
  }

  confirmDeleteid(id: number, POID: number, DeleteColumnvalue: string) {
    if (this._authorizationGuard.CheckAcess("Poshipmentlist", "ViewEdit")) {
      return;
    }

    this.selectedDeleteId = + id;
    this.selectedPOID = + POID;
    this.deleteColumn = DeleteColumnvalue;
    $('#modaldeleteconfimation').modal('show');
  }

  delete() {
    this._spinner.show();
    this._poshipmentService.delete(this.selectedDeleteId, this.selectedPOID).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.alertService.success(data.Msg);
        } else {
          this.alertService.error(data.Msg);
        }
        this.onLoad(this.SearchBy, this.SearchKeyword);
        $('#modaldeleteconfimation').modal('hide');

        this._spinner.hide();
      },
      (error: any) => {
        this._spinner.hide();
        console.log(error);
      }
    );
  }

}
