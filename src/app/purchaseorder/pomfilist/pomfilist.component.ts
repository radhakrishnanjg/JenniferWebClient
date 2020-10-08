import { Component, OnInit } from '@angular/core';
import { process, State } from '@progress/kendo-data-query';

import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { MFICaseHeader } from '../../_services/model';
import { PoService } from '../../_services/service/po.service'
import * as moment from 'moment';
import { AuthorizationGuard } from 'src/app/_guards/Authorizationguard';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pomfilist',
  templateUrl: './pomfilist.component.html',
  styleUrls: ['./pomfilist.component.css']
})
export class PomfilistComponent implements OnInit {
  constructor(
    private router: Router,
    private _poService: PoService,
    private _authorizationGuard: AuthorizationGuard
  ) { }

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
  ngOnInit() {
    this.SearchBy = '';
    this.SearchKeyword = '';
    this.selectedDateRange = {
      startDate: moment().subtract(0, 'months').date(1),
      endDate: moment().subtract(1, 'days')
    };

    this.onLoad(this.SearchBy, this.SearchKeyword);
  }

  editButtonClick(ShipmentNumber: string) {
    if (this._authorizationGuard.CheckAcess("PoMFIlist", "ViewEdit")) {
      return;
    }
    this.router.navigate(['/MFICase', ShipmentNumber]);
  }


  onChange(range) {
    let startdate: string = moment(this.selectedDateRange.startDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();
    let enddate: string = moment(this.selectedDateRange.endDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();

  }
  Search(): void {
    this.onLoad(this.SearchBy, this.SearchKeyword);
  }


  Refresh(): void {
    this.SearchBy = '';
    this.SearchKeyword = '';
    this.Searchaction = true;
  }

  onLoad(SearchBy: string, Search: string) {
    let startdate: string = moment(this.selectedDateRange.startDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();
    let enddate: string = moment(this.selectedDateRange.endDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();
    return this._poService.MFICaseSearch(SearchBy, Search, startdate, enddate).subscribe(
      (lst: MFICaseHeader[]) => {
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
    field: 'PONumber',
    dir: 'asc'
  }];
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  private items: MFICaseHeader[] = [] as any;
  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'PONumber', operator: 'contains', value: '' }]
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
            field: 'PODate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ShipmentDate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ShipmentNumber',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ItemCode',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ItemName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ShippedQty',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ReceivedQty',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'DiffQty',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'DiffValue',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'Ageing',
            operator: 'contains',
            value: inputValue
          },
        ],
      }
    });
  }

}
