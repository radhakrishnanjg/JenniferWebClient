//core npms  
import { NgModule, NO_ERRORS_SCHEMA, } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

//kendo
import { GridModule, ExcelModule as GridExcelModule, PDFModule as gridPDFModule } from '@progress/kendo-angular-grid';
import { PopupModule } from '@progress/kendo-angular-popup';
import { DropDownListModule, DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { IntlModule } from '@progress/kendo-angular-intl';

import { NgxMaskModule } from 'ngx-mask';
import { DataTablesModule } from 'angular-datatables';
import { PreventDoubleSubmitModule } from 'ngx-prevent-double-submission';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgPipesModule } from 'ngx-pipes';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ListViewModule } from '@progress/kendo-angular-listview';
import { TreeListModule, ExcelModule, PDFModule } from '@progress/kendo-angular-treelist';

import { ProfilelossComponent } from './profileloss/profileloss.component';
import { ItemlevelplComponent } from './itemlevelpl/itemlevelpl.component';

import { ManagementRoutingModule } from './management-routing.module';
import { ProfitAnalysisComponent } from './profit-analysis/profit-analysis.component';
import { MISanalysisComponent } from './misanalysis/misanalysis.component';


@NgModule({
  imports: [
    CommonModule,
    NgxDaterangepickerMd.forRoot(),
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    PreventDoubleSubmitModule.forRoot(),
    FormsModule,
    NgxMaskModule,
    DataTablesModule,
    GridModule,
    PDFModule,
    ExcelModule,
    DropDownListModule,
    DropDownsModule,
    PopupModule,
    IntlModule,
    DateInputsModule,
    PDFExportModule,
    InputsModule,
    ListViewModule,
    TreeListModule,
    NgPipesModule,
    NgbModule,
    NgbTooltipModule,
    ManagementRoutingModule
  ],
  declarations: [
    ProfilelossComponent,
    ItemlevelplComponent,
    ProfitAnalysisComponent,
    MISanalysisComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
  ]
})
export class ManagementModule { }
