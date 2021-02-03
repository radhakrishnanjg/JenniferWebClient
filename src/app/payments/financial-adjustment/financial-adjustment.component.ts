import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { Companydetails, Dropdown, FinancialAdjustment } from '../../_services/model';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import * as moment from 'moment';

import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { AuthenticationService } from 'src/app/_services/service/authentication.service';
import { SalesratecardService } from 'src/app/_services/service/salesratecard.service';
import { JsonPrivateUtilityService } from 'src/app/_services/service/crossborder/jsonprivateutility.service';

@Component({
  selector: 'app-financial-adjustment',
  templateUrl: './financial-adjustment.component.html',
  styleUrls: ['./financial-adjustment.component.css']
})
export class FinancialAdjustmentComponent implements OnInit {

  CommissionForm: FormGroup;
  panelTitle: string;
  action: boolean;
  identity: number = 0;
  deleteColumn: string;
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
  constructor(
    private alertService: ToastrService,
    private _discountService: SalesratecardService,
    private _authorizationGuard: AuthorizationGuard,
    private fb: FormBuilder,
    private _PrivateutilityService: PrivateutilityService,
    private _JsonPrivateUtilityService: JsonPrivateUtilityService,
    private authenticationService: AuthenticationService,
  ) { }


  //#region Validation Start
  formErrors = {
    'StoreName': '',
    'AdjustmentDate': '',
    'AdjustmentType': '',
    'AdjustmentDescription': '',
    'AdjustmentAmount': '',
  };

  // This object contains all the validation messages for this form
  validationMessages = {

    'StoreName': {
      'required': 'This Field is required.',
    },
    'AdjustmentDate': {
      'min': 'This Field is required.',
    },
    'AdjustmentType': {
      'min': 'This Field is required.',
    },
    'AdjustmentDescription': {
      'required': 'This Field is required.',
    },
    'AdjustmentAmount': {
      'required': 'This Field is required.',
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

    this.onLoad(this.SearchBy, this.SearchKeyword, startdate, enddate);

    this.LoadCompanydetails();
    this.LoadAdjustmentType();
    this.panelTitle = 'Add New Financial Adjustment';
    this.action = true;
    this.identity = 0;
    this.CommissionForm = this.fb.group({
      StoreName: ['', [Validators.required]],
      AdjustmentDate: ['', [Validators.required]],
      AdjustmentType: [0, [Validators.min(1)]],
      AdjustmentDescription: ['', [Validators.required]],
      AdjustmentAmount: ['', [Validators.required]],
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

  lstCompanydetails: Companydetails[] = [] as any;
  lstCompanydetails_data: Companydetails[] = [] as any;
  LoadCompanydetails() {
    let currentUser = this.authenticationService.currentUserValue;
    this._JsonPrivateUtilityService.GetAllStores(currentUser.CompanyID)
      .subscribe(
        (data: Companydetails[]) => {
          this.lstCompanydetails = data;
          this.lstCompanydetails_data = this.lstCompanydetails.slice();
        },
        (err: any) => {
          console.log(err);
        }
      );
  }
  handleFilter(value) {
    this.lstCompanydetails_data = this.lstCompanydetails.filter((s) => s.StoreName.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    this.logValidationErrors();
  }

  lstAdjustmentType: Dropdown[];
  LoadAdjustmentType() {
    this._PrivateutilityService.GetValues('AdjustmentType')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstAdjustmentType = data;
        },
        (err: any) => {
          console.log(err);
        }
      );
  }
  // private getCurrentServerDateTime() {
  //   this._PrivateutilityService.getCurrentDate()
  //     .subscribe(
  //       (data: Date) => {
  //         this.MinDate = moment(data).add(0, 'days');
  //       },
  //       (err: any) => {
  //         console.log(err);
  //       }
  //     );
  // }

  newButtonClick() {
    if (this._authorizationGuard.CheckAcess("FinancialAdjustment", "ViewEdit")) {
      return;
    }
    // this.getCurrentServerDateTime();

    $('#modalpopup_discount').modal('show');
    this.logValidationErrors();
    this.panelTitle = 'Add New Financial Adjustment';
    this.action = true;
    this.identity = 0; 
    this.CommissionForm = this.fb.group({
      StoreName: ['', [Validators.required]],
      AdjustmentDate: ['', [Validators.required]],
      AdjustmentType: [0, [Validators.min(1)]],
      AdjustmentDescription: ['', [Validators.required]],
      AdjustmentAmount: ['', [Validators.required]],
    });
  }

  editButtonClick(id: number) {
    if (this._authorizationGuard.CheckAcess("FinancialAdjustment", "ViewEdit")) {
      return;
    }
    this.panelTitle = 'Edit Financial Adjustment';
    this.action = false;
    this.identity = + id;

    this.CommissionForm = this.fb.group({
      StoreName: ['', [Validators.required]],
      AdjustmentDate: ['', [Validators.required]],
      AdjustmentType: [0, [Validators.min(1)]],
      AdjustmentDescription: ['', [Validators.required]],
      AdjustmentAmount: ['', [Validators.required]],
    });

    let data = this.items.filter(a => a.SysID == this.identity)[0];
    var AdjustmentDate = moment(data.AdjustmentDate, 'YYYY-MM-DD[T]HH:mm').format('MM-DD-YYYY HH:mm').toString();
    this.CommissionForm.patchValue({
      StoreName: data.StoreName,
      AdjustmentDate: { startDate: new Date(AdjustmentDate) },
      AdjustmentType: data.AdjustmentType,
      AdjustmentDescription: data.AdjustmentDescription,
      AdjustmentAmount: data.AdjustmentAmount,
    });
    this.objCommission = data;
    this.CommissionForm.get('StoreName').disable();
    this.CommissionForm.get('AdjustmentType').disable();
    this.logValidationErrors();
    $('#modalpopup_discount').modal('show');
  }

  objCommission: FinancialAdjustment = {} as any;
  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("FinancialAdjustment", "ViewEdit")) {
      return;
    }
    // stop here if form is invalid
    if (this.CommissionForm.invalid) {
      return;
    }
    if (this.lstCompanydetails_data.filter(a => a.StoreName == this.CommissionForm.controls['StoreName'].value).length == 0) {
      this.alertService.error('Enter valid Store!');
      return;
    }
    this.objCommission = new FinancialAdjustment(); 
    this.objCommission.CompanyDetailID =
      this.lstCompanydetails_data.filter(a => a.StoreName == this.CommissionForm.controls['StoreName'].value)[0].CompanyDetailID;
    this.objCommission.AdjustmentType = this.CommissionForm.controls['AdjustmentType'].value;
    this.objCommission.AdjustmentAmount = this.CommissionForm.controls['AdjustmentAmount'].value;
    this.objCommission.AdjustmentDescription = this.CommissionForm.controls['AdjustmentDescription'].value;
    if (this.CommissionForm.controls['AdjustmentDate'].value.startDate._d != undefined) {
      this.objCommission.AdjustmentDate = this.CommissionForm.controls['AdjustmentDate'].value.startDate._d;
    } else {
      this.objCommission.AdjustmentDate = this.CommissionForm.controls['AdjustmentDate'].value.startDate;
    }
    if (this.action) {
      this.objCommission.Action = "I";
    }
    else {
      this.objCommission.SysID = this.identity;
      this.objCommission.Action = "U";
    }
    this._discountService.FinancialAdjustmentAction(this.objCommission).subscribe(
      (data) => {
        if (data && data.Flag == true) {
          this.alertService.success(data.Msg);
          $('#modalpopup_discount').modal('hide');
          let startdate: string = moment(this.selectedDateRange.startDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();
          let enddate: string = moment(this.selectedDateRange.endDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();

          this.onLoad(this.SearchBy, this.SearchKeyword, startdate, enddate);
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

  confirmDeleteid(id: number, DeleteColumnvalue: string) {
    if (this._authorizationGuard.CheckAcess("FinancialAdjustment", "ViewEdit")) {
      return;
    }
    this.identity = + id;
    this.deleteColumn = DeleteColumnvalue;
    $('#modaldeleteconfimation').modal('show');
  }

  delete() {
    this.objCommission = new FinancialAdjustment();
    this.objCommission.Action = "D";
    this.objCommission.SysID = this.identity;
    this._discountService.FinancialAdjustmentAction(this.objCommission).subscribe(
      (data) => {
        if (data) {
          this.alertService.success(data.Msg);
          $('#modalpopup_discount').modal('hide');
          let startdate: string = moment(this.selectedDateRange.startDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();
          let enddate: string = moment(this.selectedDateRange.endDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();

          this.onLoad(this.SearchBy, this.SearchKeyword, startdate, enddate);
          $('#modaldeleteconfimation').modal('hide');
          this.identity = 0;
        } else {
          this.alertService.error(data.Msg);
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  onLoad(SearchBy: string, Search: string, StartDate: string, EndDate: string) {
    return this._discountService.FinancialAdjustmentSearch(SearchBy, Search, StartDate, EndDate).subscribe(
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
  private items: FinancialAdjustment[] = [] as any;
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
            field: 'AdjustmentDate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'AdjustmentType',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'AdjustmentDescription',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'AdjustmentAmount',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'StatementNumber',
            operator: 'contains',
            value: inputValue
          },
        ],
      }
    });
  }

  //#endregion Paging Sorting and Filtering End

}
