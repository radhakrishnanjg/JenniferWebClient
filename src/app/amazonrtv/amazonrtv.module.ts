//core

import { RouterModule } from '@angular/router';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask'

import { CookieService } from 'ngx-cookie-service';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { EncrDecrService } from '../_services/service/encr-decr.service';

//kendo
import { GridModule } from '@progress/kendo-angular-grid';

import { PreventDoubleSubmitModule } from 'ngx-prevent-double-submission';
import { MomentModule } from 'ngx-moment';

//Componenet
import { ConfigurationComponent } from './configuration/configuration.component';
import { ConfigurationlistComponent } from './configurationlist/configurationlist.component';
import { OrderlistComponent } from './orderlist/orderlist.component';
import { RtvtransitlistComponent } from './rtvtransitlist/rtvtransitlist.component';

//routing module
import { AmazonrtvRoutingModule } from '../amazonrtv/amazonrtv.routing.module';

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
    AmazonrtvRoutingModule
  ],
  declarations: [
    ConfigurationComponent,
    ConfigurationlistComponent,
    OrderlistComponent,
    RtvtransitlistComponent
  ],

  providers: [
    CookieService,
    EncrDecrService
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
  ]
})
export class AmazonrtvModule { }
