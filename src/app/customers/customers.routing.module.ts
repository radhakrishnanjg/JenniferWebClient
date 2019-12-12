import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, StoreGuard, } from '../_guards';

//Compoent
import { CustomerComponent } from './customer/customer.component';
import { CustomerlistComponent } from './customerlist/customerlist.component';
import { CustomerwarehouseComponent } from './customerwarehouse/customerwarehouse.component';
import { CustomerwarehouselistComponent } from './customerwarehouselist/customerwarehouselist.component';
import { CustomeritemlistComponent } from './customeritemlist/customeritemlist.component';


const appRoutes: Routes = [
    // customer module
    { path: 'Customer/:id', component: CustomerComponent, canActivate: [AuthGuard] },
    { path: 'Customerlist', component: CustomerlistComponent, canActivate: [AuthGuard] },
    { path: 'Customerwarehouse/:id', component: CustomerwarehouseComponent, canActivate: [AuthGuard] },
    { path: 'Customerwarehouselist', component: CustomerwarehouselistComponent, canActivate: [AuthGuard] },
    { path: 'Customeritemlist', component: CustomeritemlistComponent, canActivate: [AuthGuard, StoreGuard] },

];

@NgModule({
    imports: [RouterModule.forChild(appRoutes)],
    exports: [RouterModule]
})
export class CustomersRoutingModule { }