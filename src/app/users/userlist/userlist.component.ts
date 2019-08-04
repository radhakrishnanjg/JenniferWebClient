import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

import { UserService } from '../../_services/service/user.service';
import { ToastrService } from 'ngx-toastr';
import { IUser } from '../../_services/model';

import { AuthorizationGuard } from '../../_guards/Authorizationguard'
@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})


export class UserlistComponent implements OnInit {
  users: IUser[];
  user: IUser;
  userForm: FormGroup;

  selectedDeleteId: number;
  deleteColumn: string;
  dtOptions: DataTables.Settings = {};
  SearchBy: string = '';
  SearchKeyword: string = '';
  Searchaction: boolean = true;
  constructor(
    private alertService: ToastrService,
    private router: Router,
    private _userService: UserService,
    private _spinner: NgxSpinnerService,
    private _authorizationGuard: AuthorizationGuard
  ) {
  }

  ngOnInit() {
    this.onLoad(this.SearchBy, this.SearchKeyword, true);
  }


  editButtonClick(id: number) {
    if (this._authorizationGuard.CheckAcess("Userlist", "ViewEdit")) {
      return;
    }
    this.router.navigate(['/User', id]);
  }

  editPermissionClick(id: number) {
    if (this._authorizationGuard.CheckAcess("Userlist", "ViewEdit")) {
      return;
    }
    this.router.navigate(['/Userpermission', id]);
  }

  confirmDeleteid(id: number, DeleteColumnvalue: string) {
    if (this._authorizationGuard.CheckAcess("Userlist", "ViewEdit")) {
      return;
    }

    this.selectedDeleteId = + id;
    this.deleteColumn = DeleteColumnvalue;
    $('#modaldeleteconfimation').modal('show');
  }

  onLoad(SearchBy: string, Search: string, IsActive: Boolean) {
    this._spinner.show();
    return this._userService.search(SearchBy, Search, IsActive).subscribe(
      (employeeList) => {
        this.users = employeeList;
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


  delete() {
    this._spinner.show();
    this._userService.delete(this.selectedDeleteId).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
          this.alertService.success('User data has been deleted successful');
        } else {
          this.alertService.error('User – ' + this.deleteColumn + ' is being used in the application, Can’t be deleted.!');
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
