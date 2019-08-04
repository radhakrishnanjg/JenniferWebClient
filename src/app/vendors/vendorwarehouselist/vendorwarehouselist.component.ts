import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { VendorwarehouseService } from  '../../_services/service/vendorwarehouse.service';
import { Vendorwarehouse } from  '../../_services/model';
import { AuthorizationGuard } from  '../../_guards/Authorizationguard'
@Component({
  selector: 'app-vendorwarehouselist',
  templateUrl: './vendorwarehouselist.component.html',
  styleUrls: ['./vendorwarehouselist.component.css']
})
export class VendorwarehouselistComponent implements OnInit {

   //#region variable declartion

   lst: Vendorwarehouse[];
   obj: Vendorwarehouse;
   
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
     private _vendorwarehouseService: VendorwarehouseService,
     private _spinner: NgxSpinnerService,
     private _authorizationGuard: AuthorizationGuard
   ) { }
 
   ngOnInit() {
     
     this.onLoad('', '', true);
   }
 
 
   onLoad(SearchBy: string, Search: string, IsActive: Boolean) {
 
     this._spinner.show();
     return this._vendorwarehouseService.search(SearchBy, Search, IsActive).subscribe(
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
     if (this._authorizationGuard.CheckAcess("Vendorwarehouselist", "ViewEdit")) {
       return;
     }
     this.router.navigate(['/Vendorwarehouse', id]);
   }
 
   confirmDeleteid(id: number, DeleteColumnvalue: string) {
     if (this._authorizationGuard.CheckAcess("Vendorwarehouselist", "ViewEdit")) {
       return;
     }
     
     this.selectedDeleteId = + id;
     this.deleteColumn = DeleteColumnvalue;
     $('#modaldeleteconfimation').modal('show');
   }
 
   delete() {
     this._spinner.show();
     this._vendorwarehouseService.delete(this.selectedDeleteId).subscribe(
       (data) => {
         if (data) {
           this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
           this.alertService.success('Vendor warehouse data has been deleted successful');
         } else {
          this.alertService.error('Vendor warehouse – ' + this.deleteColumn + ' is being used in the application, Can’t be deleted.!');
       
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
