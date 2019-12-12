import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, StoreGuard } from '../_guards';

// Users module  
import { UserlistComponent } from '../users/userlist/userlist.component';
import { UserComponent } from '../users/user/user.component';
import { UserpermissionComponent } from '../users/userpermission/userpermission.component';
import { CompanydetailsComponent } from '../users/companydetails/companydetails.component';
import { CompanydetaillistComponent } from '../users/companydetaillist/companydetaillist.component';
import { CompanyprofileComponent } from '../users/companyprofile/companyprofile.component';

const appRoutes: Routes = [ 
      // Users module 
      { path: 'Userlist', component: UserlistComponent, canActivate: [AuthGuard] },
      { path: 'User/:id', component: UserComponent, canActivate: [AuthGuard] },
      { path: 'Userpermission/:id/:email', component: UserpermissionComponent, canActivate: [AuthGuard] },
      { path: 'CompanyProfile', component: CompanyprofileComponent },

      { path: 'Companydetails/:id', component: CompanydetailsComponent, canActivate: [AuthGuard] },
      { path: 'Companydetaillist', component: CompanydetaillistComponent, canActivate: [AuthGuard] },
];

@NgModule({
    imports: [RouterModule.forChild(appRoutes)

    ],
    exports: [RouterModule]
})
export class UsersRoutingModule { }