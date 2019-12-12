import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AmazonautortvService } from '../../_services/service/amazonautortv.service';
import { AmazonAutoRTVConfiguration, AmazonAutoRTVOrder } from '../../_services/model';

import { AuthorizationGuard } from '../../_guards/Authorizationguard';
import * as moment from 'moment';
import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';

@Component({
  selector: 'app-orderlist',
  templateUrl: './orderlist.component.html',
  styleUrls: ['./orderlist.component.css']
})
export class OrderlistComponent implements OnInit {

  obj: AmazonAutoRTVOrder = {} as any;
  lst: AmazonAutoRTVOrder[];

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

  constructor(
    private alertService: ToastrService,
    private router: Router,
    private _amazonautortvService: AmazonautortvService,
    private _authorizationGuard: AuthorizationGuard
  ) { }

  ngOnInit() {

    this.SearchBy = '';
    this.SearchKeyword = '';
    this.selectedDateRange = { startDate: moment().subtract(0, 'months').date(1), endDate: moment().subtract(1, 'days') };

    this.onLoad(this.SearchBy, this.SearchKeyword);
  }

  downloadFile(RTVID: number) {
    this._amazonautortvService.OrderDetailById(RTVID)
      .subscribe(data => {
        debugger
        this.alertService.success('File Downloaded successfully');
        saveAs(data, 'Detail' + RTVID + '.xlsx')
      },
        (err) => {
          console.log(err);
        }
      );
  }

  downloadError(RTVID: number) {
    this._amazonautortvService.OrderDetailErrorById(RTVID)
      .subscribe(data => {
        saveAs(data, 'Error' + RTVID.toString() + '.xlsx')
      },
        (err) => {
          console.log(err);
        }
      );
  }

  Search(): void {
    this.onLoad(this.SearchBy, this.SearchKeyword);
  }

  Refresh(): void {
    this.SearchBy = '';
    this.SearchKeyword = '';
  }

  onChange(range) {
    let startdate: string = range.startDate._d.toISOString().substring(0, 10);
    let enddate: string = range.endDate._d.toISOString().substring(0, 10);
  }

  onLoad(SearchBy: string, Search: string, ) {
    let FromDate: Date = this.selectedDateRange.startDate._d.toISOString().substring(0, 10);
    let ToDate: Date = this.selectedDateRange.endDate._d.toISOString().substring(0, 10);

    return this._amazonautortvService.OrderSearch(SearchBy, Search, FromDate, ToDate).subscribe(
      (lst) => {
        if (lst != null) {
          this.items = lst;
          this.loadItems();
        }

      },
      (err) => {

        console.log(err);
      }
    );
  }

  public allowUnsort = false;
  public sort: SortDescriptor[] = [{
    field: 'RTVID',
    dir: 'asc'
  }];
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  private items: AmazonAutoRTVOrder[] = [] as any;
  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'RTVID', operator: 'contains', value: '' }]
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


}
