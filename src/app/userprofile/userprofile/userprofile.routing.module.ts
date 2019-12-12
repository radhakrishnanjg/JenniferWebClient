import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { UserprofileComponent } from '../userprofile/userprofile.component';
import { ChangepasswordComponent } from '../changepassword/changepassword.component';


const routes: Routes = [ 
    { path: 'ChangePassword', component: ChangepasswordComponent },
    { path: 'Profile', component: UserprofileComponent }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class UserprofileRoutingModule { }