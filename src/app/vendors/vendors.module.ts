//core npms  
import { NgModule, NO_ERRORS_SCHEMA, } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

//kendo
import { GridModule, PDFModule, ExcelModule } from '@progress/kendo-angular-grid';

import { PreventDoubleSubmitModule } from 'ngx-prevent-double-submission';
import { NgxMaskModule } from 'ngx-mask';
import { EncrDecrService } from '../_services/service/encr-decr.service';
import { CookieService } from 'ngx-cookie-service';

import { VendorComponent } from './vendor/vendor.component';
import { VendorlistComponent } from './vendorlist/vendorlist.component';
import { VendoritemlistComponent } from './vendoritemlist/vendoritemlist.component';
import { VendorwarehouselistComponent } from './vendorwarehouselist/vendorwarehouselist.component';
import { VendorwarehouseComponent } from './vendorwarehouse/vendorwarehouse.component';
import { VendorsRoutingModule } from './vendors.routing.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    PreventDoubleSubmitModule.forRoot(),
    FormsModule,
    NgxMaskModule.forRoot(),
    GridModule,
    PDFModule,
    ExcelModule,
    VendorsRoutingModule
  ],
  declarations: [
    VendorComponent,
    VendorlistComponent,
    VendorwarehouseComponent,
    VendorwarehouselistComponent,
    VendoritemlistComponent,
  ],
  providers: [

    CookieService,
    EncrDecrService
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
  ]
})
export class VendorsModule { }
