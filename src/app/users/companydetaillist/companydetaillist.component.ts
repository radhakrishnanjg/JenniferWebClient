import { Component, OnInit } from '@angular/core'; 
import { Router } from '@angular/router'; 
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';  
import { CompanydetailService } from  '../../_services/service/companydetail.service';
import { Companydetails } from  '../../_services/model';

import { AuthorizationGuard } from  '../../_guards/Authorizationguard'
@Component({
  selector: 'app-companydetaillist',
  templateUrl: './companydetaillist.component.html',
  styleUrls: ['./companydetaillist.component.css']
})
export class CompanydetaillistComponent implements OnInit {

  //#region variable declartion

  lst: Companydetails[];
  obj: Companydetails;
  
  selectedDeleteId: number;  
  dtOptions: DataTables.Settings = {};
  deleteColumn: string;
  //#endregion
  constructor(
    private alertService: ToastrService,
    private router: Router,
    private _companydetailService: CompanydetailService,
    private _spinner: NgxSpinnerService,  
    private _authorizationGuard: AuthorizationGuard
  ) { }

  ngOnInit() {
    
    this.onLoad(); 
  }

  onLoad() {
    this._spinner.show();
    return this._companydetailService.search('').subscribe(
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
    this._spinner.show();
    this._companydetailService.delete(this.selectedDeleteId).subscribe(
      (data) => {
        if (data) { 
          this.onLoad();
          this.alertService.success('Store data has been deleted successful' );
        } else { 
          this.alertService.error('Store – ' + this.deleteColumn + ' is being used in the application, Can’t be deleted.!');
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
