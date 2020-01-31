import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { MarketplacefeeService } from '../../_services/service/marketplacefee.service';
import { Marketplacefee, ProductGroup, Category, SubCategory, Item } from '../../_services/model';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import * as moment from 'moment';
import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
@Component({
  selector: 'app-marketplacefeelist',
  templateUrl: './marketplacefeelist.component.html',
  styleUrls: ['./marketplacefeelist.component.css']
})
export class MarketplacefeelistComponent implements OnInit {
  lstProductGroup: ProductGroup[];
  lstCategory: Category[];
  lstSubCategory: SubCategory[];
  lstItem: Item[] = [] as any;
  lstItemSelected: Item[] = [] as any;
  objItem: Item = {} as any;
  objMarketplacefee: Marketplacefee = {} as any;
  Marketplacefeeform: FormGroup;
  panelTitle: string;
  action: boolean;
  identity: number = 0;
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
  MinDate: moment.Moment;
  ItemCode: string = '';
  ItemID: number = 0;
  config = {
    displayKey: "ItemCode", //if objects array passed which key to be displayed defaults to description
    search: true,
    // limitTo: 3    
    height: '200px'
  };
  constructor(
    private alertService: ToastrService,
    private _marketplacefeeService: MarketplacefeeService,

    private _authorizationGuard: AuthorizationGuard,
    private fb: FormBuilder,
    private _PrivateutilityService: PrivateutilityService,
  ) { }


  //#region Validation Start
  formErrors = {
    'ExpenseCharge': '',
    'ExpenseGSTTax': '',
    'ItemID': '',
    'StartDate': '',
    'EndDate': '',
  };

  // This object contains all the validation messages for this form
  validationMessages = {
    'ExpenseCharge': {
      'required': 'This Field is required.',
      'pattern': 'This Field must be a numeric(0-100).',
      'min': 'This Field must be a numeric(0.00-100).',
      'max': 'This Field must be a numeric(0.00-100).',
    },
    'ExpenseGSTTax': {
      'required': 'This Field is required.',
      'pattern': 'This Field must be a numeric(0-100).',
      'min': 'This Field must be a numeric(0.01-100).',
      'max': 'This Field must be a numeric(0.01-100).',
    },
    'ItemID': {
      'min': 'This Field is required.',
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

  logValidationErrors(group: FormGroup = this.Marketplacefeeform): void {
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
    this.selectedDateRange = { startDate: moment().subtract(0, 'months').date(1), endDate: moment().subtract(1, 'days') };

    let startdate: Date = this.selectedDateRange.startDate._d.toISOString().substring(0, 10);
    let enddate: Date = this.selectedDateRange.endDate._d.toISOString().substring(0, 10);
    this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction, startdate, enddate);

    this.panelTitle = 'Add New Martket Fee ';
    this.action = true;
    this.identity = 0;
    this.Marketplacefeeform = this.fb.group({
      ExpenseCharge: ['', [Validators.required, Validators.min(0.00), Validators.max(100), Validators.pattern("(100|[0-9]{1,2})(\.[0-9]{1,2})?"),]],
      ExpenseGSTTax: ['', [Validators.required, Validators.min(0.01), Validators.max(100), Validators.pattern("(100|[0-9]{1,2})(\.[0-9]{1,2})?"),]],
      ProductGroupID: [0, []],
      CategoryID: [0, []],
      SubCategoryID: [0, []],
      ItemID: [0, [Validators.min(1)]],
      StartDate: ['', [Validators.required]],
      EndDate: ['', [Validators.required]],
      // IsActive: [0,],
    });

    this.objItem.ItemID = 0;
    this.objItem.ItemCode = 'Select';
    this.lstItemSelected = [] as any;
    this.lstItemSelected.push(this.objItem);
  }

  Search(): void {
    let startdate: Date = this.selectedDateRange.startDate._d.toISOString().substring(0, 10);
    let enddate: Date = this.selectedDateRange.endDate._d.toISOString().substring(0, 10);
    this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction, startdate, enddate);
  }

  Refresh(): void {
    this.SearchBy = '';
    this.SearchKeyword = '';
    this.Searchaction = true;
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
    // this.MinDate = moment().add(0, 'days');
    if (this._authorizationGuard.CheckAcess("Marketplacefeelist", "ViewEdit")) {
      return;
    }
    this.getCurrentServerDateTime();
    //
    this._PrivateutilityService.getProductGroups()
      .subscribe(
        (data: ProductGroup[]) => {
          this.lstProductGroup = data;
          //

        },
        (err: any) => {
          console.log(err);
          //
        }
      );

    $('#modalpopup_marketplacefee').modal('show');
    this.logValidationErrors();
    this.panelTitle = "Add New MarketPlace Fee";
    this.action = true;
    this.Marketplacefeeform.patchValue({
      ExpenseCharge: '',
      ExpenseGSTTax: '',
      ItemID: 0,
      // StartDate: '',
      // EndDate: '',
    });
    $('#ExpenseCharge').removeAttr("disabled");
    $('#ExpenseGSTTax').removeAttr("disabled");
    $('#ItemID').removeAttr("disabled");

    // $('#ExpenseCharge').val("");
    // $('#ExpenseGSTTax').val("");
    $('#StartDate').val("");
    $('#EndDate').val("");

  }

  // editButtonClick(id: number) {
  //   this.MinDate = moment().add(0, 'days');
  //   if (this._authorizationGuard.CheckAcess("Marketplacefeelist", "ViewEdit")) {
  //     return;
  //   }

  //   //
  //   this._PrivateutilityService.getProductGroups()
  //     .subscribe(
  //       (data: ProductGroup[]) => {
  //         this.lstProductGroup = data;
  //         //
  //       },
  //       (err: any) => {
  //         console.log(err);
  //         //
  //       }
  //     );

  //   this.panelTitle = "Edit MarketPlace Fee";
  //   this.action = false;
  //   this.identity = + id;
  //   //
  //   this._marketplacefeeService.searchById(this.identity)
  //     .subscribe(
  //       (data: Marketplacefee) => {
  //         var ItemIDvalue = data.ItemID.toString();
  //         this.objItem.ItemID = data.ItemID;
  //         this.objItem.ItemCode = data.ItemCode;
  //         this.lstItemSelected = [] as any;
  //         this.lstItemSelected.push(this.objItem);
  //         var StartDate = moment(data.StartDate, 'YYYY-MM-DD[T]HH:mm').format('MM-DD-YYYY HH:mm').toString();
  //         var EndDate = moment(data.EndDate, 'YYYY-MM-DD[T]HH:mm').format('MM-DD-YYYY HH:mm').toString();

  //         this.Marketplacefeeform.patchValue({
  //           ExpenseCharge: data.ExpenseCharge,
  //           ExpenseGSTTax: data.ExpenseGSTTax,
  //           StartDate: data.StartDate,
  //           EndDate: data.EndDate,
  //           //IsActive: data.IsActive,
  //           ItemID: ItemIDvalue,
  //         });
  //         this.ItemCode = data.ItemCode;
  //         $("#ExpenseCharge").attr("disabled", "disabled");
  //         $("#ExpenseGSTTax").attr("disabled", "disabled");
  //         $("#ItemID").attr("disabled", "disabled");
  //         // $('#StartDate').val(data.StartDate.toLocaleTimeString('MM-DD-YYYY HH:mm'));
  //         // $('#EndDate').val(data.EndDate.toLocaleTimeString('MM-DD-YYYY HH:mm'));

  //         $('#StartDate').val(StartDate);
  //         $('#EndDate').val(EndDate);
  //         //this.logValidationErrors();
  //         //
  //       },
  //       (err: any) => {
  //         console.log(err);
  //         //
  //       }
  //     );
  //   $('#modalpopup_marketplacefee').modal('show');
  // }



  onchangeProductGroupID(selectedValue: string) {
    let id = parseInt(selectedValue);
    if (id > 0) {
      //
      this._PrivateutilityService.getCategories(id)
        .subscribe(
          (statesa: Category[]) => {
            this.lstCategory = statesa;
            //
          },
          (err: any) => {
            console.log(err);
            //
          }
        );
    }
  }

  onchangeCategoryID(selectedValue: string) {
    let id = parseInt(selectedValue);
    //
    if (id > 0) {
      this._PrivateutilityService.getSubCategories(id)
        .subscribe(
          (data: SubCategory[]) => {
            this.lstSubCategory = data
            //
          },
          (err: any) => {
            console.log(err);
            //
          }
        );
    }
  }

  onchangeSubCategoryID(selectedValue: string) {
    let id = parseInt(selectedValue);
    //
    this._PrivateutilityService.getItems(id)
      .subscribe(
        (data: Item[]) => {
          this.lstItem = data;
          //
        },
        (err: any) => {
          console.log(err);
          //
        }
      );
  }



  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("Marketplacefeelist", "ViewEdit")) {
      return;
    }
    // stop here if form is invalid
    if (this.Marketplacefeeform.invalid) {
      return;
    }
    let StartDate: Date = new Date(moment(new Date(this.Marketplacefeeform.controls['StartDate'].value.startDate._d)).format("MM-DD-YYYY HH:mm"));
    let EndDate: Date = new Date(moment(new Date(this.Marketplacefeeform.controls['EndDate'].value.startDate._d)).format("MM-DD-YYYY HH:mm"));
    let currentdate: Date = new Date(moment(new Date()).format("MM-DD-YYYY HH:mm"));
    // if (currentdate > StartDate) {
    //   this.alertService.error('The StartDate must be greater than or equal to current datetime.!');
    //   return;
    // }
    // else
    if (StartDate > EndDate) {
      this.alertService.error('The EndDate must be greater than or equal to StartDate.');
      return;
    }
    else if (this.Marketplacefeeform.controls['ItemID'].value == "") {
      this.alertService.error('Please select atleast one item in a list.!');
      return;
    }
    if (this.identity > 0) {
      this.Update();
    }
    else {
      this.Insert();
    }
  }
  StartDateUpdated(range) {
    this.logValidationErrors();
  }

  EndDateUpdated(range) {
    this.logValidationErrors();
  }

  Insert() {

    this.objMarketplacefee.ExpenseCharge = this.Marketplacefeeform.controls['ExpenseCharge'].value;
    this.objMarketplacefee.ExpenseGSTTax = this.Marketplacefeeform.controls['ExpenseGSTTax'].value;
    this.objMarketplacefee.ItemID = this.Marketplacefeeform.controls['ItemID'].value;
    this.objMarketplacefee.StartDate = this.Marketplacefeeform.controls['StartDate'].value.startDate._d.toLocaleString();
    this.objMarketplacefee.EndDate = this.Marketplacefeeform.controls['EndDate'].value.startDate._d.toLocaleString();
    var Itemids = this.Marketplacefeeform.controls['ItemID'].value.map(a => a.ItemID);
    //
    this._marketplacefeeService.upsert(this.objMarketplacefee, Itemids).subscribe(
      (data) => {
        if (data && data.Flag == true) {
          //
          this.alertService.success('Martket Fee  data has been added successfully');
        }
        else {
          //
          this.alertService.error(data.Msg);
        }
        $('#modalpopup_marketplacefee').modal('hide');

        let startdate: Date = this.selectedDateRange.startDate._d.toISOString().substring(0, 10);
        let enddate: Date = this.selectedDateRange.endDate._d.toISOString().substring(0, 10);
        this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction, startdate, enddate); this.identity = 0;
      },
      (error: any) => {
        //
        console.log(error);
      }
    );


  }

  Update() {
    this.objMarketplacefee.MarketPlaceFeeId = this.identity;
    this.objMarketplacefee.ExpenseCharge = this.Marketplacefeeform.controls['ExpenseCharge'].value;
    this.objMarketplacefee.ExpenseGSTTax = this.Marketplacefeeform.controls['ExpenseGSTTax'].value;
    this.objMarketplacefee.ItemID = this.Marketplacefeeform.controls['ItemID'].value;
    this.objMarketplacefee.StartDate = this.Marketplacefeeform.controls['StartDate'].value.startDate._d.toLocaleString();
    this.objMarketplacefee.EndDate = this.Marketplacefeeform.controls['EndDate'].value.startDate._d.toLocaleString();
    this.objItem.ItemID = this.Marketplacefeeform.controls['ItemID'].value;
    let Itemids: number[] = [] as any;
    Itemids.push(this.Marketplacefeeform.controls['ItemID'].value);
    //
    this._marketplacefeeService.upsert(this.objMarketplacefee, Itemids).subscribe(
      (data) => {
        if (data && data.Flag == true) {
          //
          this.alertService.success('Martket Fee  data has been updated successful');
        }
        else {
          //
          this.alertService.error(data.Msg);
        }
        $('#modalpopup_marketplacefee').modal('hide');

        let startdate: Date = this.selectedDateRange.startDate._d.toISOString().substring(0, 10);
        let enddate: Date = this.selectedDateRange.endDate._d.toISOString().substring(0, 10);
        this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction, startdate, enddate);
        this.identity = 0;
      },
      (error: any) => {
        //
        console.log(error);
      }
    );

  }


  onLoad(SearchBy: string, Search: string, IsActive: Boolean, StartDate: Date, EndDate: Date) {
    //
    return this._marketplacefeeService.search(SearchBy, Search, IsActive, StartDate, EndDate).subscribe(
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
    field: 'MarketPlace',
    dir: 'asc'
  }];
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  private items: Marketplacefee[] = [] as any;
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
            field: 'ItemCode',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ExpenseCharge',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ExpenseGSTTax',
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
