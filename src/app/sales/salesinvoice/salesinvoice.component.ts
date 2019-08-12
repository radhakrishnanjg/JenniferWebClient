import { Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../_services/service/authentication.service';
@Component({
  selector: 'app-salesinvoice',
  templateUrl: './salesinvoice.component.html',
  styleUrls: ['./salesinvoice.component.css']
})
export class SalesinvoiceComponent implements OnInit {

  // reportServer: string = 'http://myreportserver/reportserver';
  // reportUrl: string = 'MyReports/SampleReport';
  // parameters: any = {
  //   "SampleStringParameter": null,
  //   "SampleBooleanParameter" : false,
  //   "SampleDateTimeParameter" : "9/1/2017",
  //   "SampleIntParameter" : 1,
  //   "SampleFloatParameter" : "123.1234",
  //   "SampleMultipleStringParameter": ["Parameter1", "Parameter2"]
  //   };
  //http://crossborder/Reports/report/Reports/SalesInvoice/SalesInvoice
  //http://crossborder/Reports/report/Reports/SalesInvoice/SalesInvoice?PLNum=2&Store=16
  reportServer: string = 'http://localhost/Reports';
  //reportUrl: string = 'Reports/SalesInvoice/SalesInvoice?PLNum=2&Store=16';
  reportUrl: string = 'report/Reports/Test';
  parameters: any = {
  };
  showParameters: string = "true";

  language: string = "en-us";
  width: number = 700;
  height: number = 700;
  toolbar: string = "true";

  PickListNumber: number = 0;
  constructor(
    private router: Router,
    private aroute: ActivatedRoute,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {

    // let currentUser = this.authenticationService.currentUserValue;
    // let CompanyDetailID = currentUser.CompanyDetailID;

    // this.aroute.paramMap.subscribe(params => {
    //   let PickListNumber = +params.get('id');
    //   this.parameters = {
    //     PickListNumber, CompanyDetailID
    //   }

    // });
  }

}
