import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Salesorder } from '../../_services/model';
import { SalesorderService } from '../../_services/service/salesorder.service';
import { Router } from '@angular/router';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import * as moment from 'moment';

import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
@Component({
  selector: 'app-salesorderapprovallist',
  templateUrl: './salesorderapprovallist.component.html',
  styleUrls: ['./salesorderapprovallist.component.css']
})
export class SalesorderapprovallistComponent implements OnInit {
 
  obj: Salesorder;

  dtOptions: DataTables.Settings = {};
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
  InventoryType: boolean = true;
  constructor(
    private _spinner: NgxSpinnerService,
    private _salesorderService: SalesorderService,
    private _authorizationGuard: AuthorizationGuard,
    private router: Router,
  ) { }

  ngOnInit() {
    this.SearchBy = '';
    this.SearchKeyword = '';
    this.selectedDateRange = {
      startDate: moment().subtract(0, 'months').date(1),
      endDate: moment().subtract(1, 'days')
    };
    this.InventoryType = true;
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

  editButtonClick(id: number) {
    if (this._authorizationGuard.CheckAcess("Salesorderapprovallist", "ViewEdit")) {
      return;
    }
    this.router.navigate(['/Salesorderapproval', id]);
  }

  onLoad(SearchBy: string, Search: string) {
    let startdate: Date = this.selectedDateRange.startDate._d.toISOString().substring(0, 10);
    let enddate: Date = this.selectedDateRange.endDate._d.toISOString().substring(0, 10);
    this._spinner.show();
    this._salesorderService.search(SearchBy, Search, startdate, enddate).subscribe(
      (data) => {
        if (data != null) { 
          this.items = data;
          this.loadItems(); 
        }
        this._spinner.hide();
      },
      (error) => {
        this._spinner.hide();
        console.log(error);
      }
    )
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
   private items: Salesorder[] = [] as any;
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
