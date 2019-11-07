import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMaskModule } from 'ngx-mask'
import { ToastrModule } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';


import { SelectDropDownModule } from 'ngx-select-dropdown'
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { DataTablesModule } from 'angular-datatables';

import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxTypeaheadModule } from 'ngx-typeahead';
import { GridModule } from '@progress/kendo-angular-grid';
import { PopupModule } from '@progress/kendo-angular-popup';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import * as bootstrap from "bootstrap";
import * as $ from "jquery";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PreventDoubleSubmitModule } from 'ngx-prevent-double-submission';
import { MomentModule } from 'ngx-moment';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { DeviceDetectorModule } from 'ngx-device-detector';


import { EncrDecrService } from '../_services/service/encr-decr.service';

import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { ReportmasterlistComponent } from './reportmasterlist/reportmasterlist.component';
import { ReportmasterComponent } from './reportmaster/reportmaster.component';
import { ReportsinventoryComponent } from './reportsinventory/reportsinventory.component';
import { ReportsamazonComponent } from './reportsamazon/reportsamazon.component';
import { ReportscomplianceComponent } from './reportscompliance/reportscompliance.component';
import { ReportsanalyticsComponent } from './reportsanalytics/reportsanalytics.component';
import { ReportsmisComponent } from './reportsmis/reportsmis.component';
import { ReportsothersComponent } from './reportsothers/reportsothers.component';
import { ReportAmazonMTRComponent } from './report-amazon-mtr/report-amazon-mtr.component';
import { StatementlistComponent } from './statementlist/statementlist.component';
import { StatementviewComponent } from './statementview/statementview.component';

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
@Pipe({
  name: 'safeHtml',
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(html) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFontAwesomeModule,
    DataTablesModule,

    NgxSpinnerModule,
    FormsModule,
    // Prevent double submission module
    PreventDoubleSubmitModule.forRoot(),
    MomentModule,
    NgxDaterangepickerMd.forRoot(),
    DeviceDetectorModule.forRoot(),

    // ModalModule.forRoot()
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({
      timeOut: 5000,
      //positionClass: 'toast-bottom-right',
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    }),
    InputsModule,// ToastrModule added,
    NgxMaskModule.forRoot(),
    SelectDropDownModule,
    NgxTypeaheadModule,
    GridModule,
    DropDownListModule,
    PopupModule,
    NgbModule,
    PDFExportModule
  ],
  declarations: [
    SafeHtmlPipe,
    ReportmasterlistComponent, ReportmasterComponent,
    ReportsinventoryComponent, ReportsamazonComponent, ReportscomplianceComponent,
    ReportsanalyticsComponent, ReportsmisComponent, ReportsothersComponent, ReportAmazonMTRComponent,

    StatementlistComponent, StatementviewComponent,],

  providers: [

    CookieService,

    EncrDecrService
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
  ]
})
export class DownloadModule { }
