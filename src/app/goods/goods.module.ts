import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
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
import * as bootstrap from "bootstrap";
import * as $ from "jquery";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PreventDoubleSubmitModule } from 'ngx-prevent-double-submission';
import { MomentModule } from 'ngx-moment';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { InputsModule } from '@progress/kendo-angular-inputs';


import { EncrDecrService } from '../_services/service/encr-decr.service';
import { PopupAnchorDirective } from './sto/popup.anchor-target.directive';


import { GoodsinwardComponent } from './goodsinward/goodsinward.component';
import { GoodsinwardlistComponent } from './goodsinwardlist/goodsinwardlist.component';
import { GoodsstorageComponent } from './goodsstorage/goodsstorage.component';
import { GoodsstoragelistComponent } from './goodsstoragelist/goodsstoragelist.component';
import { GoodsReceiptListComponent } from './goods-receipt-list/goods-receipt-list.component';
import { GoodsReceiptComponent } from './goods-receipt/goods-receipt.component';
import { GoodsDisputeComponent } from './goods-dispute/goods-dispute.component';
import { GoodsDisputeListComponent } from './goods-dispute-list/goods-dispute-list.component';
import { StoListComponent } from './sto-list/sto-list.component';
import { StoComponent } from './sto/sto.component';
import { InventorydetaillistComponent } from './inventorydetaillist/inventorydetaillist.component';
import { GoodsdisputeviewComponent } from './goodsdisputeview/goodsdisputeview.component';
import { GoodsreceiptviewComponent } from './goodsreceiptview/goodsreceiptview.component';
import { StoviewComponent } from './stoview/stoview.component';
import { StoeditComponent } from './stoedit/stoedit.component';

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
    GoodsinwardComponent,
    GoodsstorageComponent,
    GoodsstoragelistComponent,
    GoodsinwardlistComponent,
    GoodsReceiptListComponent,
    GoodsReceiptComponent,
    GoodsDisputeComponent,
    GoodsDisputeListComponent,
    StoListComponent,
    StoComponent,
    InventorydetaillistComponent, 
    GoodsdisputeviewComponent,
    GoodsreceiptviewComponent,
    StoviewComponent,
    StoeditComponent
  ],
  providers: [
    
    CookieService,
    
    EncrDecrService
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
  ]
})
export class GoodsModule { }
