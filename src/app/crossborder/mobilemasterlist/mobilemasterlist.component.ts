import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { MobileMasterService } from '../../_services/service/crossborder/mobilemaster.service';
import { MobileMaster } from '../../_services/model/crossborder';
import { AuthorizationGuard } from '../../_guards/Authorizationguard';
import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';

@Component({
  selector: 'app-mobilemasterlist',
  templateUrl: './mobilemasterlist.component.html',
  styleUrls: ['./mobilemasterlist.component.css']
})
export class MobilemasterlistComponent implements OnInit {

  //#region variable declartion

  obj: MobileMaster = {} as any;
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
    private _mobileMasterService: MobileMasterService,
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

  confirmDeleteid(id: number, DeleteColumnvalue: string) {
    if (this._authorizationGuard.CheckAcess("Mobilemasterlist", "ViewEdit")) {
      return;
    }

    this.selectedDeleteId = + id;
    this.deleteColumn = DeleteColumnvalue;
    $('#modaldeleteconfimation').modal('show');
  }

  delete() {
    this._mobileMasterService.Delete(this.selectedDeleteId).subscribe(
      (data) => {
        if (data) {
          this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
          this.alertService.success('MobileMaster data has been deleted successful');
        } else {
          this.alertService.error('MobileMaster – ' + this.deleteColumn + ' is being used in the application, Can’t be deleted.!');
        }
        $('#modaldeleteconfimation').modal('hide');

      },
      (error: any) => {
        console.log(error);
      }
    );
  }


  onLoad(SearchBy: string, Search: string, IsActive: boolean) {
    return this._mobileMasterService.Search(SearchBy, Search, IsActive).subscribe(
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
    if (this._authorizationGuard.CheckAcess("Mobilemasterlist", "ViewEdit")) {
      return;
    }
    this.router.navigate(['/CrossBorder/Mobilemaster']);
  }

  //#region Paging Sorting and Filtering Start
  public allowUnsort = false;
  public sort: SortDescriptor[] = [{
    field: 'IndianGSTNumber',
    dir: 'asc'
  }];
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  private items: MobileMaster[] = [] as any;
  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'IndianGSTNumber', operator: 'contains', value: '' }]
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
            field: 'IndianGSTNumber',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'IndianMobileNumber',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'AssignedDetailDate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'SellerFormID',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'OTPSentDate',
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
