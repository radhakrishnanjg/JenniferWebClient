//core
import { RouterModule } from '@angular/router';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

//kendo
import { GridModule, PDFModule, ExcelModule } from '@progress/kendo-angular-grid';

import { PreventDoubleSubmitModule } from 'ngx-prevent-double-submission';
import { EncrDecrService } from '../_services/service/encr-decr.service';
import { CookieService } from 'ngx-cookie-service';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

//Component 
import { ReportsinventoryComponent } from './reportsinventory/reportsinventory.component';
import { ReportsamazonComponent } from './reportsamazon/reportsamazon.component';
import { ReportscomplianceComponent } from './reportscompliance/reportscompliance.component';
import { ReportsanalyticsComponent } from './reportsanalytics/reportsanalytics.component';
import { ReportsmisComponent } from './reportsmis/reportsmis.component';
import { ReportsothersComponent } from './reportsothers/reportsothers.component';
import { ReportAmazonMTRComponent } from './report-amazon-mtr/report-amazon-mtr.component';

//routing module
import { DownloadRoutingModule } from './download.routing.module'
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { ToastrModule } from 'ngx-toastr';
import { MomentModule } from 'ngx-moment';


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
    RouterModule,
    GridModule,
    FormsModule,
    ReactiveFormsModule,
    PreventDoubleSubmitModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    }),
    MomentModule,
    NgxDaterangepickerMd.forRoot(),
    GridModule,
    PDFModule,
    ExcelModule,
    DropDownListModule,
    DownloadRoutingModule
  ],
  declarations: [
    SafeHtmlPipe,
    ReportsinventoryComponent,
    ReportsamazonComponent,
    ReportscomplianceComponent,
    ReportsanalyticsComponent,
    ReportsmisComponent,
    ReportsothersComponent,
    ReportAmazonMTRComponent,],

  providers: [
    CookieService,
    EncrDecrService
  ],

  schemas: [
    NO_ERRORS_SCHEMA,
  ]
})
export class DownloadModule { }
