import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

import { UserService } from  '../../_services/service/user.service';
import { ToastrService } from 'ngx-toastr';
import { CompanyRegister } from  '../../_services/model';
import { AuthorizationGuard } from  '../../_guards/Authorizationguard';
import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
@Component({
  selector: 'app-companylist',
  templateUrl: './companylist.component.html',
  styleUrls: ['./companylist.component.css']
})
export class CompanylistComponent implements OnInit {

  //#region variable declartion
 
  company: CompanyRegister;
  
  selectedDeleteId: number;
  selectedUpdateId: number;
  currentUserSubscription: Subscription;
  dtOptions: DataTables.Settings = {};
  deleteColumn: string;
  //#endregion

  constructor(
    private alertService: ToastrService,
    private router: Router,
    private _userService: UserService,
    private _spinner: NgxSpinnerService, 
    private _authorizationGuard: AuthorizationGuard
  ) { }

  ngOnInit() {

    
    this.onLoad();
  } 

  confirmDeleteid(id: number, DeleteColumnvalue: string) {    
    this.selectedDeleteId = + id;
    this.deleteColumn = DeleteColumnvalue;
    $('#modaldeleteconfimation').modal('show');
  } 

  delete() {

    if (this._authorizationGuard.CheckAcess("Companylist", "ViewEdit")) {
      return;
    }
    this._spinner.show();
    this._userService.companyDelete(this.selectedDeleteId).subscribe(
      (data) => {
        if (data) {
          this.onLoad();
          this._spinner.hide();
          this.alertService.success('Company data has been deleted successful' );
          this.router.navigate(['/Companylist']);
        }
        else {
          this.alertService.error('Company – ' + this.deleteColumn + ' is being used in the application, Can’t be deleted.!');
          this.router.navigate(['/Companylist']);
        } 
        $('#modaldeleteconfimation').modal('hide');
      },
      (error: any) => { console.log(error); 
        this._spinner.hide();}
    );
    this.onLoad();
  }

  onLoad() {

    this._spinner.show();
    return this._userService.companySearch('').subscribe(
      (data) => {
        if (data != null) { 
          this.items = data;
          this.loadItems(); 

        }
        this._spinner.hide();
      },
      (err) => {
        console.log(err);
        this._spinner.hide();
      }
    );
  }

   //#region Paging Sorting and Filtering Start
   public allowUnsort = true;
   public sort: SortDescriptor[] = [{
     field: 'CompanyName',
     dir: 'asc'
   }];
   public gridView: GridDataResult;
   public pageSize = 10;
   public skip = 0;
   private data: Object[];
   private items: CompanyRegister[] = [] as any;
   public state: State = {
     skip: 0,
     take: 5,
 
     // Initial filter descriptor
     filter: {
       logic: 'and',
       filters: [{ field: 'CompanyName', operator: 'contains', value: '' }]
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
