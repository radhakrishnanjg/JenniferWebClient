import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AmazonautortvService } from '../../_services/service/amazonautortv.service';
import { ProductTaxCode, ProductTaxCodeMaster } from '../../_services/model';

import { AuthorizationGuard } from '../../_guards/Authorizationguard';
import * as moment from 'moment';
import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-product-taxcode',
  templateUrl: './product-taxcode.component.html',
  styleUrls: ['./product-taxcode.component.css']
})
export class ProductTaxcodeComponent implements OnInit {

  lst: ProductTaxCode[];
  obj: ProductTaxCode = {} as any;
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
    private _amazonautortvService: AmazonautortvService,
    private _authorizationGuard: AuthorizationGuard,
    private fb: FormBuilder,
  ) { }

  action: boolean;
  panelTitle: string;
  Configurationform: FormGroup;
  ngOnInit() {
    this.panelTitle = 'Add New Tax Upload';
    this.action = true;
    this.SearchBy = '';
    this.SearchKeyword = '';
    this.selectedDateRange = { startDate: moment().subtract(0, 'months').date(1), endDate: moment().subtract(1, 'days') };

    this.onLoad(this.SearchBy, this.SearchKeyword);
    this.Configurationform = this.fb.group({
      // FromLocationID: [0, [Validators.min(1),]], 
    });
    this.LoadProductTaxCodeMaster();

  }
  newButtonClick() {
    this.action = !this.action;
  }

  BackButtonClick() {
    this.action = !this.action;
    this.onLoad(this.SearchBy, this.SearchKeyword);
    
  }

  onDownloadTemplate() {
    this._amazonautortvService.AmazonProductTaxCodeDownloadTemplate().subscribe(
      (data: ProductTaxCode[]) => {
        if (data.length > 0) {
          this._amazonautortvService.exportAsExcelFile(data, "InventoryDetail");
        }
        else {
          this.alertService.error('No Records Found!');
        }
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  isInArray(array, word) {
    return array.indexOf(word.toLowerCase()) > -1;
  }
  flag: boolean = true;
  selectedFile: File;
  errorMsg: string = '';
  storeData: any;
  worksheet0: any;
  onFileChanged(e: any) {
    this.errorMsg = '';
    this.selectedFile = e.target.files[0];
    this.readExcel();
  }

  readExcel() {
    let readFile = new FileReader();
    readFile.onload = (e) => {
      this.storeData = readFile.result;
      var data = new Uint8Array(this.storeData);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      this.worksheet0 = workbook.Sheets[first_sheet_name];
    }
    readFile.readAsArrayBuffer(this.selectedFile);
  }
  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("ProductTaxcode", "ViewEdit")) {
      return;
    }
    if (this.selectedFile == null) {
      this.alertService.error('Please select File.!');
      return;
    }
    // stop here if form is invalid
    if (this.Configurationform.invalid) {
      return;
    }
    this.Insert();
  }
  // ViewChild is used to access the input element. 

  @ViewChild('takeInput', {})

  // this InputVar is a reference to our input. 

  InputVar: ElementRef;
  Insert() {
    this.obj.JsonData = JSON.stringify(XLSX.utils.sheet_to_json(this.worksheet0, { raw: false }));
    this.obj.Action = "I";
    this._amazonautortvService.AmazonProductTaxCodeAction(this.obj).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.errorMsg = '';
          this.flag = data.Flag;
          this.alertService.success(data.Msg);
          this.action = !this.action;
          this.onLoad(this.SearchBy, this.SearchKeyword);
        }
        else {
          this.errorMsg = data.Msg;
          this.flag = data.Flag;
          this.InputVar.nativeElement.value = "";
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  Search(): void {
    this.onLoad(this.SearchBy, this.SearchKeyword);
  }

  Refresh(): void {
    this.SearchBy = '';
    this.SearchKeyword = '';
  }

  onChange(range) {
    let startdate: string = range.startDate._d.toISOString().substring(0, 10);
    let enddate: string = range.endDate._d.toISOString().substring(0, 10);
  }

  onLoad(SearchBy: string, Search: string,) {
    let startdate: string = moment(this.selectedDateRange.startDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();
    let enddate: string = moment(this.selectedDateRange.endDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();
    return this._amazonautortvService.AmazonProductTaxCodeSearch(SearchBy, Search, startdate, enddate).subscribe(
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
  lstTaxMaster: ProductTaxCodeMaster[] = [] as any;
  LoadProductTaxCodeMaster() {
    return this._amazonautortvService.AmazonProductTaxCodeMaster().subscribe(
      (lst: ProductTaxCodeMaster[]) => {
        this.lstTaxMaster = lst; 
      },
      (err) => { 
        console.log(err);
      }
    );
  }

  public allowUnsort = false;
  public sort: SortDescriptor[] = [{
    field: 'StoreName',
    dir: 'asc'
  }];
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  private items: ProductTaxCode[] = [] as any;
  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'StoreName', operator: 'contains', value: '' }]
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
            field: 'StoreName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'SKU',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ProductTaxCode',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'CreatedByName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'CreationDate',
            operator: 'contains',
            value: inputValue
          },

        ],
      }
    });
  }


}
