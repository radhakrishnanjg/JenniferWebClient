import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { UsernameValidator } from '../../_validators/username';
import { VoucherService } from '../../_services/service/voucher.service';
import { Voucher, Dropdown, Marketplace, VoucherGSTID } from '../../_services/model';

import { Router } from '@angular/router';
import { AuthorizationGuard } from '../../_guards/Authorizationguard';
import { UtilityService } from '../../_services/service/utility.service';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { process, State } from '@progress/kendo-data-query';
import { State1 } from '../../_services/model/country'
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';

@Component({
  selector: 'app-voucherlist',
  templateUrl: './voucherlist.component.html',
  styleUrls: ['./voucherlist.component.css']
})
export class VoucherlistComponent implements OnInit {

  objVoucher: Voucher = {} as any;
  VoucherForm: FormGroup;
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
    private _voucherService: VoucherService,
    private _router: Router,
    private utilityService: UtilityService,
    private _authorizationGuard: AuthorizationGuard,
    private _PrivateutilityService: PrivateutilityService,
    private fb: FormBuilder,
  ) { }

  formErrors = {

    'StateID': '',
    'GSTID': '',
    'MarketPlaceID': '',
    'TaxType': '',
    'VoucherType': '',
    'TransactionType': '',
    'VoucherText': ''

  };

  validationMessages = {

    'StateID': {
      'min': 'This field is required.',

    },

    'GSTID': {
      'min': 'This field is required.',
    },

    'MarketPlaceID': {
      'min': 'This field is required.',
    },

    'TaxType': {
      'required': 'This field is required.',

    },
    'VoucherType': {
      'required': 'This field is required.',

    },

    'TransactionType': {
      'required': 'This field is required.',

    },

    'VoucherText': {
      'required': 'This field is required.',
      'VoucherTextInUse': 'This field is already exist.',

    },

  };

  logValidationErrors(group: FormGroup = this.VoucherForm): void {
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

  VoucherName: string = "";
  ngOnInit() {

    this.VoucherForm = this.fb.group({
      StateID: [0, [Validators.min(1)]],
      GSTID: [0, [Validators.min(1)]],
      MarketPlaceID: [0, [Validators.min(1)]],
      // TaxType: ['', [Validators.required]],
      VoucherType: ['', [Validators.required]],
      TransactionType: ['', [Validators.required]],
      VoucherText: ['', [],],
    });

    this.SearchBy = '';
    this.SearchKeyword = '';
    this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);

    this.panelTitle = "Add New Voucher";
    this.action = true;
    this.identity = 0;

    this.GetStates();
    this.GetMarketPlaces();
    // this.GettaxType();
    this.GetVoucherType();
    this.GetTransactionType();

  }


  OnchangeforVendorName() {
    this.objVoucher.StateID = this.VoucherForm.controls['StateID'].value;
    this.objVoucher.GSTID = this.VoucherForm.controls['GSTID'].value;
    this.objVoucher.MarketPlaceID = this.VoucherForm.controls['MarketPlaceID'].value;
    this.objVoucher.TransactionType = this.VoucherForm.controls['TransactionType'].value;
    this.objVoucher.VoucherType = this.VoucherForm.controls['VoucherType'].value;
    this.objVoucher.VoucherText = this.VoucherForm.controls['VoucherText'].value;

    if (this.objVoucher.StateID != 0 &&
      this.objVoucher.MarketPlaceID != 0) {
      //Sample text to show down (KA-Amazon-GST-B2C-Sales)
      let StateCode = this.lstStates.filter(a => a.StateID == this.objVoucher.StateID)[0].StateCode;
      let MarketPlaceCode = this.lstMarketplaces.filter(a => a.MarketplaceID == this.objVoucher.MarketPlaceID)[0].MarketPlaceCode;
      // this.VoucherName = StateCode + '-' + this.objVoucher.GSTID + '-'
      //   + MarketPlaceCode + '-'
      //   + this.objVoucher.TransactionType + '-'
      //   + this.objVoucher.VoucherType + '-' + this.objVoucher.VoucherText;

      let VoucherText = this.objVoucher.VoucherText == "" ? "" : '-' + this.objVoucher.VoucherText;
      this.VoucherName =
        this.objVoucher.VoucherType + '-' +
        StateCode + '-' +
        this.objVoucher.GSTID + '-' +
        MarketPlaceCode + '-' +
        this.objVoucher.TransactionType +
        VoucherText;


    }

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

  lstGSTId: VoucherGSTID[] = [] as any;
  onchangeStateID(selectedValue: string) {
    let StateID = parseInt(selectedValue);
    if (StateID > 0) {
      this._voucherService.GetGstId(StateID).subscribe(
        (data: VoucherGSTID[]) => {
          this.lstGSTId = data;
        },
        (err: any) => {
          console.log(err);
        }
      );
    }
  }

  lstMarketplaces: Marketplace[];
  GetMarketPlaces() {
    this._PrivateutilityService.getMarketPlaces()
      .subscribe(
        (data: Marketplace[]) => {
          this.lstMarketplaces = data;
        },
        (err: any) => {
          console.log(err);
        }
      );
  }
  lstVoucherType: Dropdown[];
  GetVoucherType() {
    this._PrivateutilityService.GetValues('VoucherType')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstVoucherType = data;
        },
        (err: any) => {
          console.log(err);
        }
      );
  }


  lstTransactionType: Dropdown[];
  GetTransactionType() {
    this._PrivateutilityService.GetValues('TransactionType')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstTransactionType = data;
        },
        (err: any) => {
          console.log(err);
        }
      );
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

    this.VoucherForm.get('StateID').enable();
    this.VoucherForm.get('GSTID').enable();
    this.VoucherForm.get('MarketPlaceID').enable();
    // this.VoucherForm.get('TaxType').enable();
    this.VoucherForm.get('VoucherType').enable();
    this.VoucherForm.get('TransactionType').enable();
    this.VoucherName = '';

    if (this._authorizationGuard.CheckAcess("Voucherlist", "ViewEdit")) {
      return;
    }
    $('#modalpopupvoucherupsert').modal('show');
    this.logValidationErrors();
    this.panelTitle = "Add New Voucher";
    this.action = true;
    this.identity = 0;

    this.VoucherForm = this.fb.group({
      StateID: [0, [Validators.min(1)]],
      GSTID: [0, [Validators.min(1)]],
      MarketPlaceID: [0, [Validators.min(1)]],
      // TaxType: ['', [Validators.required]],
      VoucherType: ['', [Validators.required]],
      TransactionType: ['', [Validators.required]],
      VoucherText: ['', [],
      ],

    });
  }

  editButtonClick(id: number) {
    if (this._authorizationGuard.CheckAcess("Voucherlist", "ViewEdit")) {
      return;
    }

    this.panelTitle = "Edit Voucher";
    this.action = false;
    this.identity = + id;

    this.VoucherForm = this.fb.group({
      StateID: [0, [Validators.min(1)]],
      GSTID: [0, [Validators.min(1)]],
      MarketPlaceID: [0, [Validators.min(1)]],
      // TaxType: ['', [Validators.required]],
      VoucherType: ['', [Validators.required]],
      TransactionType: ['', [Validators.required]],
      VoucherText: ['', [],
      ],

    });

    this._voucherService.SearchById(this.identity)
      .subscribe(
        (data: Voucher) => {
          var StateID = data.StateID.toString();
          var MarketPlaceID = data.MarketPlaceID.toString();
          var GSTID = data.GSTID.toString();
          this.onchangeStateID(data.StateID.toString());
          this.VoucherForm.patchValue({
            StateID: StateID,
            MarketPlaceID: MarketPlaceID,
            GSTID: GSTID,
            VoucherType: data.VoucherType,
            TransactionType: data.TransactionType,
            VoucherText: data.VoucherText,

          });
          this.VoucherName = data.VoucherName,
            this.logValidationErrors();
          if (this.identity > 0) {
            this.VoucherForm.get('StateID').disable();
            this.VoucherForm.get('GSTID').disable();
            this.VoucherForm.get('MarketPlaceID').disable();
            // this.VoucherForm.get('TaxType').disable();
            this.VoucherForm.get('VoucherType').disable();
            this.VoucherForm.get('TransactionType').disable();
          }
        },
        (err: any) => {
          console.log(err)
        }
      );
    $('#modalpopupvoucherupsert').modal('show');
  }

  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("Voucherlist", "ViewEdit")) {
      return;
    }
    if (this.VoucherForm.invalid) {
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
    this.objVoucher.StateID = this.VoucherForm.controls['StateID'].value;
    this.objVoucher.GSTID = this.VoucherForm.controls['GSTID'].value;
    this.objVoucher.MarketPlaceID = this.VoucherForm.controls['MarketPlaceID'].value;
    this.objVoucher.TransactionType = this.VoucherForm.controls['TransactionType'].value;
    this.objVoucher.VoucherType = this.VoucherForm.controls['VoucherType'].value;

    this.objVoucher.VoucherText = this.VoucherForm.controls['VoucherText'].value;
    this.objVoucher.VoucherName = this.VoucherName;
    this._voucherService.Insert(this.objVoucher).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.alertService.success(data.Msg);
          $('#modalpopupvoucherupsert').modal('hide');
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
    this.objVoucher.VoucherID = this.identity;
    this.objVoucher.StateID = this.VoucherForm.controls['StateID'].value;
    this.objVoucher.GSTID = this.VoucherForm.controls['GSTID'].value;
    this.objVoucher.MarketPlaceID = this.VoucherForm.controls['MarketPlaceID'].value;
    this.objVoucher.TransactionType = this.VoucherForm.controls['TransactionType'].value;

    this.objVoucher.VoucherType = this.VoucherForm.controls['VoucherType'].value;
    this.objVoucher.VoucherText = this.VoucherForm.controls['VoucherText'].value;;
    this.objVoucher.VoucherName = this.VoucherName;

    this._voucherService.Update(this.objVoucher).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.alertService.success(data.Msg);
          $('#modalpopupvoucherupsert').modal('hide');
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
    if (this._authorizationGuard.CheckAcess("Voucherlist", "ViewEdit")) {
      return;
    }

    this.selectedDeleteId = + id;
    this.deleteColumn = DeleteColumnvalue;
    $('#modaldeleteconfimation').modal('show');
  }

  delete() {
    this._voucherService.Delete(this.selectedDeleteId).subscribe(
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
    return this._voucherService.Search(SearchBy, Search, IsActive).subscribe(
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
    field: 'StateName',
    dir: 'asc'
  }];

  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  private items: Voucher[] = [] as any;
  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'StateName', operator: 'contains', value: '' }]
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
            field: 'StateName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'MarketPlace',
            operator: 'contains',
            value: inputValue
          },
          // {
          //   field: 'TaxType',
          //   operator: 'contains',
          //   value: inputValue
          // },
          {
            field: 'VoucherType',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'TransactionType',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'VoucherText',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'VoucherName',
            operator: 'contains',
            value: inputValue
          },

        ],
      }
    });
  }
}
