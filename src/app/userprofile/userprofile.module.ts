import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { UserprofileRoutingModule } from './userprofile/userprofile.routing.module';

import { UserprofileComponent } from './userprofile/userprofile.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { PreventDoubleSubmitModule } from 'ngx-prevent-double-submission';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule, 
    PreventDoubleSubmitModule.forRoot(),
    UserprofileRoutingModule
  ],
  providers: [ 
  ],
  declarations: [
    UserprofileComponent,
    ChangepasswordComponent, ]
})
export class UserprofileModule { }
