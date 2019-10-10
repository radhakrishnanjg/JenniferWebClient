import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
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
    private _spinner: NgxSpinnerService,
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

    this._spinner.show();
    return this._shipmentService.search(SearchBy, Search).subscribe(
      (data) => {
        if (data != null) {  
          this.items = data;
          this.loadItems(); 
        }
        this._spinner.hide();
      },
      (err) => {
        this._spinner.hide();
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
  public allowUnsort = true;
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
