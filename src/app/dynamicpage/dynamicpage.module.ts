import { NgModule, NO_ERRORS_SCHEMA, } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

//third party npms 
import { DataTablesModule } from 'angular-datatables';
// import { NgxMaskModule } from 'ngx-mask'
// import { ToastrModule } from 'ngx-toastr';
// import { CookieService } from 'ngx-cookie-service';
// import { SelectDropDownModule } from 'ngx-select-dropdown'
// import { AngularFontAwesomeModule } from 'angular-font-awesome';
// import { NgxSpinnerModule } from 'ngx-spinner';
// import { NgxTypeaheadModule } from 'ngx-typeahead';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { PreventDoubleSubmitModule } from 'ngx-prevent-double-submission';
// import { MomentModule } from 'ngx-moment';
// import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
// import { DeviceDetectorModule } from 'ngx-device-detector';
// import * as bootstrap from "bootstrap";
// import * as $ from "jquery";
import { NgPipesModule } from 'ngx-pipes';
import { TrimPipe } from 'ngx-pipes';

//import { EncrDecrService } from '../_services/service/encr-decr.service';

import { DataentryformlistComponent } from './dataentryformlist/dataentryformlist.component';
import { WorkflowformlistComponent } from './workflowformlist/workflowformlist.component';
import { DataentryreportComponent } from './dataentryreport/dataentryreport.component';
import { WorkflowreportComponent } from './workflowreport/workflowreport.component';
import { DataentryformComponent } from './dataentryform/dataentryform.component';
import { WorkflowformComponent } from './workflowform/workflowform.component';

import { DynamicpageRoutingModule } from './dynamicpage.routing.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    //third party
    DataTablesModule,
    // AngularFontAwesomeModule,

    // NgxSpinnerModule,
    // PreventDoubleSubmitModule.forRoot(),
    // MomentModule,
    // NgxDaterangepickerMd.forRoot(),
    // DeviceDetectorModule.forRoot(),
    // ToastrModule.forRoot({
    //   timeOut: 5000,
    //   //positionClass: 'toast-bottom-right',
    //   positionClass: 'toast-top-center',
    //   preventDuplicates: true,
    // }),

    // NgxMaskModule.forRoot(),
    // SelectDropDownModule,
    // NgxTypeaheadModule,
    NgPipesModule,
    DynamicpageRoutingModule
  ],

  declarations: [
    DataentryformlistComponent,
    WorkflowformlistComponent,
    DataentryreportComponent,
    WorkflowreportComponent,
    DataentryformComponent,
    WorkflowformComponent,
  ],
  providers: [
    // CookieService,
    // EncrDecrService,
    TrimPipe
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
  ]
})
export class DynamicpageModule { }
