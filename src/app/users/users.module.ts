import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMaskModule } from 'ngx-mask'
import { ToastrModule } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';


import { SelectDropDownModule } from 'ngx-select-dropdown'
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { DataTablesModule } from 'angular-datatables';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxTypeaheadModule } from 'ngx-typeahead';
import { GridModule } from '@progress/kendo-angular-grid';
import { PopupModule } from '@progress/kendo-angular-popup';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import * as bootstrap from "bootstrap";
import * as $ from "jquery";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PreventDoubleSubmitModule } from 'ngx-prevent-double-submission';
import { MomentModule } from 'ngx-moment';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { InputsModule } from '@progress/kendo-angular-inputs';

import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { JwtInterceptor, HttpErrorInterceptor } from '../_helpers';
import { EncrDecrService } from '../_services/service/encr-decr.service';
import { PopupAnchorDirective } from '../purchaseorder/po/popup.anchor-target.directive';

import { UserComponent } from '../users/user/user.component';
import { UserlistComponent } from '../users/userlist/userlist.component';
import { UserpermissionComponent } from '../users/userpermission/userpermission.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { CompanydetailsComponent } from './companydetails/companydetails.component';
import { CompanydetaillistComponent } from './companydetaillist/companydetaillist.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
@NgModule({
    imports: [
        CommonModule,
        // ReactiveFormsModule,
        FormsModule,
        // UserRoutingModule

        BrowserModule,
        RouterModule, 
        ReactiveFormsModule,
        HttpClientModule,
        AngularFontAwesomeModule,
        DataTablesModule,
        NgxEchartsModule,
        NgxSpinnerModule,
        FormsModule,
        // Prevent double submission module
        PreventDoubleSubmitModule.forRoot(),
        MomentModule,
        NgxDaterangepickerMd.forRoot(),
        DeviceDetectorModule.forRoot(),
        
        // ModalModule.forRoot()
        BrowserAnimationsModule, // required animations module
        ToastrModule.forRoot({
            timeOut: 5000,
            //positionClass: 'toast-bottom-right',
            positionClass: 'toast-top-center',
            preventDuplicates: true,
        }),
        InputsModule,// ToastrModule added,

        NgxMaskModule.forRoot(),
        SelectDropDownModule,
        NgxTypeaheadModule,
        GridModule,
        DropDownListModule,
        PopupModule,
        NgbModule,
        DateInputsModule,
    ],
    declarations:
        [
            UserComponent,
            UserlistComponent,
            UserpermissionComponent,
            ChangepasswordComponent,
            CompanydetailsComponent,
            CompanydetaillistComponent,
            UserprofileComponent
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


