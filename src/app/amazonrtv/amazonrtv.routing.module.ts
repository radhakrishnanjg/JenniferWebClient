import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, StoreGuard, } from '../_guards';

import { ConfigurationComponent } from './configuration/configuration.component';
import { ConfigurationlistComponent } from './configurationlist/configurationlist.component';
import { OrderlistComponent } from './orderlist/orderlist.component';
import { RtvtransitlistComponent } from './rtvtransitlist/rtvtransitlist.component';


const appRoutes: Routes = [
    { path: 'Configuration/:id', component: ConfigurationComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Configurationlist', component: ConfigurationlistComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Orderlist', component: OrderlistComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Transitlist', component: RtvtransitlistComponent, canActivate: [AuthGuard, StoreGuard] },

]; 

@NgModule({
    imports: [RouterModule.forChild(appRoutes)],
    exports: [RouterModule]
})
export class AmazonrtvRoutingModule { }