import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { PpobService } from '../../_services/service/ppob.service';
import { Ppob } from '../../_services/model';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'

import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';

@Component({
  selector: 'app-ppoblist',
  templateUrl: './ppoblist.component.html',
  styleUrls: ['./ppoblist.component.css']
})
export class PpoblistComponent implements OnInit {

  //#region variable declartion

  obj: Ppob= {} as any;

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
    private _ppobService: PpobService,

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

  editButtonClick(id: number) {
    if (this._authorizationGuard.CheckAcess("PPOBlist", "ViewEdit")) {
      return;
    }
    this.router.navigate(['/PPOB', id]);
  }
 


  confirmDeleteid(id: number, DeleteColumnvalue: string) {
    if (this._authorizationGuard.CheckAcess("PPOBlist", "ViewEdit")) {
      return;
    }

    this.selectedDeleteId = + id;
    this.deleteColumn = DeleteColumnvalue;
    $('#modaldeleteconfimation').modal('show');
  }

  delete() {
    this._ppobService.PPOBDelete(this.selectedDeleteId).subscribe(
      (data) => {
        if (data) {
          this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
          this.alertService.success('PPOB data has been deleted successful');
        } else {
          this.alertService.error('PPOB – ' + this.deleteColumn + ' is being used in the application, Can’t be deleted.!');
        }
        $('#modaldeleteconfimation').modal('hide');

      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  onLoad(SearchBy: string, Search: string, IsActive: boolean) {
    return this._ppobService.PPOBSearch(SearchBy, Search, IsActive).subscribe(
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

  AddNewLink() {
    if (this._authorizationGuard.CheckAcess("PPOBlist", "ViewEdit")) {
      return;
    }
    this.router.navigate(['/PPOB/Create',]);
  }
  //#region Paging Sorting and Filtering Start
  public allowUnsort = false;
  public sort: SortDescriptor[] = [{
    field: 'StateName',
    dir: 'asc'
  }];
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  private items: Ppob[] = [] as any;
  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'StateName', operator: 'contains', value: '' }]
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
            field: 'GSTNumber',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'CountryName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'StateName',
            operator: 'contains',
            value: inputValue
          }, 
          {
            field: 'City',
            operator: 'contains',
            value: inputValue
          }, 
          {
            field: 'ContactName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ContactNumber',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'Email',
            operator: 'contains',
            value: inputValue
          }, 
        ],
      }
    });
  }
  //#endregion Paging Sorting and Filtering End
}
