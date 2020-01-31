import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, StoreGuard, } from '../_guards';


//Component
import { ReportsinventoryComponent } from './reportsinventory/reportsinventory.component';
import { ReportsamazonComponent } from './reportsamazon/reportsamazon.component';
import { ReportscomplianceComponent } from './reportscompliance/reportscompliance.component';
import { ReportsanalyticsComponent } from './reportsanalytics/reportsanalytics.component';
import { ReportsmisComponent } from './reportsmis/reportsmis.component';
import { ReportsothersComponent } from './reportsothers/reportsothers.component';
import { ReportAmazonMTRComponent } from './report-amazon-mtr/report-amazon-mtr.component'; 

const appRoutes: Routes = [
    //download path
    { path: 'Reportsinventory', component: ReportsinventoryComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Reportsamazon', component: ReportsamazonComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Reportscompliance', component: ReportscomplianceComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Reportsanalytics', component: ReportsanalyticsComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Reportsmis', component: ReportsmisComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Reportsothers', component: ReportsothersComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'ReportAmazonMTR', component: ReportAmazonMTRComponent, canActivate: [AuthGuard, StoreGuard] }, 

];

@NgModule({
    imports: [RouterModule.forChild(appRoutes)],
    exports: [RouterModule]
})
export class DownloadRoutingModule { }