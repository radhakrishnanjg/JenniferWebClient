import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PoService } from '../../_services/service/po.service';
import { Poorder } from '../../_services/model';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'

import * as moment from 'moment';
@Component({
  selector: 'app-polist',
  templateUrl: './polist.component.html',
  styleUrls: ['./polist.component.css']
})
export class PolistComponent implements OnInit {

  //#region variable declartion

  lst: Poorder[];
  obj: Poorder;

  selectedDeleteId: number;
  deleteColumn: string;
  LocationID: number;
  dtOptions: DataTables.Settings = {};
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
  //#endregion

  constructor(
    private alertService: ToastrService,
    private router: Router,
    private _poService: PoService,
    private _spinner: NgxSpinnerService,
    private _authorizationGuard: AuthorizationGuard
  ) { }

  ngOnInit() {

    this.SearchBy = '';
    this.SearchKeyword = '';
    this.selectedDateRange = {
      startDate: moment().subtract(0, 'months').date(1),
      endDate: moment().subtract(1, 'days')
    };

    this.onLoad(this.SearchBy, this.SearchKeyword);
  }

  onLoad(SearchBy: string, Search: string, ) {
    let startdate: Date = this.selectedDateRange.startDate._d.toISOString().substring(0, 10);
    let enddate: Date = this.selectedDateRange.endDate._d.toISOString().substring(0, 10);
    this._spinner.show();
    return this._poService.search(SearchBy, Search, startdate, enddate).subscribe(
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
    this.Searchaction = true;
  }

  editButtonClick(id: number) {
    if (this._authorizationGuard.CheckAcess("Polist", "ViewEdit")) {
      return;
    }
    this.router.navigate(['/PO', id]);
  }

  viewButtonClick(id: number) {
    if (this._authorizationGuard.CheckAcess("Polist", "ViewEdit")) {
      return;
    }
    this.router.navigate(['/POview', id]);
  }

  AddNewPurchaseButtonClick(id: number) {
    if (this._authorizationGuard.CheckAcess("Polist", "ViewEdit")) {
      return;
    }
    this.router.navigate(['/Purchase', 0, id]);
  }

  confirmDeleteid(id: number, LocationID: number, DeleteColumnvalue: string) {
    if (this._authorizationGuard.CheckAcess("Polist", "ViewEdit")) {
      return;
    }

    this.selectedDeleteId = + id;
    this.LocationID = + LocationID;
    this.deleteColumn = DeleteColumnvalue;
    $('#modaldeleteconfimation').modal('show');
  }

  delete() {
    this._spinner.show();
    this._poService.delete(this.selectedDeleteId, this.LocationID).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.onLoad(this.SearchBy, this.SearchKeyword);
          this.alertService.success(data.Msg);
        } else {
          this.alertService.error(data.Msg);
        }
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
