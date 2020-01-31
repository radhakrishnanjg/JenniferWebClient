//core npms  
import { NgModule, NO_ERRORS_SCHEMA, } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

//kendo
import { GridModule, PDFModule, ExcelModule } from '@progress/kendo-angular-grid';

import { NgxMaskModule } from 'ngx-mask';
import { DataTablesModule } from 'angular-datatables';
import { PreventDoubleSubmitModule } from 'ngx-prevent-double-submission';
import { EncrDecrService } from '../_services/service/encr-decr.service';
import { CookieService } from 'ngx-cookie-service';

import { DropdownlistComponent } from './dropdownlist/dropdownlist.component';
import { MarketplacelistComponent } from './marketplacelist/marketplacelist.component';
import { MenulistComponent } from './menulist/menulist.component';
import { CompanylistComponent } from './companylist/companylist.component';
import { CompanyComponent } from './company/company.component';
import { ReportmasterlistComponent } from './reportmasterlist/reportmasterlist.component';
import { ReportmasterComponent } from './reportmaster/reportmaster.component';
import { PremasterRoutingModule } from './premaster.routing.module';

@NgModule({
  imports: [
    CommonModule,
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
    PremasterRoutingModule
  ],
  declarations: [
    DropdownlistComponent,
    MarketplacelistComponent,
    MenulistComponent,
    CompanylistComponent,
    CompanyComponent,
    ReportmasterlistComponent,
    ReportmasterComponent
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
export class PremasterModule { }
