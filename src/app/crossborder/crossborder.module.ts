//core
import { RouterModule } from '@angular/router';
import { NgModule, NO_ERRORS_SCHEMA, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { RecaptchaModule ,RecaptchaFormsModule} from 'ng-recaptcha';
import { BlockPasteDirective } from '../_directive/blockpastedirective';

//kendo


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";

//kendo
import { GridModule, PDFModule, ExcelModule } from '@progress/kendo-angular-grid';
import { PopupModule } from '@progress/kendo-angular-popup';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { IntlModule } from '@progress/kendo-angular-intl';

import { PreventDoubleSubmitModule } from 'ngx-prevent-double-submission';
import { MomentModule } from 'ngx-moment';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { SelectDropDownModule } from 'ngx-select-dropdown'
import { EncrDecrService } from '../_services/service/encr-decr.service';
import { CookieService } from 'ngx-cookie-service'; 

import { S1Component } from './s1/s1.component';
import { CataloguelistComponent } from './cataloguelist/cataloguelist.component';
import { CataloguecreateComponent } from './cataloguecreate/cataloguecreate.component'; 
import { CatalogueviewComponent } from './catalogueview/catalogueview.component';
import { IORCataloguelistComponent } from './iorcataloguelist/iorcataloguelist.component';
import { IORCatalogueupdateComponent } from './iorcatalogueupdate/iorcatalogueupdate.component';
import { IORCatalogueviewComponent } from './iorcatalogueview/iorcatalogueview.component';
import { CustomcataloguelistComponent } from './customcataloguelist/customcataloguelist.component';
import { CustomcatalogueupdateComponent } from './customcatalogueupdate/customcatalogueupdate.component';
import { CustomcatalogueviewComponent } from './customcatalogueview/customcatalogueview.component'; 
import { EorcataloguelistComponent } from './eorcataloguelist/eorcataloguelist.component';
import { EorcatalogueviewComponent } from './eorcatalogueview/eorcatalogueview.component';

import { MobilemasterComponent } from './mobilemaster/mobilemaster.component';
import { MobilemasterlistComponent } from './mobilemasterlist/mobilemasterlist.component';
import { MobilemasterviewComponent } from './mobilemasterview/mobilemasterview.component';
import { MobilemasterotpComponent } from './mobilemasterotp/mobilemasterotp.component';
import { MobilemastersellerassignComponent } from './mobilemastersellerassign/mobilemastersellerassign.component'; 
import { SellerlistComponent } from './sellerlist/sellerlist.component'; 
import { SellerapprovalComponent } from './sellerapproval/sellerapproval.component';
import { SellerprofileComponent } from './sellerprofile/sellerprofile.component';
import { CrossborderRoutingModule } from './crossborder-routing.module';
import { PopupAnchorDirective } from './popup.anchor-target.directive';
import { EorsellerlistComponent } from './eorsellerlist/eorsellerlist.component';
import { EorsellerviewComponent } from './eorsellerview/eorsellerview.component';
import { CrossborderuserlistComponent } from './crossborderuserlist/crossborderuserlist.component';
import { CrossborderuserComponent } from './crossborderuser/crossborderuser.component';

import { ChangepasswordComponent } from '../userprofile/changepassword/changepassword.component';
import { UserprofileComponent } from '../userprofile/userprofile/userprofile.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    PreventDoubleSubmitModule.forRoot(),
    MomentModule,
    NgxDaterangepickerMd.forRoot(),
    SelectDropDownModule,
    InputsModule,
    GridModule,
    PDFModule,
    ExcelModule,
    DropDownListModule,
    PopupModule,
    IntlModule,
    DateInputsModule,
    PDFExportModule,
    RecaptchaModule.forRoot(),
    RecaptchaFormsModule,
    CrossborderRoutingModule
  ],
  declarations: [
    BlockPasteDirective,
    PopupAnchorDirective,
    S1Component,
    CataloguelistComponent,
    CataloguecreateComponent, 
    CatalogueviewComponent,
    IORCataloguelistComponent,
    IORCatalogueupdateComponent,
    IORCatalogueviewComponent,
    CustomcataloguelistComponent,
    CustomcatalogueupdateComponent,
    CustomcatalogueviewComponent, 
    EorcataloguelistComponent,
    EorcatalogueviewComponent, 
    MobilemasterComponent,
    MobilemasterlistComponent,
    MobilemasterviewComponent,
    MobilemasterotpComponent,
    MobilemastersellerassignComponent, 
    SellerlistComponent,
    SellerapprovalComponent, 
    SellerprofileComponent, 
    EorsellerlistComponent,
     EorsellerviewComponent, 
    CrossborderuserlistComponent, 
    CrossborderuserComponent,
    // ChangepasswordComponent,
    // UserprofileComponent
  ],

  providers: [

    CookieService,
    EncrDecrService
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
  ]
})
export class CrossborderModule { }
