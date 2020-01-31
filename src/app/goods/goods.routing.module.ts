import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, StoreGuard, } from '../_guards';

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

const appRoutes: Routes = [ 
    
   { path: 'Goodsreceipt/:id', component: GoodsReceiptComponent, canActivate: [AuthGuard, StoreGuard] },
   { path: 'Goodsreceiptlist', component: GoodsReceiptListComponent, canActivate: [AuthGuard, StoreGuard] },
   { path: 'Goodsdispute/:id', component: GoodsDisputeComponent, canActivate: [AuthGuard, StoreGuard] },
   { path: 'Goodsdisputelist', component: GoodsDisputeListComponent, canActivate: [AuthGuard, StoreGuard] },
   { path: 'Goodsinward/:id', component: GoodsinwardComponent, canActivate: [AuthGuard, StoreGuard] },
   { path: 'Goodsinwardlist', component: GoodsinwardlistComponent, canActivate: [AuthGuard, StoreGuard] },
   { path: 'Goodsstorage/:id', component: GoodsstorageComponent, canActivate: [AuthGuard, StoreGuard] },
   { path: 'Goodsstoragelist', component: GoodsstoragelistComponent, canActivate: [AuthGuard, StoreGuard] },  
   { path: 'Inventorydetaillist', component: InventorydetaillistComponent, canActivate: [AuthGuard, StoreGuard] },
   { path: 'Goodsreceiptview/:id', component: GoodsreceiptviewComponent, canActivate: [AuthGuard, StoreGuard] },
   { path: 'Goodsdisputeview/:id', component: GoodsdisputeviewComponent, canActivate: [AuthGuard, StoreGuard] },

];

@NgModule({
    imports: [RouterModule.forChild(appRoutes)],
    exports: [RouterModule]
})
export class GoodsRoutingModule { }