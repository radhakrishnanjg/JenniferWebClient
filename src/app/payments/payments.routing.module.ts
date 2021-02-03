import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, StoreGuard, } from '../_guards';

import { StatementlistComponent } from './statementlist/statementlist.component';
import { StatementviewComponent } from './statementview/statementview.component';
import { VendorpaymentComponent } from './vendorpayment/vendorpayment.component';
import { VendorpaymentlistComponent } from './vendorpaymentlist/vendorpaymentlist.component';
import { VendorpaymentviewComponent } from './vendorpaymentview/vendorpaymentview.component';
import { PaymentsurveyComponent } from './paymentsurvey/paymentsurvey.component';
import { FinancialAdjustmentComponent } from './financial-adjustment/financial-adjustment.component';
import { DutyDepositLedgerComponent } from './duty-deposit-ledger/duty-deposit-ledger.component';

const routes: Routes = [
  { path: 'Statementview/:id', component: StatementviewComponent, canActivate: [AuthGuard, StoreGuard] },
  { path: 'Statementlist', component: StatementlistComponent, canActivate: [AuthGuard, StoreGuard] },
  { path: 'Vendorpayment/:id', component: VendorpaymentComponent, canActivate: [AuthGuard, StoreGuard] },
  { path: 'Vendorpaymentlist', component: VendorpaymentlistComponent, canActivate: [AuthGuard, StoreGuard] },
  { path: 'Vendorpaymentview/:id', component: VendorpaymentviewComponent, canActivate: [AuthGuard, StoreGuard] },
  { path: 'PaymentSurvey', component: PaymentsurveyComponent, canActivate: [] },
  { path: 'FinancialAdjustment', component: FinancialAdjustmentComponent, canActivate: [AuthGuard,] },
  { path: 'DutyDepositLedger', component: DutyDepositLedgerComponent, canActivate: [AuthGuard,] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentsRoutingModule { }
