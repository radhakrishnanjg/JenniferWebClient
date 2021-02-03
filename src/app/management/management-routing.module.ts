import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../_guards';

import { ProfilelossComponent } from './profileloss/profileloss.component';
import { ItemlevelplComponent } from './itemlevelpl/itemlevelpl.component';
import { ProfitAnalysisComponent } from './profit-analysis/profit-analysis.component';
import { MISanalysisComponent } from './misanalysis/misanalysis.component';


const routes: Routes = [
  // Pre master module   
  { path: 'ProfitLoss', component: ProfilelossComponent, canActivate: [AuthGuard] },
  { path: 'ItemWisePL', component: ItemlevelplComponent, canActivate: [AuthGuard] },
  { path: 'ProfitAnalysis', component: ProfitAnalysisComponent, canActivate: [AuthGuard] },
  { path: 'MISAnalysis', component: MISanalysisComponent, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule { }
