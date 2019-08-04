import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from  '../../_services/service/customer.service';
import { Customer } from  '../../_services/model';
import { AuthorizationGuard } from  '../../_guards/Authorizationguard'
@Component({
  selector: 'app-customerlist',
  templateUrl: './customerlist.component.html',
  styleUrls: ['./customerlist.component.css']
})
export class CustomerlistComponent implements OnInit {

   //#region variable declartion

   lst: Customer[];
   obj: Customer;
   
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
     private _customerService: CustomerService,
     private _spinner: NgxSpinnerService,
     private _authorizationGuard: AuthorizationGuard
   ) { }
 
   ngOnInit() {
     
     this.onLoad('', '', true);
   }
 
 
   onLoad(SearchBy: string, Search: string, IsActive: Boolean) {
 
     this._spinner.show();
     return this._customerService.search(SearchBy, Search, IsActive).subscribe(
       (data) => {
         this.lst = data;
         this.dtOptions = {
          pagingType: 'full_numbers',
          "language": {
            "search": 'Filter',
          },
        };
		
         this._spinner.hide();
       },
       (err) => {
         this._spinner.hide();
         console.log(err);
       }
     );
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
     if (this._authorizationGuard.CheckAcess("Customerlist", "ViewEdit")) {
       return;
     }
     this.router.navigate(['/Customer', id]);
   }
 
   confirmDeleteid(id: number, DeleteColumnvalue: string) {
     if (this._authorizationGuard.CheckAcess("Customerlist", "ViewEdit")) {
       return;
     }
     
     this.selectedDeleteId = + id;
     this.deleteColumn = DeleteColumnvalue;
     $('#modaldeleteconfimation').modal('show');
   }
 
   delete() {
     this._spinner.show();
     this._customerService.delete(this.selectedDeleteId).subscribe(
       (data) => {
         if (data) {
           this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
           this.alertService.success('Customer data has been deleted successful');
         } else {
          this.alertService.error('Customer – ' + this.deleteColumn + ' is being used in the application, Can’t be deleted.!');
         }
         $('#modaldeleteconfimation').modal('hide');
         
         this._spinner.hide();
       },
       (error: any) => {
         this._spinner.hide();
         console.log(error);
       }
     );
   }
}
