import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RTVcasesService } from '../../_services/service/rtvcases.service';
import { RTVCaseHeader, } from '../../_services/model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-managementview',
  templateUrl: './managementview.component.html',
  styleUrls: ['./managementview.component.css']
})
export class ManagementviewComponent implements OnInit {

  obj: RTVCaseHeader;
  identity: number;
  constructor(
    private _rtvcasesService: RTVcasesService,

    private alertService: ToastrService,
    private aroute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
    });

    this._rtvcasesService.RTVCaseSearchById(this.identity)
      .subscribe(
        (data) => {
          this.obj = data;

        },
        (err) => {

          console.log(err);
        }
      );
  }


  addpath(imagepath: string) {
    return environment.basedomain + imagepath;
  }

  DownloadImages(RemovalOrderID: string, TrackingID: string, DisputeType: string) {
    this._rtvcasesService.RTVCaseImages(RemovalOrderID, TrackingID, DisputeType)
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


}
