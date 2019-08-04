import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
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


import { UserService } from './_services/service/user.service';
import { AuthenticationService } from './_services/service/authentication.service';
import { JwtInterceptor, HttpErrorInterceptor } from './_helpers';
import { EncrDecrService } from './_services/service/encr-decr.service';
// import { PopupAnchorDirective } from './purchaseorder/po/popup.anchor-target.directive';

// Import your library
import { PrivatelayoutComponent } from './privatelayout/privatelayout.component';
import { Dashboard1Component } from './dashboard1/dashboard1.component';

// Import your Module
import { AccountModule } from './account/account.module';
import { UsersModule } from './users/users.module';
import { CustomersModule } from './customers/customers.module';
import { VendorsModule } from './vendors/vendors.module';
import { EmailconfigurationModule } from './emailconfiguration/emailconfiguration.module';
import { PremasterModule } from './premaster/premaster.module';
import { MastersModule } from './masters/masters.module';
import { PurchaseorderModule } from './purchaseorder/purchaseorder.module';
import { SalesModule } from './sales/sales.module';
import { GoodsModule } from './goods/goods.module';
import { DownloadModule } from './download/download.module'; 

@NgModule({
  imports: [
    BrowserModule,
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
    // user defined modules by rk 
    AccountModule,
    UsersModule,
    CustomersModule,
    VendorsModule,
    EmailconfigurationModule,
    PremasterModule,
    MastersModule,
    PurchaseorderModule,
    SalesModule,
    GoodsModule,
    DownloadModule,
    AppRoutingModule,
    DateInputsModule,
  ],
  declarations: [
    AppComponent,
    Dashboard1Component,
    PrivatelayoutComponent, 
    // PopupAnchorDirective,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    CookieService,
    
    EncrDecrService,
    //AuthenticationService
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA,
  ]
})
export class AppModule { }
