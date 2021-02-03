import { Component, OnInit,OnDestroy  } from '@angular/core'; 
import { Sto } from '../../_services/model';
import { StoService } from '../../_services/service/sto.service'; 
import * as moment from 'moment';
import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-sto-list',
  templateUrl: './sto-list.component.html',
  styleUrls: ['./sto-list.component.css']
})
export class StoListComponent implements OnInit, OnDestroy {  
  SearchBy: string;
  SearchKeyword: string;
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
    
    private _stoService: StoService, ) { }

  ngOnInit() {

    this.SearchBy = '';
    this.SearchKeyword = '';
    this.selectedDateRange = {
      startDate: moment().subtract(0, 'months').date(1),
      endDate: moment().subtract(1, 'days')
    };

    this.onLoad(this.SearchBy, this.SearchKeyword);
  }

  Search(): void {
    this.onLoad(this.SearchBy, this.SearchKeyword);
  }

  onChange(range) {
    let startdate: string = range.startDate._d.toISOString().substring(0, 10);
    let enddate: string = range.endDate._d.toISOString().substring(0, 10);
  }

  Refresh(): void {
    this.SearchBy = '';
    this.SearchKeyword = '';
  }

  onLoad(SearchBy: string, Search: string) {
    let startdate: Date = this.selectedDateRange.startDate._d.toISOString().substring(0, 10);
    let endDate: Date = this.selectedDateRange.endDate._d.toISOString().substring(0, 10);
    //
    return this._stoService.search(SearchBy, Search, startdate, endDate).subscribe(
      (data) => {
        if (data != null) {
          this.items = data;
          this.loadItems();
        }
        //
      },
      (error) => {
        //
        console.log(error);
      }
    )
  }

  //#region Paging Sorting and Filtering Start
  public allowUnsort = false;
  public sort: SortDescriptor[] = [{
    field: 'STODate',
    dir: 'desc'
  }];
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  private items: Sto[] = [] as any;
  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'STODate', operator: 'contains', value: '' }]
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
            field: 'STONumber',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'STODate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'FromLocation',
            operator: 'contains',
            value: inputValue
          }, 
          {
            field: 'ToLocation',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'InventoryType',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'TotalAmount',
            operator: 'contains',
            value: inputValue
          },  
        ],
      }
    })  ;  
  }
 
  //#endregion Paging Sorting and Filtering End
  private subscriptions: Subscription[] = [];
  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
