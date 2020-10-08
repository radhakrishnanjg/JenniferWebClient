//core
import { RouterModule } from '@angular/router';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

//kendo
import { GridModule, PDFModule, ExcelModule } from '@progress/kendo-angular-grid';
import { PopupModule } from '@progress/kendo-angular-popup';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns'; 
import { InputsModule } from '@progress/kendo-angular-inputs';

import { PreventDoubleSubmitModule } from 'ngx-prevent-double-submission';
import { EncrDecrService } from '../_services/service/encr-decr.service';
import { CookieService } from 'ngx-cookie-service';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgxMaskModule } from 'ngx-mask';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MomentModule } from 'ngx-moment';
import { ToastrModule } from 'ngx-toastr';
import { NgxTypeaheadModule } from 'ngx-typeahead';

//Component

import { GoodsinwardComponent } from './goodsinward/goodsinward.component';
import { GoodsinwardlistComponent } from './goodsinwardlist/goodsinwardlist.component';
import { GoodsstorageComponent } from './goodsstorage/goodsstorage.component';
import { GoodsstoragelistComponent } from './goodsstoragelist/goodsstoragelist.component';
import { GoodsReceiptListComponent } from './goods-receipt-list/goods-receipt-list.component';
import { GoodsReceiptComponent } from './goods-receipt/goods-receipt.component';
import { GoodsDisputeComponent } from './goods-dispute/goods-dispute.component';
import { GoodsDisputeListComponent } from './goods-dispute-list/goods-dispute-list.component'; 
import { InventorydetaillistComponent } from './inventorydetaillist/inventorydetaillist.component';
import { GoodsdisputeviewComponent } from './goodsdisputeview/goodsdisputeview.component';
import { GoodsreceiptviewComponent } from './goodsreceiptview/goodsreceiptview.component'; 
import { GoodsgateacknowledgementComponent } from './goodsgateacknowledgement/goodsgateacknowledgement.component';

//routing module

import { GoodsRoutingModule } from './goods.routing.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    GridModule,
    PDFModule, 
    ExcelModule,
    FormsModule,
    ReactiveFormsModule,
    PopupModule,
    DropDownListModule,
    InputsModule,
    PreventDoubleSubmitModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    }),
    MomentModule,
    NgxDaterangepickerMd.forRoot(),
    NgxMaskModule.forRoot(),
    NgbModule,
    NgxTypeaheadModule,
    GoodsRoutingModule,
  ],

  declarations: [ 
    GoodsinwardComponent,
    GoodsstorageComponent,
    GoodsstoragelistComponent,
    GoodsinwardlistComponent,
    GoodsReceiptListComponent,
    GoodsReceiptComponent,
    GoodsDisputeComponent,
    GoodsDisputeListComponent, 
    InventorydetaillistComponent,
    GoodsdisputeviewComponent,
    GoodsreceiptviewComponent,
    GoodsgateacknowledgementComponent, 
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