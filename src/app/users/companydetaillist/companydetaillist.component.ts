import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { CompanydetailService } from '../../_services/service/companydetail.service';
import { Companydetails } from '../../_services/model';

import { AuthorizationGuard } from '../../_guards/Authorizationguard'

import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
@Component({
  selector: 'app-companydetaillist',
  templateUrl: './companydetaillist.component.html',
  styleUrls: ['./companydetaillist.component.css']
})
export class CompanydetaillistComponent implements OnInit {

  //#region variable declartion

  obj: Companydetails;

  selectedDeleteId: number;
  dtOptions: DataTables.Settings = {};
  deleteColumn: string;

  //#endregion
  constructor(
    private alertService: ToastrService,
    private router: Router,
    private _companydetailService: CompanydetailService,

    private _authorizationGuard: AuthorizationGuard
  ) { }

  ngOnInit() {

    this.onLoad();
  }

  editButtonClick(id: number) {
    if (this._authorizationGuard.CheckAcess("Companydetaillist", "ViewEdit")) {
      return;
    }
    this.router.navigate(['/Companydetails', id]);
  }

  confirmDeleteid(id: number, DeleteColumnvalue: string) {
    if (this._authorizationGuard.CheckAcess("Companydetaillist", "ViewEdit")) {
      return;
    }

    this.selectedDeleteId = + id;
    this.deleteColumn = DeleteColumnvalue;
    $('#modaldeleteconfimation').modal('show');
  }

  delete() {
    //
    this._companydetailService.delete(this.selectedDeleteId).subscribe(
      (data) => {
        if (data) {
          this.onLoad();
          this.alertService.success('Store data has been deleted successful');
        } else {
          this.alertService.error('Store – ' + this.deleteColumn + ' is being used in the application, Can’t be deleted.!');
        }
        $('#modaldeleteconfimation').modal('hide');

        //
      },
      (error: any) => {
        //
        console.log(error);
      }
    );
  }

  onLoad() {
    //
    return this._companydetailService.search('').subscribe(
      (lst) => {
        if (lst != null) {
          this.items = lst;
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
    if (this._authorizationGuard.CheckAcess("Companydetaillist", "ViewEdit")) {
      return;
    }
    this.router.navigate(['/Companydetails/Create']);
  }

  //#region Paging Sorting and Filtering Start
  public allowUnsort = false;
  public sort: SortDescriptor[] = [{
    field: 'StoreName',
    dir: 'asc'
  }];
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  private items: Companydetails[] = [] as any;
  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'StoreName', operator: 'contains', value: '' }]
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

  //#endregion Paging Sorting and Filtering End

}
