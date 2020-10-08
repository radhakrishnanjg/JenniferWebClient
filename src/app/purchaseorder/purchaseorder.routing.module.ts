import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, StoreGuard } from '../_guards';

// Purchase order module
import { PolistComponent } from '../purchaseorder/polist/polist.component';
import { PoComponent } from '../purchaseorder/po/po.component';
import { PoapprovallistComponent } from '../purchaseorder/poapprovallist/poapprovallist.component';
import { PoapprovalComponent } from '../purchaseorder/poapproval/poapproval.component';
import { PoshipmentlistComponent } from '../purchaseorder/poshipmentlist/poshipmentlist.component';
import { PoshipmentComponent } from '../purchaseorder/poshipment/poshipment.component';
import { ShipmentviewComponent } from '../purchaseorder/shipmentview/shipmentview.component';
import { PurchaselistComponent } from '../purchaseorder/purchaselist/purchaselist.component';
import { PurchaseComponent } from '../purchaseorder/purchase/purchase.component';
import { PurchaseviewComponent } from '../purchaseorder/purchaseview/purchaseview.component';
import { PoviewComponent } from '../purchaseorder/poview/poview.component';
import { BoeComponent } from '../purchaseorder/boe/boe.component';
import { BoelistComponent } from '../purchaseorder/boelist/boelist.component';
import { BoeviewComponent } from '../purchaseorder/boeview/boeview.component';
import { PoprintComponent } from '../purchaseorder/poprint/poprint.component';
import { DebitnoteComponent } from '../purchaseorder/debitnote/debitnote.component';
import { DebitnotelistComponent } from '../purchaseorder/debitnotelist/debitnotelist.component';
import { DebitnoteviewComponent } from '../purchaseorder/debitnoteview/debitnoteview.component';
import { PomfilistComponent } from '../purchaseorder/pomfilist/pomfilist.component';
import { MFICaseComponent } from './mficase/mficase.component';


const appRoutes: Routes = [

    // po ,shipment , purchase and sto  screens
    { path: 'Polist', component: PolistComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'PO/:id', component: PoComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Poapprovallist', component: PoapprovallistComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Poapproval/:id', component: PoapprovalComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Poshipmentlist', component: PoshipmentlistComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Poshipment/:id/:PoId', component: PoshipmentComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Poshipmentview/:id/:PoId', component: ShipmentviewComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Purchaselist', component: PurchaselistComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Purchase/:id/:PoId', component: PurchaseComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'POview/:id', component: PoviewComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Purchaseview/:id/:PoId', component: PurchaseviewComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'BOElist', component: BoelistComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'BOE/:id/:PurchaseId', component: BoeComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'BOEview/:id/:PurchaseId', component: BoeviewComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'POprint/:id', component: PoprintComponent, canActivate: [AuthGuard, StoreGuard] },
    //debitnote
    { path: 'Debitnote/:DNType/:id', component: DebitnoteComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Debitnotelist', component: DebitnotelistComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Debitnoteview/:id/:dntype', component: DebitnoteviewComponent, canActivate: [AuthGuard, StoreGuard] },
    // MFI  
    { path: 'PoMFIlist', component: PomfilistComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'MFICase/:id', component: MFICaseComponent, canActivate: [AuthGuard, StoreGuard] },
];

@NgModule({
    imports: [RouterModule.forChild(appRoutes)

    ],
    exports: [RouterModule]
})
export class PurchaseorderRoutingModule { }