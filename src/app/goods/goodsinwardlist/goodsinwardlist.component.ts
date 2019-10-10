import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { GoodsinwardService } from '../../_services/service/goodsinward.service';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { Goodsinward } from '../../_services/model';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';

@Component({
  selector: 'app-goodsinwardlist',
  templateUrl: './goodsinwardlist.component.html',
  styleUrls: ['./goodsinwardlist.component.css']
})
export class GoodsinwardlistComponent implements OnInit {
 
  obj: Goodsinward;
  InwardGRNNumbers: string[] = [];
  dtOptions: DataTables.Settings = {};
  selectedDeleteId: number;
  identity: number = 0;
  deleteColumn: string = '';
  SearchBy: string = '';
  SearchKeyword: string = '';

  constructor(
    private alertService: ToastrService,
    private router: Router,
    private _goodsinwardService: GoodsinwardService,
    private _privateUtilityService: PrivateutilityService,
    private _spinner: NgxSpinnerService,
    private _authorizationGuard: AuthorizationGuard
  ) { }

  ngOnInit() {
    this.onLoad('', '');
  }

  Search(): void {
    this.onLoad(this.SearchBy, this.SearchKeyword);
  }

  Refresh(): void {
    this.SearchBy = '',
      this.SearchKeyword = ''
  }
  confirmDeleteid(id: number, DeleteColumnValue: string) {
    if (this._authorizationGuard.CheckAcess("Goodsinwardlist", "ViewEdit")) {
      return;
    }
    this.selectedDeleteId = + id;
    this.deleteColumn = DeleteColumnValue;
    $('#modaldeleteconfimation').modal('show');
  }

  delete() {
    this._spinner.show();
    this._goodsinwardService.delete(this.selectedDeleteId).subscribe(
      (data) => {
        if (data!=null && data==true ) {
          this.onLoad(this.SearchBy, this.SearchKeyword);
          this.alertService.success('Goods Inward data has been deleted successfully');
        }
        else {
          this.alertService.error('Goods Inward - ' + this.deleteColumn + ' is being used in the application, Can’t be deleted.!');
        }
        $('#modaldeleteconfimation').modal('hide');
        this._spinner.hide();
      },
      (error: any) => {
        this._spinner.hide();
        console.log(error);
      }
    )
  }

  onLoad(SearchBy: string, Search: string) {

    this._spinner.show();
    return this._goodsinwardService.search(SearchBy, Search).subscribe(
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
    if (this._authorizationGuard.CheckAcess("Goodsinwardlist", "ViewEdit")) {
      return;
    }
    this.router.navigate(['/Goodsinward/Create',]);
  }


  //#region Paging Sorting and Filtering Start
  public allowUnsort = true;
  public sort: SortDescriptor[] = [{
    field: 'GRNNumber',
    dir: 'asc'
  }];
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  private items: Goodsinward[] = [] as any;
  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'GRNNumber', operator: 'contains', value: '' }]
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
      //data: orderBy(this.items, this.sort).slice(this.skip, this.skip + this.pageSize),
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
