import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, StoreGuard } from '../_guards';

import { DiscountlistComponent } from '../pricing/discountlist/discountlist.component';
import { MarketplacefeelistComponent } from '../pricing/marketplacefeelist/marketplacefeelist.component';
import { SalesratecardlistComponent } from '../pricing/salesratecardlist/salesratecardlist.component';
import { EventmanagerComponent } from './eventmanager/eventmanager.component';
import { SubscriptionComponent } from './subscription/subscription.component';

const routes: Routes = [
  { path: 'Discountlist', component: DiscountlistComponent, canActivate: [AuthGuard, StoreGuard] },
  { path: 'Marketplacefeelist', component: MarketplacefeelistComponent, canActivate: [AuthGuard, StoreGuard] },
  { path: 'Salesratecardlist', component: SalesratecardlistComponent, canActivate: [AuthGuard, StoreGuard] },
  { path: 'EventManager', component: EventmanagerComponent, canActivate: [AuthGuard] },
  { path: 'Subscription', component: SubscriptionComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PricingRoutingModule { }
