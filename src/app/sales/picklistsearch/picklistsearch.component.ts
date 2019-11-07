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
  public allowUnsort = true;
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
  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.loadItems();
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.loadSortItems();
  }

  private loadItems(): void {
    this.gridView = {
      data: this.items.slice(this.skip, this.skip + this.pageSize),
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


  //#endregion Paging Sorting and Filtering End

}
