import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthorizationGuard } from '../../_guards/Authorizationguard';
import { RTVCaseHeader,  RTVUsers,   } from '../../_services/model';
import { RTVcasesService } from '../../_services/service/rtvcases.service';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { AuthenticationService } from '../../_services/service/authentication.service'; 

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit {
  TransferTo: number = 0;
  Remarks: string = '';
  lstTransferTo: RTVUsers[];
  lst: RTVCaseHeader[];
  // dtOptions: DataTables.Settings = {};
 

  constructor(
    private alertService: ToastrService,
    private _router: Router,
    private aroute: ActivatedRoute,
    
    private _RTVcasesService: RTVcasesService,
    private _authorizationGuard: AuthorizationGuard,
    private _PrivateutilityService: PrivateutilityService,
    private _authenticationService: AuthenticationService,
    
  ) { }

  ngOnInit() {
    this.Remarks = '';
    this.BindTransferTo();
    let currentUser = this._authenticationService.currentUserValue;
    let LoginId = currentUser.UserId;
     this.onLoad(LoginId);
  }

  BindTransferTo() {
    
    this._PrivateutilityService.GetRTVUsersExceptLogin()
      .subscribe(
        (data: RTVUsers[]) => {
          this.lstTransferTo = data;
          
        },
        (err: any) => {
          
          console.log(err);
        }
      );
  }

  onLoad(LoginId:number) {
    
    return this._RTVcasesService.RTVCaseTransfer(LoginId).subscribe(
      (data) => {
        if (data != null) {
          this.lst = data;
          // this.dtOptions = {
          //   paging: false,
          //   scrollY: '400px',
          //   "language": {
          //     "search": 'Filter',
          //   },
          // };
        }
        
      },
      (err) => {
        
        console.log(err);
      }
    );
  }

  onchangeTransferTo(TransferTo:number){
    if (TransferTo!=0){
      this.onLoad(TransferTo);
    }
  }

  ContactIDFieldsChange(values: any, RTVID: number) {
    this.lst.filter(a => a.RTVID == RTVID)[0].IsActive = values.currentTarget.checked;
  }

  checkcontacts(value: boolean) {
    for (var i = 0; i < this.lst.length; i++) {
      this.lst[i].IsActive = value;
      $('#' + i).prop("checked", value);
    }
  }

  SaveData() {
    if (this._authorizationGuard.CheckAcess("Transferlist", "ViewEdit")) {
      return;
    }
    if (this.TransferTo == 0) {
      this.alertService.error("Please select Transfer To.!");
      return;
    }

    if (this.Remarks == '') {
      this.alertService.error("Please enter the Remarks!");
      return;
    }

    if (this.lst.filter(a => a.IsActive == true).length == 0) {
      this.alertService.error("Please select atleast one row in the list.!");
      return;
    }
    else {
      return this._RTVcasesService.RTVCaseTransferSave(this.TransferTo,this.Remarks,
        this.lst.filter(a => a.IsActive == true)).subscribe(
          (data) => {
            if (data != null && data.Flag == true) {
              this.alertService.success(data.Msg);
            } else {
              this.alertService.error(data.Msg);
            }
            this._router.navigate(['/Transferlist']);
            
          },
          (err) => {
            
            console.log(err);
          }
        );
    }


  }



}
