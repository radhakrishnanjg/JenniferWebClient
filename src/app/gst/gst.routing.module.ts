import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, StoreGuard, } from '../_guards';


//cases
import { GstComponent } from '../gst/gst/gst.component';
import { GstlistComponent } from '../gst/gstlist/gstlist.component';
import { GstdownloadComponent } from '../gst/gstdownload/gstdownload.component';
import { GstapprovalComponent } from '../gst/gstapproval/gstapproval.component';
import { TallyprocesslistComponent } from './tallyprocesslist/tallyprocesslist.component';

const appRoutes: Routes = [
    //Cases module

    { path: 'Gst/:id', component: GstComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Gstapproval/:id', component: GstapprovalComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Gstlist', component: GstlistComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'GstDownload', component: GstdownloadComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Tallyprocesslist', component: TallyprocesslistComponent, canActivate: [AuthGuard] },


];
@NgModule({
    imports: [RouterModule.forChild(appRoutes)],
    exports: [RouterModule]
})
export class GstRoutingModule { }