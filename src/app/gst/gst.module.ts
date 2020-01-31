//core
import { RouterModule } from '@angular/router';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask'; 
import { CookieService } from 'ngx-cookie-service';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PreventDoubleSubmitModule } from 'ngx-prevent-double-submission';
import { MomentModule } from 'ngx-moment';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material'; 
 
import { EncrDecrService } from '../_services/service/encr-decr.service';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";


//kendo
import { GridModule, PDFModule, ExcelModule } from '@progress/kendo-angular-grid'; 
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';

@Pipe({
  name: 'safeHtml',
})
export class SafeHtmlPipe implements PipeTransform {
  
constructor(private sanitizer:DomSanitizer){}
  transform(html) {
    
return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}

//component

import { GstComponent } from './gst/gst.component';
import { GstlistComponent } from './gstlist/gstlist.component';
import { GstdownloadComponent } from './gstdownload/gstdownload.component';
import { GstapprovalComponent } from './gstapproval/gstapproval.component';

//module routing
import {GstRoutingModule} from '../gst/gst.routing.module';

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

    NgxMaskModule.forRoot(),
    GridModule,
    PDFModule, 
    ExcelModule,
    DropDownListModule, 
    NgbModule,
    GstRoutingModule
  ],

  declarations: [SafeHtmlPipe, GstComponent, GstlistComponent, GstdownloadComponent, GstapprovalComponent,
   ],
   providers: [
    CookieService,
    EncrDecrService
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
  ]
})
export class GstModule { }
