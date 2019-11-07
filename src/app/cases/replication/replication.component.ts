import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthorizationGuard } from '../../_guards/Authorizationguard';
import { RTVCaseHeader } from '../../_services/model';
import { RTVcasesService } from '../../_services/service/rtvcases.service';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-replication',
  templateUrl: './replication.component.html',
  styleUrls: ['./replication.component.css']
})
export class ReplicationComponent implements OnInit {
  identity: number;
  ParentRTVid: number;
  ParentCaseId: string;
  AmazonCaseId: string = '';
  CurrentStatus: string = '';
  ReimbursementValue: number = 0;
  NewReimbursementValue: number = 0;
  Remarks: string = '';
  lstParentCaseId: RTVCaseHeader[];
  lst: RTVCaseHeader[];
  obj: RTVCaseHeader = {} as any;

  constructor(
    private alertService: ToastrService,
    private _router: Router,
    private aroute: ActivatedRoute,

    private _RTVcasesService: RTVcasesService,
    private _authorizationGuard: AuthorizationGuard,
    private _PrivateutilityService: PrivateutilityService,
  ) { }

  ngOnInit() {
    this.ParentRTVid = 0;
    this.BindParentCaseId();

  }

  onchangeParentCaseId(RTVID: number) {
    this._RTVcasesService.RTVCaseSearchById(RTVID)
      .subscribe(
        (data) => {
          this.ParentCaseId = data.AmazonCaseId;
          this.obj = data;
        },
        (err) => {
          console.log(err);
        }
      );
  }

  BindParentCaseId() {
    this._PrivateutilityService.GetRTVAmazonClosedCaseID()
      .subscribe(
        (data: RTVCaseHeader[]) => {
          this.lstParentCaseId = data;
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  SaveData() {
    if (this._authorizationGuard.CheckAcess("Replicationlist", "ViewEdit")) {
      return;
    }
    if (this.ParentRTVid == 0) {
      this.alertService.error("Please select Parent CaseId.!");
      return;
    }
    if (this.AmazonCaseId == '') {
      this.alertService.error("Please enter the Amazon CaseId!");
      return;
    }
    if (this.Remarks == '') {
      this.alertService.error("Please enter the Remarks!");
      return;
    }
    else {
      this.obj = new RTVCaseHeader();
      this.obj.RTVID = this.ParentRTVid;
      this.obj.CurrentStatus = 'REOPEN';
      this.obj.ReimbursementValue = 0;
      this.obj.AmazonCaseId = this.AmazonCaseId;
      this.obj.Remarks = this.Remarks;
      this.obj.ParentCaseId = this.lstParentCaseId.filter(a => a.RTVID == this.ParentRTVid)[0].AmazonCaseId;
      //for  replication details
      this._RTVcasesService.Existence("", this.obj.AmazonCaseId, this.identity)
        .subscribe(
          (data) => {
            if (data == true) {
              this.alertService.error('This Amazon CaseId is already registered');
            }
            else {
              return this._RTVcasesService.RTVCaseUpdate(this.obj).subscribe(
                (data) => {
                  if (data != null && data.Flag == true) {
                    this.alertService.success(data.Msg);
                  } else {
                    this.alertService.error(data.Msg);
                  }
                  this._router.navigate(['/Replicationlist']);

                },
                (err) => {
                  console.log(err);
                }
              );
            }
            //
          },
          (err: any) => {
            console.log(err);
          }
        );
    }

  }

  addpath(imagepath: string) {
    return environment.basedomain + imagepath;
  }

}

