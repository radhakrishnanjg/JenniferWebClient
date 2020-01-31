import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { GstfinancefileuploadService } from '../../_services/service/gstfinancefileupload.service';
import { UtilityService } from '../../_services/service/utility.service';
import { PrivateutilityService } from '../../_services/service/privateutility.service';

import { FormGroup, } from '@angular/forms';
import { State, Dropdown } from '../../_services/model';
import { AuthorizationGuard } from 'src/app/_guards/Authorizationguard';

@Component({
  selector: 'app-gstdownload',
  templateUrl: './gstdownload.component.html',
  styleUrls: ['./gstdownload.component.css']
})
export class GstdownloadComponent implements OnInit {
  States: State[];
  lstGSTYears: Dropdown[];
  lstMonths: Dropdown[];
  State: string = '';
  Year: number;
  Month: number;
  constructor(
    private alertService: ToastrService,
    public _gstfinancefileuploadService: GstfinancefileuploadService,
    private utilityService: UtilityService,
    private _PrivateutilityService: PrivateutilityService,
    private _authorizationGuard: AuthorizationGuard
  ) { }

  ngOnInit() {

    this.Year = (new Date()).getFullYear();
    this.Month = (new Date()).getMonth() + 1;

    this.utilityService.getStates(1)
      .subscribe(
        (data: State[]) => {
          this.States = data;
        },
        (err: any) => {
          console.log(err);
        }
      );

    this._PrivateutilityService.GetValues('GSTYears')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstGSTYears = data;
        },
        (err: any) => {
          console.log(err);
        }
      );

    this._PrivateutilityService.GetValues('Months')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstMonths = data;
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  DownloadGSTReturn() {
    if (this.State == '') {
      this.alertService.error("Please select the State.!");
      return;
    }
    if (this.Year == 0) {
      this.alertService.error("Please select the Year.!");
      return;
    }
    if (this.Month == 0) {
      this.alertService.error("Please select the Month.!");
      return;
    }
    this._gstfinancefileuploadService.DownloadGSTReturn(this.Year, this.Month, this.State)
      .subscribe(data => {
        this.alertService.success('File Downloaded successfully');
        saveAs(data, this.State + '_' + this.Year + '_' + this.Month)
      },
        (err) => {
          console.log(err);
        }
      );
  }

  ProcessGst() {
    if (this._authorizationGuard.CheckAcess("GstDownload", "ViewEdit")) {
      return;
    }

    this._gstfinancefileuploadService.GSTReturnProcesses()
      .subscribe(data => {
        if (data.Flag) {
          this.alertService.success(data.Msg);
        }
        else {
          this.alertService.error(data.Msg);
        }
      },
        (err) => {
          //
          console.log(err);
        }
      );

  }
  Refresh(): void {
    this.State = '';
    this.Year = 0;
    this.Month = 0;
  }
}
