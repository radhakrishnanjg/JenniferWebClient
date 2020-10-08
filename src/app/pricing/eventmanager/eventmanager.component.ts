import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { Item, Marketplace, Companydetails, EventManager } from '../../_services/model';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import * as moment from 'moment';

import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { AuthenticationService } from 'src/app/_services/service/authentication.service';
import { SalesratecardService } from 'src/app/_services/service/salesratecard.service';

@Component({
  selector: 'app-eventmanager',
  templateUrl: './eventmanager.component.html',
  styleUrls: ['./eventmanager.component.css']
})
export class EventmanagerComponent implements OnInit {

  lstItem: Item[] = [] as any;
  lstItemSelected: Item[] = [] as any;
  objItem: Item = {} as any;
  discountForm: FormGroup;
  panelTitle: string;
  action: boolean;
  identity: number = 0;
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
    private _discountService: SalesratecardService,
    private _authorizationGuard: AuthorizationGuard,
    private fb: FormBuilder,
    private _PrivateutilityService: PrivateutilityService,
    private authenticationService: AuthenticationService,
  ) { }


  //#region Validation Start
  formErrors = {
    'MarketplaceID': '',
    'CompanyDetailID': '',
    'ItemID': '',
    'StartDate': '',
    'EndDate': '',
  };

  // This object contains all the validation messages for this form
  validationMessages = {

    'MarketplaceID': {
      'min': 'This Field is required.',
    },
    'CompanyDetailID': {
      'min': 'This Field is required.',
    },
    'ItemID': {
      'required': 'This Field is required.',
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

  logValidationErrors(group: FormGroup = this.discountForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
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
    this.selectedDateRange = { startDate: moment().subtract(0, 'months').date(1), endDate: moment().subtract(1, 'days') };

    let startdate: string = moment(this.selectedDateRange.startDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();
    let enddate: string = moment(this.selectedDateRange.endDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();

    this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction, startdate, enddate);

    this.panelTitle = 'Add New Event';
    this.action = true;
    this.identity = 0;
    this.discountForm = this.fb.group({
      MarketplaceID: [0, [Validators.min(1)]],
      CompanyDetailID: [0, [Validators.min(1)]],
      IsExpense: [1, []],
      Expense: ['', []],
      ItemID: ['', []],
      StartDate: ['', [Validators.required]],
      EndDate: ['', [Validators.required]],
      ItemSelectionType: [1, []],
    });

    this.objItem.ItemID = 0;
    this.objItem.ItemCode = 'Select';
    this.lstItemSelected = [] as any;
    this.lstItemSelected.push(this.objItem);
  }

  Search(): void {
    let startdate: string = moment(this.selectedDateRange.startDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();
    let enddate: string = moment(this.selectedDateRange.endDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();

    this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction, startdate, enddate);
  }

  Refresh(): void {
    this.SearchBy = '';
    this.SearchKeyword = '';
    this.Searchaction = true;
    this.selectedDateRange = { startDate: moment().subtract(0, 'months').date(1), endDate: moment().subtract(1, 'days') };

  }
  marketplaces: Marketplace[];
  LoadMarketPlaces() {
    this._PrivateutilityService.getMarketPlaces()
      .subscribe(
        (data: Marketplace[]) => {
          this.marketplaces = data;
        },
        (err: any) => {
          console.log(err);
        }
      );
  }
  lstCompanydetails: Companydetails[] = [] as any;
  LoadCompanydetails() {
    let currentUser = this.authenticationService.currentUserValue;
    this._PrivateutilityService.getTopUserStores(currentUser.CompanyID)
      .subscribe(
        (data: Companydetails[]) => {
          this.lstCompanydetails = data;
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  onchangeCompanyDetailID(selectedValue: string) {
    let id = parseInt(selectedValue);
    this._PrivateutilityService.getItemLevelsByStore(id)
      .subscribe(
        (data: Item[]) => {
          if (data.length > 0) {
            this.lstItem = data.filter(a => a.Type == 'Item');
          }
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  private GetGSTClimableDate() {
    this._PrivateutilityService.GetGSTClimableDate()
      .subscribe(
        (res: Date) => {
          this.MinDate = moment(res).add(1, 'minutes');
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  newButtonClick() {
    if (this._authorizationGuard.CheckAcess("EventManager", "ViewEdit")) {
      return;
    }
    this.LoadMarketPlaces();
    this.LoadCompanydetails();
    this.GetGSTClimableDate();

    $('#modalpopup_discount').modal('show');
    this.logValidationErrors();
    this.panelTitle = "Add New Event";
    this.action = true;
    $('#StartDate').val("");
    $('#EndDate').val("");
    this.ItemSelectionType = true;
    this.IsExpense = true;
    this.discountForm = this.fb.group({
      MarketplaceID: [0, [Validators.min(1)]],
      CompanyDetailID: [0, [Validators.min(1)]],
      IsExpense: [1, []],
      Expense: ['', []],
      ItemID: ['', []],
      StartDate: ['', [Validators.required]],
      EndDate: ['', [Validators.required]],
      ItemSelectionType: [1, []],
    });
  }

  ItemSelectionType: boolean = true;
  IsExpense: boolean = true;
  objEventManager: EventManager = {} as any;
  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("EventManager", "ViewEdit")) {
      return;
    }
    // stop here if form is invalid
    if (this.discountForm.invalid) {
      return;
    }
    let StartDate: Date = new Date(moment(new Date(this.discountForm.controls['StartDate'].value.startDate._d)).format("MM-DD-YYYY HH:mm"));
    let EndDate: Date = new Date(moment(new Date(this.discountForm.controls['EndDate'].value.startDate._d)).format("MM-DD-YYYY HH:mm"));
    let Expense = parseFloat(this.discountForm.controls['Expense'].value).toFixed(2);

    if (StartDate > EndDate) {
      this.alertService.error('The EndDate must be greater than or equal to StartDate.!');
      return;
    }
    else if (this.ItemSelectionType == false && this.discountForm.controls['ItemID'].value == "") {
      this.alertService.error('Please select atleast one item in a list.!');
      return;
    }
    else if (this.IsExpense && (parseFloat(Expense) <= 0 || parseFloat(Expense) > 100)) {
      this.alertService.error('Expense must be greater than Zero and less than or equal to 100.!');
      return;
    }
    this.objEventManager.MarketplaceID = this.discountForm.controls['MarketplaceID'].value;
    this.objEventManager.CompanyDetailID = this.discountForm.controls['CompanyDetailID'].value;
    this.objEventManager.IsExpense = this.discountForm.controls['IsExpense'].value;
    if (this.objEventManager.IsExpense) {
      this.objEventManager.Expense = this.discountForm.controls['Expense'].value;
    } else {
      this.objEventManager.Expense = 0;
    }
    this.objEventManager.StartDate = this.discountForm.controls['StartDate'].value.startDate._d;
    this.objEventManager.EndDate = this.discountForm.controls['EndDate'].value.startDate._d;
    let Itemids = [];
    if (this.ItemSelectionType) {
      Itemids = this.lstItem.map(a => a.ItemID);
    }
    else {
      Itemids = this.discountForm.controls['ItemID'].value.map(a => a.ItemID);
    }
    if (Itemids.length == 0) {
      this.alertService.error('No Items in list or selected Store!');
      return;
    }
    this._discountService.EventManagerUpsert(this.objEventManager, Itemids).subscribe(
      (data) => {
        if (data && data.Flag == true) {
          this.alertService.success(data.Msg);
          $('#modalpopup_discount').modal('hide');
          let startdate: string = moment(this.selectedDateRange.startDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();
          let enddate: string = moment(this.selectedDateRange.endDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();

          this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction, startdate, enddate);
          this.identity = 0;
        }
        else {
          this.alertService.error(data.Msg);
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  StartDateUpdated(range) {
    //this.logValidationErrors();
  }

  EndDateUpdated(range) {
    //this.logValidationErrors();
  }
  onLoad(SearchBy: string, Search: string, IsActive: Boolean, StartDate: string, EndDate: string) {
    return this._discountService.EventManagerSearch(SearchBy, Search, StartDate, EndDate, IsActive).subscribe(
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
    field: 'MarketPlace',
    dir: 'asc'
  }];
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  private items: EventManager[] = [] as any;
  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'MarketPlace', operator: 'contains', value: '' }]
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
            field: 'MarketPlace',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'TransactionType',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'StoreName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'Expense',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ItemCode',
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
    });
  }

  //#endregion Paging Sorting and Filtering End

}
