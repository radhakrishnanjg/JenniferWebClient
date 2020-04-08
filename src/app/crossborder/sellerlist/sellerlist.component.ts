import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { SellerregistrationService } from '../../_services/service/crossborder/sellerregistration.service';
import { SellerRegistration } from '../../_services/model/crossborder';
import { AuthorizationGuard } from '../../_guards/Authorizationguard';
import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';

@Component({
  selector: 'app-sellerlist',
  templateUrl: './sellerlist.component.html',
  styleUrls: ['./sellerlist.component.css']
})
export class SellerlistComponent implements OnInit {
  //#region variable declartion

  obj: SellerRegistration = {} as any;
  AssignedDetailDate: boolean;
  selectedDeleteId: number;
  dtOptions: DataTables.Settings = {};
  deleteColumn: string;
  SearchBy: string = '';
  SearchKeyword: string = '';
  Searchaction: boolean = true;

  //#endregion

  constructor(
    private alertService: ToastrService,
    private router: Router,
    private _sellerregistrationService: SellerregistrationService,
    private _authorizationGuard: AuthorizationGuard
  ) { }

  ngOnInit() {
    this.onLoad('', '', true);
  }


  Search(): void {
    this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
  }

  Refresh(): void {
    this.SearchBy = '';
    this.SearchKeyword = '';
    this.Searchaction = true;
  }


  onLoad(SearchBy: string, Search: string, IsActive: boolean) {
    return this._sellerregistrationService.Search(SearchBy, Search, IsActive).subscribe(
      (lst) => {
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


  //#region Paging Sorting and Filtering Start
  public allowUnsort = false;
  public sort: SortDescriptor[] = [{
    field: 'RKSellerID',
    dir: 'asc'
  }];
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  private items: SellerRegistration[] = [] as any;
  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'RKSellerID', operator: 'contains', value: '' }]
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
            field: 'SellerFormID',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'CompanyName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'Email',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'BusinessLaunchDate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ApprovalStatus',
            operator: 'contains',
            value: inputValue
          },

        ],
      }
    });
  }

  //#endregion Paging Sorting and Filtering End
}
