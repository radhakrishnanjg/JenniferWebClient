import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangepasswordComponent } from '../userprofile/changepassword/changepassword.component';
import { UserprofileComponent } from '../userprofile/userprofile/userprofile.component';

const routes: Routes = [
  // Userprofile module
  { path: 'ChangePassword', component: ChangepasswordComponent },
  { path: 'Profile', component: UserprofileComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserprofileRoutingModule { }
