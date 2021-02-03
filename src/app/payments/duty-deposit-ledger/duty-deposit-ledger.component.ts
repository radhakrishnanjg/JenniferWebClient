import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { Companydetails, Dropdown, DutyDepositLedgerHeader, Poshipment } from '../../_services/model';
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
  selector: 'app-duty-deposit-ledger',
  templateUrl: './duty-deposit-ledger.component.html',
  styleUrls: ['./duty-deposit-ledger.component.css']
})
export class DutyDepositLedgerComponent implements OnInit {

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
    'FBAShipmentID': '',
    'DepositDate': '',
    'DepositAmount': '',
    'CurrencyType': '',
    'Remarks': '',
  };

  // This object contains all the validation messages for this form
  validationMessages = {
    'StoreName': {
      'required': 'This Field is required.',
    },
    'FBAShipmentID': {
      'required': 'This Field is required.',
    },
    'DepositDate': {
      'required': 'This Field is required.',
    },
    'DepositAmount': {
      'required': 'This Field is required.',
    },
    'CurrencyType': {
      'required': 'This Field is required.',
    },
    'Remarks': {
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

  formErrors1 = {
    'ReimbursementAmount': '',
    'ReimbursementDate': '',
    'Remarks': '',
  };

  // This object contains all the validation messages for this form
  validationMessages1 = {
    'ReimbursementAmount': {
      'required': 'This Field is required.',
    },
    'ReimbursementDate': {
      'required': 'This Field is required.',
    },
    'Remarks': {
      'required': 'This Field is required.',
    },
  };

  logValidationErrors1(group: FormGroup = this.CommissionForm_Reimbursement): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      this.formErrors[key] = '';
      if (abstractControl && !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty)) {
        const messages = this.validationMessages1[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors1[key] += messages[errorKey] + ' ';
          }
        }
      }
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors1(abstractControl);
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
    this.LoadCurrencyType();
    this.getCurrentServerDateTime();
    this.panelTitle = 'Add New Duty Deposit Ledger';
    this.action = true;
    this.identity = 0;
    this.CommissionForm = this.fb.group({
      StoreName: ['', [Validators.required]],
      FBAShipmentID: ['', [Validators.required]],
      DepositDate: ['', [Validators.required]],
      DepositAmount: ['', [Validators.required]],
      CurrencyType: ['', [Validators.required]],
      Remarks: ['', [Validators.required]],
    });

    this.CommissionForm_Reimbursement = this.fb.group({
      ReimbursementAmount: ['', [Validators.required]],
      ReimbursementDate: ['', [Validators.required]],
    });
  }
  lstCurrencyType: Dropdown[];
  LoadCurrencyType() {
    this._JsonPrivateUtilityService.getvalues('CurrencyType')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstCurrencyType = data;
        },
        (err: any) => {
          console.log(err);
        }
      );
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

  lstPoshipment: Poshipment[];
  lstPoshipment_data: Poshipment[] = [] as any;
  LoadDutyDepositLedgerShipments(selectedValue: string) {
    let CompanyDetailID =
      this.lstCompanydetails_data.filter(a => a.StoreName == selectedValue)[0].CompanyDetailID;
    if (CompanyDetailID > 0) {
      this._JsonPrivateUtilityService.GetDutyDepositLedgerShipments(CompanyDetailID)
        .subscribe(
          (data: Poshipment[]) => {
            this.lstPoshipment = data;
            this.lstPoshipment_data = this.lstPoshipment.slice();
          },
          (err: any) => {
            console.log(err);
          }
        );
    }
  }

  handleFilter_shipment(value) {
    this.lstPoshipment_data = this.lstPoshipment.filter((s) => s.ShipmentNumber.toLowerCase().indexOf(value.toLowerCase()) !== -1);
    this.logValidationErrors();
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
    this.logValidationErrors();
    if (this._authorizationGuard.CheckAcess("DutyDepositLedger", "ViewEdit")) {
      return;
    }

    $('#modalpopup_discount').modal('show');
    this.panelTitle = 'Add New Duty Deposit Ledger';
    this.action = true;
    this.identity = 0;
    this.CommissionForm = this.fb.group({
      StoreName: ['', [Validators.required]],
      FBAShipmentID: ['', [Validators.required]],
      DepositDate: ['', [Validators.required]],
      DepositAmount: ['', [Validators.required]],
      CurrencyType: ['', [Validators.required]],
      Remarks: ['', [Validators.required]],
    });
  }

  editButtonClick(id: number) {
    this.logValidationErrors1();
    if (this._authorizationGuard.CheckAcess("DutyDepositLedger", "ViewEdit")) {
      return;
    }
    this.panelTitle = 'Edit Duty Deposit Ledger';
    this.action = false;
    this.identity = + id;

    this.CommissionForm = this.fb.group({
      StoreName: ['', [Validators.required]],
      FBAShipmentID: ['', [Validators.required]],
      DepositDate: ['', [Validators.required]],
      DepositAmount: ['', [Validators.required]],
      CurrencyType: ['', [Validators.required]],
      Remarks: ['', [Validators.required]],
    });

    let data = this.items.filter(a => a.DutyDepositLedgerID == this.identity)[0];
    var DepositDate = moment(data.DepositDate, 'YYYY-MM-DD[T]HH:mm').format('MM-DD-YYYY HH:mm').toString();
    this.CommissionForm.patchValue({
      StoreName: data.StoreName,
      FBAShipmentID: data.FBAShipmentID,
      DepositDate: { startDate: new Date(DepositDate) },
      DepositAmount: data.DepositAmount,
      CurrencyType: data.CurrencyType,
      Remarks: data.Remarks,
    });
    this.objCommission = data;
    // this.CommissionForm.get('StoreName').disable(); 
    this.logValidationErrors();
    $('#modalpopup_discount').modal('show');
  }

  objCommission: DutyDepositLedgerHeader = {} as any;
  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("DutyDepositLedger", "ViewEdit")) {
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
    this.objCommission = new DutyDepositLedgerHeader();
    this.objCommission.CompanyDetailID =
      this.lstCompanydetails_data.filter(a => a.StoreName == this.CommissionForm.controls['StoreName'].value)[0].CompanyDetailID;
    this.objCommission.FBAShipmentID = this.CommissionForm.controls['FBAShipmentID'].value;
    this.objCommission.DepositAmount = this.CommissionForm.controls['DepositAmount'].value;
    this.objCommission.CurrencyType = this.CommissionForm.controls['CurrencyType'].value;
    this.objCommission.Remarks = this.CommissionForm.controls['Remarks'].value;
    if (this.CommissionForm.controls['DepositDate'].value.startDate._d != undefined) {
      this.objCommission.DepositDate = this.CommissionForm.controls['DepositDate'].value.startDate._d;
    } else {
      this.objCommission.DepositDate = this.CommissionForm.controls['DepositDate'].value.startDate;
    }
    if (this.action) {
      this.objCommission.Action = "I";
    }
    else {
      this.objCommission.DutyDepositLedgerID = this.identity;
      this.objCommission.Action = "U";
    }
    this._discountService.DutyDepositLedgerAction(this.objCommission).subscribe(
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
    this.objCommission = new DutyDepositLedgerHeader();
    this.objCommission.Action = "D";
    this.objCommission.DutyDepositLedgerID = this.identity;
    this._discountService.DutyDepositLedgerAction(this.objCommission).subscribe(
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


  CommissionForm_Reimbursement: FormGroup;
  AddReimbursementButtonClick(DutyDepositLedgerID: number) {
    this.logValidationErrors1();
    if (this._authorizationGuard.CheckAcess("DutyDepositLedger", "ViewEdit")) {
      return;
    }
    $('#modalpopup_discount_Reimbursement').modal('show');
    this.CommissionForm_Reimbursement = this.fb.group({
      ReimbursementAmount: ['', [Validators.required]],
      ReimbursementDate: ['', [Validators.required]],
    });
    let data = this.items.filter(a => a.DutyDepositLedgerID == DutyDepositLedgerID)[0];
    this.objCommission = data;
  }

  SaveDataReimbursement(): void {
    if (this._authorizationGuard.CheckAcess("DutyDepositLedger", "ViewEdit")) {
      return;
    }
    // stop here if form is invalid
    if (this.CommissionForm_Reimbursement.invalid) {
      return;
    }
    // let DepositAmount = this.objCommission.DepositAmount;
    // let DutyDepositLedgerID = this.objCommission.DutyDepositLedgerID;
    // // this.objCommission = new DutyDepositLedgerHeader();
    // this.objCommission.DutyDepositLedgerID = DutyDepositLedgerID;
    // this.objCommission.DepositAmount = DepositAmount;
    this.objCommission.ReimbursementAmount = this.CommissionForm_Reimbursement.controls['ReimbursementAmount'].value;
    this.objCommission.ReimbursementDate = this.CommissionForm_Reimbursement.controls['ReimbursementDate'].value.startDate._d;
    this.objCommission.Action = "RI";
    this._discountService.DutyDepositLedgerAction(this.objCommission).subscribe(
      (data) => {
        if (data && data.Flag == true) {
          this.alertService.success(data.Msg);
          $('#modalpopup_discount_Reimbursement').modal('hide');
          let startdate: string = moment(this.selectedDateRange.startDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();
          let enddate: string = moment(this.selectedDateRange.endDate._d, 'YYYY-MM-DD[T]HH:mm').format('YYYY-MM-DD').toString();

          this.onLoad(this.SearchBy, this.SearchKeyword, startdate, enddate);
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

  onLoad(SearchBy: string, Search: string, StartDate: string, EndDate: string) {
    return this._discountService.DutyDepositLedgerSearch(SearchBy, Search, StartDate, EndDate).subscribe(
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
  private items: DutyDepositLedgerHeader[] = [] as any;
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
            field: 'FBAShipmentID',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'DepositDate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'DepositAmount',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ReimbursementAmount',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'BalanceAmount',
            operator: 'contains',
            value: inputValue
          },
        ],
      }
    });
  }

  //#endregion Paging Sorting and Filtering End

}
