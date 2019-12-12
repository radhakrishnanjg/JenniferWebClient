import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, StoreGuard, } from '../_guards';


//Component
import { ReportmasterlistComponent } from './reportmasterlist/reportmasterlist.component';
import { ReportmasterComponent } from './reportmaster/reportmaster.component';
import { ReportsinventoryComponent } from './reportsinventory/reportsinventory.component';
import { ReportsamazonComponent } from './reportsamazon/reportsamazon.component';
import { ReportscomplianceComponent } from './reportscompliance/reportscompliance.component';
import { ReportsanalyticsComponent } from './reportsanalytics/reportsanalytics.component';
import { ReportsmisComponent } from './reportsmis/reportsmis.component';
import { ReportsothersComponent } from './reportsothers/reportsothers.component';
import { ReportAmazonMTRComponent } from './report-amazon-mtr/report-amazon-mtr.component';
import { StatementlistComponent } from './statementlist/statementlist.component';
import { StatementviewComponent } from './statementview/statementview.component';

const appRoutes: Routes = [
    //download path
    { path: 'Reportmaster/:id', component: ReportmasterComponent, canActivate: [AuthGuard] },
    { path: 'Reportmasterlist', component: ReportmasterlistComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Reportsinventory', component: ReportsinventoryComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Reportsamazon', component: ReportsamazonComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Reportscompliance', component: ReportscomplianceComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Reportsanalytics', component: ReportsanalyticsComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Reportsmis', component: ReportsmisComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Reportsothers', component: ReportsothersComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'ReportAmazonMTR', component: ReportAmazonMTRComponent, canActivate: [AuthGuard, StoreGuard] },

    { path: 'Statementview/:id', component: StatementviewComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Statementlist', component: StatementlistComponent, canActivate: [AuthGuard, StoreGuard] },

];

@NgModule({
    imports: [RouterModule.forChild(appRoutes)],
    exports: [RouterModule]
})
export class DownloadRoutingModule { }