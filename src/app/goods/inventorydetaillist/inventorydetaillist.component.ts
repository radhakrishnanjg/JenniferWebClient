import { Component, OnInit } from '@angular/core';

import { InventorydetailService } from '../../_services/service/inventorydetail.service';
import { Inventorydetail } from '../../_services/model/index';
import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';

@Component({
  selector: 'app-inventorydetaillist',
  templateUrl: './inventorydetaillist.component.html',
  styleUrls: ['./inventorydetaillist.component.css']
})
export class InventorydetaillistComponent implements OnInit {

  obj: Inventorydetail;

  dtOptions: DataTables.Settings = {};
  SearchBy: string = '';
  SearchKeyword: string = '';
  SearchInventoryType: string = '';
  constructor(
    private _inventoryTypeService: InventorydetailService,
  ) { }

  ngOnInit() {
    this.onLoad('', '');
  }

  Search(): void {
    this.onLoad(this.SearchBy, this.SearchKeyword);
  }

  Refresh(): void {
    this.SearchBy = '';
    this.SearchKeyword = '';
  }

  onLoad(SearchBy: string, Search: string) {

    //
    return this._inventoryTypeService.search(SearchBy, Search).subscribe(
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
    field: 'EventDate',
    dir: 'desc'
  }];
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  private items: Inventorydetail[] = [] as any;
  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'EventDate', operator: 'contains', value: '' }]
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
            field: 'LocationName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'BrandName',
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
            field: 'EventDate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'SellableCurrentStock',
            operator: 'contains',
            value: inputValue
          }, 
          {
            field: 'UnsellableCurrentStock',
            operator: 'contains',
            value: inputValue
          }, 
          {
            field: 'SellableWarehouseQty',
            operator: 'contains',
            value: inputValue
          }, 
          {
            field: 'UnSellableWarehouseQty',
            operator: 'contains',
            value: inputValue
          }, 
        ],
      }
    })  ;  
  }

  //#endregion Paging Sorting and Filtering End

}
