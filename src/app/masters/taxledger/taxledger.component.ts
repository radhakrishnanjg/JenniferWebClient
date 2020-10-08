import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { LedgerService } from '../../_services/service/ledger.service';
import { TaxLedger, ChartOfAccount } from '../../_services/model';

import { AuthorizationGuard } from '../../_guards/Authorizationguard';
import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { JsonPrivateUtilityService } from 'src/app/_services/service/crossborder/jsonprivateutility.service';
@Component({
  selector: 'app-taxledger',
  templateUrl: './taxledger.component.html',
  styleUrls: ['./taxledger.component.css']
})
export class TaxledgerComponent implements OnInit {

  objLedger: TaxLedger = {} as any;
  LedgerForm: FormGroup;
  selectedDeleteId: number;
  panelTitle: string;
  action: boolean;
  identity: number = 0;
  deleteColumn: string;
  dtOptions: DataTables.Settings = {};
  SearchBy: string = '';
  SearchKeyword: string = '';
  Searchaction: boolean = true;

  constructor(
    private alertService: ToastrService,
    private _ledgerService: LedgerService,
    private _jsonPrivateUtilityService: JsonPrivateUtilityService,
    private _authorizationGuard: AuthorizationGuard,
    private fb: FormBuilder,
  ) { }

  formErrors = {

    'FinancialStatementType': '',
    'Groups': '',
    'SubGroup': '',
    'LedgerName': '',

  };

  validationMessages = {

    'Groups': {
      'required': 'This field is required.',
    },
    'SubGroup': {
      'required': 'This field is required.',
    },
    'FinancialStatementType': {
      'required': 'This field is required.',
    },
    'LedgerName': {
      'required': 'This field is required.',
    },


  };

  logValidationErrors(group: FormGroup = this.LedgerForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl && abstractControl.value && abstractControl.value.length > 0 && !abstractControl.value.replace(/^\s+|\s+$/gm, '').length) {
        abstractControl.setValue('');
      }
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
  ngOnInit() {

    this.LedgerForm = this.fb.group({
      Groups: ['', [Validators.required]],
      SubGroup: ['', [Validators.required]],
      FinancialStatementType: ['', [Validators.required]],
      LedgerName: ['', [Validators.required]],

    });

    this.SearchBy = '';
    this.SearchKeyword = '';
    this.onLoad(this.SearchBy, this.SearchKeyword);

    this.action = true;
    this.identity = 0;


  }

  lstGroup: ChartOfAccount[];
  GetChartOfAccountsGroup() {
    this._jsonPrivateUtilityService.GetChartOfAccountsGroup()
      .subscribe(
        (data: ChartOfAccount[]) => {
          this.lstGroup = data;
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  lstSubGroup: ChartOfAccount[];
  OnChange_AccountsGroup(ChartOfAccountsGroup: string) {
    this._jsonPrivateUtilityService.GetChartOfAccountsSubGroup(ChartOfAccountsGroup)

      .subscribe(
        (data: ChartOfAccount[]) => {
          this.lstSubGroup = data;
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  lstFinancialStatementType: ChartOfAccount[];
  OnChange_AccountsSubGroup(ChartOfAccountsSubGroup: string) {
    this._jsonPrivateUtilityService.GetChartOfAccountsFinancialStatement(ChartOfAccountsSubGroup)

      .subscribe(
        (data: ChartOfAccount[]) => {
          this.lstFinancialStatementType = data;
        },
        (err: any) => {
          console.log(err);
        }
      );
  }


  Search(): void {
    this.onLoad(this.SearchBy, this.SearchKeyword);
  }

  Refresh(): void {
    this.SearchBy = '';
    this.SearchKeyword = '';
    this.Searchaction = true;
  }

  newButtonClick() {

    if (this._authorizationGuard.CheckAcess("Taxledgerlist", "ViewEdit")) {
      return;
    }
    this.GetChartOfAccountsGroup();

    $('#modalpopupledgerupsert').modal('show');
    this.logValidationErrors();
    this.panelTitle = "Add New Ledger";
    this.action = true;
    this.identity = 0;

    this.LedgerForm = this.fb.group({
      Groups: ['', [Validators.required]],
      SubGroup: ['', [Validators.required]],
      FinancialStatementType: ['', [Validators.required]],
      LedgerName: ['', [Validators.required]],

    });

  }

  editButtonClick(AccountID: number) {
    if (this._authorizationGuard.CheckAcess("Taxledgerlist", "ViewEdit")) {
      return;
    }
    this.panelTitle = "Edit Ledger";
    this.action = false;
    this.identity = + AccountID;


    this.LedgerForm = this.fb.group({
      Groups: ['', [Validators.required]],
      SubGroup: ['', [Validators.required]],
      FinancialStatementType: ['', [Validators.required]],
      LedgerName: ['', [Validators.required]],

    });
    let data = this.items.filter(a => a.AccountID == AccountID)[0];
    this.objLedger = data;
    this.LedgerForm.patchValue({
      Groups: data.Groups,
      SubGroup: data.SubGroup,
      FinancialStatementType: data.FinancialStatementType,
      LedgerName: data.LedgerName,
    });

    $('#modalpopupledgerupsert').modal('show');

  }

  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("Taxledgerlist", "ViewEdit")) {
      return;
    }

    if (this.LedgerForm.invalid) {
      return;
    }

    if (this.identity > 0) {
      this.Update();
    }
    else {
      this.Insert();
    }
  }

  Insert() {
    this.objLedger.Groups = this.LedgerForm.controls['Groups'].value;;
    this.objLedger.SubGroup = this.LedgerForm.controls['SubGroup'].value;
    this.objLedger.FinancialStatementType = this.LedgerForm.controls['FinancialStatementType'].value;
    this.objLedger.LedgerName = this.LedgerForm.controls['LedgerName'].value;

    this._ledgerService.TaxLedgerInsert(this.objLedger).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.alertService.success(data.Msg);
          $('#modalpopupledgerupsert').modal('hide');
          this.onLoad(this.SearchBy, this.SearchKeyword);
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

  Update() {
    this.objLedger.AccountID = this.identity;
    this.objLedger.Groups = this.LedgerForm.controls['Groups'].value;;
    this.objLedger.SubGroup = this.LedgerForm.controls['SubGroup'].value;
    this.objLedger.FinancialStatementType = this.LedgerForm.controls['FinancialStatementType'].value;
    this.objLedger.LedgerName = this.LedgerForm.controls['LedgerName'].value;
    this._ledgerService.TaxLedgerUpdate(this.objLedger).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.alertService.success(data.Msg);
          $('#modalpopupledgerupsert').modal('hide');
          this.onLoad(this.SearchBy, this.SearchKeyword);
          this.identity = 0;
        }
        else {
          this.onLoad(this.SearchBy, this.SearchKeyword);
          this.alertService.error(data.Msg);
        }
      },
      (error: any) => {
        console.log(error);
      }
    );

  }
 
  onLoad(SearchBy: string, Search: string) {
    return this._ledgerService.TaxLedgerSearch(SearchBy, Search).subscribe(
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
    field: 'Groups',
    dir: 'asc'
  }];

  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  private items: TaxLedger[] = [] as any;
  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'Groups', operator: 'contains', value: '' }]
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
            field: 'Groups',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'SubGroup',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'FinancialStatementType',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'LedgerName',
            operator: 'contains',
            value: inputValue
          },
        ],
      }
    });
  }


}
