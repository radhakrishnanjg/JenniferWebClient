import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../_guards';

//help 
import { HelpnavigationComponent } from '../help/helpnavigation/helpnavigation.component';
import { HelpmenulistComponent } from '../help/helpmenulist/helpmenulist.component';
import { HelpmenuComponent } from '../help/helpmenu/helpmenu.component';

const appRoutes: Routes = [
    //Help module
    { path: 'Help', component: HelpnavigationComponent, },
    { path: 'Helpmenu/:id', component: HelpmenuComponent, canActivate: [AuthGuard] },
    { path: 'Helpmenulist', component: HelpmenulistComponent, canActivate: [AuthGuard,] },

];

@NgModule({
    imports: [RouterModule.forChild(appRoutes)

    ],
    exports: [RouterModule]
})
export class HelpRoutingModule { }