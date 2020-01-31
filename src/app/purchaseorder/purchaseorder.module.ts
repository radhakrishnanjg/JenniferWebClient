//core npms  
import { NgModule, NO_ERRORS_SCHEMA,   } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

//kendo
import { GridModule, PDFModule, ExcelModule } from '@progress/kendo-angular-grid';
import { PopupModule } from '@progress/kendo-angular-popup';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns'; 
import { InputsModule } from '@progress/kendo-angular-inputs';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';

import { PreventDoubleSubmitModule } from 'ngx-prevent-double-submission';
import { MomentModule } from 'ngx-moment';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { EncrDecrService } from '../_services/service/encr-decr.service';
import { CookieService } from 'ngx-cookie-service';
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
import { ShipmentviewComponent } from './shipmentview/shipmentview.component';
import { PoprintComponent } from './poprint/poprint.component';

import { PomfilistComponent } from './pomfilist/pomfilist.component';
import { PurchaseorderRoutingModule } from './/purchaseorder.routing.module';
import { DebitnoteComponent } from './debitnote/debitnote.component';
import { DebitnotelistComponent } from './debitnotelist/debitnotelist.component';
import { DebitnoteviewComponent } from './debitnoteview/debitnoteview.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule, 
    ReactiveFormsModule, 
    PreventDoubleSubmitModule.forRoot(),
    MomentModule,
    NgxDaterangepickerMd.forRoot(), 
    FormsModule, 
    InputsModule, 
    GridModule,
    PDFModule, 
    ExcelModule,
    DropDownListModule,
    PopupModule, 
    PDFExportModule,
    PurchaseorderRoutingModule
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
    ShipmentviewComponent,
    PoprintComponent,
    PomfilistComponent,
    DebitnoteComponent,
    DebitnotelistComponent,
    DebitnoteviewComponent
  ],
  providers: [ 
    CookieService, 
    EncrDecrService
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
  ]
})
export class PurchaseorderModule { }
