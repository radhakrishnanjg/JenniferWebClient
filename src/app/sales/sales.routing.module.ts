import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, StoreGuard } from '../_guards';

// Sales module  
import { SalesorderlistComponent } from '../sales/salesorderlist/salesorderlist.component';
import { SalesorderComponent } from '../sales/salesorder/salesorder.component';
import { SalesorderviewComponent } from '../sales/salesorderview/salesorderview.component';
import { SalesShipmentComponent } from '../sales/sales-shipment/sales-shipment.component';
import { SalesShipmentListComponent } from '../sales/sales-shipment-list/sales-shipment-list.component';
import { ShipmentoutwardlistComponent } from '../sales/shipmentoutwardlist/shipmentoutwardlist.component';
import { PicklistComponent } from '../sales/picklist/picklist.component';
import { PicklistsearchComponent } from '../sales/picklistsearch/picklistsearch.component';
import { PicklistviewComponent } from '../sales/picklistview/picklistview.component';
import { SalesinvoiceComponent } from '../sales/salesinvoice/salesinvoice.component';
import { ReceiptslistComponent } from '../sales/receiptslist/receiptslist.component';
import { SalesorderunsellableComponent } from '../sales/salesorderunsellable/salesorderunsellable.component';
import { SalesorderapprovallistComponent } from '../sales/salesorderapprovallist/salesorderapprovallist.component';
import { SalesorderapprovalComponent } from '../sales/salesorderapproval/salesorderapproval.component';
//Customer Receipt
import { CustomerreceiptComponent } from './customerreceipt/customerreceipt.component';
import { CustomerreceiptlistComponent } from './customerreceiptlist/customerreceiptlist.component';
import { CustomerreceiptviewComponent } from './customerreceiptview/customerreceiptview.component';

//Credit Note
import { CreditnoteComponent } from './creditnote/creditnote.component';
import { CreditnotelistComponent } from './creditnotelist/creditnotelist.component';
import { CreditnoteviewComponent } from './creditnoteview/creditnoteview.component';
import { RefundlistComponent } from './refundlist/refundlist.component';
import { RefundComponent } from './refund/refund.component';
import { StockauditComponent } from './stockaudit/stockaudit.component';

const appRoutes: Routes = [
    // Sales module
    { path: 'Salesorder/:id', component: SalesorderComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Salesorderunsellable/:id', component: SalesorderunsellableComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Salesorderview/:id', component: SalesorderviewComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Salesorderlist', component: SalesorderlistComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Salesorderapproval/:id', component: SalesorderapprovalComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Salesorderapprovallist', component: SalesorderapprovallistComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Salesshipment/:id', component: SalesShipmentComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Salesshipmentlist', component: SalesShipmentListComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Shipmentoutwardlist', component: ShipmentoutwardlistComponent, canActivate: [AuthGuard] },

    { path: 'Picklist/:id', component: PicklistComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'PickListView/:id', component: PicklistviewComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Picklistsearch', component: PicklistsearchComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'SalesInvoice/:id', component: SalesinvoiceComponent, },
    { path: 'Receiptslist', component: ReceiptslistComponent, canActivate: [AuthGuard, StoreGuard] },
    //Customer Receipt
    { path: 'Customerreceipt/:id', component: CustomerreceiptComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Customerreceiptlist', component: CustomerreceiptlistComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Customerreceiptview/:id', component: CustomerreceiptviewComponent, canActivate: [AuthGuard, StoreGuard] },

    //Credit  Note
    { path: 'Creditnote/:CNType/:id', component: CreditnoteComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Creditnotelist', component: CreditnotelistComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Creditnoteview/:id/:CNType', component: CreditnoteviewComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Refund/:id', component: RefundComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Refundlist', component: RefundlistComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'StockAudit', component: StockauditComponent, canActivate: [AuthGuard, StoreGuard] },
];

@NgModule({
    imports: [RouterModule.forChild(appRoutes)

    ],
    exports: [RouterModule]
})
export class SalesRoutingModule { }