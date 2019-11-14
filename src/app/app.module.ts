//core npms 
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//third party npms 
import { NgxMaskModule } from 'ngx-mask'
import { ToastrModule } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { SelectDropDownModule } from 'ngx-select-dropdown'
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { DataTablesModule } from 'angular-datatables';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxTypeaheadModule } from 'ngx-typeahead';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PreventDoubleSubmitModule } from 'ngx-prevent-double-submission';
import { MomentModule } from 'ngx-moment';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { RecaptchaModule } from 'ng-recaptcha';
import * as bootstrap from "bootstrap";
import * as $ from "jquery";
//kendo
import { GridModule } from '@progress/kendo-angular-grid';
import { PopupModule } from '@progress/kendo-angular-popup';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { EditorModule } from '@progress/kendo-angular-editor';
import { ChartsModule } from '@progress/kendo-angular-charts';

import { JwtInterceptor, HttpErrorInterceptor, LoaderInterceptor } from './_helpers';
import { EncrDecrService } from './_services/service/encr-decr.service';
// import { PopupAnchorDirective } from './purchaseorder/po/popup.anchor-target.directive';

// Import your library
import { PrivatelayoutComponent } from './privatelayout/privatelayout.component';
import { TermsofuseComponent } from './termsofuse/termsofuse.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
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
import { HelpModule } from './help/help.module';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { SearchComponent } from './search/search.component';
import { IndexComponent } from './index/index.component';


import { CasesModule } from './cases/cases.module';
import 'hammerjs';
import { DynamicformComponent } from './dynamicform/dynamicform.component';


@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    RecaptchaModule.forRoot(),
    BrowserAnimationsModule,
    FormsModule,

    AngularFontAwesomeModule,
    DataTablesModule,

    NgxSpinnerModule,
    PreventDoubleSubmitModule.forRoot(),
    MomentModule,
    NgxDaterangepickerMd.forRoot(),
    DeviceDetectorModule.forRoot(),

    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    }),
    NgxMaskModule.forRoot(),
    SelectDropDownModule,
    NgxTypeaheadModule,
    NgbModule,

    //kendo
    GridModule,
    PDFExportModule,
    InputsModule,
    DropDownListModule,
    PopupModule,
    DateInputsModule,
    EditorModule,
    ChartsModule,
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
    // HelpModule,
    //CasesModule,
    AppRoutingModule,

  ],
  declarations: [
    AppComponent,
    Dashboard1Component,
    PrivatelayoutComponent,
    MaintenanceComponent,
    SearchComponent,
    DynamicformComponent,
    TermsofuseComponent,
    PrivacyPolicyComponent,
    IndexComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    CookieService,

    EncrDecrService,
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA,
  ]
})
export class AppModule { }
