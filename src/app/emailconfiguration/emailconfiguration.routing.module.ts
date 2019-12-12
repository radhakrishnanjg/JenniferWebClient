import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, StoreGuard, } from '../_guards';

//Component

import { EmailconfigComponent } from './emailconfig/emailconfig.component';
import { ContactlistComponent } from './contactlist/contactlist.component';
import { ContactComponent } from './contact/contact.component';

const appRoutes: Routes = [ 
    { path: 'Emailconfig', component: EmailconfigComponent, canActivate: [AuthGuard, StoreGuard] },
    { path: 'Contact/:id', component: ContactComponent, canActivate: [AuthGuard] },
    { path: 'Contactlist', component: ContactlistComponent, canActivate: [AuthGuard] },

];

@NgModule({
    imports: [RouterModule.forChild(appRoutes)],
    exports: [RouterModule]
})
export class EmailConfigurationRoutingModule { }