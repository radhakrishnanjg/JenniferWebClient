import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { InvoiceService } from '../../_services/service/invoice.service';
import { Invoice } from '../../_services/model';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'

import * as moment from 'moment';
import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
@Component({
  selector: 'app-purchaselist',
  templateUrl: './purchaselist.component.html',
  styleUrls: ['./purchaselist.component.css']
})
export class PurchaselistComponent implements OnInit {

  //#region variable declartion
 
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

  NewBOW(id: number) {
    if (this._authorizationGuard.CheckAcess("Purchaselist", "ViewEdit")) {
      return;
    }
    this.router.navigate(['/BOE', 0, id]);
  }

  delete() {
    //
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

        //
      },
      (error: any) => {
        //
        console.log(error);
      }
    );
  }

  onLoad(SearchBy: string, Search: string, StartDate: Date, EndDate: Date) {
    //
    return this._invoiceService.search(SearchBy, Search, StartDate, EndDate).subscribe(
      (lst) => {
        if (lst != null ) { 
          this.items = lst;
          this.loadItems(); 
        }
        //
      },
      (err) => {
        //
        console.log(err);
      }
    );
  }

  //#region Paging Sorting and Filtering Start
  public allowUnsort = false;
  public sort: SortDescriptor[] = [{
    field: 'InvoiceDate',
    dir: 'desc'
  }];
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  private items: Invoice[] = [] as any;
  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'InvoiceDate', operator: 'contains', value: '' }]
    }
  };
  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
    this.loadItems();
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.loadSortItems();
  }

  private loadItems(): void {
    this.gridView = {
      data: orderBy(this.items, this.sort).slice(this.skip, this.skip + this.pageSize),
      total: this.items.length
    };
  }
  private loadSortItems(): void {
    this.gridView = {
      data: orderBy(this.items, this.sort).slice(this.skip, this.skip + this.pageSize),
      total: this.items.length
    };
  }
  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.gridView = process(this.items, this.state);
  }

  public onFilter(inputValue: string): void {
    this.gridView = process(this.items, {
      skip: this.skip,
      take: this.skip + this.pageSize,
      filter: {
        logic: "or",
        filters: [
          {
            field: 'PONumber',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'InvoiceNumber',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'InvoiceDate',
            operator: 'contains',
            value: inputValue
          }, 
          {
            field: 'WarehouseName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'LocationName',
            operator: 'contains',
            value: inputValue
          }, 
        ],
      }
    })  ;  
  }

  //#endregion Paging Sorting and Filtering End

}
