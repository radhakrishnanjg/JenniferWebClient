import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ShipmentoutwardService } from '../../_services/service/shipmentoutward.service';
import { Shipmentoutward } from '../../_services/model';
import { AuthorizationGuard } from '../../_guards/Authorizationguard';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { UsernameValidator } from '../../_validators/username';
import * as moment from 'moment';

@Component({
  selector: 'app-shipmentoutwardlist',
  templateUrl: './shipmentoutwardlist.component.html',
  styleUrls: ['./shipmentoutwardlist.component.css']
})
export class ShipmentoutwardlistComponent implements OnInit {
  //#region variable declartion

  shipmentoutwardform: FormGroup;

  lst: Shipmentoutward[];
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
    private _spinner: NgxSpinnerService,
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
      'maxlength': 'This Field must be less than 15 characters.'
    },
    'CourierTrackingID': {
      'required': 'This Field is required.',
      'maxlength': 'This Field must be less than 30 characters.',
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
      GSTEwayBillNumber: ['', [Validators.required, Validators.maxLength(15)]],
      CourierTrackingID: ['', [Validators.required, Validators.maxLength(30)],
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
    $('#modalpopup_shipmentoutward').modal('show');
    this.logValidationErrors();
    this.panelTitle = "Add New Shipment Outward";
    this.action = true;

    this.shipmentoutwardform.controls['GSTEwayBillNumber'].setValue('');
    this.shipmentoutwardform.controls['CourierTrackingID'].setValue('');
    this._spinner.show();
    this._shipmentoutwardService.generateOutwardID().subscribe(
      (data) => {
        this.OutwardID = data;
        this._spinner.hide();
      },

      (err) => {
        this._spinner.hide();
        console.log(err);
      }
    );
  }

  editButtonClick(id: string) {
    $('#modalpopup_shipmentoutward').modal('show');
    this.logValidationErrors();
    this.panelTitle = "Edit Shipment outward";
    this.action = true;
    let obj = this.lst.filter(x => { return x.OutwardID == id })[0]
    this.shipmentoutwardform.controls['GSTEwayBillNumber'].setValue(obj.GSTEwayBillNumber);
    this.shipmentoutwardform.controls['CourierTrackingID'].setValue(obj.CourierTrackingID);
    this.OutwardID = obj.OutwardID;
  }

  onLoad(SearchBy: string, Search: string) {
    this._spinner.show();
    return this._shipmentoutwardService.search(SearchBy, Search).subscribe(
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
    this._spinner.show();
    this._shipmentoutwardService.updateGSTBill(this.obj).subscribe(
      (data) => {
        if (data && data == true) {
          this._spinner.hide();
          this.alertService.success('Shipment outward data has been added successful');
          this._router.navigate(['/Shipmentoutwardlist']);
        }
        else {
          this._spinner.hide();
          this.alertService.error('Shipment outward creation failed!');
          this._router.navigate(['/Shipmentoutwardlist']);
        }
        $('#modalpopup_shipmentoutward').modal('hide');
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
