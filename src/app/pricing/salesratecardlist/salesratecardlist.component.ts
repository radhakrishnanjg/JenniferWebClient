import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { SalesratecardService } from '../../_services/service/salesratecard.service';

import { Salesratecard, Dropdown, Item } from '../../_services/model';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { AuthorizationGuard } from '../../_guards/Authorizationguard';

import * as moment from 'moment';

import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
@Component({
  selector: 'app-salesratecardlist',
  templateUrl: './salesratecardlist.component.html',
  styleUrls: ['./salesratecardlist.component.css']
})
export class SalesratecardlistComponent implements OnInit {

  lstInventoryType: Dropdown[];

  lstItem: Item[] = [] as any;
  lstItemSelected: Item[] = [] as any;
  objItem: Item = {} as any; 
  objSalesratecard: Salesratecard = {} as any;
  salesratecardForm: FormGroup;
  panelTitle: string;
  action: boolean;
  identity: number = 0;
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
    private _salesratecardService: SalesratecardService,
    
    private _authorizationGuard: AuthorizationGuard,
    private fb: FormBuilder,
    private _PrivateutilityService: PrivateutilityService,
  ) { }

  //#region Validation Start
  formErrors = {
    'InventoryType': '',
    'ItemID': '',
    'SellingPrice': '',
    'StartDate': '',
    'EndDate': '',
  };

  // This object contains all the validation messages for this form
  validationMessages = {

    'InventoryType': {
      'required': 'This Field is required.',
    },

    'ItemID': {
      'min': 'This Field is required.',
    },

    'SellingPrice': {
      'required': 'This Field is required.',
      'pattern': 'This Field must be a float value (0.01-1000000.00).',
      'min': 'This Field must be a numeric(0.01-10000000.00).',
      'max': 'This Field must be a numeric(0.01-10000000.00).',
    },

    'StartDate': {
      'required': 'This Field is required.',
      'invalidDate': 'This Field must be date format(MM-DD-YYYY HH:mm).',
    },

    'EndDate': {
      'required': 'This Field is required.',
      'invalidDate': 'This Field must be date format(MM-DD-YYYY HH:mm).',
    },
  };

  logValidationErrors(group: FormGroup = this.salesratecardForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      // if (abstractControl && abstractControl.value && abstractControl.value.length > 0 && !abstractControl.value.replace(/^\s+|\s+$/gm, '').length) {
      //   abstractControl.setValue('');
      // }
      this.formErrors[key] = '';
      if (abstractControl && !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty)) {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }
    });
  }
  //#endregion Validation End

  onChange(range) {
    let startdate: string = range.startDate._d.toISOString().substring(0, 10);
    let enddate: string = range.endDate._d.toISOString().substring(0, 10);
  }
  ngOnInit() {
    this.SearchBy = '';
    this.SearchKeyword = '';
    this.Searchaction = true;
    this.selectedDateRange = { startDate: moment().subtract(0, 'months').date(1), endDate: moment().subtract(1, 'days') };

    let startdate: Date = this.selectedDateRange.startDate._d.toISOString().substring(0, 10);
    let enddate: Date = this.selectedDateRange.endDate._d.toISOString().substring(0, 10);
    this.onLoad(this.SearchBy, this.SearchKeyword, startdate, enddate, this.Searchaction);

    this.panelTitle = 'Add New Sales Rate ';
    this.identity = 0;
    this.salesratecardForm = this.fb.group({

      InventoryType: ['', [Validators.required]],
      ItemID: ['', [Validators.min(1)]],
      SellingPrice: ['', [Validators.required, Validators.min(0.01), Validators.max(1000000), Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")]],

      StartDate: ['', [Validators.required]],
      EndDate: ['', [Validators.required]],
      //IsActive: [0,],
    });

    this.objItem.ItemID = 0;
    this.objItem.ItemCode = 'Select';
    this.lstItemSelected = [] as any;
    this.lstItemSelected.push(this.objItem);
  }

  Search(): void {
    let startdate: Date = this.selectedDateRange.startDate._d.toISOString().substring(0, 10);
    let enddate: Date = this.selectedDateRange.endDate._d.toISOString().substring(0, 10);
    this.onLoad(this.SearchBy, this.SearchKeyword, startdate, enddate, this.Searchaction);
  }

  Refresh(): void {
    this.SearchBy = '';
    this.SearchKeyword = '';
    this.selectedDateRange = { startDate: moment().subtract(0, 'months').date(1), endDate: moment().subtract(1, 'days') };

  }


  private getCurrentServerDateTime() {
    //
    this._PrivateutilityService.getCurrentDate()
      .subscribe(
        (data: Date) => {
          // var mcurrentDate = moment(data, 'YYYY-MM-DD[T]HH:mm').format('MM-DD-YYYY HH:mm').toString();
          // this.salesratecardForm.patchValue({
          //   StartDate: { startDate: new Date(mcurrentDate) },
          // }); 
          this.MinDate = moment(data).add(0, 'days');
          //
        },
        (err: any) => {
          console.log(err);

          //
        }
      );
  }
  newButtonClick() {
    //this.MinDate = moment().add(0, 'days');
    if (this._authorizationGuard.CheckAcess("Salesratecardlist", "ViewEdit")) {
      return;
    }
    this.getCurrentServerDateTime();
    
    //
    this._PrivateutilityService.GetValues('InventoryType')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstInventoryType = data;

          //
        },
        (err: any) => {
          console.log(err);

          //
        }
      );

    //
    this._PrivateutilityService.getItemLevels()
      .subscribe(
        (data: Item[]) => {

          this.lstItem = data.filter(a => a.Type == 'Item');
          //
        },
        (err: any) => {
          console.log(err);
          //
        }
      );

    $('#modalpopup_salesratecard').modal('show');
    this.logValidationErrors();
    this.panelTitle = "Add New Sales Rate";
    this.action = true;

    $('#InventoryType').removeAttr("disabled");

    $('#ItemID').removeAttr("disabled");
    $('#SellingPrice').removeAttr("disabled");

    $('#SellingPrice').val("");

    $('#StartDate').val("");
    $('#EndDate').val("");

  }

  // editButtonClick(id: number) {
  //   this.MinDate = moment().add(0, 'days');
  //   if (this._authorizationGuard.CheckAcess("Salesratecardlist", "ViewEdit")) {
  //     return;
  //   }
  //   //
  //   this._PrivateutilityService.GetValues('InventoryType')
  //     .subscribe(
  //       (data: Dropdown[]) => {
  //         this.lstInventoryType = data;
  //         //
  //       },
  //       (err: any) => {
  //         console.log(err);
  //         //
  //       }
  //     );
  //   //
  //   this._PrivateutilityService.getItemLevels()
  //     .subscribe(
  //       (data: Item[]) => {

  //         this.lstItem = data;
  //         //
  //       },
  //       (err: any) => {
  //         console.log(err);
  //         //
  //       }
  //     );
  // }



  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("Salesratecardlist", "ViewEdit")) {
      return;
    }
    // stop here if form is invalid
    if (this.salesratecardForm.invalid) {
      return;
    }
    let StartDate: Date = new Date(moment(new Date(this.salesratecardForm.controls['StartDate'].value.startDate._d)).format("MM-DD-YYYY HH:mm"));
    let EndDate: Date = new Date(moment(new Date(this.salesratecardForm.controls['EndDate'].value.startDate._d)).format("MM-DD-YYYY HH:mm"));
    let currentdate: Date = new Date(moment(new Date()).format("MM-DD-YYYY HH:mm"));

    // if (currentdate > StartDate) {
    //   this.alertService.error('The StartDate must be greater than or equal to current datetime.!');
    //   return;
    // }
    // else
     if (StartDate > EndDate) {
      this.alertService.error('The EndDate must be greater than or equal to StartDate.!');
      return;
    }
    else if (this.salesratecardForm.controls['ItemID'].value == "") {
      this.alertService.error('Please select atleast one item in a list.!');
      return;
    }
    this.Insert();
  }
  StartDateUpdated(range) {
    this.logValidationErrors();
  }

  EndDateUpdated(range) {
    this.logValidationErrors();
  }

  Insert() {

    this.objSalesratecard.InventoryType = this.salesratecardForm.controls['InventoryType'].value;

    this.objSalesratecard.ItemID = this.salesratecardForm.controls['ItemID'].value;
    this.objSalesratecard.SellingPrice = this.salesratecardForm.controls['SellingPrice'].value;

    this.objSalesratecard.StartDate = this.salesratecardForm.controls['StartDate'].value.startDate._d.toLocaleString();
    this.objSalesratecard.EndDate = this.salesratecardForm.controls['EndDate'].value.startDate._d.toLocaleString();
    var Itemids = this.salesratecardForm.controls['ItemID'].value.map(a => a.ItemID);
    //
    this._salesratecardService.upsert(this.objSalesratecard, Itemids).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          //
          this.alertService.success(data.Msg);
        }
        else {
          //
          this.alertService.error(data.Msg);
        }
        $('#modalpopup_salesratecard').modal('hide');
        let startdate: Date = this.selectedDateRange.startDate._d.toISOString().substring(0, 10);
        let enddate: Date = this.selectedDateRange.endDate._d.toISOString().substring(0, 10);
        this.onLoad(this.SearchBy, this.SearchKeyword, startdate, enddate, this.Searchaction); this.identity = 0;
      },
      (error: any) => {
        //
        console.log(error);
      }
    );


  }

  onLoad(SearchBy: string, Search: string, StartDate: Date, EndDate: Date, IsActive: boolean) {
    //
    return this._salesratecardService.search(SearchBy, Search, StartDate, EndDate, IsActive).subscribe(
      (lst) => {
        if (lst != null) { 
          this.items = lst;
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
    field: 'ItemCode',
    dir: 'asc'
  }];
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  private items: Salesratecard[] = [] as any;
  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'ItemCode', operator: 'contains', value: '' }]
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
            field: 'ItemCode',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'InventoryType',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'SellingPrice',
            operator: 'contains',
            value: inputValue
          }, 
          {
            field: 'StartDate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'EndDate',
            operator: 'contains',
            value: inputValue
          }, 
        ],
      }
    })  ;  
  }
  //#endregion Paging Sorting and Filtering End

}
