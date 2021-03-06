import { Component, OnInit } from '@angular/core';

import { UserService } from '../../_services/service/user.service';
import { CompanyRegister } from '../../_services/model';
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
  constructor(
    public _authenticationService: AuthenticationService,
    private _userService: UserService,
    
  ) { }

  ngOnInit() {

    let currentUser = this._authenticationService.currentUserValue;
    this.usertype = currentUser.UserType;
    if (currentUser.UserType == 'Admin') {
      let Id = 0 as number;
      Id = currentUser.CompanyID;
      //
      this._userService.companySearchById(Id)
        .subscribe(
          (data: CompanyRegister) => {
            this.company = data;
            //
          },
          (err: any) => {
            console.log(err);
            //
          }
        );
      this.panelTitle = "Company Profile";
    }
    else {
      this.panelTitle = "You don't have permission to view this screen";
    }

  }

}
