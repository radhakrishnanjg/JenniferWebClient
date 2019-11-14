import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GstfinancefileuploadService } from '../../_services/service/gstfinancefileupload.service';
import { Gstfinancefileupload, } from '../../_services/model';

import { AuthorizationGuard } from '../../_guards/Authorizationguard';
import { PrivateutilityService } from 'src/app/_services/service/privateutility.service';

@Component({
  selector: 'app-gstapproval',
  templateUrl: './gstapproval.component.html',
  styleUrls: ['./gstapproval.component.css']
})
export class GstapprovalComponent implements OnInit {
  obj: Gstfinancefileupload;
  identity: number = 0;
  Remarks: string = '';
  constructor(
    private router: Router,
    private aroute: ActivatedRoute,
    public _alertService: ToastrService,
    public _gstfinancefileuploadService: GstfinancefileuploadService,
    private _authorizationGuard: AuthorizationGuard
  ) { }

  ngOnInit() {
    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
      if (this.identity > 0) {

        this._gstfinancefileuploadService.SearchById(this.identity).subscribe(
          (data) => {
            this.obj = data;
          },
          (error: any) => {
            console.log(error);
          }
        );
      }

    });
  }

  downloadActualFile(downloadFilePath: string,
    fileName: string) {
    debugger
    this._gstfinancefileuploadService.downloadActualFile(downloadFilePath, fileName)
      .subscribe(data => {
        this._alertService.success('File Downloaded successfully');
        saveAs(data, fileName)
      },
        (err) => {
          //
          console.log(err);
        }
      );
  }

  Save(Action: string) {
    if (this._authorizationGuard.CheckAcess("Gstlist", "ViewEdit")) {
      return;
    }
    if (this.Remarks == "") {
      this._alertService.error("Please enter the Remarks.!");
      return;
    }
    this.obj = new Gstfinancefileupload();
    this.obj.FileID = this.identity;
    this.obj.ApprovalStatus = Action;
    this.obj.Remarks = this.Remarks;
    // L1 Approval
    if (Action == "L1 REJECTED" || Action == "L1 APPROVED") {
      this._gstfinancefileuploadService.FinanceApproverCheck()
        .subscribe(
          (CheckAcess) => {
            if (CheckAcess != "L1") {
              this._alertService.error("You dont have access to use this page,Please contact administrator.!");
              return;
            } else {
              this._gstfinancefileuploadService.Approval(this.obj).subscribe(
                (data) => {
                  if (data.Flag) {
                    this._alertService.success(data.Msg);
                    this.router.navigate(['/Gstlist']);
                  }
                  else {
                    this._alertService.error(data.Msg);
                    this.router.navigate(['/Gstlist']);
                  }
                },
                (error: any) => {
                }
              );
            }
          },
          (error: any) => {
            //
          }
        );
    }
    else if (Action == "L2 REJECTED" || Action == "L2 APPROVED") {
      // L2 Approval
      this._gstfinancefileuploadService.FinanceApproverCheck()
        .subscribe(
          (CheckAcess) => {
            if (CheckAcess != "L2") {
              this._alertService.error("You dont have access to use this page,Please contact administrator.!");
              return;
            } else {
              this._gstfinancefileuploadService.Approval(this.obj).subscribe(
                (data) => {
                  if (data.Flag) {
                    this._alertService.success(data.Msg);
                    this.router.navigate(['/Gstlist']);
                  }
                  else {
                    this._alertService.error(data.Msg);
                    this.router.navigate(['/Gstlist']);
                  }
                },
                (error: any) => {
                }
              );
            }
          },
          (error: any) => {
            //
          }
        );
    }
  }
}
