//core
import { RouterModule } from '@angular/router';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";

//kendo
import { GridModule, PDFModule, ExcelModule } from '@progress/kendo-angular-grid';
//other module
import { DataTablesModule } from 'angular-datatables';
import { PreventDoubleSubmitModule } from 'ngx-prevent-double-submission';
import { NgxMaskModule } from 'ngx-mask';
//service
import { EncrDecrService } from '../_services/service/encr-decr.service';
import { CookieService } from 'ngx-cookie-service';

//Component
import { EmailconfigComponent } from './emailconfig/emailconfig.component';
import { ContactlistComponent } from './contactlist/contactlist.component';
import { ContactComponent } from './contact/contact.component';

//routing module
import { EmailConfigurationRoutingModule } from './emailconfiguration.routing.module'


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
    GridModule,

    GridModule,  
    PDFModule,
    ExcelModule,
    DataTablesModule,
    PreventDoubleSubmitModule.forRoot(),
    NgxMaskModule.forRoot(),
    EmailConfigurationRoutingModule,
  ],

  declarations: [
    SafeHtmlPipe,
    EmailconfigComponent,
    ContactComponent,
    ContactlistComponent,
  ],
  providers: [
    CookieService,
    EncrDecrService
  ],

  schemas: [
    NO_ERRORS_SCHEMA,
  ]
})
export class EmailconfigurationModule { }
