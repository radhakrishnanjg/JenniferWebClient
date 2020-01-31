import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, StoreGuard, } from '../_guards';

import { StatementlistComponent } from './statementlist/statementlist.component';
import { StatementviewComponent } from './statementview/statementview.component';
import { VendorpaymentComponent } from './vendorpayment/vendorpayment.component';
import { VendorpaymentlistComponent } from './vendorpaymentlist/vendorpaymentlist.component';
import { VendorpaymentviewComponent } from './vendorpaymentview/vendorpaymentview.component';

const routes: Routes = [
  { path: 'Statementview/:id', component: StatementviewComponent, canActivate: [AuthGuard, StoreGuard] },
  { path: 'Statementlist', component: StatementlistComponent, canActivate: [AuthGuard, StoreGuard] },
  { path: 'Vendorpayment/:id', component: VendorpaymentComponent, canActivate: [AuthGuard, StoreGuard] },
  { path: 'Vendorpaymentlist', component: VendorpaymentlistComponent, canActivate: [AuthGuard, StoreGuard] },
  { path: 'Vendorpaymentview/:id', component: VendorpaymentviewComponent, canActivate: [AuthGuard, StoreGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentsRoutingModule { }
