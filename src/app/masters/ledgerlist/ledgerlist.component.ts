import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { UsernameValidator } from '../../_validators/username';
import { LedgerService } from '../../_services/service/ledger.service';
import { Voucher, Ledger, LedgerTaxRate, State1, VoucherGSTID } from '../../_services/model';

import { Router } from '@angular/router';
import { AuthorizationGuard } from '../../_guards/Authorizationguard';
import { UtilityService } from '../../_services/service/utility.service';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';

@Component({
  selector: 'app-ledgerlist',
  templateUrl: './ledgerlist.component.html',
  styleUrls: ['./ledgerlist.component.css']
})
export class LedgerlistComponent implements OnInit {

  objLedger: Ledger = {} as any;
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
    private _usernameValidator: UsernameValidator,
    private _ledgerService: LedgerService,
    private utilityService: UtilityService,
    private _authorizationGuard: AuthorizationGuard,
    private fb: FormBuilder,
  ) { }

  formErrors = {

    'VoucherID': '',
    'TaxRate': '',
    'LedgerText': '',

  };

  validationMessages = {

    'VoucherID': {
      'min': 'This field is required.',

    },
    'TaxRate': {
      'required': 'This field is required.',
    },

    'LedgerText': {
      'required': 'This field is required.',
      'LedgerTextInUse': 'This field is already exist.',

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


  InterstateLedgerName: string = "";
  InterstateOutput_InputLedgerName: string = "";
  LocalLedgerName: string = "";
  LocalOutput_InputLedgerName1: string = "";
  LocalOutput_InputLedgerName2: string = "";
  ngOnInit() {

    this.LedgerForm = this.fb.group({
      VoucherID: [0, [Validators.min(1)]],
      TaxRate: ['', [Validators.required]],
      LedgerText: ['', [],
        // this._usernameValidator.existLedgerText(this.identity)
      ],

    });

    this.SearchBy = '';
    this.SearchKeyword = '';
    this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);

    this.action = true;
    this.identity = 0;

    this.GetVoucherName();
    this.GetTaxrate();
    this.GetStates();

  }

  lstStates: State1[];
  GetStates() {
    this.utilityService.getStates1(1)
      .subscribe(
        (data: State1[]) => {
          this.lstStates = data;
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  lstVoucher: Voucher[];
  GetVoucherName() {
    this._ledgerService.getvoucher()

      .subscribe(
        (data: Voucher[]) => {
          this.lstVoucher = data;
        },
        (err: any) => {
          console.log(err);
        }
      );


  }

  lstTaxRate: LedgerTaxRate[];
  GetTaxrate() {
    this._ledgerService.gettaxrate()
      .subscribe(
        (data: LedgerTaxRate[]) => {
          this.lstTaxRate = data;
        },
        (err: any) => {
          console.log(err);
        }
      );


  }


  OnChangeforLedgerName() {
    let VoucherID = this.LedgerForm.controls['VoucherID'].value;;
    let TaxRate = this.LedgerForm.controls['TaxRate'].value;
    let LedgerText = this.LedgerForm.controls['LedgerText'].value == "" ? "" : '-' + this.LedgerForm.controls['LedgerText'].value;

    let GSTID = this.lstVoucher.filter(a => a.VoucherID == VoucherID)[0].GSTID;
    let VoucherType = this.lstVoucher.filter(a => a.VoucherID == VoucherID)[0].VoucherType;
    let StateID = this.lstVoucher.filter(a => a.VoucherID == VoucherID)[0].StateID;
    let StateCode = this.lstStates.filter(a => a.StateID == StateID)[0].StateCode;
    debugger
    if (TaxRate == 0) {
      this.InterstateLedgerName = VoucherType + ' ' + StateCode + ' ' + GSTID + ' @ Tax Exempted' + ' INTERSTATE' + LedgerText;
      this.InterstateOutput_InputLedgerName = 'Output ' + StateCode + '-IGST ' + ' @ Tax Exempted' + LedgerText;
      this.LocalLedgerName = VoucherType + ' ' + StateCode + ' @ Tax Exempted' + ' LOCAL' + LedgerText;
      this.LocalOutput_InputLedgerName1 = 'Output ' + StateCode + ' -CGST ' + ' @ Tax Exempted' + LedgerText;
      this.LocalOutput_InputLedgerName2 = 'Output ' + StateCode + ' -SGST ' + ' @ Tax Exempted' + LedgerText;
      if (VoucherType == "PURCHASE" || VoucherType == "IMPORT PURCHASE") {
        this.LocalOutput_InputLedgerName1 = 'Input ' + StateCode + ' -CGST ' + ' @ Tax Exempted' + LedgerText;
        this.LocalOutput_InputLedgerName2 = 'Input ' + StateCode + ' -SGST ' + ' @ Tax Exempted' + LedgerText;
      }
    }
    else {
      this.InterstateLedgerName = VoucherType + ' ' + StateCode + ' ' + GSTID + ' @ ' + TaxRate + '% INTERSTATE' + LedgerText;
      this.InterstateOutput_InputLedgerName = 'Output ' + StateCode + '-IGST ' + ' @ ' + TaxRate + '%' + LedgerText;
      this.LocalLedgerName = VoucherType + ' ' + StateCode + ' @ ' + TaxRate + '% LOCAL' + LedgerText;
      this.LocalOutput_InputLedgerName1 = 'Output ' + StateCode + ' -CGST ' + ' @ ' + TaxRate / 2 + '%' + LedgerText;
      this.LocalOutput_InputLedgerName2 = 'Output ' + StateCode + ' -SGST ' + ' @ ' + TaxRate / 2 + '%' + LedgerText;
      if (VoucherType == "PURCHASE" || VoucherType == "IMPORT PURCHASE") { 
        this.LocalOutput_InputLedgerName1 = 'Input ' + StateCode + ' -CGST ' + ' @ ' + TaxRate / 2 + '%' + LedgerText;
        this.LocalOutput_InputLedgerName2 = 'Input ' + StateCode + ' -SGST ' + ' @ ' + TaxRate / 2 + '%' + LedgerText;
      }
    }
    if (VoucherType == "PURCHASE" || VoucherType == "IMPORT PURCHASE") {
      this.InterstateLedgerName = "";
      this.InterstateOutput_InputLedgerName = "";
    }
  }


  Search(): void {
    this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
  }

  Refresh(): void {
    this.SearchBy = '';
    this.SearchKeyword = '';
    this.Searchaction = true;
  }

  newButtonClick() {

    this.LedgerForm.get('VoucherID').enable();
    this.LedgerForm.get('TaxRate').enable();
    this.InterstateLedgerName = '';
    this.InterstateOutput_InputLedgerName = '';
    this.LocalLedgerName = '';
    this.LocalOutput_InputLedgerName1 = '';
    this.LocalOutput_InputLedgerName2 = '';

    if (this._authorizationGuard.CheckAcess("Ledgerlist", "ViewEdit")) {
      return;
    }
    $('#modalpopupledgerupsert').modal('show');
    this.logValidationErrors();
    this.panelTitle = "Add New Ledger";
    this.action = true;
    this.identity = 0;

    this.LedgerForm = this.fb.group({
      VoucherID: [0, [Validators.min(1)]],
      TaxRate: ['', [Validators.required]],
      LedgerText: ['', [],
        // this._usernameValidator.existLedgerText(this.identity)
      ],
    });

  }

  editButtonClick(id: number) {
    if (this._authorizationGuard.CheckAcess("Ledgerlist", "ViewEdit")) {
      return;
    }

    this.panelTitle = "Edit Ledger";
    this.action = false;
    this.identity = + id;


    this.LedgerForm = this.fb.group({
      VoucherID: [0, [Validators.min(1)]],
      TaxRate: ['', [Validators.required]],
      LedgerText: ['', [],
        // this._usernameValidator.existLedgerText(this.identity)
      ],

    });

    this._ledgerService.SearchById(this.identity)
      .subscribe(
        (data: Ledger) => {
          var VoucherID = data.VoucherID.toString();

          this.LedgerForm.patchValue({
            VoucherID: VoucherID,
            TaxRate: data.TaxRate,
            LedgerText: data.LedgerText,
          });
          this.InterstateLedgerName = data.InterstateLedgerName,
            this.InterstateOutput_InputLedgerName = data.InterstateOutput_InputLedgerName,
            this.LocalLedgerName = data.LocalLedgerName,
            this.LocalOutput_InputLedgerName1 = data.LocalOutput_InputLedgerName1,
            this.LocalOutput_InputLedgerName2 = data.LocalOutput_InputLedgerName2,
            this.logValidationErrors();
          if (this.identity > 0) {
            this.LedgerForm.get('VoucherID').disable();
            this.LedgerForm.get('TaxRate').disable();
          }
        },
        (err: any) => {
          console.log(err)
        }
      );
    $('#modalpopupledgerupsert').modal('show');

  }

  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("Ledgerlist", "ViewEdit")) {
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
    this.objLedger.VoucherID = this.LedgerForm.controls['VoucherID'].value;;
    this.objLedger.TaxRate = this.LedgerForm.controls['TaxRate'].value;
    this.objLedger.LedgerText = this.LedgerForm.controls['LedgerText'].value;

    this.objLedger.InterstateLedgerName = this.InterstateLedgerName;
    this.objLedger.InterstateOutput_InputLedgerName = this.InterstateOutput_InputLedgerName;
    this.objLedger.LocalLedgerName = this.LocalLedgerName;
    this.objLedger.LocalOutput_InputLedgerName1 = this.LocalOutput_InputLedgerName1;
    this.objLedger.LocalOutput_InputLedgerName2 = this.LocalOutput_InputLedgerName2;

    this._ledgerService.Insert(this.objLedger).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.alertService.success(data.Msg);
          $('#modalpopupledgerupsert').modal('hide');
          this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
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
    this.objLedger.LedgerID = this.identity;
    this.objLedger.VoucherID = this.LedgerForm.controls['VoucherID'].value;;
    this.objLedger.TaxRate = this.LedgerForm.controls['TaxRate'].value;
    this.objLedger.LedgerText = this.LedgerForm.controls['LedgerText'].value;

    this.objLedger.InterstateLedgerName = this.InterstateLedgerName;
    this.objLedger.InterstateOutput_InputLedgerName = this.InterstateOutput_InputLedgerName;
    this.objLedger.LocalLedgerName = this.LocalLedgerName;
    this.objLedger.LocalOutput_InputLedgerName1 = this.LocalOutput_InputLedgerName1;
    this.objLedger.LocalOutput_InputLedgerName2 = this.LocalOutput_InputLedgerName2;


    this._ledgerService.Update(this.objLedger).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.alertService.success(data.Msg);
          $('#modalpopupledgerupsert').modal('hide');
          this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
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

  confirmDeleteid(id: number, DeleteColumnvalue: string) {
    if (this._authorizationGuard.CheckAcess("Ledgerlist", "ViewEdit")) {
      return;
    }

    this.selectedDeleteId = + id;
    this.deleteColumn = DeleteColumnvalue;
    $('#modaldeleteconfimation').modal('show');
  }

  delete() {
    this._ledgerService.Delete(this.selectedDeleteId).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
          this.alertService.success(data.Msg);
        } else {
          this.alertService.error(data.Msg);
        }
        $('#modaldeleteconfimation').modal('hide');
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  onLoad(SearchBy: string, Search: string, IsActive: boolean) {
    return this._ledgerService.Search(SearchBy, Search, IsActive).subscribe(
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
    field: 'VoucherName',
    dir: 'asc'
  }];

  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  private items: Ledger[] = [] as any;
  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'VoucherName', operator: 'contains', value: '' }]
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
            field: 'VoucherName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'TaxRate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'LedgerText',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'InterstateLedgerName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'InterstateOutput_InputLedgerName',
            operator: 'contains',
            value: inputValue
          },

          {
            field: 'LocalLedgerName',
            operator: 'contains',
            value: inputValue
          },

          {
            field: 'LocalOutput_InputLedgerName1',
            operator: 'contains',
            value: inputValue
          },

          {
            field: 'LocalOutput_InputLedgerName2',
            operator: 'contains',
            value: inputValue
          },

        ],
      }
    });
  }

}
