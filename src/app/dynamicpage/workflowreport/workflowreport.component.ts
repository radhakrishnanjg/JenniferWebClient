import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { DynamicformService } from '../../_services/service/dynamicform.service';

@Component({
  selector: 'app-workflowreport',
  templateUrl: './workflowreport.component.html',
  styleUrls: ['./workflowreport.component.css']
})
export class WorkflowreportComponent implements OnInit {

  RequestFormID: number = 0;
  SearchBy: string = '';
  SearchKeyword: string = '';
  StartDate: string = '';
  EndDate: string = '';
  JSONdata: any = [] as any;
  keys: any = [] as any;
  captions: any = [] as any;
  @ViewChild('TABLE', {}) TABLE: ElementRef;
  FormName: string = '';
  FormType: string = '';
  constructor(
    private alertService: ToastrService,
    private aroute: ActivatedRoute,
    private _DynamicformService: DynamicformService,
  ) { }

  ngOnInit() {
    this.aroute.paramMap.subscribe(params => {
      this.RequestFormID = +params.get('id');
      this.loadFormHeaderOnly();
    });
  }


  loadFormHeaderOnly() {
    this._DynamicformService.GetFormHeader(this.RequestFormID)
      .subscribe(
        (data: string) => {
          this.FormType = JSON.parse(data)[0].FormType;
          this.FormName = JSON.parse(data)[0].FormName;
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  ExportTOExcel() {

    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.TABLE.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    var re = / /gi;
    let xlsname = this.FormName.replace(re, "_")
    XLSX.writeFile(wb, xlsname + '.xlsx');
  }

  Search() {
    if (this.SearchBy == 'FormId' && this.SearchKeyword == '') {
      this.alertService.error('Please enter Form Id');
      return;
    }
    else if (this.SearchBy == 'Status' && this.SearchKeyword == '') {
      this.alertService.error('Please select Form Status');
      return;
    }
    else if (this.SearchBy == 'Date' && (this.StartDate == '' || this.EndDate == '')) {
      this.alertService.error('Please enter Start Date and End Date');
      return;
    }
    else if (new Date(this.StartDate) > new Date(this.EndDate)) {
      this.alertService.error('The Start Date must be greater than or equal to the End Date!');
      return;
    }
    this._DynamicformService.GetDataReport(this.RequestFormID,
      this.SearchBy, this.SearchKeyword,
      this.StartDate, this.EndDate)
      .subscribe(
        (data: string) => {
          this.JSONdata = JSON.parse(data);
          this.keys = Object.keys(JSON.parse(data)[0]); // Get the column names  
          this.captions = [] as any;
          var re = /_/gi;
          this.keys.forEach(element => {
            this.captions.push(element.replace(re, " "))
          });
        },
        (err: any) => {
          console.log(err);
        }
      );
  }
  Reset() {
    this.SearchBy = '';
    this.SearchKeyword = '';
    this.StartDate = '';
    this.EndDate = '';
    this.JSONdata = JSON.parse("[]");
  }

  onchangeSearchBy() {
    this.SearchKeyword = '';
    this.StartDate = '';
    this.EndDate = '';
  }

}
