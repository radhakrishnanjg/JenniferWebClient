//core npms  
import { NgModule, NO_ERRORS_SCHEMA,   } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
import { EncrDecrService } from '../_services/service/encr-decr.service';

//only for this module
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
@Pipe({
  name: 'safeHtml',
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(html) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}

import { HelpnavigationComponent } from './helpnavigation/helpnavigation.component';
import { HelpmenulistComponent } from './helpmenulist/helpmenulist.component';
import { HelpmenuComponent } from './helpmenu/helpmenu.component';


import { HelpRoutingModule } from './/help.routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule, 
    ReactiveFormsModule, 
    //third party
    AngularFontAwesomeModule,
    DataTablesModule,

    NgxSpinnerModule,
    FormsModule, 
    PreventDoubleSubmitModule.forRoot(),
    MomentModule,
    NgxDaterangepickerMd.forRoot(),
    DeviceDetectorModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 5000,
      //positionClass: 'toast-bottom-right',
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    }),

    NgxMaskModule.forRoot(),
    SelectDropDownModule,
    NgxTypeaheadModule,
    //kendo
    GridModule,
    InputsModule,
    DropDownListModule,
    PopupModule,
    NgbModule,
    Ng2SearchPipeModule,
    EditorModule,
    HelpRoutingModule
  ],
  declarations: [
    SafeHtmlPipe,
    HelpnavigationComponent,
    HelpmenulistComponent,
    HelpmenuComponent,
  ],
  providers: [
    CookieService,
    EncrDecrService
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
  ]
})
export class HelpModule { }
