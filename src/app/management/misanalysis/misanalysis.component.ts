import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as moment from 'moment';
import { DashboardoneService } from 'src/app/_services/service/dashboardone.service';
import { GroupDescriptor, DataResult } from '@progress/kendo-data-query';
import { ToastrService } from 'ngx-toastr';
import { DownloadService } from 'src/app/_services/service/download.service';
import { RowClassArgs } from '@progress/kendo-angular-grid';
import { Employee, employees, filesdata } from './Employeee';
import { TreeListComponent } from '@progress/kendo-angular-treelist';

@Component({
  selector: 'app-misanalysis',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './misanalysis.component.html',
  styleUrls: ['./misanalysis.component.css']
})
export class MISanalysisComponent implements OnInit {
  SearchBy: string;
  SearchKeyword: string;
  selectedDateRange: any;
  Searchranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  }
  constructor(
    public _dashboard1Service: DashboardoneService,
    public _alertService: ToastrService,
    private _DownloadService: DownloadService,) { }

  ngOnInit() {

    this.SearchBy = 'Summary';
    this.SearchKeyword = '';
    this.selectedDateRange = {
      startDate: moment().subtract(0, 'months').date(1),
      endDate: moment().subtract(1, 'days')
    };

    this.onLoad(this.SearchBy, this.SearchKeyword);
  }
  public rowCallback(context: RowClassArgs) {
    //grid
    // const classname = context.dataItem.Style;
    // return classname;
    const classname = context.dataItem.Levels;
    return classname;
  }
  public exportToExcel(treelist: TreeListComponent): void {
    treelist.saveAsExcel();
  }
  Search(): void {
    if (this.SearchBy == 'ItemLevel' && this.SearchKeyword == '') {
      this._alertService.error("Please enter ASIN!.");
      return;
    }
    else {
      this.onLoad(this.SearchBy, this.SearchKeyword);
    }
  }
  ExportTOExcel() {
    var re = / /gi;
    this._DownloadService.exportAsExcelFile(this.JSONdata, this.SearchBy.replace(re, "_"));
  }

  onChange(range) {
    let startdate: string = range.startDate._d.toISOString().substring(0, 10);
    let enddate: string = range.endDate._d.toISOString().substring(0, 10);
  }

  Refresh(): void {
    this.SearchBy = 'Summary';
    this.SearchKeyword = '';
  }

  JSONdata: any = [] as any;
  keys: any = [] as any;
  captions: any = [] as any;
  public employees: any[] = employees;
  public filesdata: any[] = filesdata;
  onLoad(SearchBy: string, Search: string) {
    let startdate: string = moment(this.selectedDateRange.startDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();
    let enddate: string = moment(this.selectedDateRange.endDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();
    return this._dashboard1Service.GetMISPresentation(SearchBy, Search, startdate, enddate).subscribe(
      (data: any[]) => {
        if (data != null) {
          this.JSONdata = data;
          this.keys = Object.keys(this.JSONdata[0]); // Get the column names
          this.captions = [] as any;
          this.keys.forEach(element => {
            if (!(element == 'Descriptions' || element == 'Levels' || element == 'contents'))
              this.captions.push(element)
          });
        }
      },
      (error) => {
        console.log(error);
      }
    )
  }

  public groups: GroupDescriptor[] = [{ field: 'Section' }];
  public gridView: DataResult;

  public groupChange(groups: GroupDescriptor[]): void {
    this.groups = groups;
  }



}
