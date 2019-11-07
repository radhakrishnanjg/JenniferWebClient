import { Component, OnInit } from '@angular/core';

import {  FormBuilder, } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthorizationGuard } from '../../_guards/Authorizationguard';
import { RTVCaseHeader,  RTVUsers, } from '../../_services/model';
import { RTVcasesService } from '../../_services/service/rtvcases.service';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import * as moment from 'moment';
@Component({
  selector: 'app-allotment',
  templateUrl: './allotment.component.html',
  styleUrls: ['./allotment.component.css']
})
export class AllotmentComponent implements OnInit {
  AssignTo: number = 0;
  lstAssignTo: RTVUsers[];
  objAssignTo: RTVUsers = {} as any;
  lst: RTVCaseHeader[];
  obj: RTVCaseHeader = {} as any;
  action: boolean;
  selectedDateRange: any;
  dtOptions: DataTables.Settings = {};
  Searchranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  }
  constructor(private alertService: ToastrService,
    private fb: FormBuilder,
    private _router: Router,
    private aroute: ActivatedRoute,
    
    private _RTVcasesService: RTVcasesService,
    private _authorizationGuard: AuthorizationGuard,
    private _PrivateutilityService: PrivateutilityService, ) { }

  ngOnInit() {
    this.BindAssignTos();
    this.selectedDateRange = {
      startDate: moment().subtract(0, 'months').date(1),
      endDate: moment().subtract(1, 'days')
    };
    this.onLoad();
  }

  onChange(range) {
    let startdate: string = range.startDate._d.toISOString().substring(0, 10);
    let enddate: string = range.endDate._d.toISOString().substring(0, 10);
    this.onLoad();
  }

  BindAssignTos() {
    
    this._PrivateutilityService.GetRTVUsersExceptLogin()
      .subscribe(
        (data: RTVUsers[]) => {
          this.lstAssignTo = data;
          
        },
        (err: any) => {
          
          console.log(err);
        }
      );
  }

  onLoad() {
    let FromDate: Date = this.selectedDateRange.startDate._d.toISOString().substring(0, 10);
    let ToDate: Date = this.selectedDateRange.endDate._d.toISOString().substring(0, 10);
    
    return this._RTVcasesService.RTVCaseAssign(FromDate.toString(), ToDate.toString()).subscribe(
      (data) => {
        if (data != null) {
          this.lst = data;
          this.dtOptions = {
            paging: false,
            scrollY: '400px',
            "language": {
              "search": 'Filter',
            },
          };
        }
        
      },
      (err) => {
        
        console.log(err);
      }
    );
  }


  ContactIDFieldsChange(values: any, RemovalOrderID: string, TrackingId: string, DisputeType: string) {
    this.lst.filter(a => a.RemovalOrderID == RemovalOrderID && a.TrackingID == TrackingId &&
      a.DisputeType == DisputeType)[0].IsActive = values.currentTarget.checked;
  }
  checkcontacts(value: boolean) {
    for (var i = 0; i < this.lst.length; i++) {
      this.lst[i].IsActive = value;
      $('#' + i).prop("checked", value);
    }
    //this.checkcontactsselecttedcount();
  }

  SaveData() {
    if (this._authorizationGuard.CheckAcess("Allotmentlist", "ViewEdit")) {
      return;
    }
    if (this.AssignTo == 0) {
      this.alertService.error("Please select Assign To.!");
      return;
    }
    if (this.lst.filter(a => a.IsActive == true).length == 0) {
      this.alertService.error("Please select atleast one row in the list.!");
      return;
    }
    else {
      return this._RTVcasesService.RTVCaseAssignSave(this.AssignTo,
        this.lst.filter(a => a.IsActive == true)).subscribe(
          (data) => {
            if (data != null && data.Flag == true) {
              this.alertService.success(data.Msg);
            } else {
              this.alertService.error(data.Msg);
            }
            this._router.navigate(['/Allotmentlist']);
            
          },
          (err) => {
            
            console.log(err);
          }
        );
    }


  }
  checkcontactsselecttedcount() {
    if (this.lst.length > 0) {
      return this.lst.filter(a => a.IsActive == true).length > 0 ? true : false;
    }
  }
}
