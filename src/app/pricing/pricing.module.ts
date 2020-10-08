//core npms  
import { NgModule, NO_ERRORS_SCHEMA,   } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 

//kendo
import { GridModule, PDFModule, ExcelModule } from '@progress/kendo-angular-grid';
 
import { PreventDoubleSubmitModule } from 'ngx-prevent-double-submission';
import { MomentModule } from 'ngx-moment';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgxMaskModule } from 'ngx-mask';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { EncrDecrService } from '../_services/service/encr-decr.service'; 
import { CookieService } from 'ngx-cookie-service'; 
import { DataTablesModule } from 'angular-datatables';

import { DiscountlistComponent } from './discountlist/discountlist.component';
import { MarketplacefeelistComponent } from './marketplacefeelist/marketplacefeelist.component';
import { SalesratecardlistComponent } from './salesratecardlist/salesratecardlist.component';
import { EventmanagerComponent } from './eventmanager/eventmanager.component';

import { PricingRoutingModule } from './pricing.routing.module';

@NgModule({
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule, 
    ReactiveFormsModule, 
    PreventDoubleSubmitModule.forRoot(),
    MomentModule,
    NgxDaterangepickerMd.forRoot(), 
    NgxMaskModule.forRoot(),
    SelectDropDownModule,
    FormsModule, 
    GridModule,  
    PDFModule,
    ExcelModule,
    DataTablesModule,
    PricingRoutingModule
  ],
  declarations: [
    DiscountlistComponent,
    MarketplacefeelistComponent,
    SalesratecardlistComponent,
    EventmanagerComponent,
  ],
  providers: [ 
    CookieService, 
    EncrDecrService
  ], 
  schemas: [
    NO_ERRORS_SCHEMA,
  ]
})
export class PricingModule { }
