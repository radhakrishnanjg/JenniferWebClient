import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { CustomerreceiptService } from '../../_services/service/customerreceipt.service';
import { CustomerReceiptHeader, CustomerReceiptDetail } from '../../_services/model';
import { AuthorizationGuard } from '../../_guards/Authorizationguard';

import * as moment from 'moment';
import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';

@Component({
  selector: 'app-customerreceiptlist',
  templateUrl: './customerreceiptlist.component.html',
  styleUrls: ['./customerreceiptlist.component.css']
})
export class CustomerreceiptlistComponent implements OnInit {


 obj: CustomerReceiptHeader;
  selectedDeleteId: number;
  deleteColumn: string;
  dtOptions: DataTables.Settings = {};
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
    private router: Router,
    private _customerreceiptService: CustomerreceiptService,

    private _authorizationGuard: AuthorizationGuard
  ) { }

  ngOnInit() {

    this.SearchBy = '';
    this.SearchKeyword = '';
    this.selectedDateRange = {
      startDate: moment().subtract(0, 'months').date(1),
      endDate: moment().subtract(1, 'days')
    };

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
    this.Searchaction = true;
  }

  AddNewPurchaseButtonClick(id: number) {
    if (this._authorizationGuard.CheckAcess("Customerreceiptlist", "ViewEdit")) {
      return;
    }
    this.router.navigate(['/Customerreceipt', id]);
  }

  confirmDeleteid(id: number, DeleteColumnvalue: string) {
    if (this._authorizationGuard.CheckAcess("Customerreceiptlist", "ViewEdit")) {
      return;
    }

    this.selectedDeleteId = + id;
    this.deleteColumn = DeleteColumnvalue;
    $('#modaldeleteconfimation').modal('show');
  }

  delete() {
    this._customerreceiptService.Delete(this.selectedDeleteId).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.onLoad(this.SearchBy, this.SearchKeyword);
          this.alertService.success(data.Msg);
        } else {
          this.alertService.error(data.Msg);
        }
        $('#modaldeleteconfimation').modal('hide');
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  onLoad(SearchBy: string, Search: string, ) {
    let startdate: Date = this.selectedDateRange.startDate._d.toISOString().substring(0, 10);
    let enddate: Date = this.selectedDateRange.endDate._d.toISOString().substring(0, 10);
    return this._customerreceiptService.Search(SearchBy, Search, startdate, enddate).subscribe(
      (lst) => {
        if (lst != null) {
          this.items = lst;
          this.loadItems();
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  AddNewLink() {
    if (this._authorizationGuard.CheckAcess("Customerreceiptlist", "ViewEdit")) {
      return;
    }
    this.router.navigate(['/Customerreceipt/Create',]);
  }

  //#region Paging Sorting and Filtering Start
  public allowUnsort = false;
  public sort: SortDescriptor[] = [{
    field: 'BillNumber',
    dir: 'asc'
  }];

  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  private items: CustomerReceiptHeader[] = [] as any;
  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'BillNumber', operator: 'contains', value: '' }]
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
            field: 'BillNumber',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'CustomerName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'OrderID',
            operator: 'contains',
            value: inputValue
          },

          {
            field: 'TotalReceivedAmount',
            operator: 'contains',
            value: inputValue
          },
          // {
          //   field: 'PendingAmt',
          //   operator: 'contains',
          //   value: inputValue
          // },
          {
            field: 'PaymentMode',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'TransactionNumber',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'TransactionDate',
            operator: 'contains',
            value: inputValue
          },
          // {
          //   field: 'ReceivedAmt',
          //   operator: 'contains',
          //   value: inputValue
          // },
          {
            field: 'Remarks',
            operator: 'contains',
            value: inputValue
          },


        ],
      }
    });
  }

  //#endregion Paging Sorting and Filtering End

}
