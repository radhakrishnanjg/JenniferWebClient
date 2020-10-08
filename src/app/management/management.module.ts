//core npms  
import { NgModule, NO_ERRORS_SCHEMA, } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

//kendo
import { GridModule, PDFModule, ExcelModule } from '@progress/kendo-angular-grid';
import { PopupModule } from '@progress/kendo-angular-popup';
import { DropDownListModule, DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { IntlModule } from '@progress/kendo-angular-intl';

import { NgxMaskModule } from 'ngx-mask';
import { DataTablesModule } from 'angular-datatables';
import { PreventDoubleSubmitModule } from 'ngx-prevent-double-submission';
import { EncrDecrService } from '../_services/service/encr-decr.service';
import { CookieService } from 'ngx-cookie-service';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgPipesModule } from 'ngx-pipes';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { ProfilelossComponent } from './profileloss/profileloss.component';
import { ItemlevelplComponent } from './itemlevelpl/itemlevelpl.component';

import { ManagementRoutingModule } from './management-routing.module';


@NgModule({
  imports: [
    CommonModule,
    NgxDaterangepickerMd.forRoot(),
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    PreventDoubleSubmitModule.forRoot(),
    FormsModule,
    NgxMaskModule,
    DataTablesModule,
    GridModule,
    PDFModule,
    ExcelModule,
    DropDownListModule,
    DropDownsModule,
    PopupModule,
    IntlModule,
    DateInputsModule,
    PDFExportModule,
    InputsModule,
    NgPipesModule,
    NgbModule,
    NgbTooltipModule,
    ManagementRoutingModule
  ],
  declarations: [
    ProfilelossComponent,
    ItemlevelplComponent
  ]
  ,
  providers: [

    CookieService,

    EncrDecrService
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
  ]
})
export class ManagementModule { }
