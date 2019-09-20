import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from '../../_services/service/user.service';
import { ToastrService } from 'ngx-toastr';
import { CompanyRegister } from '../../_services/model';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { AuthenticationService } from 'src/app/_services/service/authentication.service';
@Component({
  selector: 'app-companyprofile',
  templateUrl: './companyprofile.component.html',
  styleUrls: ['./companyprofile.component.css']
})
export class CompanyprofileComponent implements OnInit {

  company: CompanyRegister;
  panelTitle: string = '';

  usertype: string = '';
  constructor(private aroute: ActivatedRoute,
    private alertService: ToastrService,
    private _router: Router,
    public _authenticationService: AuthenticationService,
    private _userService: UserService,
    private _spinner: NgxSpinnerService,
    private _authorizationGuard: AuthorizationGuard) { }

  ngOnInit() {

    let currentUser = this._authenticationService.currentUserValue;
    this.usertype = currentUser.UserType;
    if (currentUser.UserType == 'Admin') {
      let Id = 0 as number;
      Id = currentUser.CompanyID;
      this._spinner.show();
      this._userService.companySearchById(Id)
        .subscribe(
          (data: CompanyRegister) => {
            this.company = data;
            this._spinner.hide();
          },
          (err: any) => {
            console.log(err);
            this._spinner.hide();
          }
        );
    }
    else {
      this.panelTitle = "You don't have permission to view this screen";
    }

  }

}
