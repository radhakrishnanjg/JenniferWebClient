import { Component, OnInit } from '@angular/core';
import { PagerSettings, PagerPosition, PagerType, ListViewDataResult } from '@progress/kendo-angular-listview';
import { process, State } from '@progress/kendo-data-query';
import { DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';

import { Product, products } from './productsss';

@Component({
  selector: 'app-profit-analysis',
  templateUrl: './profit-analysis.component.html',
  styleUrls: ['./profit-analysis.component.css']
})
export class ProfitAnalysisComponent implements OnInit {

  public RevenueRange = 0;
  public RevenuesmallStep = .2;
  public NetProfitRange = 0;
  public NetProfitsmallStep = 1;
  public StockDaysRange = 0;
  public StockDaysmallStep = 1;

  public products: any[] = products;
  public products1: Product[] = [];
  constructor() { }
  RevenueSort: boolean = true;
  ngOnInit() {
    // this.loadItems();
  }

  doRevenueSort() {
    this.RevenueSort = !this.RevenueSort;
    this.products1 = this.RevenueSort ? orderBy(this.products, [{ field: "productName", dir: "asc" }]) : orderBy(this.products, [{ field: "productName", dir: "desc" }]);
  }
  ItemPerRow = 3;
  doshowdatalist() {
    this.ItemPerRow = 3;
  }
  doshowdatadetail() {
    this.ItemPerRow = 6;
  }
  markitasfavorite(productID: number) {
    console.log("productID :" + productID)
  }
  onchange_RevenuesmallStep(value: string) {
    // if (DropdownValue != '') {
    //   this.DropDownDescription = this.lstDropdown.filter(a => a.DropdownValue == DropdownValue)[0].DropDownDescription;
    // }

    console.log("value :" + value)
  }

  public pageSize = 5;

  public position: PagerPosition = 'bottom';
  public pageSizes = false;
  public info = true;
  public prevNext = true;
  public type: PagerType = 'numeric';

  public get pagerSettings(): PagerSettings {
    return {
      position: this.position,
      pageSizeValues: this.pageSizes,
      info: this.info,
      previousNext: this.prevNext,
      type: this.type
    };
  }

  // //#region Paging Sorting and Filtering Start
  // public allowUnsort = false;
  // public sort: SortDescriptor[] = [{
  //   field: 'productName',
  //   dir: 'asc'
  // }];
  // public gridView: ListViewDataResult;
  // public pageSize = 3;
  // public skip = 0;
  // private data: Object[];
  // private items: Product[] = [] as any;
  // public state: State = {
  //   skip: 0,
  //   take: 5,

  //   // Initial filter descriptor
  //   filter: {
  //     logic: 'and',
  //     filters: [{ field: 'productName', operator: 'contains', value: '' }]
  //   }
  // };
  // public pageChange({ skip, take }: PageChangeEvent): void {
  //   this.skip = skip;
  //   this.pageSize = take;
  //   this.loadItems();
  // }

  // public sortChange(sort: SortDescriptor[]): void {
  //   this.sort = sort;
  //   this.loadSortItems();
  // }

  // private loadItems(): void {
  //   this.gridView = {
  //     data: orderBy(this.items, this.sort).slice(this.skip, this.skip + this.pageSize),
  //     total: this.items.length
  //   };
  // }
  // private loadSortItems(): void {
  //   this.gridView = {
  //     data: orderBy(this.items, this.sort).slice(this.skip, this.skip + this.pageSize),
  //     total: this.items.length
  //   };
  // }
  // public dataStateChange(state: DataStateChangeEvent): void {
  //   this.state = state;
  //   this.gridView = process(this.items, this.state);
  // }

  // public onFilter(inputValue: string): void {
  //   debugger
  //   this.gridView = process(this.items.slice(this.skip, this.skip + this.pageSize), {
  //     skip: this.skip,
  //     take: this.skip + this.pageSize,
  //     filter: {
  //       logic: "or",
  //       filters: [
  //         {
  //           field: 'categoryName',
  //           operator: 'contains',
  //           value: inputValue
  //         },
  //         {
  //           field: 'productName',
  //           operator: 'contains',
  //           value: inputValue
  //         },
  //       ],
  //     }
  //   });
  // }

  // //#endregion Paging Sorting and Filtering End


}
