import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { DownloadService } from '../../_services/service/download.service';
import { AmazonMTR } from '../../_services/model';
import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import * as moment from 'moment';

@Component({
  selector: 'app-report-amazon-mtr',
  templateUrl: './report-amazon-mtr.component.html',
  styleUrls: ['./report-amazon-mtr.component.css']
})
export class ReportAmazonMTRComponent implements OnInit {


  selectedDeleteId: number;
  dtOptions: DataTables.Settings = {};
  deleteColumn: string;
  SearchBy: string = '';
  SearchKeyword: string = '';
  Searchaction: boolean = true;
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
    private alertService: ToastrService,
    private _downloadService: DownloadService,
    
  ) { }

  ngOnInit() {
    this.SearchBy = '';
    this.SearchKeyword = '';
    this.selectedDateRange = { startDate: moment().subtract(0, 'months').date(1), endDate: moment().subtract(1, 'days') };

    let startdate: Date = this.selectedDateRange.startDate._d.toISOString().substring(0, 10);
    let enddate: Date = this.selectedDateRange.endDate._d.toISOString().substring(0, 10);

    this.onLoad(this.SearchBy, this.SearchKeyword, startdate, enddate);
  }
  onChange(range) {
    let startdate: string = range.startDate._d.toISOString().substring(0, 10);
    let enddate: string = range.endDate._d.toISOString().substring(0, 10);
  }
  Search(): void {
    let startdate: Date = this.selectedDateRange.startDate._d.toISOString().substring(0, 10);
    let enddate: Date = this.selectedDateRange.endDate._d.toISOString().substring(0, 10);
    this.onLoad(this.SearchBy, this.SearchKeyword, startdate, enddate);
  }

  Refresh(): void {
    this.SearchBy = '';
    this.SearchKeyword = '';
    this.selectedDateRange = { startDate: moment().subtract(0, 'months').date(1), endDate: moment().subtract(1, 'days') };

  }
  // public removeHandler({ rowIndex }): void {

  //   let selectedItem = this.items[rowIndex];
  //   const DownloadPath = selectedItem.DownloadPath;
  //   //
  //   this._downloadService.downloadAmazonMTR(DownloadPath)
  //     .subscribe(data => {
  //       this.alertService.success('File downloaded successfully.!');
  //       
  //         saveAs(data, DownloadPath.toString());//+ '.csv'
  //     },
  //       (err) => {
  //         //
  //         console.log(err);
  //       }
  //     );
  // }

  public removeHandler(DownloadPath: string, FileName: string): void {
    //
    this._downloadService.downloadAmazonMTR(DownloadPath)
      .subscribe(data => {
        this.alertService.success('File downloaded successfully.!');
        
          saveAs(data, FileName.toString());//+ '.csv'
      },
        (err) => {
          //
          console.log(err);
        }
      );
  }

  onLoad(SearchBy: string, Search: string, StartDate: Date, EndDate: Date) {
    //
    return this._downloadService.getAmazonMTR(SearchBy, Search, StartDate, EndDate).subscribe(
      (data) => {
        if (data != null) {
          this.items = data;
          this.loadItems();
        }
        //
      },
      (err) => {
        //
        console.log(err);
      }
    );
  }

  //#region Paging Sorting and Filtering Start
  public allowUnsort = false;
  public sort: SortDescriptor[] = [{
    field: 'ReportId',
    dir: 'asc'
  }];
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  private items: AmazonMTR[] = [] as any;
  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'ReportId', operator: 'contains', value: '' }]
    }
  };
  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
    this.loadItems();
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.loadSortItems();
  }

  private loadItems(): void {
    this.gridView = {
      data: orderBy(this.items, this.sort).slice(this.skip, this.skip + this.pageSize),
      total: this.items.length
    };
  }
  private loadSortItems(): void {
    this.gridView = {
      data: orderBy(this.items, this.sort).slice(this.skip, this.skip + this.pageSize),
      total: this.items.length
    };
  }
  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.gridView = process(this.items, this.state);
  }

  public onFilter(inputValue: string): void {
    this.gridView = process(this.items.slice(this.skip, this.skip + this.pageSize), {
      skip: this.skip,
      take: this.skip + this.pageSize,
      filter: {
        logic: "or",
        filters: [
          {
            field: 'ReportId',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'FileName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'CreatedDate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'UploadStatus',
            operator: 'contains',
            value: inputValue
          }, 
        ],
      }
    });
  }

}
