import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, StoreGuard, } from '../_guards';

import { StoListComponent } from './sto-list/sto-list.component';
import { StoComponent } from './sto/sto.component';
import { StoviewComponent } from './stoview/stoview.component';
import { StoeditComponent } from './stoedit/stoedit.component';

const routes: Routes = [
  { path: 'StoList', component: StoListComponent, canActivate: [AuthGuard, StoreGuard] },
  { path: 'Sto/:id', component: StoComponent, canActivate: [AuthGuard, StoreGuard] },
  { path: 'StoEdit/:id', component: StoeditComponent, canActivate: [AuthGuard, StoreGuard] },
  { path: 'Stoview/:id', component: StoviewComponent, canActivate: [AuthGuard, StoreGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JournalsRoutingModule { }
