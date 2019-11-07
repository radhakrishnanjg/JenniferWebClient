import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, StoreGuard, } from '../_guards';

//cases
import { AllotmentComponent } from '../cases/allotment/allotment.component';
import { AllotmentlistComponent } from '../cases/allotmentlist/allotmentlist.component';
import { ManagementComponent } from '../cases/management/management.component';
import { ManagementlistComponent } from '../cases/managementlist/managementlist.component';
import { ManagementviewComponent } from '../cases/managementview/managementview.component';
import { TransferlistComponent } from '../cases/transferlist/transferlist.component';
import { TransferComponent } from '../cases/transfer/transfer.component';
import { ReplicationlistComponent } from '../cases/replicationlist/replicationlist.component';
import { ReplicationComponent } from '../cases/replication/replication.component';


const appRoutes: Routes = [
    //Cases module
    { path: 'Allotment/:id', component: AllotmentComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Allotmentlist', component: AllotmentlistComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Management/:id', component: ManagementComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Managementlist', component: ManagementlistComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Managementview/:id', component: ManagementviewComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Transferlist', component: TransferlistComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Transfer/:id', component: TransferComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Replicationlist', component: ReplicationlistComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Replication/:id', component: ReplicationComponent, canActivate: [AuthGuard, StoreGuard] },

];

@NgModule({
    imports: [RouterModule.forChild(appRoutes)],
    exports: [RouterModule]
})
export class CasesRoutingModule { }