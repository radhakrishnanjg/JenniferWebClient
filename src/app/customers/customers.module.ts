//core
import { NgModule, NO_ERRORS_SCHEMA,   } from '@angular/core'; 
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 

//kendo
import { GridModule, PDFModule, ExcelModule } from '@progress/kendo-angular-grid';

import { PreventDoubleSubmitModule } from 'ngx-prevent-double-submission';
import { NgxMaskModule } from 'ngx-mask';
import { EncrDecrService } from '../_services/service/encr-decr.service';
import { CookieService } from 'ngx-cookie-service';  

//Compoent

import { CustomerComponent } from './customer/customer.component';
import { CustomerlistComponent } from './customerlist/customerlist.component';
import { CustomerwarehouseComponent } from './customerwarehouse/customerwarehouse.component';
import { CustomerwarehouselistComponent } from './customerwarehouselist/customerwarehouselist.component';
import { CustomeritemlistComponent } from './customeritemlist/customeritemlist.component';

//routing 
import { CustomersRoutingModule } from './customers.routing.module'
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
  
    PreventDoubleSubmitModule.forRoot(), 
    NgxMaskModule.forRoot(),
    GridModule,  
    PDFModule, 
    ExcelModule,
    CustomersRoutingModule
  ],
  declarations: [
    CustomerComponent,
    CustomerlistComponent,
    CustomeritemlistComponent,
    CustomerwarehouseComponent,
    CustomerwarehouselistComponent
  ],
  providers: [
    CookieService,
    EncrDecrService
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
  ]
})
export class CustomersModule { }
