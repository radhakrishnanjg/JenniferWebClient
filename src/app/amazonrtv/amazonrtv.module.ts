//core

import { RouterModule } from '@angular/router';
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CookieService } from 'ngx-cookie-service';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { EncrDecrService } from '../_services/service/encr-decr.service';


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
import { PopupAnchorDirective } from './configurationinvoice/popup.anchor-target.directive';

//Componenet
import { ConfigurationComponent } from './configuration/configuration.component';
import { ConfigurationlistComponent } from './configurationlist/configurationlist.component';
import { OrderlistComponent } from './orderlist/orderlist.component';
import { RtvtransitlistComponent } from './rtvtransitlist/rtvtransitlist.component';
import { ConfigurationmanualComponent } from './configurationmanual/configurationmanual.component';
import { ConfigurationapprovalComponent } from './configurationapproval/configurationapproval.component';
import { ConfigurationviewComponent } from './configurationview/configurationview.component';
import { ConfigurationinvoiceComponent } from './configurationinvoice/configurationinvoice.component';
import { ProductTaxcodeComponent } from './product-taxcode/product-taxcode.component';

//routing module
import { AmazonrtvRoutingModule } from '../amazonrtv/amazonrtv.routing.module';
import { DomSanitizer } from '@angular/platform-browser';
@Pipe({
  name: 'safeHtml',
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(html) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    PreventDoubleSubmitModule.forRoot(),
    MomentModule,
    NgxDaterangepickerMd.forRoot(),
    InputsModule,
    GridModule,
    PDFModule,
    ExcelModule,
    DropDownListModule,
    PopupModule,
    IntlModule,
    DateInputsModule,
    PDFExportModule,
    AmazonrtvRoutingModule
  ],
  declarations: [
    SafeHtmlPipe,
    PopupAnchorDirective,
    ConfigurationComponent,
    ConfigurationlistComponent,
    OrderlistComponent,
    RtvtransitlistComponent,
    ConfigurationmanualComponent,
    ConfigurationapprovalComponent,
    ConfigurationviewComponent,
    ConfigurationinvoiceComponent,
    ProductTaxcodeComponent,
  ],

  providers: [
    CookieService,
    EncrDecrService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA,
  ]
})
export class AmazonrtvModule { }
