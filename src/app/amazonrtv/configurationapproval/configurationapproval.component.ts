import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AmazonAutoRTVConfiguration, AmazonAutoRTVOrder, Dropdown, Location } from '../../_services/model';
import { AmazonautortvService } from '../../_services/service/amazonautortv.service';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { JsonPrivateUtilityService } from 'src/app/_services/service/crossborder/jsonprivateutility.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-configurationapproval',
  templateUrl: './configurationapproval.component.html',
  styleUrls: ['./configurationapproval.component.css']
})
export class ConfigurationapprovalComponent implements OnInit {

  Configurationform: FormGroup;
  obj: AmazonAutoRTVOrder = {} as any;
  BatchId: string = '';
  Fromlocations: Location[] = [] as any;
  lstInventorytype: Dropdown[];
  lstFrequencytype: Dropdown[];
  panelTitle: string;
  action: boolean;
  FromLocationName: string;
  ToLocationName: string;
  InventoryType: string;
  DropDownDescription: string;


  constructor(
    private alertService: ToastrService,
    private fb: FormBuilder,
    private _router: Router,
    private aroute: ActivatedRoute,
    private _amazonautortvService: AmazonautortvService, 
    private _authorizationGuard: AuthorizationGuard,
  ) { }

  formErrors = {
    'ApprovalStatus': '',
    'Remarks': '',
  };
  validationMessages = {
    'ApprovalStatus': {
      'required': 'This field is required',
    },
    'ApproRemarksvalStatus': {
      'required': 'This field is required',

    },
  };

  logValidationErrors(group: FormGroup = this.Configurationform): void {
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


  TotalQuantity: number = 0;
  TotalTotalValue: number = 0;
  ngOnInit() {
    this.aroute.paramMap.subscribe(params => {
      this.BatchId = params.get('id');
    });
    this._amazonautortvService.BulkSearchById(this.BatchId)
      .subscribe(
        (data: AmazonAutoRTVOrder) => {
          this.obj = data;
          this.TotalQuantity = data.lstRTVDetail.reduce((acc, a) => acc + a.Quantity, 0);
          this.TotalTotalValue = data.lstRTVDetail.reduce((acc, a) => acc + a.TotalValue, 0);
        },
        (err: any) => {
          console.log(err);
        }
      );

    this.Configurationform = this.fb.group({
      ApprovalStatus: ['', [Validators.required,]],
      Remarks: ['', [Validators.required,]],
    });
  }



  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("Configurationlist", "ViewEdit")) {
      return;
    }
    // stop here if form is invalid
    if (this.Configurationform.invalid) {
      return;
    }
    this.Insert();
  }

  Insert() {
    let olddata = this.obj;
    this.obj = new AmazonAutoRTVOrder();
    this.aroute.paramMap.subscribe(params => {
      this.obj.BatchId = params.get('id');
    });
    this.obj.Remarks = this.Configurationform.controls['Remarks'].value;
    if (this.Configurationform.controls['ApprovalStatus'].value == 'Approve') {
      this.obj.Action = "A";
    } else {
      this.obj.Action = "R";
    }
    this._amazonautortvService.BulkAction(this.obj).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.alertService.success(data.Msg);
          this._router.navigate(['/Configurationlist']);
        }
        else {
          this.obj = olddata;
          this.alertService.error(data.Msg);
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }


}

