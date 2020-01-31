import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import * as moment from 'moment';
import { GoodsReceipt } from '../../_services/model/goodsreceipt.model';
import { GoodsReceiptService } from '../../_services/service/goods-receipt.service';
import { saveAs } from 'file-saver';
import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
@Component({
  selector: 'app-goods-receipt-list',
  templateUrl: './goods-receipt-list.component.html',
  styleUrls: ['./goods-receipt-list.component.css']
})
export class GoodsReceiptListComponent implements OnInit {
  obj: GoodsReceipt;
  identity: number = 0;
  deleteColumn: string;
  selectedDeleteId: number;
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
  //#endregion

  constructor(
    private alertService: ToastrService,
    private router: Router,
    private _goodsReceiptService: GoodsReceiptService,
    
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
  }

  editButtonClick(id: number) {
    if (this._authorizationGuard.CheckAcess("Goodsreceiptlist", "ViewEdit")) {
      return;
    }
    this.router.navigate(['/Goodsreceipt', id]);
  }

  viewButtonClick(id: number) {
    if (this._authorizationGuard.CheckAcess("Goodsreceiptlist", "ViewEdit")) {
      return;
    }
    this.router.navigate(['/Goodsreceiptview', id]);
  }

  confirmDeleteid(id: number, DeleteColumnvalue: string) {
    if (this._authorizationGuard.CheckAcess("Goodsreceiptlist", "ViewEdit")) {
      return;
    }
    this.identity = + id;
    this.deleteColumn = DeleteColumnvalue;
    $('#modaldeleteconfimation').modal('show');
  }

  delete() {
    //
    this._goodsReceiptService.Delete(this.identity).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.onLoad(this.SearchBy, this.SearchKeyword);
          this.alertService.success(data.Msg);
        } else {
          this.alertService.error(data.Msg);
        }
        $('#modaldeleteconfimation').modal('hide');
        this.identity = 0;
        //
      },
      (error: any) => {
        //
        console.log(error);
      }
    );
  }

  DownloadButtonClick(GRNNumber: string) {
    if (GRNNumber != "") {
      //
      this._goodsReceiptService.DownloadLabels(GRNNumber)
        .subscribe(data => {
          this.alertService.success("File downloaded succesfully.!");
          
            saveAs(data, GRNNumber + '.zip')
        },
          (err) => {
            //
            console.log(err);
          }
        );
    } else {
    }
  }

  onLoad(SearchBy: string, Search: string) {
    let startdate: Date = this.selectedDateRange.startDate._d.toISOString().substring(0, 10);
    let enddate: Date = this.selectedDateRange.endDate._d.toISOString().substring(0, 10);
    ////
    this._goodsReceiptService.search(SearchBy, Search, startdate, enddate).subscribe(
      (data) => {
        if (data != null) {
          this.items = data;
          this.loadItems(); 
        }
        ////
      },
      (err) => {
        ////
        console.log(err);
      }
    );
  }

  AddNewLink() {
    if (this._authorizationGuard.CheckAcess("Goodsreceiptlist", "ViewEdit")) {
      return;
    }
    this.router.navigate(['/Goodsreceipt/Create',]);
  }

  //#region Paging Sorting and Filtering Start
  public allowUnsort = false;
  public sort: SortDescriptor[] = [{
    field: 'PONumber',
    dir: 'asc'
  }];
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  private items: GoodsReceipt[] = [] as any;
  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'PONumber', operator: 'contains', value: '' }]
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
            field: 'PONumber',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'GRNNumber',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'GRNDate',
            operator: 'contains',
            value: inputValue
          }, 
          {
            field: 'InvoiceNumber',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'LocationName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'VendorName',
            operator: 'contains',
            value: inputValue
          }, 
          {
            field: 'InventoryType',
            operator: 'contains',
            value: inputValue
          }, 
          {
            field: 'GRNStatus',
            operator: 'contains',
            value: inputValue
          }, 
        ],
      }
    })  ;  
  }

  //#endregion Paging Sorting and Filtering End

}
