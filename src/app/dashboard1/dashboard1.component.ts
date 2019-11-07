import { Component, OnInit } from '@angular/core';
import { EChartOption } from 'echarts';
import { DashboardoneService } from '../_services/service/dashboardone.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

import { Userlog, Userpermission, } from '../_services/model';
import { PlotBand } from '@progress/kendo-angular-charts';

import { SalesChartColors} from '../../assets/ChartColors';

import { AuthenticationService } from '../_services/service/authentication.service';;

@Component({
  selector: 'app-dashboard1',
  templateUrl: './dashboard1.component.html',
  styleUrls: ['./dashboard1.component.css'],
  styles: [`
    kendo-chart {
      width: 100%;
      height:250px;
    }
    
  `],
})
export class Dashboard1Component implements OnInit {


  constructor(
    private _alertService: ToastrService,
    public _authenticationService: AuthenticationService,
    public _dashboard1Service: DashboardoneService,
    public _spinner: NgxSpinnerService,
  ) { }


  //#region variable declartion start
  lstMenus: Userpermission[] = [] as any;
  MenuID: number = 0;

  
  Sales_OrderByTime: any = SalesChartColors.Sales_OrderByTime;
  Sales_ReturnsByTime: any = SalesChartColors.Sales_ReturnsByTime;;
  Sales_TopProductainSales: any = SalesChartColors.Sales_TopProductainSales;
  Sales_Performance: any = SalesChartColors.Sales_Performance;
  Sales_TopSellersinRevenueBarChart: any = SalesChartColors.Sales_TopSellersinRevenueBarChart;
  
  Sales_ReturnsAndSalesOrders: any = SalesChartColors.Sales_ReturnsAndSalesOrders;
  Sales_ReturnsValueAndSalesValue: any = SalesChartColors.Sales_ReturnsValueAndSalesValue;
  Sales_RevenueByLocation: any = SalesChartColors.Sales_RevenueByLocation;
 


  selectedDateRange: any;
  ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  }

  //#endregion variable declartion end

  ngOnInit() {
    this.selectedDateRange = { startDate: moment().subtract(0, 'months').date(1), endDate: moment().subtract(1, 'days') };

    let startdate: string = this.selectedDateRange.startDate._d.toISOString().substring(0, 10);
    let enddate: string = this.selectedDateRange.endDate._d.toISOString().substring(0, 10);
    this.BindDropdown();

    
    this.OnloadupdatedDate();
    this.onLoadLiveSalesData();
    this.onLoadliveReturnsValue();
    this.onLoadOrderByTime();
    this.onLoadReturnsByTime();
    this.onLoadTopProductssales();

  }

   //#region Method declaration
  Search() {
    if (this.MenuID == 0) {
      this._alertService.error("Please select the Dashboard");
      return;
    }
    else if (this.MenuID == 122) {
      this.onLoadSaticSalesData();
      this.onLoadTopSellersInRevenue();
      this.onLoadPerformance();
      this.onLoadSalesReturnsOrder();
      this.onLoadSalesReturnsValue();
      this.onLoadRevenueByLocation();
    } 
  }
  selectedDateRangeUpdated(range) {
    //this.Search();
  }
  
  Reset() {
    this.MenuID = 0;
    this.selectedDateRange = { startDate: moment().subtract(3, 'months').date(1), endDate: moment().subtract(1, 'days') };

  }

  onchangeMenuID(MenuID: number) {
 
  }
  BindDropdown() {
    this.lstMenus = this._authenticationService.currentUserValue.lstUserPermission.filter(a => a.ParentId == 120);

  }

  LastUpdatedDate: Date;
  TodayDate: Date;

  OnloadupdatedDate() {
    //this._spinner.show();
    this._dashboard1Service.updatedDate()
      .subscribe(
        (data) => {
          if (data != null) {
            let resJSON = JSON.parse(data)[0];
            this.LastUpdatedDate = resJSON['LastUpdatedDate'];
            this.TodayDate = resJSON['TodayDate'];
          }
          // this._spinner.hide();
        },
        (err) => {
          // this._spinner.hide();
          console.log(err);
        }
      );

  }

  TotalOrderItem: number = 0;
  OrderedProductSales: number = 0;
  TotalUnitsOrdered: number = 0;
  AvgSalesPerorderitem: number = 0;
  AvgunitPerorderitem: number = 0;

  onLoadLiveSalesData() {
    //this._spinner.show();
    this._dashboard1Service.liveSalesData()
      .subscribe(
        (data) => {
          if (data != null) {
            let resJSON = JSON.parse(data)[0];
            this.TotalOrderItem = resJSON['TotalOrderItem'];
            this.OrderedProductSales = resJSON['OrderedProductSales'];
            this.TotalUnitsOrdered = resJSON['TotalUnitsOrdered'];
            this.AvgSalesPerorderitem = resJSON['AvgSalesPerorderitem'];
            this.AvgunitPerorderitem = resJSON['AvgunitPerorderitem'];
          }
          // this._spinner.hide();
        },
        (err) => {
          // this._spinner.hide();
          console.log(err);
        }
      );

  }

  TotalReturnOrders: number = 0;
  ReturnsValue: number = 0;
  onLoadliveReturnsValue() {
    this._dashboard1Service.liveReturnsValue()
      .subscribe(
        (data) => {
          if (data != null) {
            let resJSON = JSON.parse(data)[0];
            this.TotalReturnOrders = resJSON['TotalReturnOrders'];
            this.ReturnsValue = resJSON['ReturnsValue'];
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

  sales_Salesorders: number[] = [] as any;
  sales_purchaseHours: number[] = [] as any;
  onLoadOrderByTime() {
    this._dashboard1Service.orderByTime()
      .subscribe(
        (data) => {
          if (data != null) {
            let resJSON = JSON.parse(data);
            this.sales_Salesorders = resJSON.map(a => a.Salesorder);
            this.sales_purchaseHours = resJSON.map(a => a.purchaseHour);
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

  sales_ReturnsValues: number[] = [] as any;
  sales_ReturnsHours: number[] = [] as any;
  onLoadReturnsByTime() {
    this._dashboard1Service.returnsByTime()
      .subscribe(
        (data) => {
          if (data != null) {
            let resJSON = JSON.parse(data);
            this.sales_ReturnsValues = resJSON.map(a => a.ReturnsValue);
            this.sales_ReturnsHours = resJSON.map(a => a.ReturnsHour);
          }

        },
        (err) => {
          console.log(err);
        }
      );
  }

  public sales_TopProductsinSalesToday = [] = [] as any;
  onLoadTopProductssales() {
    this._dashboard1Service.topProductsSalesOrder()
      .subscribe(
        (data) => {
          if (data != null) {
            let resJSON = JSON.parse(data);
            this.sales_TopProductsinSalesToday = resJSON;
          }
        },
        (err) => {
          console.log(err);
        }
      );


  }

  TotalSales: number = 0;
  NetSales: number = 0;
  GrossProfit: number = 0;
  GrossProfitPer: number = 0;
  onLoadSaticSalesData() {
    let startdate: string = this.selectedDateRange.startDate._d.toISOString().substring(0, 10);
    let enddate: string = this.selectedDateRange.endDate._d.toISOString().substring(0, 10);

    this._dashboard1Service.staticSalesData(startdate, enddate)
      .subscribe(
        (data) => {
          if (data != null) {
            let resJSON = JSON.parse(data)[0];
            this.TotalSales = resJSON['TotalSales'];
            this.NetSales = resJSON['NetSales'];
            this.GrossProfit = resJSON['GrossProfit'];
            this.GrossProfitPer = resJSON['GrossProfitPer'];
          }
        },
        (err) => {
          console.log(err);
        }
      );

  }

  public sales_Brand = [] = [] as any;
  public sales_Returnsvalue = [] = [] as any;
  public sales_SalesValue = [] = [] as any;
  onLoadTopSellersInRevenue() {
    let startdate: string = this.selectedDateRange.startDate._d.toISOString().substring(0, 10);
    let enddate: string = this.selectedDateRange.endDate._d.toISOString().substring(0, 10);

    this._dashboard1Service.topSellersInRevenue(startdate, enddate)
      .subscribe(
        (data) => {
          if (data != null) {
            let resJSON = JSON.parse(data);
            this.sales_Brand = resJSON.map(a => a.Brand);
            this.sales_Returnsvalue = resJSON.map(a => a.ReturnsValue);
            this.sales_SalesValue = resJSON.map(a => a.SalesValue);
          }
        },
        (err) => {
          console.log(err);
        }
      );

  }

  public sales_Performence = [] = [] as any;
  public sales_Performence_PostedDate = [] = [] as any;
  public sales_Performence_NetSales = [] = [] as any;
  onLoadPerformance() {
    let startdate: string = this.selectedDateRange.startDate._d.toISOString().substring(0, 10);
    let enddate: string = this.selectedDateRange.endDate._d.toISOString().substring(0, 10);
    this._dashboard1Service.performence(startdate, enddate)
      .subscribe(
        (data) => {
          if (data != null) {
            let resJSON = JSON.parse(data); 
            this.sales_Performence = resJSON;
            this.sales_Performence_PostedDate = resJSON.map(a => a.PostedDate);
            this.sales_Performence_NetSales = resJSON.map(a => a.NetSales);
          }
        },
        (err) => {
          console.log(err);
        }
      );

  }

  public sales_TotalSalesOrders = [] = [] as any;
  onLoadSalesReturnsOrder() {
    let startdate: string = this.selectedDateRange.startDate._d.toISOString().substring(0, 10);
    let enddate: string = this.selectedDateRange.endDate._d.toISOString().substring(0, 10);
    this._dashboard1Service.salesVsReturnsOrders(startdate, enddate)
      .subscribe(
        (data) => {
          if (data != null) {
            // let resJSON = JSON.parse(data);
            this.sales_TotalSalesOrders = JSON.parse(data);
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

  public sales_TotalSales = [] = [] as any;
  onLoadSalesReturnsValue() {
    let startdate: string = this.selectedDateRange.startDate._d.toISOString().substring(0, 10);
    let enddate: string = this.selectedDateRange.endDate._d.toISOString().substring(0, 10);
    this._dashboard1Service.salesVsReturnsValue(startdate, enddate)
      .subscribe(
        (data) => {
          if (data != null) {
            this.sales_TotalSales = JSON.parse(data);
          }
        },
        (err) => {
          console.log(err);
        }
      );

  }
  sales_RevenueByLocation: number[] = [] as any;
  sales_Revenuegraphtable:boolean=true;
  onLoadRevenueByLocation() {
    let startdate: string = this.selectedDateRange.startDate._d.toISOString().substring(0, 10);
    let enddate: string = this.selectedDateRange.endDate._d.toISOString().substring(0, 10);
    this._dashboard1Service.revenueByLocation(startdate, enddate)
      .subscribe(
        (data) => {

          if (data != null) {
            this.sales_RevenueByLocation = JSON.parse(data);
          }
        },
        (err) => {
          console.log(err);
        }
      );

  }
   //#endregion Method declaration
   
  // changesale_RevenueByLocation() {
  //   this.sale_RevenueByLocation = !this.sale_RevenueByLocation;
  // }


  onChange(range) {
    let startdate: string = range.startDate._d.toISOString().substring(0, 10);
    let enddate: string = range.endDate._d.toISOString().substring(0, 10);
  }

}