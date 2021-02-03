import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { Companydetails, Dropdown, Commission } from '../../_services/model';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import * as moment from 'moment';

import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { AuthenticationService } from 'src/app/_services/service/authentication.service';
import { SalesratecardService } from 'src/app/_services/service/salesratecard.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {

  CommissionForm: FormGroup;
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
    'CompanyDetailID': '',
    'CommissionMethod': '',
    'CommissionType': '',
    'SubscriptionType': '',
    'StartDate': '',
    'EndDate': '',
  };

  // This object contains all the validation messages for this form
  validationMessages = {

    'CompanyDetailID': {
      'min': 'This Field is required.',
    },
    'CommissionMethod': {
      'min': 'This Field is required.',
    },
    'CommissionType': {
      'required': 'This Field is required.',
    },
    'SubscriptionType': {
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

  logValidationErrors(group: FormGroup = this.CommissionForm): void {
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

    this.panelTitle = 'Add New Commission';
    this.action = true;
    this.identity = 0;
    this.CommissionForm = this.fb.group({
      CompanyDetailID: [0, [Validators.min(1)]],
      CommissionMethod: [0, [Validators.min(1)]],
      CommissionPer: ['', []],
      FixedCharges: ['', []],
      SubscriptionType: [0, [Validators.min(1)]],
      StartDate: ['', [Validators.required]],
      EndDate: ['', [Validators.required]],
    });
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
  lstCommissionMethod: Dropdown[];
  LoadCommissionMethod() {
    this._PrivateutilityService.GetValues('CommissionMethod')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstCommissionMethod = data;
        },
        (err: any) => {
          console.log(err);
        }
      );
  }
  onchange_CommissionMethod(selectedValue: string) {
    if (selectedValue == 'VAIRABLE') {
      this.CommissionForm.get('CommissionPer').enable();
      this.CommissionForm.get('FixedCharges').disable();
      this.CommissionForm.patchValue({
        CommissionPer: '',
      });
    }
    else if (selectedValue == 'FIXED') {
      this.CommissionForm.get('CommissionPer').disable();
      this.CommissionForm.get('FixedCharges').enable();
      this.CommissionForm.patchValue({
        FixedCharges: '',
      });
    }
    else {
      this.CommissionForm.get('CommissionPer').enable();
      this.CommissionForm.get('FixedCharges').enable();
      this.CommissionForm.patchValue({
        FixedCharges: '',
        CommissionPer: '',
      });
    }
  }
  lstCommissionType: Dropdown[];
  LoadCommissionType() {
    this._PrivateutilityService.GetValues('CommissionType')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstCommissionType = data;
          this.lstCommissionType.forEach(element => {
            element.IsActive = false
          });
        },
        (err: any) => {
          console.log(err);
        }
      );
  }
  private getCurrentServerDateTime() {
    this._PrivateutilityService.getCurrentDate()
      .subscribe(
        (data: Date) => {
          this.MinDate = moment(data).add(0, 'days');
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  newButtonClick() {
    if (this._authorizationGuard.CheckAcess("Subscription", "ViewEdit")) {
      return;
    }
    this.LoadCompanydetails();
    this.LoadCommissionMethod();
    this.LoadCommissionType();
    this.getCurrentServerDateTime();

    $('#modalpopup_discount').modal('show');
    this.logValidationErrors();
    this.panelTitle = "Add New Commission";
    this.action = true;
    $('#StartDate').val("");
    $('#EndDate').val("");
    this.CommissionForm = this.fb.group({
      CompanyDetailID: [0, [Validators.min(1)]],
      CommissionMethod: [0, [Validators.min(1)]],
      CommissionPer: ['', []],
      FixedCharges: ['', []],
      SubscriptionType: [0, [Validators.min(1)]],
      StartDate: ['', [Validators.required]],
      EndDate: ['', [Validators.required]],
    });
  }
  masterscreenFieldsChange(values: any) {
    this.lstCommissionType.filter(a => a.DropdownValue ==
      values.currentTarget.id)[0].IsActive = values.currentTarget.checked;
  }
  objCommission: Commission = {} as any;
  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("Subscription", "ViewEdit")) {
      return;
    }
    // stop here if form is invalid
    if (this.CommissionForm.invalid) {
      return;
    }
    let StartDate: Date = new Date(moment(new Date(this.CommissionForm.controls['StartDate'].value.startDate._d)).format("MM-DD-YYYY HH:mm"));
    let EndDate: Date = new Date(moment(new Date(this.CommissionForm.controls['EndDate'].value.startDate._d)).format("MM-DD-YYYY HH:mm"));
    let CommissionPer = parseFloat(this.CommissionForm.controls['CommissionPer'].value).toFixed(2);
    debugger
    if (StartDate > EndDate) {
      this.alertService.error('The EndDate must be greater than or equal to StartDate.!');
      return;
    }
    else if (this.CommissionForm.controls['CommissionMethod'].value == 'VAIRABLE' &&
      this.CommissionForm.controls['CommissionPer'].value == "") {
      this.alertService.error('Please enter Commission Percentage(%).!');
      return;
    }
    else if (this.CommissionForm.controls['CommissionMethod'].value == 'VAIRABLE'
      && (parseFloat(CommissionPer) <= 0 || parseFloat(CommissionPer) > 100)) {
      this.alertService.error('Commission (%) must be greater than Zero and less than or equal to 100.!');
      return;
    }
    else if (this.CommissionForm.controls['CommissionMethod'].value == 'FIXED' &&
      this.CommissionForm.controls['FixedCharges'].value == "") {
      this.alertService.error('Please enter Fixed Charges.!');
      return;
    }
    else if (this.lstCommissionType.filter(a => a.IsActive == true).length == 0) {
      this.alertService.error('Please select Commission Type.!');
      return;
    }
    // else if ((this.CommissionForm.controls['CommissionMethod'].value == 'BOTHVAIRABLE&FIXED') &&
    //   (this.CommissionForm.controls['FixedCharges'].value == "" || this.CommissionForm.controls['CommissionPer'].value == "")) {
    //   this.alertService.error('Please enter both Fixed Charges and Commission Percentage(%).!');
    //   return;
    // }
    // else if ((this.CommissionForm.controls['CommissionMethod'].value == 'WHICHEVERISHIGHER') &&
    //   (this.CommissionForm.controls['FixedCharges'].value == "" && this.CommissionForm.controls['CommissionPer'].value == "")) {
    //   this.alertService.error('Please enter both Fixed Charges or Commission Percentage(%).!');
    //   return;
    // }
    if (this.CommissionForm.controls['CommissionMethod'].value == 'FIXED') {
      this.objCommission.CommissionPer = 0;
      this.objCommission.FixedCharges = this.CommissionForm.controls['FixedCharges'].value;
    }
    if (this.CommissionForm.controls['CommissionMethod'].value == 'VAIRABLE') {
      this.objCommission.FixedCharges = 0;
      this.objCommission.CommissionPer = this.CommissionForm.controls['CommissionPer'].value;
    }
    this.objCommission.CompanyDetailID = this.CommissionForm.controls['CompanyDetailID'].value;
    this.objCommission.CommissionMethod = this.CommissionForm.controls['CommissionMethod'].value;
    this.objCommission.CommissionType = this.lstCommissionType.filter(a => a.IsActive == true).map(a => a.DropdownValue).toString();
    this.objCommission.SubscriptionType = this.CommissionForm.controls['SubscriptionType'].value;
    this.objCommission.StartDate = this.CommissionForm.controls['StartDate'].value.startDate._d;
    this.objCommission.EndDate = this.CommissionForm.controls['EndDate'].value.startDate._d;

    this._discountService.SubscriptionUpsert(this.objCommission).subscribe(
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
    return this._discountService.SubscriptionSearch(SearchBy, Search, StartDate, EndDate, IsActive).subscribe(
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
    field: 'StoreName',
    dir: 'asc'
  }];
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  private items: Commission[] = [] as any;
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
            field: 'CommissionMethod',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'CommissionType',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'SubscriptionType',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'CommissionPer',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'FixedCharges',
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
