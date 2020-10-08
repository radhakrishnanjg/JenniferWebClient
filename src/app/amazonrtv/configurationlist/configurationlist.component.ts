import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AmazonautortvService } from '../../_services/service/amazonautortv.service';
import { AmazonAutoRTVConfiguration } from '../../_services/model';

import { AuthorizationGuard } from '../../_guards/Authorizationguard';
import * as moment from 'moment';
import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';

@Component({
  selector: 'app-configurationlist',
  templateUrl: './configurationlist.component.html',
  styleUrls: ['./configurationlist.component.css']
})
export class ConfigurationlistComponent implements OnInit {

  obj: AmazonAutoRTVConfiguration;
  lst: AmazonAutoRTVConfiguration[];

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

  onLoad(SearchBy: string, Search: string,) {
    let startdate: string = moment(this.selectedDateRange.startDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();
    let enddate: string = moment(this.selectedDateRange.endDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();
    return this._amazonautortvService.Search(SearchBy, Search, startdate, enddate).subscribe(
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
    field: 'RTVLocationName',
    dir: 'asc'
  }];
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  private items: AmazonAutoRTVConfiguration[] = [] as any;
  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'RTVLocationName', operator: 'contains', value: '' }]
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
    this.gridView = process(this.items.slice(this.skip, this.skip + this.pageSize), {
      skip: this.skip,
      take: this.skip + this.pageSize,
      filter: {
        logic: "or",
        filters: [
          {
            field: 'RTVLocationName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'InventoryType',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'FrequencyType',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'Lastmodifieddate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'LastModifiedByName',
            operator: 'contains',
            value: inputValue
          },
        ],
      }
    });
  }
}
