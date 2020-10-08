import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, StoreGuard } from '../_guards';
import { CommonModule } from '@angular/common';
 
import { ProfilelossComponent } from './profileloss/profileloss.component';
import { ItemlevelplComponent } from './itemlevelpl/itemlevelpl.component';


const routes: Routes = [
  // Pre master module   
  { path: 'ProfitLoss', component: ProfilelossComponent, canActivate: [AuthGuard] },
  { path: 'ItemWisePL', component: ItemlevelplComponent, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule { }
