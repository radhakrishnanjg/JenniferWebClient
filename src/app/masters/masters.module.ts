//core npms  
import { NgModule, NO_ERRORS_SCHEMA, } from '@angular/core';
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

import { LocationComponent } from './location/location.component';
import { LocationlistComponent } from './locationlist/locationlist.component';
import { ItemComponent } from './item/item.component';
import { ItemlistComponent } from './itemlist/itemlist.component';
import { ProductgrouplistComponent } from './productgrouplist/productgrouplist.component';
import { BrandlistComponent } from './brandlist/brandlist.component';
import { CategorylistComponent } from './categorylist/categorylist.component';
import { SubcategorylistComponent } from './subcategorylist/subcategorylist.component';
import { UomlistComponent } from './uomlist/uomlist.component';
import { MasteruploadlistComponent } from './masteruploadlist/masteruploadlist.component';
import { MasteruploadComponent } from './masterupload/masterupload.component';
import { VoucherlistComponent } from './voucherlist/voucherlist.component';
import { LedgerlistComponent } from './ledgerlist/ledgerlist.component';
import { PpoblistComponent } from './ppoblist/ppoblist.component';
import { PpobComponent } from './ppob/ppob.component';

import { MastersRoutingModule } from './masters.routing.module';
import { TaxledgerComponent } from './taxledger/taxledger.component';
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
    MastersRoutingModule
  ],

  declarations: [
    LocationComponent,
    LocationlistComponent,
    ItemComponent,
    ItemlistComponent,
    UomlistComponent,
    BrandlistComponent,
    CategorylistComponent,
    SubcategorylistComponent,
    ProductgrouplistComponent,
    MasteruploadlistComponent,
    MasteruploadComponent, 
    VoucherlistComponent,
    LedgerlistComponent, 
    PpoblistComponent,
    PpobComponent,
    TaxledgerComponent,
  ],
  providers: [
    CookieService,
    EncrDecrService
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
  ]
})
export class MastersModule { }
