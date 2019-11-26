import { NgModule, NO_ERRORS_SCHEMA, } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

//third party npms 
import { NgxMaskModule } from 'ngx-mask'
import { ToastrModule } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { SelectDropDownModule } from 'ngx-select-dropdown'
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { DataTablesModule } from 'angular-datatables';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxTypeaheadModule } from 'ngx-typeahead';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PreventDoubleSubmitModule } from 'ngx-prevent-double-submission';
import { MomentModule } from 'ngx-moment';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { DeviceDetectorModule } from 'ngx-device-detector';
import * as bootstrap from "bootstrap";
import * as $ from "jquery";
import { NgPipesModule } from 'ngx-pipes';
import { TrimPipe } from 'ngx-pipes';
//kendo
import { GridModule } from '@progress/kendo-angular-grid';
import { PopupModule } from '@progress/kendo-angular-popup';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';

import { EncrDecrService } from '../_services/service/encr-decr.service';

import { AdminRoutingModule } from './admin-routing.module';
import { DepartmentComponent } from './department/department.component';
import { SeniormasterComponent } from './seniormaster/seniormaster.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    // AngularFontAwesomeModule,
    // DataTablesModule,

    // NgxSpinnerModule,
    FormsModule,
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
   //NgxMaskModule.forRoot(),
    //SelectDropDownModule,
    //NgxTypeaheadModule,
    //grid
    InputsModule,// ToastrModule added,
    GridModule,
    DropDownListModule,
    PopupModule,
    //NgbModule,
    AdminRoutingModule
  ],
  providers: [
    // CookieService,
    // EncrDecrService,
    TrimPipe
  ],
  // schemas: [
  //   NO_ERRORS_SCHEMA,
  // ],
  declarations: [DepartmentComponent, SeniormasterComponent]
})
export class AdminModule { }
