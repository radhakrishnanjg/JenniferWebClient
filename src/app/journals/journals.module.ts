//core
import { RouterModule } from '@angular/router';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupAnchorDirective } from './sto/popup.anchor-target.directive';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

//kendo
import { GridModule, PDFModule, ExcelModule } from '@progress/kendo-angular-grid';
import { PopupModule } from '@progress/kendo-angular-popup';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns'; 
import { InputsModule } from '@progress/kendo-angular-inputs';

import { PreventDoubleSubmitModule } from 'ngx-prevent-double-submission';
import { EncrDecrService } from '../_services/service/encr-decr.service';
import { CookieService } from 'ngx-cookie-service';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgxMaskModule } from 'ngx-mask';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MomentModule } from 'ngx-moment';
import { ToastrModule } from 'ngx-toastr';
import { NgxTypeaheadModule } from 'ngx-typeahead';

import { StoListComponent } from './sto-list/sto-list.component';
import { StoComponent } from './sto/sto.component';
import { StoviewComponent } from './stoview/stoview.component';
import { StoeditComponent } from './stoedit/stoedit.component'; 
import { JournalsRoutingModule } from './journals.routing.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    GridModule,
    PDFModule,
    ExcelModule,
    FormsModule,
    ReactiveFormsModule,
    PopupModule,
    DropDownListModule,
    InputsModule,
    PreventDoubleSubmitModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    }),
    MomentModule,
    NgxDaterangepickerMd.forRoot(),
    NgxMaskModule.forRoot(),
    NgbModule,
    NgxTypeaheadModule,
    JournalsRoutingModule
  ],
  declarations: [
    PopupAnchorDirective,
    StoListComponent,
    StoComponent,
    StoviewComponent,
    StoeditComponent,
  ],
  providers: [
    CookieService,
    EncrDecrService
  ],

  schemas: [
    NO_ERRORS_SCHEMA,
  ]
})
export class JournalsModule { }
