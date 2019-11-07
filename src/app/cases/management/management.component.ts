import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { saveAs } from 'file-saver';
import { AuthorizationGuard } from '../../_guards/Authorizationguard';
import { RTVCaseHeader, Dropdown } from '../../_services/model';
import { RTVcasesService } from '../../_services/service/rtvcases.service';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { AuthenticationService } from '../../_services/service/authentication.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css']
})
export class ManagementComponent implements OnInit {
  identity: number;
  AmazonCaseId: string = '';
  CurrentStatus: string;
  lstRtvStatus: Dropdown[];
  Remarks: string = '';
  ReimbursementValue: number = 0;
  lstCurrentStatus: RTVCaseHeader[];
  OldReimbursementValue: number = 0;
  lst: RTVCaseHeader[];
  obj: RTVCaseHeader = {} as any;
  UserId = 0;

  constructor(
    private alertService: ToastrService,
    private _router: Router,
    private aroute: ActivatedRoute,

    private _RTVcasesService: RTVcasesService,
    private _authorizationGuard: AuthorizationGuard,
    private _PrivateutilityService: PrivateutilityService,
    private _AuthenticationService: AuthenticationService,
  ) { }

  ngOnInit() {
    this.CurrentStatus = '0';
    this.Remarks = '';
    this.ReimbursementValue = 0;
    this.AmazonCaseId = '';

    this.UserId = this._AuthenticationService.currentUserValue.UserId;

    this.BindRTVStatus();
    this.BindTemplateInfo();
  }

  addpath(imagepath: string) {
    return environment.basedomain + imagepath;
  }

  BindTemplateInfo() {

    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
    });

    this._RTVcasesService.RTVCaseSearchById(this.identity)
      .subscribe(
        (data) => {
          this.obj = data;
          this.CurrentStatus = this.obj.CurrentStatus;
          this.AmazonCaseId = this.obj.AmazonCaseId;
          this.Remarks = this.obj.Remarks;
          this.identity = this.obj.RTVID;
          if (this.obj.lstHistory.length > 0) {
            this.OldReimbursementValue = this.obj.lstHistory[0].ReimbursementValue;
          }

        },
        (err) => {

          console.log(err);
        }
      );
  }

  BindRTVStatus() {


    this._PrivateutilityService.GetValues('RtvStatus')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstRtvStatus = data;

        },
        (err: any) => {

          console.log(err);
        }
      );
    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
    });
  }



  DownloadImages(RemovalOrderID: string, TrackingID: string, DisputeType: string) {
    this._RTVcasesService.RTVCaseImages(RemovalOrderID, TrackingID, DisputeType)
      .subscribe(data => {
        this.alertService.success("File downloaded succesfully.!");

        saveAs(data, TrackingID + '_' + RemovalOrderID + '' + DisputeType + '.zip')
      },
        (err) => {
          //
          console.log(err);
        }
      );
  }


  SaveData() {

    if (this._authorizationGuard.CheckAcess("Managementlist", "ViewEdit")) {
      return;
    }
    if (this.CurrentStatus == '' || this.CurrentStatus == '0') {
      this.alertService.error("Please select the Case Status!");
      return;
    }
    if (this.AmazonCaseId == '') {
      this.alertService.error("Please enter the Amazon CaseId!");
      return;
    }
    if (this.CurrentStatus == 'CLOSED' && this.ReimbursementValue <= 0) {
      this.alertService.error("Please enter the ReimbursementValue!");
      return;
    }
    if (this.Remarks == '') {
      this.alertService.error("Please enter the Remarks!");
      return;
    }
    else {
      this.obj = new RTVCaseHeader();
      this.obj.RTVID = this.identity;
      this.obj.CurrentStatus = this.CurrentStatus;
      this.obj.Remarks = this.Remarks;
      this.obj.ReimbursementValue = this.ReimbursementValue;
      this.obj.AmazonCaseId = this.AmazonCaseId;
      this._RTVcasesService.Existence("", this.obj.AmazonCaseId, this.obj.RTVID)
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
                  this._router.navigate(['/Managementlist']);

                },
                (err) => {

                  console.log(err);
                }
              );
            }
            //
          },
          (error: any) => {
            //
          }
        );
    }


  }


}
