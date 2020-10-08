import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { PoshipmentService } from '../../_services/service/poshipment.service';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { Apisettings, Poshipment, Poorderitem, MFICaseHeader, Dropdown, MFICaseDetail } from '../../_services/model';
import * as moment from 'moment';
import { PoService } from 'src/app/_services/service/po.service';

@Component({
  selector: 'app-mficase',
  templateUrl: './mficase.component.html',
  styleUrls: ['./mficase.component.css']
})
export class MFICaseComponent implements OnInit {

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public _privateutilityService: PrivateutilityService,
    public _alertService: ToastrService,
    private _authorizationGuard: AuthorizationGuard,
    private aroute: ActivatedRoute,
    private _poService: PoService,
  ) {
  }

  formErrors = {
    'CaseId': '',
    'Status': '',
    'Remarks': '',
  };
  validationMessages = {
    'CaseId': {
      'required': 'This Field is required.',
    },
    'Status': {
      'required': 'This Field is required.',
    },
    'Remarks': {
      'required': 'This Field is required.',
    },
  };

  logValidationErrors(group: FormGroup = this.MFICaseForm): void {
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
  MFICaseForm: FormGroup;
  panelTitle: string;
  ShipmentNumber: string = '';
  obj: MFICaseDetail = {} as any;
  objMFICaseHeader: MFICaseHeader = {} as any;
  Status: string = '';
  Resolution: string = '';
  ngOnInit() {
    this.aroute.paramMap.subscribe(params => {
      this.ShipmentNumber = params.get('id');
      this.panelTitle = "Edit MFI Case ";
      this.LoadOldData();
      this.LoadMFIStatus();
      this.LoadMFIResolutionStatus();
    });

    this.MFICaseForm = this.fb.group({
      CaseId: ['', [Validators.required]],
      Status: ['', [Validators.required]],
      Resolution: ['', []],
      OveragedShipment: ['', []],
      RMSID: ['', []],
      ValueOfRMS: ['', []],
      Quantity: ['', []],
      Remarks: ['', [Validators.required]],
    });

  }

  LoadOldData() {
    this._poService.MFICaseSearchById(this.ShipmentNumber)
      .subscribe(
        (data: MFICaseHeader) => {
          this.objMFICaseHeader = data;
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  lstMFIStatus: Dropdown[] = [] as any;
  LoadMFIStatus() {
    this._privateutilityService.GetValues('MFIStatus')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstMFIStatus = data
        },
        (err: any) => {
          console.log(err);
        }
      );
  }
  lstMFIResolutionStatus: Dropdown[] = [] as any;
  LoadMFIResolutionStatus() {
    this._privateutilityService.GetValues('MFIResolutionStatus')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstMFIResolutionStatus = data
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  Save() {

    if (this._authorizationGuard.CheckAcess("PoMFIlist", "ViewEdit")) {
      return;
    }
    if (this.MFICaseForm.invalid) {
      return;
    }
    if (this.MFICaseForm.controls['Status'].value == "RESOLVED" && this.MFICaseForm.controls['Resolution'].value == "") {
      this._alertService.error("Please select Resolution!");
      return;
    }
    if (this.MFICaseForm.controls['Resolution'].value == "OVERAGED TO" && this.MFICaseForm.controls['OveragedShipment'].value == "") {
      this._alertService.error("Please select Overaged Shipment!");
      return;
    }
    if (this.MFICaseForm.controls['Resolution'].value == "OVERAGED TO" && this.MFICaseForm.controls['Quantity'].value == "") {
      this._alertService.error("Please select Quantity!");
      return;
    }
    if (this.MFICaseForm.controls['Resolution'].value == "REIMBURSED" && this.MFICaseForm.controls['RMSID'].value == "") {
      this._alertService.error("Please select Reimbursed ID!");
      return;
    }
    if (this.MFICaseForm.controls['Resolution'].value == "REIMBURSED" && this.MFICaseForm.controls['ValueOfRMS'].value == "") {
      this._alertService.error("Please select Value Of Reimbursed!");
      return;
    }
    this.aroute.paramMap.subscribe(params => {
      this.ShipmentNumber = params.get('id');
    });
    this.obj = new MFICaseDetail();
    this.obj.ShipmentNumber = this.ShipmentNumber;
    this.obj.CaseId = this.MFICaseForm.controls['CaseId'].value;
    this.obj.Status = this.MFICaseForm.controls['Status'].value;
    this.obj.Resolution = this.MFICaseForm.controls['Resolution'].value;
    this.obj.OveragedShipment = this.MFICaseForm.controls['OveragedShipment'].value;
    this.obj.Quantity = this.MFICaseForm.controls['Quantity'].value;
    this.obj.RMSID = this.MFICaseForm.controls['RMSID'].value;
    this.obj.ValueOfRMS = this.MFICaseForm.controls['ValueOfRMS'].value;
    this.obj.Remarks = this.MFICaseForm.controls['Remarks'].value;

    this._poService.MFICaseSave(this.obj).subscribe(
      (data) => {
        if (data.Flag == true) {
          this._alertService.success(data.Msg);
          this.router.navigate(['/PoMFIlist']);
        }
        else {
          this._alertService.error(data.Msg);
          this.LoadOldData();
        }
      },
      (error: any) => {
      }
    );
  }


}
