import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { DocketNumber } from '../../_services/model';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import * as moment from 'moment';

import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { GoodsReceiptService } from 'src/app/_services/service/goods-receipt.service';
@Component({
  selector: 'app-goodsgateacknowledgement',
  templateUrl: './goodsgateacknowledgement.component.html',
  styleUrls: ['./goodsgateacknowledgement.component.css']
})
export class GoodsgateacknowledgementComponent implements OnInit {

  discountForm: FormGroup;
  panelTitle: string;
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
  MinDate: moment.Moment;
  ItemCode: string = '';
  ItemID: number = 0;
  ConvertToFloat(val) {
    return parseFloat(val).toFixed(2);
  }
  config = {
    displayKey: "ItemCode", //if objects array passed which key to be displayed defaults to description
    search: true,
    // limitTo: 3    
    height: '200px'
  };
  constructor(
    private alertService: ToastrService,
    private _goodsReceiptService: GoodsReceiptService,
    private _authorizationGuard: AuthorizationGuard,
    private fb: FormBuilder,
  ) { }


  onChange(range) {
    let startdate: string = range.startDate._d.toISOString().substring(0, 10);
    let enddate: string = range.endDate._d.toISOString().substring(0, 10);
  }
  ngOnInit() {
    this.SearchBy = '';
    this.SearchKeyword = '';
    this.selectedDateRange = { startDate: moment().subtract(0, 'months').date(1), endDate: moment().subtract(1, 'days') };

    let startdate: string = moment(this.selectedDateRange.startDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();
    let enddate: string = moment(this.selectedDateRange.endDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();

    this.onLoad(this.SearchBy, this.SearchKeyword, startdate, enddate);

    this.discountForm = this.fb.group({
      JenniferItemSerial: ['', []],
    });
  }

  Search(): void {
    let startdate: string = moment(this.selectedDateRange.startDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();
    let enddate: string = moment(this.selectedDateRange.endDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();

    this.onLoad(this.SearchBy, this.SearchKeyword, startdate, enddate);
  }

  Refresh(): void {
    this.SearchBy = '';
    this.SearchKeyword = '';
    this.selectedDateRange = { startDate: moment().subtract(0, 'months').date(1), endDate: moment().subtract(1, 'days') };

  }

  newButtonClick() {
    if (this._authorizationGuard.CheckAcess("GoodsGateAcknowledgement", "ViewEdit")) {
      return;
    }
    this.lstDocketNumber = [];
    $('#modalpopup_discount').modal('show');
    this.panelTitle = "Add New Docket Numbers";
  }
  
  dtOptions: DataTables.Settings = {};
  lstDocketNumber: DocketNumber[] = [] as any;
  objDocketNumber: DocketNumber = {} as any;
  public onJenniferItemSerialChange(value): void {
    if (value != undefined && value != "") {
      if (this.lstDocketNumber.filter(a => a.DocketNumber == value).length > 0) {
        this.alertService.error("Docket Number is already added in the Scanned list.!");
        return;
      }
      else {
        this.objDocketNumber = new DocketNumber();
        this.objDocketNumber.DocketNumber = value;
        this.lstDocketNumber.push(this.objDocketNumber);
        $('#JenniferItemSerial').val('');
        $('#JenniferItemSerial').focus();
        this.dtOptions = {
          "scrollY": "200px",
          "scrollCollapse": true,
          "paging": false,
          "ordering": false,
          "searching": false
        };
      }
    }
  }

  removeRow(index): void {
    this.lstDocketNumber.splice(index, 1);
  }
  JenniferItemSerial: string = '';
  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("GoodsGateAcknowledgement", "ViewEdit")) {
      return;
    }
    if (this.lstDocketNumber.filter(a => a.DocketNumber != "").length == 0) {
      this.alertService.error('Required Jennifer Item Serial Numbers!');
      return;
    }
    else {
      this._goodsReceiptService.DocketNumberAction(this.lstDocketNumber).subscribe(
        (data) => {
          if (data && data.Flag == true) {
            this.alertService.success(data.Msg);
            $('#modalpopup_discount').modal('hide');
            let startdate: string = moment(this.selectedDateRange.startDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();
            let enddate: string = moment(this.selectedDateRange.endDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();
            this.onLoad(this.SearchBy, this.SearchKeyword, startdate, enddate);
          }
          else {
            this.alertService.error(data.Msg);
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  onLoad(SearchBy: string, Search: string, StartDate: string, EndDate: string) {
    return this._goodsReceiptService.DocketNumberSearch(SearchBy, Search, StartDate, EndDate).subscribe(
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

  //#region Paging Sorting and Filtering Start
  public allowUnsort = false;
  public sort: SortDescriptor[] = [{
    field: 'DocketNumber',
    dir: 'asc'
  }];
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private items: DocketNumber[] = [] as any;
  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'DocketNumber', operator: 'contains', value: '' }]
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
            field: 'DocketNumber',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ScannedDate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'CreatedByName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'CreatedDate',
            operator: 'contains',
            value: inputValue
          },
        ],
      }
    });
  }

  //#endregion Paging Sorting and Filtering End

}
