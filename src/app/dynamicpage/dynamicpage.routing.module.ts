
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../_guards';


import { DataentryformlistComponent } from './dataentryformlist/dataentryformlist.component';
import { WorkflowformlistComponent } from './workflowformlist/workflowformlist.component';
import { DataentryreportComponent } from './dataentryreport/dataentryreport.component';
import { WorkflowreportComponent } from './workflowreport/workflowreport.component';
import { DataentryformComponent } from './dataentryform/dataentryform.component';
import { WorkflowformComponent } from './workflowform/workflowform.component';

const appRoutes: Routes = [
  { path: 'Dataentryformlist', component: DataentryformlistComponent },
  { path: 'Dataentryreport/:id', component: DataentryreportComponent },
  { path: 'Dataentry/:id/:FormId', component: DataentryformComponent },

  { path: 'Workflowformlist', component: WorkflowformlistComponent },
  { path: 'Workflowreport/:id', component: WorkflowreportComponent },
  { path: 'Workflow/:id/:FormId', component: WorkflowformComponent },

];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)
  ],
  exports: [RouterModule]
})


export class DynamicpageRoutingModule { }