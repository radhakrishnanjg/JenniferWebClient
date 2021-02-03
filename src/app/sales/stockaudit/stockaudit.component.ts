import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { PicklistService } from '../../_services/service/picklist.service';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { Picklistdetail, JenniferItemSerials, StockAuditReport, StockAuditStatus, StockExchangeDetail, StockExchangeHeader } from '../../_services/model';

import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
@Component({
  selector: 'app-stockaudit',
  templateUrl: './stockaudit.component.html',
  styleUrls: ['./stockaudit.component.css']
})
export class StockauditComponent implements OnInit {
  picklistForm: FormGroup;
  lstPicklistdetail: JenniferItemSerials[] = [] as any;
  objPicklistdetail: JenniferItemSerials = {} as any;
  panelTitle: string = 'PickList Detail';
  OrderID: string = '';
  LocationName: string = '';
  InventoryType: string = '';
  Status: string = '';
  identity: number = 0;
  JenniferItemSerial: string = '';
  Btnenable: boolean = false;
  PicklistQty: number = 0;
  CheckCountvalue: boolean = false;
  dtOptions: DataTables.Settings = {};
  constructor(private alertService: ToastrService,
    private router: Router,
    private _picklistService: PicklistService,
    private fb: FormBuilder,
    private _authorizationGuard: AuthorizationGuard,
    private aroute: ActivatedRoute,) { }


  stockauditForm: FormGroup;
  stockexchangeForm: FormGroup;
  ngOnInit() {
    this.stockauditForm = this.fb.group({
      JenniferItemSerial1: ['', []],
    });
    this.stockexchangeForm = this.fb.group({
      JenniferItemSerial_StockExchange: ['', []],
    });
    this.onLoadStockExchangeHistory(this.SearchBy, this.SearchKeyword);
  }

  public onJenniferItemSerialChange(value): void {
    if (value != undefined && value != "") {
      if (this.lstPicklistdetail.filter(a => a.JenniferItemSerial == value).length > 0) {
        this.alertService.error("Jennifer Item Serial Number is already added in the Scanned list.!");
        return;
      }
      else {
        this.objPicklistdetail = new Picklistdetail();
        this.objPicklistdetail.JenniferItemSerial = value;
        this.lstPicklistdetail.push(this.objPicklistdetail);
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
    this.lstPicklistdetail.splice(index, 1);
  }
  gridView_StockAuditReport: StockAuditReport[] = [] as any;
  Process(): void {
    if (this._authorizationGuard.CheckAcess("StockAudit", "ViewEdit")) {
      return;
    }
    if (this.lstPicklistdetail.filter(a => a.JenniferItemSerial != "").length == 0) {
      this.alertService.error('Required Jennifer Item Serial Numbers!');
      return;
    }
    else {
      this._picklistService.StockAuditCheck(this.lstPicklistdetail).subscribe(
        (data1: StockAuditReport[]) => {
          if (data1 != null) {
            this.gridView_StockAuditReport = data1;
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }
  ErrorMessage: string = '';
  gridView_StockAuditStatus: StockAuditStatus[] = [] as any;
  CheckStatus(): void {
    if (this._authorizationGuard.CheckAcess("StockAudit", "ViewEdit")) {
      return;
    }
    let JenniferItemSerial1 = this.stockauditForm.controls['JenniferItemSerial1'].value;
    if (JenniferItemSerial1 == '') {
      this.alertService.error('Required Jennifer Item Serial Number!');
      return;
    }
    else {
      this._picklistService.StockAuditCheckStatus(JenniferItemSerial1).subscribe(
        (data1: StockAuditStatus[]) => {
          if (data1 != null && data1.length > 0) {
            this.gridView_StockAuditStatus = data1;
            this.ErrorMessage = '';
          }
          else {
            this.ErrorMessage = 'Invalid Jennifer Serial Number';
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  //#region Stock Exchange

  JenniferItemSerial_StockExchange: string = '';
  lstPicklistdetail_StockExchange: JenniferItemSerials[] = [] as any;
  public onJenniferItemSerialChange_StockExchange(value): void {
    if (value != undefined && value != "") {
      if (this.lstPicklistdetail_StockExchange.filter(a => a.JenniferItemSerial == value).length > 0) {
        this.alertService.error("Jennifer Item Serial Number is already added in the Scanned list.!");
        return;
      }
      else {
        this.objPicklistdetail = new Picklistdetail();
        this.objPicklistdetail.JenniferItemSerial = value;
        this.lstPicklistdetail_StockExchange.push(this.objPicklistdetail);
        $('#JenniferItemSerial_StockExchange').val('');
        $('#JenniferItemSerial_StockExchange').focus();
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

  removeRow_StockExchange(index): void {
    this.lstPicklistdetail_StockExchange.splice(index, 1);
  }
  gridView_StockExchange: StockExchangeDetail[] = [] as any;
  StockExchangeProcess(): void {
    if (this._authorizationGuard.CheckAcess("StockAudit", "ViewEdit")) {
      return;
    }
    if (this.lstPicklistdetail_StockExchange.filter(a => a.JenniferItemSerial != "").length == 0) {
      this.alertService.error('Required Jennifer Item Serial Numbers!');
      return;
    }
    else {
      this._picklistService.StockExchangeProcess(this.lstPicklistdetail_StockExchange).subscribe(
        (data1: StockExchangeDetail[]) => {
          if (data1 != null) {
            this.gridView_StockExchange = data1;
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }
  obj: StockExchangeHeader = {} as any;
  StockExChangeSave(): void {
    if (this._authorizationGuard.CheckAcess("StockAudit", "ViewEdit")) {
      return;
    }
    if (this.gridView_StockExchange.filter(a => a.JenniferItemSerial != "").length == 0) {
      this.alertService.error('Required Jennifer Item Serial Numbers!');
      return;
    }
    else {
      this.obj = new StockExchangeHeader();
      this.obj.lstSerialNums = this.gridView_StockExchange;
      this._picklistService.StockExChangeSave(this.obj).subscribe(
        (data) => {
          if (data != null && data.Flag == true) {
            this.alertService.success(data.Msg);
            this.lstPicklistdetail_StockExchange = [];
            this.gridView_StockExchange = [];
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
  SearchBy: string = '';
  SearchKeyword: string = '';
  Search(): void {
    this.onLoadStockExchangeHistory(this.SearchBy, this.SearchKeyword);
  }

  Refresh(): void {
    this.SearchBy = '';
    this.SearchKeyword = '';
  }
  onLoadStockExchangeHistory(SearchBy: string, Search: string,) {
    return this._picklistService.StockExChangeHistory(SearchBy, Search,).subscribe(
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
    field: 'ActionDate',
    dir: 'desc'
  }];
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  private items: StockExchangeDetail[] = [] as any;
  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'ActionDate', operator: 'contains', value: '' }]
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
            field: 'ActionDate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'LocationName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'JenniferItemSerial',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ItemCode',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ItemName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'InventoryType',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'NewInventoryType',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ActionBy',
            operator: 'contains',
            value: inputValue
          } 
        ],
      }
    });
  }

  //#endregion Paging Sorting and Filtering End
  //#endregion
}
