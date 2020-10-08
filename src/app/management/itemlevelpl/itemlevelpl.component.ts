import { Component, OnInit } from '@angular/core';
import { Dropdown, ItemWiseProfitLossData } from '../../_services/model';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { DashboardoneService } from '../../_services/service/dashboardone.service';
import * as moment from 'moment';
@Component({
  selector: 'app-itemlevelpl',
  templateUrl: './itemlevelpl.component.html',
  styleUrls: ['./itemlevelpl.component.css']
})
export class ItemlevelplComponent implements OnInit {

  constructor(
    private _PrivateutilityService: PrivateutilityService,
    public _dashboard1Service: DashboardoneService,
  ) { }

  SearchBy: string = '';
  SearchKeyword: string = '';
  CompanyDetailID: number = 0;
  lst: ItemWiseProfitLossData[] = [] as any;
  Sublst: ItemWiseProfitLossData[] = [] as any;
  lstDropdown: Dropdown[] = [] as any;
  selectedDateRange: any;
  Searchranges: any = {
    // 'Today': [moment(), moment()],
    // 'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    // 'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    // 'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    'Last Year': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],
    'Current Quarter': [moment().quarter(moment().quarter()).startOf('quarter'), moment().subtract(1, 'days')],
    'Current Financial Year': [moment().quarter(2).startOf('quarter'), moment().subtract(1, 'days')],
  }
  ngOnInit() {

    this.selectedDateRange = {
      startDate: moment().subtract(1, 'months').date(1),
      endDate: moment().subtract(1, 'months').endOf('month')
    };
    this._PrivateutilityService.GetValues('ItemWiseProfitLoss')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstDropdown = data;
          this.SearchBy = 'TOP ITEMS';
          this.SearchKeyword = '10';
          this.onchange_SearchBy(this.SearchBy);
        },
        (err: any) => {
          console.log(err);
        }
      );

    $("[data-toggle=tooltip]").tooltip();
  }
  DropDownDescription: string = 'AA';
  onchange_SearchBy(DropdownValue: string) {
    if (DropdownValue != '') {
      this.DropDownDescription = this.lstDropdown.filter(a => a.DropdownValue == DropdownValue)[0].DropDownDescription;
    }
  }
  Recommendations: number = 0;
  Outrightitems: number = 0;
  onChange(range) {

    let startdate: string = moment(this.selectedDateRange.startDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();
    let enddate: string = moment(this.selectedDateRange.endDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();
    this._dashboard1Service.GetItemWiseProfitLossData(this.SearchBy, this.SearchKeyword, startdate, enddate)
      .subscribe(
        (data: ItemWiseProfitLossData[]) => {
          if (data.length > 0) {
            this.lst = data.filter(a => a.ItemCode == 'Sub Total' || a.ItemCode == '');
            this.Sublst = data;
          }
          else {
            this.lst = [];
            this.Sublst = [];
          }
          this.Recommendations = data.filter(a => a.OutrightFlag == 2).length;
          this.Outrightitems = data.filter(a => a.OutrightFlag == 1).length;
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  Search() {
    let startdate: string = moment(this.selectedDateRange.startDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();
    let enddate: string = moment(this.selectedDateRange.endDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();
    this._dashboard1Service.GetItemWiseProfitLossData(this.SearchBy, this.SearchKeyword, startdate, enddate)
      .subscribe(
        (data: ItemWiseProfitLossData[]) => {
          if (data.length > 0) {
            this.lst = data.filter(a => a.ItemCode == 'Sub Total' || a.ItemCode == '');
            this.Sublst = data;
          }
          else {
            this.lst = [];
            this.Sublst = [];
          }
          this.Recommendations = data.filter(a => a.OutrightFlag == 2).length;
          this.Outrightitems = data.filter(a => a.OutrightFlag == 1).length;
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  filterdata(value: number) {
    //Recommendations
    if (value == 2) {
      let startdate: string = moment(this.selectedDateRange.startDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();
      let enddate: string = moment(this.selectedDateRange.endDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();
      this._dashboard1Service.GetItemWiseProfitLossData(this.SearchBy, this.SearchKeyword, startdate, enddate)
        .subscribe(
          (data: ItemWiseProfitLossData[]) => {
            if (data.length > 0) {
              this.lst = data;//.filter(a => a.ItemCode == 'Sub Total' || a.ItemCode == '');
              this.lst = this.lst.filter(a => a.OutrightFlag == 2)
              this.Sublst = data;
            }
            else {
              this.lst = [];
              this.Sublst = [];
            }
            this.Recommendations = this.lst.filter(a => a.OutrightFlag == 2).length;
            this.Outrightitems = this.lst.filter(a => a.OutrightFlag == 1).length;
          },
          (err: any) => {
            console.log(err);
          }
        );
    }
    //Outrightitems
    else if (value == 1) {
      let startdate: string = moment(this.selectedDateRange.startDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();
      let enddate: string = moment(this.selectedDateRange.endDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();
      this._dashboard1Service.GetItemWiseProfitLossData(this.SearchBy, this.SearchKeyword, startdate, enddate)
        .subscribe(
          (data: ItemWiseProfitLossData[]) => {
            if (data.length > 0) {
              this.lst = data;//.filter(a => a.ItemCode == 'Sub Total' || a.ItemCode == '');
              this.lst = this.lst.filter(a => a.OutrightFlag == 1)
              this.Sublst = data;
            }
            else {
              this.lst = [];
              this.Sublst = [];
            }
            this.Recommendations = this.lst.filter(a => a.OutrightFlag == 2).length;
            this.Outrightitems = this.lst.filter(a => a.OutrightFlag == 1).length;
          },
          (err: any) => {
            console.log(err);
          }
        );
    }
  }
}
