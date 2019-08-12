import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMaskModule } from 'ngx-mask'
import { ToastrModule } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';


import { SelectDropDownModule } from 'ngx-select-dropdown'
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { DataTablesModule } from 'angular-datatables';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxTypeaheadModule } from 'ngx-typeahead';
import { GridModule } from '@progress/kendo-angular-grid';
import { PopupModule } from '@progress/kendo-angular-popup';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import * as bootstrap from "bootstrap";
import * as $ from "jquery";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PreventDoubleSubmitModule } from 'ngx-prevent-double-submission';
import { MomentModule } from 'ngx-moment';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { InputsModule } from '@progress/kendo-angular-inputs';

import { JwtInterceptor, HttpErrorInterceptor } from '../_helpers';
import { EncrDecrService } from '../_services/service/encr-decr.service';
import { PopupAnchorDirective } from './po/popup.anchor-target.directive';

import { PolistComponent } from './polist/polist.component';
import { PoComponent } from './po/po.component';
import { PoapprovallistComponent } from './poapprovallist/poapprovallist.component';
import { PoapprovalComponent } from './poapproval/poapproval.component';
import { PoshipmentlistComponent } from './poshipmentlist/poshipmentlist.component';
import { PoshipmentComponent } from './poshipment/poshipment.component';
import { PurchaselistComponent } from './purchaselist/purchaselist.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { PurchaseviewComponent } from './purchaseview/purchaseview.component';
import { PoviewComponent } from './poview/poview.component';
import { BoeComponent } from './boe/boe.component';
import { BoelistComponent } from './boelist/boelist.component';
import { BoeviewComponent } from './boeview/boeview.component';
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
    NgxEchartsModule,
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
  ],

  declarations: [
    PopupAnchorDirective,
    PolistComponent,
    PoComponent,
    PoapprovallistComponent,
    PoapprovalComponent,
    PoshipmentlistComponent,
    PoshipmentComponent,
    PurchaselistComponent,
    PurchaseComponent,
    PurchaseviewComponent,
    PoviewComponent,
    BoeComponent,
    BoelistComponent,
    BoeviewComponent,
  ],
  providers: [
    // { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    CookieService,
    
    EncrDecrService
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
  ]
})
export class PurchaseorderModule { }
