import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { ShipmentoutwardService } from '../../_services/service/shipmentoutward.service';
import { Shipmentoutward } from '../../_services/model';
import { AuthorizationGuard } from '../../_guards/Authorizationguard';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { UsernameValidator } from '../../_validators/username';
import * as moment from 'moment';
import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';

@Component({
  selector: 'app-shipmentoutwardlist',
  templateUrl: './shipmentoutwardlist.component.html',
  styleUrls: ['./shipmentoutwardlist.component.css']
})
export class ShipmentoutwardlistComponent implements OnInit {
  //#region variable declartion

  shipmentoutwardform: FormGroup;

  obj: Shipmentoutward = {} as any;
  confirmDelete = false;
  panelTitle: string;
  action: boolean;
  selectedDeleteId: number;
  identity: number = 0;
  dtOptions: DataTables.Settings = {};
  deleteColumn: string;
  SearchBy: string = '';
  SearchKeyword: string = '';
  OutwardID: string = '';

  //#endregion
  constructor(
    private alertService: ToastrService,
    private _router: Router,
    private _shipmentoutwardService: ShipmentoutwardService,
    
    private fb: FormBuilder,
    private _authorizationGuard: AuthorizationGuard,
    private _PrivateutilityService: PrivateutilityService,
    private aroute: ActivatedRoute,
    private usernameValidator: UsernameValidator,
  ) { }

  formErrors = {
    'GSTEwayBillNumber': '',
    'CourierTrackingID': ''
  };

  validationMessages = {
    'GSTEwayBillNumber': {
      'required': 'This Field is required.',
    },
    'CourierTrackingID': {
      'required': 'This Field is required.',
      'CourierTrackingIDInUse': 'This Courier Tracking Id is invalid'
    }
  }

  logValidationErrors(group: FormGroup = this.shipmentoutwardform): void {
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

  ngOnInit() {
    this.onLoad('', '');
    this.panelTitle = 'Add New Shipment outward ';
    this.identity = 0;
    this.shipmentoutwardform = this.fb.group({
      GSTEwayBillNumber: ['', [Validators.required]],
      CourierTrackingID: ['', [Validators.required],
        this.usernameValidator.notexistCourierTrackingID(this.identity)],
    });
  }

  Search(): void {
    this.onLoad(this.SearchBy, this.SearchKeyword);
  }

  Refresh(): void {
    this.SearchBy = '',
      this.SearchKeyword = ''
  }

  newButtonClick() {
    if (this._authorizationGuard.CheckAcess("Shipmentoutwardlist", "ViewEdit")) {
      return;
    }
    $('#modalpopup_shipmentoutward').modal('show');
    this.logValidationErrors();
    this.panelTitle = "Add New Shipment Outward";
    this.action = true;

    this.shipmentoutwardform.controls['GSTEwayBillNumber'].setValue('');
    this.shipmentoutwardform.controls['CourierTrackingID'].setValue('');
    //
    this._shipmentoutwardService.generateOutwardID().subscribe(
      (data) => {
        this.OutwardID = data;
        //
      },

      (err) => {
        //
        console.log(err);
      }
    );
  }

  editButtonClick(id: string) {
    $('#modalpopup_shipmentoutward').modal('show');
    this.logValidationErrors();
    this.panelTitle = "Edit Shipment outward";
    this.action = true;
    let obj = this.items.filter(x => { return x.OutwardID == id })[0]
    this.shipmentoutwardform.controls['GSTEwayBillNumber'].setValue(obj.GSTEwayBillNumber);
    this.shipmentoutwardform.controls['CourierTrackingID'].setValue(obj.CourierTrackingID);
    this.OutwardID = obj.OutwardID;
  }

  CourierTrackingIDChangeFocus() {
    $('#GSTEwayBillNumber').focus();
  }

  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("Shipmentoutwardlist", "ViewEdit")) {
      return;
    }
    // stop here if form is invalid
    if (this.shipmentoutwardform.invalid) {
      return;
    }
    this.Update();
  }

  Update() {
    this.obj.OutwardID = this.OutwardID;
    this.obj.GSTEwayBillNumber = this.shipmentoutwardform.controls['GSTEwayBillNumber'].value;
    this.obj.CourierTrackingID = this.shipmentoutwardform.controls['CourierTrackingID'].value;
    //
    this._shipmentoutwardService.updateGSTBill(this.obj).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          //
          this.alertService.success(data.Msg); 
        }
        else {
          //
          this.alertService.error(data.Msg); 
        }
        $('#modalpopup_shipmentoutward').modal('hide');
        this.onLoad(this.SearchBy, this.SearchKeyword);
        this.identity = 0;
      },
      (error: any) => {
        //
        console.log(error);
      }
    );
  }

  onLoad(SearchBy: string, Search: string) {
    //
    return this._shipmentoutwardService.search(SearchBy, Search).subscribe(
      (data) => {
        if (data != null) {
          this.items = data;
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
    field: 'OutwardID',
    dir: 'asc'
  }];
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  private items: Shipmentoutward[] = [] as any;
  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'OutwardID', operator: 'contains', value: '' }]
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

  //#endregion Paging Sorting and Filtering End


}
