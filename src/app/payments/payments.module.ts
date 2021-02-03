//core
import { RouterModule } from '@angular/router';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

//kendo
import { GridModule, PDFModule, ExcelModule } from '@progress/kendo-angular-grid';
import { PopupModule } from '@progress/kendo-angular-popup';
import { DropDownListModule, DropDownsModule } from '@progress/kendo-angular-dropdowns'; 
import { InputsModule } from '@progress/kendo-angular-inputs';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';


import { PreventDoubleSubmitModule } from 'ngx-prevent-double-submission'; 
import { EncrDecrService } from '../_services/service/encr-decr.service';
import { CookieService } from 'ngx-cookie-service';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { ToastrModule } from 'ngx-toastr';
import { MomentModule } from 'ngx-moment';

import { StatementlistComponent } from './statementlist/statementlist.component';
import { StatementviewComponent } from './statementview/statementview.component';

import { VendorpaymentComponent } from './vendorpayment/vendorpayment.component';
import { VendorpaymentlistComponent } from './vendorpaymentlist/vendorpaymentlist.component';
import { VendorpaymentviewComponent } from './vendorpaymentview/vendorpaymentview.component';

import { PaymentsRoutingModule } from './payments.routing.module';
import { PaymentsurveyComponent } from './paymentsurvey/paymentsurvey.component';
import { NgPipesModule } from 'ngx-pipes';
import { FinancialAdjustmentComponent } from './financial-adjustment/financial-adjustment.component';
import { DutyDepositLedgerComponent } from './duty-deposit-ledger/duty-deposit-ledger.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule, 
    FormsModule, 
    ReactiveFormsModule, 
    PreventDoubleSubmitModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    }),
    MomentModule,
    NgxDaterangepickerMd.forRoot(), 
 
    InputsModule, 
    GridModule,
    PDFModule, 
    ExcelModule,
    DropDownListModule,
    DropDownsModule,
    PopupModule, 
    PDFExportModule,
    NgPipesModule,
    PaymentsRoutingModule
  ],
  declarations: [
    StatementlistComponent, 
    StatementviewComponent,
     VendorpaymentComponent,
    VendorpaymentlistComponent,
    VendorpaymentviewComponent,
    PaymentsurveyComponent,
    FinancialAdjustmentComponent,
    DutyDepositLedgerComponent
  ],

  providers: [
    CookieService,
    EncrDecrService
  ],

  schemas: [
    NO_ERRORS_SCHEMA,
  ]
})
export class PaymentsModule { }
