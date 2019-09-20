import { Component, OnInit } from '@angular/core';
import { EChartOption } from 'echarts';
import { DashboardoneService } from '../_services/service/dashboardone.service'; 
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { Userlog, } from '../_services/model';
@Component({
  selector: 'app-dashboard1',
  templateUrl: './dashboard1.component.html',
  styleUrls: ['./dashboard1.component.css']
})
export class Dashboard1Component implements OnInit { 

  selectedDateRange: any;
  ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  }
  chartOption1: EChartOption = {
  }
  chartOption2: EChartOption = {
  }
  chartOption3: EChartOption = {
  }

  objuserlog: Userlog = {} as any;
  constructor(
    public _dashboard1Service: DashboardoneService,
    public _spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.selectedDateRange = { startDate: moment().subtract(0, 'months').date(1), endDate: moment().subtract(1, 'days') };

    let startdate: string = this.selectedDateRange.startDate._d.toISOString().substring(0, 10);
    let enddate: string = this.selectedDateRange.endDate._d.toISOString().substring(0, 10);
  }


  onChange(range) {
    let startdate: string = range.startDate._d.toISOString().substring(0, 10);
    let enddate: string = range.endDate._d.toISOString().substring(0, 10);
  }

}