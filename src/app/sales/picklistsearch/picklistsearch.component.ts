import { Component, OnInit } from '@angular/core';

import { PicklistService } from '../../_services/service/picklist.service';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { Picklistheader, Location, } from '../../_services/model';
import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
@Component({
  selector: 'app-picklistsearch',
  templateUrl: './picklistsearch.component.html',
  styleUrls: ['./picklistsearch.component.css']
})
export class PicklistsearchComponent implements OnInit {
   obj: Picklistheader;
  deleteColumn: string;
  SearchBy: string = '';
  SearchKeyword: string = '';
  LocationID: number = 0;
  locations: Location[];
  dtOptions: DataTables.Settings = {};
  selectedDeleteId: number;


  constructor(
    private _picklistService: PicklistService,
    private _privateutilityService: PrivateutilityService,
    
  ) { }

  ngOnInit() {
    this.SearchBy = '';
    this.SearchKeyword = '';
    this.LocationID = 0;
    //
    this._privateutilityService.getLocations()
      .subscribe(
        (data: Location[]) => {
          this.locations = data;
          //
        },
        (err: any) => {
          //
          console.log(err);
        }
      );
    this.onLoad(this.SearchBy, this.SearchKeyword, this.LocationID);
  }

  Search(): void {
    this.onLoad(this.SearchBy, this.SearchKeyword, this.LocationID);
  }

  Refresh(): void {
    this.SearchBy = '';
    this.SearchKeyword = '';
    this.LocationID = 0;
  }

  onLoad(SearchBy: string, Search: string, LocationID: number) {
    //
    return this._picklistService.search(SearchBy, Search, LocationID).subscribe(
      (data) => {
        if (data != null) { 
          this.items = data;
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
    field: 'OrderID',
    dir: 'asc'
  }];
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  private items: Picklistheader[] = [] as any;
  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'OrderID', operator: 'contains', value: '' }]
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
            field: 'OrderID',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'InvoiceNumber',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'InventoryType',
            operator: 'contains',
            value: inputValue
          }, 
          {
            field: 'LocationName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'PicklistQty',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'PickedQty',
            operator: 'contains',
            value: inputValue
          }, 
          {
            field: 'TransferQty',
            operator: 'contains',
            value: inputValue
          }, 
          {
            field: 'Status',
            operator: 'contains',
            value: inputValue
          }, 
        ],
      }
    })  ;  
  }

  //#endregion Paging Sorting and Filtering End

}
