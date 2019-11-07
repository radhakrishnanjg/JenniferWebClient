import { Component, OnInit } from '@angular/core';

import { AuthorizationGuard } from  '../../_guards/Authorizationguard'
import { UserService } from  '../../_services/service/user.service';
import { ToastrService } from 'ngx-toastr';
import { Userpermission } from  '../../_services/model';
@Component({
  selector: 'app-menulist',
  templateUrl: './menulist.component.html',
  styleUrls: ['./menulist.component.css']
})
export class MenulistComponent implements OnInit {
  lstmenus: Userpermission[];
  IsActive: Boolean
  selectedDeleteId: number;
  deleteColumn: string;
  dtOptions: DataTables.Settings = {};
  constructor(
    private alertService: ToastrService,
    private _userService: UserService,
    
    private _authorizationGuard: AuthorizationGuard
  ) { }

  ngOnInit() {

    this.onLoad();
  }

  confirmDeleteid(id: number, DeleteColumnvalue: string, IsActive: Boolean) {
    if (this._authorizationGuard.CheckAcess("Menulist", "ViewEdit")) {
      return;
    }
    this.selectedDeleteId = + id;
    this.deleteColumn = DeleteColumnvalue;
    this.IsActive = IsActive;
    $('#modaldeleteconfimation').modal('show');
  }

  onLoad() {
    //
    return this._userService.getMenus().subscribe(
      (data) => {
        this.lstmenus = data;
        this.dtOptions = {
          "ordering": false,
          pagingType: 'full_numbers',
          "language": {
            "search": 'Filter',
          },
        };
        //
      },
      (err) => {
        //
        console.log(err);
      }
    );
  }

  delete() {
    //
    this._userService.updateMenu(this.selectedDeleteId, !this.IsActive).subscribe(
      (data) => {
        if (data) {
          this.onLoad();
          if (this.IsActive) {
            this.alertService.success('Menu data has been deactviated successful');
          } else {
            this.alertService.success('Menu data has been actviated successful');
          }
        } else {
          this.alertService.error('Menu update is failure !');
        }
        $('#modaldeleteconfimation').modal('hide');
        //
        this.IsActive = false;
      },
      (error: any) => {
        //
        this.IsActive = false;
        console.log(error);
      }
    );
  }

}
