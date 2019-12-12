import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, StoreGuard } from '../_guards';

// Vendor module   
import { VendorComponent } from '../vendors/vendor/vendor.component';
import { VendorlistComponent } from '../vendors/vendorlist/vendorlist.component';
import { VendoritemlistComponent } from '../vendors/vendoritemlist/vendoritemlist.component';
import { VendorwarehouselistComponent } from '../vendors/vendorwarehouselist/vendorwarehouselist.component';
import { VendorwarehouseComponent } from '../vendors/vendorwarehouse/vendorwarehouse.component';

const appRoutes: Routes = [  
      //vendor module
      { path: 'Vendor/:id', component: VendorComponent, canActivate: [AuthGuard] },
      { path: 'Vendorlist', component: VendorlistComponent, canActivate: [AuthGuard] },
      { path: 'Vendorwarehouse/:id', component: VendorwarehouseComponent, canActivate: [AuthGuard] },
      { path: 'Vendorwarehouselist', component: VendorwarehouselistComponent, canActivate: [AuthGuard] },
      { path: 'Vendoritemlist', component: VendoritemlistComponent, canActivate: [AuthGuard, StoreGuard] },
];

@NgModule({
    imports: [RouterModule.forChild(appRoutes)

    ],
    exports: [RouterModule]
})
export class VendorsRoutingModule { }