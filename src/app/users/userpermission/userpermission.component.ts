import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../_services/service/user.service';
import { ToastrService } from 'ngx-toastr';
import { Userpermission } from '../../_services/model';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthorizationGuard } from '../../_guards/Authorizationguard';
@Component({
  selector: 'app-userpermission',
  templateUrl: './userpermission.component.html',
  styleUrls: ['./userpermission.component.css']
})

export class UserpermissionComponent implements OnInit {
  email: string = '';
  identity: number = 0;
  lstUserpermission: Userpermission[];
  constructor(
    public _userService: UserService,
    private alertService: ToastrService,
    private aroute: ActivatedRoute,
    private _router: Router,
    private _spinner: NgxSpinnerService,
    private _authorizationGuard: AuthorizationGuard,
  ) { }


  ngOnInit() {

    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
      this.email = params.get('email');
      debugger
      if (this.identity > 0) {
        this._spinner.show();
        return this._userService.getUserPermission(this.identity).subscribe(
          (data) => {
            this.lstUserpermission = data;
            this._spinner.hide();
          },
          (err) => {
            this._spinner.hide();
            console.log(err)
          }
        );
      }
    });

  }


  onload() {
    let nonrallllids = [] as any;
    nonrallllids = this.lstUserpermission.filter(a => a.IsViewEdit == '0').map(a => a.MenuID);
    nonrallllids.forEach(element => {
      $('#' + element + '_None').prop("checked", true);
    });

    let Viewallids = [] as any;
    Viewallids = this.lstUserpermission.filter(a => a.IsViewEdit == '1').map(a => a.MenuID);
    Viewallids.forEach(element => {
      $('#' + element + '_View').prop("checked", true);
    });

    let ViewEditallids = [] as any;
    ViewEditallids = this.lstUserpermission.filter(a => a.IsViewEdit == '2').map(a => a.MenuID);
    ViewEditallids.forEach(element => {
      $('#' + element + '_ViewEdit').prop("checked", true);
    });
  }

  fnusercheckall_None(id: number) {
    let submenus = [] as any;
    submenus = this.lstUserpermission.filter(a => a.ParentId == id);

    submenus = submenus.map(a => a.MenuID);
    //alert(submenus);
    submenus.forEach(element => {
      $('#' + element + '_None').prop("checked", true);
      this.lstUserpermission.filter(a => a.MenuID == element)[0].IsViewEdit = '0';
    });
  }

  fnusercheckall_View(id: number) {
    let submenus = [] as any;
    submenus = this.lstUserpermission.filter(a => a.ParentId == id);

    submenus = submenus.map(a => a.MenuID);
    //alert(submenus);
    submenus.forEach(element => {
      $('#' + element + '_View').prop("checked", true);
      this.lstUserpermission.filter(a => a.MenuID == element)[0].IsViewEdit = '1';
    });
  }

  fnusercheckall_ViewEdit(id: number) {
    let submenus = [] as any;
    submenus = this.lstUserpermission.filter(a => a.ParentId == id);

    submenus = submenus.map(a => a.MenuID);
    //alert(submenus);
    submenus.forEach(element => {
      $('#' + element + '_ViewEdit').prop("checked", true);
      this.lstUserpermission.filter(a => a.MenuID == element)[0].IsViewEdit = '2';
    });
  }
  fnusermenu_None(id: number) {
    this.lstUserpermission.filter(a => a.MenuID == id)[0].IsViewEdit = '0';
  }

  fnusermenu_View(id: number) {
    this.lstUserpermission.filter(a => a.MenuID == id)[0].IsViewEdit = '1';
  }

  fnusermenu_ViewEdit(id: number) {
    this.lstUserpermission.filter(a => a.MenuID == id)[0].IsViewEdit = '2';
  }

  savepermission() {

    if (this._authorizationGuard.CheckAcess("Userlist", "ViewEdit")) {
      return;
    }

    let id = 0;
    this.aroute.paramMap.subscribe(params => {
      id = +params.get('id');
      if (id) {
        this.lstUserpermission.map(a => a.UserId = id);
        this._spinner.show();
        this._userService.updateUserPermission(this.lstUserpermission).subscribe(
          (data) => {
            this._spinner.hide();
            if (data != null && data.Flag == true) {
              this.alertService.success(data.Msg);
              this._router.navigate(['/Userlist']);
            }
            else {
              this.alertService.error(data.Msg);
              this._router.navigate(['/Userlist']);
            }
          },
          (error: any) => {
            this._spinner.hide();
            console.log(error);
          }
        );
      }
    });

  }

  fnusercheckall_View3(id: number) {
    let submenus = [] as any;
    submenus = this.lstUserpermission.filter(a => a.ParentId == id);

    submenus = submenus.map(a => a.MenuID);
    //alert(submenus);
    submenus.forEach(element => {
      $('#' + element + '_View3').prop("checked", true);
      this.lstUserpermission.filter(a => a.MenuID == element)[0].IsViewEdit = '3';
    });
  }

  fnusercheckall_View4(id: number) {
    let submenus = [] as any;
    submenus = this.lstUserpermission.filter(a => a.ParentId == id);

    submenus = submenus.map(a => a.MenuID);
    //alert(submenus);
    submenus.forEach(element => {
      $('#' + element + '_View4').prop("checked", true);
      this.lstUserpermission.filter(a => a.MenuID == element)[0].IsViewEdit = '4';
    });
  }

  fnusermenu_View3(id: number) {
    this.lstUserpermission.filter(a => a.MenuID == id)[0].IsViewEdit = '3';
  }

  fnusermenu_View4(id: number) {
    this.lstUserpermission.filter(a => a.MenuID == id)[0].IsViewEdit = '4';
  }
  filter(type: number): Userpermission[] {
    let result: Userpermission[] = [];
    if (type == 0) {
      result = this.lstUserpermission.filter(a => a.ParentId != 80 && a.MenuID != 80);
    }
    else {
      result = this.lstUserpermission.filter(a => a.ParentId == 80 || a.MenuID == 80);
    }
    return result;
  }

}
