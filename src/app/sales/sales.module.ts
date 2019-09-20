import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { IntlModule } from '@progress/kendo-angular-intl';
import * as bootstrap from "bootstrap";
import * as $ from "jquery";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PreventDoubleSubmitModule } from 'ngx-prevent-double-submission';
import { MomentModule } from 'ngx-moment';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';

import { EncrDecrService } from '../_services/service/encr-decr.service';
import { PopupAnchorDirective } from './salesorder/popup.anchor-target.directive';

import { SalesratecardlistComponent } from './salesratecardlist/salesratecardlist.component';
import { SalesorderlistComponent } from './salesorderlist/salesorderlist.component';
import { SalesorderComponent } from './salesorder/salesorder.component';
import { SalesShipmentComponent } from './sales-shipment/sales-shipment.component';
import { SalesShipmentListComponent } from './sales-shipment-list/sales-shipment-list.component';
import { ShipmentoutwardlistComponent } from './shipmentoutwardlist/shipmentoutwardlist.component';

import { PicklistComponent } from './picklist/picklist.component';
import { PicklistsearchComponent } from './picklistsearch/picklistsearch.component';
import { PicklistviewComponent } from './picklistview/picklistview.component';
import { SalesinvoiceComponent } from './salesinvoice/salesinvoice.component';
import { ReceiptslistComponent } from './receiptslist/receiptslist.component';
import { SalesorderunsellableComponent } from './salesorderunsellable/salesorderunsellable.component';
import { SalesorderapprovallistComponent } from './salesorderapprovallist/salesorderapprovallist.component';
import { SalesorderapprovalComponent } from './salesorderapproval/salesorderapproval.component';
@NgModule({
  imports: [
    CommonModule,
    // ReactiveFormsModule,
    FormsModule,
    // UserRoutingModule

    BrowserModule,
    RouterModule,
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
    DateInputsModule,

    IntlModule,
    PDFExportModule,
  ],

  declarations: [
    PopupAnchorDirective,
    SalesratecardlistComponent,
    SalesorderlistComponent,
    SalesorderComponent,
    SalesShipmentComponent,
    SalesShipmentListComponent,
    ShipmentoutwardlistComponent,
    PicklistComponent,
    PicklistsearchComponent,
    SalesinvoiceComponent,
    ReceiptslistComponent,
    SalesorderunsellableComponent,
    SalesorderapprovallistComponent,
    SalesorderapprovalComponent,
    PicklistviewComponent
  ],
  providers: [

    CookieService,

    EncrDecrService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA,
  ]
})
export class SalesModule { }
