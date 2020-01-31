import { Component, OnInit } from '@angular/core';

import { SalesShipmentService } from '../../_services/service/sales-shipment.service';
import { SalesShipment, Shipmentoutward } from '../../_services/model';

import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { Router } from '@angular/router';
import { AuthorizationGuard } from 'src/app/_guards/Authorizationguard';
@Component({
  selector: 'app-sales-shipment-list',
  templateUrl: './sales-shipment-list.component.html',
  styleUrls: ['./sales-shipment-list.component.css']
})
export class SalesShipmentListComponent implements OnInit {
  obj: SalesShipment;
  deleteColumn: string;
  SearchBy: string = '';
  SearchKeyword: string = '';
  Searchaction: boolean = true;
  dtOptions: DataTables.Settings = {};
  selectedDeleteId: number;
  constructor(
    private router: Router,
    private _shipmentService: SalesShipmentService,
    
    private _authorizationGuard: AuthorizationGuard
  ) { }

  ngOnInit() {

    this.SearchBy = '';
    this.SearchKeyword = '';

    this.onLoad(this.SearchBy, this.SearchKeyword);
  } 

  Search(): void {
    this.onLoad(this.SearchBy, this.SearchKeyword);
  }

  Refresh(): void {
    this.SearchBy = '';
    this.SearchKeyword = '';
    this.Searchaction = true;
  }  

  onLoad(SearchBy: string, Search: string, ) {

    //
    return this._shipmentService.search(SearchBy, Search).subscribe(
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

  AddNewLink() {
    if (this._authorizationGuard.CheckAcess("Salesshipmentlist", "ViewEdit")) {
      return;
    }
    this.router.navigate(['Salesshipment/Create',]);
  }
  
  //#region Paging Sorting and Filtering Start
  public allowUnsort = false;
  public sort: SortDescriptor[] = [{
    field: 'SalesShipmentID',
    dir: 'asc'
  }];
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  private items: SalesShipment[] = [] as any;
  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'SalesShipmentID', operator: 'contains', value: '' }]
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
            field: 'SalesShipmentID',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'InvoiceNumber',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'CourierName',
            operator: 'contains',
            value: inputValue
          }, 
          {
            field: 'CourierTrackingID',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'AirwayBillNumber',
            operator: 'contains',
            value: inputValue
          }, 
        ],
      }
    })  ;  
  }

  //#endregion Paging Sorting and Filtering End

}
