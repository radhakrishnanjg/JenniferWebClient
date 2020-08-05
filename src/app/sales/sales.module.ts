//core npms  
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

//kendo
import { GridModule, PDFModule, ExcelModule } from '@progress/kendo-angular-grid';
import { PopupModule } from '@progress/kendo-angular-popup';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { IntlModule } from '@progress/kendo-angular-intl';

import { PreventDoubleSubmitModule } from 'ngx-prevent-double-submission';
import { MomentModule } from 'ngx-moment';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { SelectDropDownModule } from 'ngx-select-dropdown'
import { EncrDecrService } from '../_services/service/encr-decr.service';
import { CookieService } from 'ngx-cookie-service';
import { PopupAnchorDirective } from './salesorder/popup.anchor-target.directive';

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
import { SalesorderviewComponent } from './salesorderview/salesorderview.component';

//Customer Receipt
import { CustomerreceiptComponent } from './customerreceipt/customerreceipt.component';
import { CustomerreceiptlistComponent } from './customerreceiptlist/customerreceiptlist.component';
import { CustomerreceiptviewComponent } from './customerreceiptview/customerreceiptview.component';

//Credit Note
import { CreditnoteComponent } from './creditnote/creditnote.component';
import { CreditnotelistComponent } from './creditnotelist/creditnotelist.component';
import { CreditnoteviewComponent } from './creditnoteview/creditnoteview.component';
import { SalesRoutingModule } from './sales.routing.module';
import { RefundlistComponent } from './refundlist/refundlist.component';
import { RefundComponent } from './refund/refund.component';
@NgModule({
  imports: [
    CommonModule,
    // ReactiveFormsModule,
    FormsModule,
    // UserRoutingModule

    RouterModule,
    ReactiveFormsModule,
    PreventDoubleSubmitModule.forRoot(),
    MomentModule,
    NgxDaterangepickerMd.forRoot(),
    SelectDropDownModule,
    InputsModule,
    GridModule,
    PDFModule,
    ExcelModule,
    DropDownListModule,
    PopupModule,
    IntlModule,
    DateInputsModule,
    PDFExportModule,
    SalesRoutingModule
  ],

  declarations: [
    PopupAnchorDirective,
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
    PicklistviewComponent,
    SalesorderviewComponent,
    CustomerreceiptComponent,
    CustomerreceiptlistComponent,
    CustomerreceiptviewComponent,
    CreditnoteComponent,
    CreditnotelistComponent,
    CreditnoteviewComponent,
    RefundlistComponent,
    RefundComponent,
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
