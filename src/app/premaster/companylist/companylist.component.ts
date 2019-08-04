import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

import { UserService } from  '../../_services/service/user.service';
import { ToastrService } from 'ngx-toastr';
import { CompanyRegister } from  '../../_services/model';
import { AuthorizationGuard } from  '../../_guards/Authorizationguard'
@Component({
  selector: 'app-companylist',
  templateUrl: './companylist.component.html',
  styleUrls: ['./companylist.component.css']
})
export class CompanylistComponent implements OnInit {

  //#region variable declartion

  companies: CompanyRegister[];
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
  editButtonClick(id: number) {
    if (this._authorizationGuard.CheckAcess("Companylist", "ViewEdit")) {
      return;
    }
    this.router.navigate(['/Company', id]); 
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
        this.companies = data;
        this.dtOptions = {
          pagingType: 'full_numbers',
          "language": {
            "search": 'Filter',
          },
        }; 
        this._spinner.hide();
      },
      (err) => {
        console.log(err);
        this._spinner.hide();
      }
    );
  }

}
