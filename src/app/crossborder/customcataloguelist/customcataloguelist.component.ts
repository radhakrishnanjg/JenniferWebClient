import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { CatalogueService } from '../../_services/service/crossborder/catalogue.service';
import { CatalogueHeader } from '../../_services/model/crossborder';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'

import * as moment from 'moment';
import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';

@Component({
  selector: 'app-customcataloguelist',
  templateUrl: './customcataloguelist.component.html',
  styleUrls: ['./customcataloguelist.component.css']
})
export class CustomcataloguelistComponent implements OnInit {
//#region variable declartion

obj: CatalogueHeader;

selectedDeleteId: number;
deleteColumn: string;
dtOptions: DataTables.Settings = {};
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
//#endregion

constructor(
  private alertService: ToastrService,
  private router: Router,
  private _catalogueService: CatalogueService,

  private _authorizationGuard: AuthorizationGuard
) { }

ngOnInit() {
  this.SearchBy = '';
  this.SearchKeyword = '';
  this.selectedDateRange = {
    startDate: moment().subtract(0, 'months').date(1),
    endDate: moment().subtract(1, 'days')
  };

  this.onLoad(this.SearchBy, this.SearchKeyword);
}

onChange(range) {
  let startdate: string = range.startDate._d.toISOString().substring(0, 10);
  let enddate: string = range.endDate._d.toISOString().substring(0, 10);
}
Search(): void {
  this.onLoad(this.SearchBy, this.SearchKeyword);
}

Refresh(): void {
  this.SearchBy = '';
  this.SearchKeyword = '';
  this.Searchaction = true;
}  

confirmDeleteid(id: number, LocationID: number, DeleteColumnvalue: string) {
  // if (this._authorizationGuard.CheckAcess("Cataloguelist", "ViewEdit")) {
  //   return;
  // }

  this.selectedDeleteId = + id;
  this.deleteColumn = DeleteColumnvalue;
  $('#modaldeleteconfimation').modal('show');
} 

onLoad(SearchBy: string, Search: string, ) {
  let startdate: Date = this.selectedDateRange.startDate._d.toISOString().substring(0, 10);
  let enddate: Date = this.selectedDateRange.endDate._d.toISOString().substring(0, 10);
  return this._catalogueService.CustomSearch(SearchBy, Search, startdate, enddate).subscribe(

    (lst) => {
      if (lst != null) {
        this.items = lst;
        this.CatalogueStatus('New');
        this.loadItems();

      }
    },
    (err) => {
      console.log(err);
    }
  );
} 

CatalogueStatus(Status: string) { 
  this.items1 = this.items.filter(a => a.Custom_CatalogueStatus == Status);
  this.loadItems();
} 

//#region Paging Sorting and Filtering Start Under Consultant
public allowUnsort = false;
public sort: SortDescriptor[] = [{
  field: 'MarketPlaceSellerID',
  dir: 'asc'
}];
public gridView: GridDataResult;
public pageSize = 10;
public skip = 0;
private data: Object[];
private items: CatalogueHeader[] = [] as any;
private items1: CatalogueHeader[] = [] as any;
public state: State = {
  skip: 0,
  take: 5,

  // Initial filter descriptor
  filter: {
    logic: 'and',
    filters: [{ field: 'MarketPlaceSellerID', operator: 'contains', value: '' }]
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
    data: orderBy(this.items1, this.sort).slice(this.skip, this.skip + this.pageSize),
    total: this.items1.length
  };
}
private loadSortItems(): void {
  this.gridView = {
    data: orderBy(this.items1, this.sort).slice(this.skip, this.skip + this.pageSize),
    total: this.items1.length
  };
}
public dataStateChange(state: DataStateChangeEvent): void {
  this.state = state;
  this.gridView = process(this.items1, this.state);
}

public onFilter(inputValue: string): void {
  this.gridView = process(this.items1, {

    skip: this.skip,
    take: this.skip + this.pageSize,
    filter: {
      logic: "or",
      filters: [
        {
          field: 'MarketPlaceSellerID',
          operator: 'contains',
          value: inputValue
        },
        {
          field: 'CatalogueNumber',
          operator: 'contains',
          value: inputValue
        },
        {
          field: 'CatalogueDate',
          operator: 'contains',
          value: inputValue
        },
        {
          field: 'NoOfItem',
          operator: 'contains',
          value: inputValue
        },
        {
          field: 'Custom_CatalogueStatus',
          operator: 'contains',
          value: inputValue
        },
        {
          field: 'LastModifiedDate',
          operator: 'contains',
          value: inputValue
        },
      ],
    }
  });
}

//#endregion Paging Sorting and Filtering End 
}
