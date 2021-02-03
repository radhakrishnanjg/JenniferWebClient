import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../_services/service/authentication.service';
import { Companydetails, ProfitLossData } from '../../_services/model'; 
import { DashboardoneService } from '../../_services/service/dashboardone.service';
import * as moment from 'moment';
@Component({
  selector: 'app-profileloss',
  templateUrl: './profileloss.component.html',
  styleUrls: ['./profileloss.component.css']
})
export class ProfilelossComponent implements OnInit {

  constructor(
    private authenticationService: AuthenticationService, 
    public _dashboard1Service: DashboardoneService,
  ) { }
  lstCompanydetails: Companydetails[] = [] as any;
  CompanyDetailID: number = 0;
  obj: ProfitLossData = {} as any;
  ngOnInit() {

    this.obj = new ProfitLossData();

    this.selectedDateRange = {
      startDate: moment().subtract(1, 'months').date(1),
      endDate: moment().subtract(1, 'months').endOf('month')
    };

    let currentUser = this.authenticationService.currentUserValue;
    this._dashboard1Service.GetProfitStores(currentUser.CompanyID)
      .subscribe(
        (data: Companydetails[]) => {
          this.lstCompanydetails = data;
        },
        (err: any) => {
          console.log(err);
        }
      );

    let startdate: string = moment(this.selectedDateRange.startDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();
    let enddate: string = moment(this.selectedDateRange.endDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();
    this._dashboard1Service.GetProfitLossData((this.CompanyDetailID), this.OrderID, this.SKU, startdate, enddate)
      .subscribe(
        (data: ProfitLossData[]) => {
          if (data.length > 0) {
            this.obj = data[0];
          }
          else {
            this.obj = new ProfitLossData()
          }
        },
        (err: any) => {
          console.log(err);
        }
      );
  }
  StoreName: string = '';
  onchangeCompanyDetail(selectedValue: string) {
    if (selectedValue != "") {
      this.CompanyDetailID = this.lstCompanydetails.filter(a => a.StoreName == selectedValue.toUpperCase())[0].CompanyDetailID;
    }
    else {
      this.CompanyDetailID = 0;
    }
    this._dashboard1Service.GetProfitLossOrders(this.CompanyDetailID)
      .subscribe(
        (data: ProfitLossData[]) => {
          this.lstOrderIds = data;
        },
        (err: any) => {
          console.log(err);
        }
      );
    this._dashboard1Service.GetProfitLossSKUs(this.CompanyDetailID)
      .subscribe(
        (data: ProfitLossData[]) => {
          this.lstSKUs = data;
        },
        (err: any) => {
          console.log(err);
        }
      );
    let startdate: string = moment(this.selectedDateRange.startDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();
    let enddate: string = moment(this.selectedDateRange.endDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();
    this._dashboard1Service.GetProfitLossData((this.CompanyDetailID), this.OrderID, this.SKU, startdate, enddate)
      .subscribe(
        (data: ProfitLossData[]) => {
          if (data.length > 0) {
            this.obj = data[0];
          }
          else {
            this.obj = new ProfitLossData()
          }
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  lstOrderIds: ProfitLossData[] = [] as any;
  OrderID: string = '';

  lstSKUs: ProfitLossData[] = [] as any;
  SKU: string = '';

  onchangeOrderID(selectedValue: string) {
    this.OrderID = selectedValue;
    let startdate: string = moment(this.selectedDateRange.startDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();
    let enddate: string = moment(this.selectedDateRange.endDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();
    this._dashboard1Service.GetProfitLossData((this.CompanyDetailID), this.OrderID, this.SKU, startdate, enddate)
      .subscribe(
        (data: ProfitLossData[]) => {
          if (data.length > 0) {
            this.obj = data[0];
          }
          else {
            this.obj = new ProfitLossData()
          }
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  onchangeSKU(selectedValue: string) {
    this.SKU = selectedValue;
    let startdate: string = moment(this.selectedDateRange.startDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();
    let enddate: string = moment(this.selectedDateRange.endDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();
    this._dashboard1Service.GetProfitLossData((this.CompanyDetailID), this.OrderID, this.SKU, startdate, enddate)
      .subscribe(
        (data: ProfitLossData[]) => {
          if (data.length > 0) {
            this.obj = data[0];
          }
          else {
            this.obj = new ProfitLossData();
          }
        },
        (err: any) => {
          console.log(err);
        }
      );
  }



  dataCompanydetail: Companydetails[] = [];
  handleFilterCompanydetails(value) {
    this.dataCompanydetail = this.lstCompanydetails.filter(a => a.StoreName.indexOf(value.toUpperCase()) !== -1);
  }
  datatOrderIds: ProfitLossData[] = [];
  handleFilterOrderID(value) {
    this.datatOrderIds = this.lstOrderIds.filter(a => a.OrderID.indexOf(value.toUpperCase()) !== -1);
  }
  dataSKUs: ProfitLossData[] = [];
  handleFilterSKU(value) {
    this.dataSKUs = this.lstSKUs.filter(a => a.SKU.indexOf(value.toUpperCase()) !== -1);
  }
  // public close() {
  //   debugger
  //   let startdate: Date = this.selectedDateRange.startDate._d.toISOString().substring(0, 10);
  //   let enddate: Date = this.selectedDateRange.endDate._d.toISOString().substring(0, 10);
  //   this._dashboard1Service.GetProfitLossData((this.CompanyDetailID), this.OrderID, this.SKU, startdate, enddate)
  //     .subscribe(
  //       (data: ProfitLossData[]) => {
  //         this.obj = data[0];
  //       },
  //       (err: any) => {
  //         console.log(err);
  //       }
  //     );
  // }


  selectedDateRange: any;
  Searchranges: any = {
    'Current FY ': [moment().month() > 4 ? moment().quarter(2).startOf('quarter') : moment().subtract(1, 'year').quarter(2).startOf('quarter'),
    moment().month() > 4 ? moment().add(1, 'year').quarter(1).endOf('quarter') : moment().quarter(1).endOf('quarter')],
    'Lifetime  (2019-04-01 to till Date)': [moment("04/01/2019"), moment().subtract(1, 'days')],
    'Last FY ': [moment().month() > 4 ? moment().subtract(1, 'year').quarter(2).startOf('quarter') : moment().subtract(1, 'year').subtract(1, 'year').quarter(2).startOf('quarter'),
    moment().month() > 4 ? moment().subtract(1, 'year').add(1, 'year').quarter(1).endOf('quarter') : moment().subtract(1, 'year').quarter(1).endOf('quarter')],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
  }


  onChange(range) {

    let startdate: string = moment(this.selectedDateRange.startDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();
    let enddate: string = moment(this.selectedDateRange.endDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();
    this._dashboard1Service.GetProfitLossData((this.CompanyDetailID), this.OrderID, this.SKU, startdate, enddate)
      .subscribe(
        (data: ProfitLossData[]) => {
          if (data.length > 0) {
            this.obj = data[0];
          }
          else {
            this.obj = new ProfitLossData();
          }
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

}
