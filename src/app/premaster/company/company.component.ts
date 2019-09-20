import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

import { UserService } from '../../_services/service/user.service';
import { ToastrService } from 'ngx-toastr';
import { CompanyRegister } from '../../_services/model';

import { AuthorizationGuard } from '../../_guards/Authorizationguard'


@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  //#region variable declartion

  company: CompanyRegister;
  //#endregion
  constructor(
    private aroute: ActivatedRoute,
    private alertService: ToastrService,
    private _router: Router,
    private _userService: UserService,
    private _spinner: NgxSpinnerService,
    private _authorizationGuard: AuthorizationGuard
  ) { }

  ngOnInit() {

    let Id = 0 as number;
    this.aroute.paramMap.subscribe(params => {
      Id = parseInt(params.get('id'));
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
    });
  }

  AuthorsieCompany(): void {

    if (this._authorizationGuard.CheckAcess("Companylist", "ViewEdit")) {
      return;
    }
    let empId = 0;
    this.aroute.paramMap.subscribe(params => {
      empId = +params.get('id');
    });
    this._spinner.show();
    
    this._userService.CompanyAuthorise(empId,this.company.EMail).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.alertService.success(data.Msg);
          this._router.navigate(['/Companylist']);
        }
        else {
          this.alertService.error(data.Msg);
          this._router.navigate(['/Companylist']);
          this._spinner.hide();
        }
      },
      (error: any) => {
        console.log(error);
        this._spinner.hide();
      }
    );
  }

} 
