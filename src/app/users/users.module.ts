//core npms  
import { NgModule, NO_ERRORS_SCHEMA,   } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 

//kendo
import { GridModule } from '@progress/kendo-angular-grid';  

import { PreventDoubleSubmitModule } from 'ngx-prevent-double-submission';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { CookieService } from 'ngx-cookie-service';   
import { EncrDecrService } from '../_services/service/encr-decr.service'; 

import { UserComponent } from '../users/user/user.component';
import { UserlistComponent } from '../users/userlist/userlist.component';
import { UserpermissionComponent } from '../users/userpermission/userpermission.component'; 
import { CompanydetailsComponent } from './companydetails/companydetails.component';
import { CompanydetaillistComponent } from './companydetaillist/companydetaillist.component'; 
import { CompanyprofileComponent } from './companyprofile/companyprofile.component';
import { UsersRoutingModule } from './users.routing.module';
@NgModule({
    imports: [
        CommonModule,
        // ReactiveFormsModule,
        FormsModule,
        // UserRoutingModule
 
        RouterModule, 
        ReactiveFormsModule, 
        PreventDoubleSubmitModule.forRoot(),
        FormsModule,  
        GridModule, 
        NgxDaterangepickerMd,
        UsersRoutingModule
    ],
    declarations:
        [
            UserComponent,
            UserlistComponent,
            UserpermissionComponent, 
            CompanydetailsComponent,
            CompanydetaillistComponent, 
            CompanyprofileComponent
        ],
    // If you want the components that belong to this module, available to
    // other modules, that import this module, then include all those
    // components in the exports array. Similarly you can also export the
    // imported Angular Modules
    exports: [
        UserComponent, UserlistComponent, UserpermissionComponent,
        ReactiveFormsModule
    ],
    providers: [
        // { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        // { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
        CookieService,
        
        EncrDecrService
    ],

    schemas: [
        NO_ERRORS_SCHEMA,
    ]

})

export class UsersModule { }


