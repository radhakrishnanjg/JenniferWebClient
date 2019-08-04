import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { InvoiceService } from '../../_services/service/invoice.service';
import { Invoice } from '../../_services/model';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'

import * as moment from 'moment';
@Component({
  selector: 'app-purchaselist',
  templateUrl: './purchaselist.component.html',
  styleUrls: ['./purchaselist.component.css']
})
export class PurchaselistComponent implements OnInit {

  //#region variable declartion

  lst: Invoice[];
  obj: Invoice;

  selectedDeleteId: number;
  dtOptions: DataTables.Settings = {};
  deleteColumn: string;
  SearchBy: string = '';
  SearchKeyword: string = '';
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
    private _invoiceService: InvoiceService,
    private _spinner: NgxSpinnerService,
    private _authorizationGuard: AuthorizationGuard
  ) { }

  ngOnInit() {

    this.SearchBy = '';
    this.SearchKeyword = '';
    this.selectedDateRange = { startDate: moment().subtract(0, 'months').date(1), endDate: moment().subtract(1, 'days') };

    let startdate: Date = this.selectedDateRange.startDate._d.toISOString().substring(0, 10);
    let enddate: Date = this.selectedDateRange.endDate._d.toISOString().substring(0, 10);
    this.onLoad(this.SearchBy, this.SearchKeyword, startdate, enddate);

  }

  onLoad(SearchBy: string, Search: string, StartDate: Date, EndDate: Date) {
    this._spinner.show();
    return this._invoiceService.search(SearchBy, Search, StartDate, EndDate).subscribe(
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
    let startdate: Date = this.selectedDateRange.startDate._d.toISOString().substring(0, 10);
    let enddate: Date = this.selectedDateRange.endDate._d.toISOString().substring(0, 10);
    this.onLoad(this.SearchBy, this.SearchKeyword, startdate, enddate);
  }

  Refresh(): void {
    this.SearchBy = '';
    this.SearchKeyword = '';
  }


  editButtonClick(id: number, PoId: number) {
    if (this._authorizationGuard.CheckAcess("Purchaselist", "ViewEdit")) {
      return;
    }
    // this.router.navigate(['/Poshipment', { queryParams: { 'id': id, 'PoId': PoId } }]);
    this.router.navigate(['/Purchase', id, PoId]);
  }

  viewButtonClick(id: number, PoId: number) {
    if (this._authorizationGuard.CheckAcess("Purchaselist", "ViewEdit")) {
      return;
    }
    this.router.navigate(['/Purchaseview', id, PoId]);
  }

  confirmDeleteid(id: number, DeleteColumnvalue: string) {
    if (this._authorizationGuard.CheckAcess("Purchaselist", "ViewEdit")) {
      return;
    }

    this.selectedDeleteId = + id;
    this.deleteColumn = DeleteColumnvalue;
    $('#modaldeleteconfimation').modal('show');
  }

  delete() {
    this._spinner.show();
    this._invoiceService.delete(this.selectedDeleteId).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          let startdate: Date = this.selectedDateRange.startDate._d.toISOString().substring(0, 10);
          let enddate: Date = this.selectedDateRange.endDate._d.toISOString().substring(0, 10);
          this.onLoad(this.SearchBy, this.SearchKeyword, startdate, enddate);
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
