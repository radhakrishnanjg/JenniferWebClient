import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import * as moment from 'moment';
import { Statement } from '../../_services/model/index';
import { StatementService } from '../../_services/service/statement.service';
import { SellerstatementService } from '../../_services/service/sellerstatement.service';
import { saveAs } from 'file-saver';
import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';

@Component({
  selector: 'app-statementlist',
  templateUrl: './statementlist.component.html',
  styleUrls: ['./statementlist.component.css']
})
export class StatementlistComponent implements OnInit {
  obj: Statement;
  identity: number = 0;
  dtOptions: DataTables.Settings = {};
  SearchBy: string = '';
  SearchKeyword: string = '';
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
    private router: Router,
    private _sellerStatementService: SellerstatementService,

    private _authorizationGuard: AuthorizationGuard
  ) { }

  ngOnInit() {
    this.SearchBy = '';
    this.SearchKeyword = '';
    this.selectedDateRange = {
      startDate: moment().subtract(0, 'months').date(1),
      endDate: moment().subtract(1, 'days')
    };

    if (sessionStorage.getItem("IsSaveVideo") == null || sessionStorage.getItem("IsSaveVideo") == undefined) {
      if (sessionStorage.getItem("IsSaveVideo") == "0") {
        $('#myModalvideo').modal('show');
      }
    }
    this.onLoad(this.SearchBy, this.SearchKeyword);
  }

  onChange(range) {
    let startdate: string = range.startDate._d.toISOString().substring(0, 10);
    let enddate: string = range.endDate._d.toISOString().substring(0, 10);
  }

  Search(): void {
    this.onLoad(this.SearchBy, this.SearchKeyword);
  }

  Refresh(): void {
    this.SearchBy = '';
    this.SearchKeyword = '';
  }

  DownloadButtonClick(StatementNumber: string) {
    if (StatementNumber != "") {
      this._sellerStatementService.GenerateStatementFile(StatementNumber)
        .subscribe(data => {
          if (data.Flag == true) {
            this._sellerStatementService.downloadFile(StatementNumber)
              .subscribe(data => {
                this.alertService.success("File downloaded succesfully.!");
                saveAs(data, StatementNumber + '.xls')
              },
                (err) => {
                  console.log(err);
                }
              );
          }
        },
          (err) => {
            console.log(err);
          }
        );


    }
  }

  onLoad(SearchBy: string, Search: string) {
    let startdate: Date = this.selectedDateRange.startDate._d.toISOString().substring(0, 10);
    let enddate: Date = this.selectedDateRange.endDate._d.toISOString().substring(0, 10);
    this._sellerStatementService.Search(SearchBy, Search, startdate, enddate).subscribe(
      (data) => {
        if (data != null) {
          this.items = data;
          this.loadItems();
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  //#region Paging Sorting and Filtering Start
  public allowUnsort = false;
  public sort: SortDescriptor[] = [{
    field: 'StatementDate',
    dir: 'desc'
  }];
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  private items: Statement[] = [] as any;
  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'StatementDate', operator: 'contains', value: '' }]
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
    this.gridView = process(this.items, {
      skip: this.skip,
      take: this.skip + this.pageSize,
      filter: {
        logic: "or",
        filters: [
          {
            field: 'StatementNumber',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'StatementDate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'Stateopbalance',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'AmazonCredits',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'NetRevenue',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'Deductions',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ClosingBalance',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ClosingBalance',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'PayabletoMerchant',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'Status',
            operator: 'contains',
            value: inputValue
          },
        ],
      }
    });
  }
  //#endregion Paging Sorting and Filtering End

}
