import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, StoreGuard, } from '../_guards';

import { ConfigurationComponent } from './configuration/configuration.component';
import { ConfigurationlistComponent } from './configurationlist/configurationlist.component';
import { OrderlistComponent } from './orderlist/orderlist.component';
import { RtvtransitlistComponent } from './rtvtransitlist/rtvtransitlist.component';

import { ConfigurationmanualComponent } from './configurationmanual/configurationmanual.component';
import { ConfigurationapprovalComponent } from './configurationapproval/configurationapproval.component';
import { ConfigurationviewComponent } from './configurationview/configurationview.component';
import { ConfigurationinvoiceComponent } from './configurationinvoice/configurationinvoice.component';
import { ProductTaxcodeComponent } from './product-taxcode/product-taxcode.component';

const appRoutes: Routes = [
    { path: 'Configuration/:id', component: ConfigurationComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Configurationlist', component: ConfigurationlistComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Orderlist', component: OrderlistComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Transitlist', component: RtvtransitlistComponent, canActivate: [AuthGuard, StoreGuard] },
    
    { path: 'ConfigurationManual/:id', component: ConfigurationmanualComponent, canActivate: [AuthGuard,] },
    { path: 'ConfigurationApproval/:id', component: ConfigurationapprovalComponent, canActivate: [AuthGuard,] },
    { path: 'ConfigurationView/:id', component: ConfigurationviewComponent, canActivate: [AuthGuard,] },
    { path: 'ConfigurationInvoice/:id', component: ConfigurationinvoiceComponent, canActivate: [AuthGuard,] },
    { path: 'ProductTaxcode', component: ProductTaxcodeComponent, canActivate: [AuthGuard,] },

];

@NgModule({
    imports: [RouterModule.forChild(appRoutes)],
    exports: [RouterModule]
})
export class AmazonrtvRoutingModule { }