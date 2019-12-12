//core npms  
import { NgModule, NO_ERRORS_SCHEMA,   } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

//kendo
import { GridModule } from '@progress/kendo-angular-grid';

import { PreventDoubleSubmitModule } from 'ngx-prevent-double-submission';
import { MomentModule } from 'ngx-moment';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { EncrDecrService } from '../_services/service/encr-decr.service';
import { CookieService } from 'ngx-cookie-service';
 
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


//compeonted

import { AllotmentComponent } from './allotment/allotment.component';
import { AllotmentlistComponent } from './allotmentlist/allotmentlist.component';
import { ManagementComponent } from './management/management.component';
import { ManagementlistComponent } from './managementlist/managementlist.component';
import { ManagementviewComponent } from './managementview/managementview.component';
import { TransferlistComponent } from './transferlist/transferlist.component';
import { TransferComponent } from './transfer/transfer.component';
import { ReplicationlistComponent } from './replicationlist/replicationlist.component';
import { ReplicationComponent } from './replication/replication.component'; 

import { CasesRoutingModule } from '../cases/cases.routing.module';

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
    GridModule,
    CasesRoutingModule,
  ],

  declarations: [
    SafeHtmlPipe,
    AllotmentComponent,
    AllotmentlistComponent,
    ManagementComponent,
    ManagementlistComponent,
    ManagementviewComponent,
    TransferlistComponent,
    TransferComponent,
    ReplicationlistComponent,
    ReplicationComponent],

  providers: [
    CookieService,
    EncrDecrService
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
  ]
})
export class CasesModule { }
