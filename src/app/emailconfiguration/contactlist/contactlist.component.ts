import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { ContactService } from '../../_services/service/contact.service';
import { Contact } from '../../_services/model';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'

import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
@Component({
  selector: 'app-contactlist',
  templateUrl: './contactlist.component.html',
  styleUrls: ['./contactlist.component.css']
})
export class ContactlistComponent implements OnInit {
  //#region variable declartion
 
  obj: Contact;
  confirmDelete = false;
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
    private _contactService: ContactService,
    
    private _authorizationGuard: AuthorizationGuard
  ) { }

  ngOnInit() {
    this.onLoad('', '', true);
  }



  Search(): void {
    this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
  }

  Refresh(): void {
    this.SearchBy = '',
      this.SearchKeyword = '',
      this.Searchaction = true;
  }

  editButtonClick(id: number) {
    if (this._authorizationGuard.CheckAcess("Contactlist", "ViewEdit")) {
      return;
    }
    this.router.navigate(['/Contact', id]);
  }

  confirmDeleteid(id: number, DeleteColumnValue: string) {
    if (this._authorizationGuard.CheckAcess("Contactlist", "ViewEdit")) {
      return;
    }
    this.confirmDelete = true;
    this.selectedDeleteId = + id;
    this.deleteColumn = DeleteColumnValue;
    $('#modaldeleteconfimation').modal('show');
  }

  delete() {
    //
    this._contactService.delete(this.selectedDeleteId).subscribe(
      (data) => {
        if (data) {
          this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
          this.alertService.success('Contact data has been deleted successfully');
        }
        else {
          this.alertService.error('Contact - ' + this.deleteColumn + ' is being used in the application, Can’t be deleted.!');
        }
        $('#modaldeleteconfimation').modal('hide');
        this.confirmDelete = false;
        //
      },
      (error: any) => {
        //
        console.log(error);
      }
    )
  }

  onLoad(SearchBy: string, Search: string, IsActive: Boolean) {

    //
    return this._contactService.search(SearchBy, Search, IsActive).subscribe(
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
    if (this._authorizationGuard.CheckAcess("Contactlist", "ViewEdit")) {
      return;
    }
    this.router.navigate(['/Contact/Create',]);
  }

  //#region Paging Sorting and Filtering Start
  public allowUnsort = true;
  public sort: SortDescriptor[] = [{
    field: 'BrandName',
    dir: 'asc'
  }];
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  private items: Contact[] = [] as any;
  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'BrandName', operator: 'contains', value: '' }]
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
