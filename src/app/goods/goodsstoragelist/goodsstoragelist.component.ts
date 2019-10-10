import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { GoodsstorageService } from '../../_services/service/goodsstorage.service';
import { Goodsstorage } from '../../_services/model';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';

@Component({
  selector: 'app-goodsstoragelist',
  templateUrl: './goodsstoragelist.component.html',
  styleUrls: ['./goodsstoragelist.component.css']
})
export class GoodsstoragelistComponent implements OnInit {

  itemlist: Goodsstorage[] = [];
  //obj: Goodsstorage;
  obj: Goodsstorage = {} as any;
  goodsstorageform: FormGroup;
  panelTitle: string;
  action: boolean;
  identity: number = 0;
  serial: string = '';
  //confirmDelete = false;
  //selectedDeleteId: number;
  dtOptions: DataTables.Settings = {};
  //deleteColumn: string;
  SearchBy: string = '';
  SearchKeyword: string = '';
  JenniferItemSerial: string = '';
  constructor(
    private alertService: ToastrService,
    private _router: Router,
    private _goodsstorageService: GoodsstorageService,
    private fb: FormBuilder,
    private _spinner: NgxSpinnerService,
    private _authorizationGuard: AuthorizationGuard,
  ) { }

  formErrors = {
    'WarehouseLocation': '',
    'WarehouseRack': '',
    'WarehouseBin': '',
  };

  // This object contains all the validation messages for this form
  validationMessages = {

    'WarehouseLocation': {
      'required': 'This Field is required.',
    },

    'WarehouseRack': {
      'required': 'This Field is required.',
    },

    'WarehouseBin': {
      'required': 'This Field is required.',
    },
  };

  logValidationErrors(group: FormGroup = this.goodsstorageform): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl && abstractControl.value && !abstractControl.value.replace(/^\s+|\s+$/gm, '').length) {
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
    this.onLoad(this.SearchBy, this.SearchKeyword);
    this.identity = 0;
    this.goodsstorageform = this.fb.group({
      WarehouseLocation: ['', [Validators.required,]],
      WarehouseRack: ['', [Validators.required,]],
      WarehouseBin: ['', [Validators.required,]],
    });
  }

  Refresh(): void {
    this.SearchBy = '',
      this.SearchKeyword = ''
  }

  Search(): void {
    this.onLoad(this.SearchBy, this.SearchKeyword);
  }

  editButtonClick(id: number) {
    if (this._authorizationGuard.CheckAcess("Goodsstoragelist", "ViewEdit")) {
      return;
    }
    $('#modalpopup_goodsstorage').modal('show');
    this.logValidationErrors();
    this.panelTitle = "Edit Shipment outward";
    this.identity = id;
    let obj = this.items.filter(x => { return x.GoodsStorageID == id })[0]
    this.goodsstorageform.controls['WarehouseLocation'].setValue(obj.WarehouseLocation);
    this.goodsstorageform.controls['WarehouseRack'].setValue(obj.WarehouseRack);
    this.goodsstorageform.controls['WarehouseBin'].setValue(obj.WarehouseBin);
    this.JenniferItemSerial = obj.JenniferItemSerial;
  }

  SaveData(): void {

    if (this._authorizationGuard.CheckAcess("Goodsstoragelist", "ViewEdit")) {
      return;
    }
    // stop here if form is invalid
    if (this.goodsstorageform.invalid) {
      return;
    }
    if (this.identity > 0) {
      this.Update();
    }
  }

  Update() {

    this.obj.GoodsStorageID = this.identity;
    this.obj.WarehouseLocation = this.goodsstorageform.controls['WarehouseLocation'].value;
    this.obj.WarehouseRack = this.goodsstorageform.controls['WarehouseRack'].value;
    this.obj.WarehouseBin = this.goodsstorageform.controls['WarehouseBin'].value;
    this.obj.JenniferItemSerial = this.JenniferItemSerial;
    this._spinner.show();
    this._goodsstorageService.update(this.obj).subscribe(
      (data) => {
        if (data != null && data == true) {
          this._spinner.hide();
          this.alertService.success('Goods storage data has been updated successful');
          this._router.navigate(['/Goodsstoragelist']);
        }
        else {
          this._spinner.hide();
          this.alertService.error('Goods storage update failed!');
          this._router.navigate(['/Goodsstoragelist']);
        }
        $('#modalpopup_goodsstorage').modal('hide');
        this.onLoad(this.SearchBy, this.SearchKeyword);
        this.identity = 0;
      },
      (error: any) => {
        this._spinner.hide();
        console.log(error);
      }
    );
  }

  onLoad(SearchBy: string, Search: string) {
    this._spinner.show();
    return this._goodsstorageService.search(SearchBy, Search).subscribe(
      (data) => {
        if (data != null) {
          this.items = data;
          this.loadItems();
        }
        this._spinner.hide();
      },

      (err) => {
        this._spinner.hide();
        console.log(err);
      }

    );
  }

  AddNewLink() {
    if (this._authorizationGuard.CheckAcess("Goodsstoragelist", "ViewEdit")) {
      return;
    }
    this._router.navigate(['/Goodsstorage/Create',]);
  }

  //#region Paging Sorting and Filtering Start
  public allowUnsort = true;
  public sort: SortDescriptor[] = [{
    field: 'OrderID',
    dir: 'asc'
  }];
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  private items: Goodsstorage[] = [] as any;
  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'OrderID', operator: 'contains', value: '' }]
    }
  };
  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.loadItems();
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.loadSortItems();
  }

  private loadItems(): void {
    this.gridView = {
      data: this.items.slice(this.skip, this.skip + this.pageSize),
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


  //#endregion Paging Sorting and Filtering End

}
