import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DepartmentComponent } from './department/department.component';

import { SeniormasterComponent } from './seniormaster/seniormaster.component';
const routes: Routes = [
  { path: 'Department', component: DepartmentComponent },
  { path: 'SeniorMaster', component: SeniormasterComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
