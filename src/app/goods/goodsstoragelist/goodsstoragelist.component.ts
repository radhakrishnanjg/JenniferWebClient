import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { GoodsstorageService } from '../../_services/service/goodsstorage.service';
import { UsernameValidator } from '../../_validators/username';

import { Goodsstorage } from '../../_services/model';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { AuthenticationService } from '../../_services/service/authentication.service';

@Component({
  selector: 'app-goodsstoragelist',
  templateUrl: './goodsstoragelist.component.html',
  styleUrls: ['./goodsstoragelist.component.css']
})
export class GoodsstoragelistComponent implements OnInit {

  lst: Goodsstorage[];
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
      if (abstractControl && abstractControl.value && !abstractControl.value.replace(/\s/g, '').length) {
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

  onLoad(SearchBy: string, Search: string) {
    this._spinner.show();
    return this._goodsstorageService.search(SearchBy, Search).subscribe(
      (data) => {
        this.lst = data;
        this.dtOptions = {
          pagingType: 'full_numbers',
          "language": {
            "search": 'Filter',
          },
        };
        this._spinner.hide();
      },

      (err) => {
        this._spinner.hide();
        console.log(err);
      }

    );
  }

  editButtonClick(id: number) {
    if (this._authorizationGuard.CheckAcess("Goodsstoragelist", "ViewEdit")) {
      return;
    }
    $('#modalpopup_goodsstorage').modal('show');
    this.logValidationErrors();
    this.panelTitle = "Edit Shipment outward";
    this.identity = id;
    let obj = this.lst.filter(x => { return x.GoodsStorageID == id })[0]
    this.goodsstorageform.controls['WarehouseLocation'].setValue(obj.WarehouseLocation);
    this.goodsstorageform.controls['WarehouseRack'].setValue(obj.WarehouseRack);
    this.goodsstorageform.controls['WarehouseBin'].setValue(obj.WarehouseBin);
    this.JenniferItemSerial = obj.JenniferItemSerial;
  }

  SaveData(): void {
    debugger
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
    debugger
    this.obj.GoodsStorageID = this.identity;
    this.obj.WarehouseLocation = this.goodsstorageform.controls['WarehouseLocation'].value;
    this.obj.WarehouseRack = this.goodsstorageform.controls['WarehouseRack'].value;
    this.obj.WarehouseBin = this.goodsstorageform.controls['WarehouseBin'].value;
    this.obj.JenniferItemSerial = this.JenniferItemSerial;
    this._spinner.show();
    this._goodsstorageService.update(this.obj).subscribe(
      (data) => {
        if (data && data == true) {
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
}
