import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthorizationGuard } from '../../_guards/Authorizationguard';
import { MobileMasterService } from '../../_services/service/crossborder/mobilemaster.service';
import { JsonPrivateUtilityService } from '../../_services/service/crossborder/jsonprivateutility.service';
import { MobileMaster } from '../../_services/model/crossborder';
import { State } from '../../_services/model';
import { PrivateutilityService } from '../../_services/service/privateutility.service';

@Component({
  selector: 'app-mobilemaster',
  templateUrl: './mobilemaster.component.html',
  styleUrls: ['./mobilemaster.component.css']
})
export class MobilemasterComponent implements OnInit {
  Mobilemasterform: FormGroup;
  lst: MobileMaster[];
  // lstMenuType: Dropdown[];
  obj: MobileMaster = {} as any;
  panelTitle: string;
  Action: boolean;
  identity: number = 0;

  constructor(
    private alertService: ToastrService,
    private fb: FormBuilder,
    private _router: Router,
    private aroute: ActivatedRoute,
    private _jsonPrivateUtilityService: JsonPrivateUtilityService,
    private _mobileMasterService: MobileMasterService,
    private _authorizationGuard: AuthorizationGuard,
    private _PrivateutilityService: PrivateutilityService,

  ) { }

  formErrors = {

    'AccountName': '',
    'AccountNumber': '',
    'IndianGSTNumber': '',
    'GSTState': '',
    'IndianMobileNumber': '',


  };

  validationMessages = {

    'AccountName': {
      'required': 'This field is required.',

    },
    'AccountNumber': {
      'required': 'This field is required.',
    },

    'IndianGSTNumber': {
      'required': 'This field is required.',

    },
    'GSTState': {
      'min': 'This field is required.',

    },
    'IndianMobileNumber': {
      'required': 'This field is required.',

    },

  };

  logValidationErrors(group: FormGroup = this.Mobilemasterform): void {
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

    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
    });
    if (this.identity > 0) {
      this.Action = false;
      this.panelTitle = 'Edit Mobile Master Content';
      //
      // this._mobileMasterService.SearchById(this.identity)
      //   .subscribe(
      //     (data: MobileMaster) => {
      //       this.Mobilemasterform.patchValue({
      //         AccountName: data.AccountName,
      //         AccountNumber: data.AccountNumber,
      //         IndianGSTNumber: data.IndianGSTNumber,
      //         GSTState: data.GSTState,
      //         IndianMobileNumber: data.IndianMobileNumber,
      //         IsActive: data.IsActive,
      //       });
      //       this.Mobilemasterform.get('AccountName').disable();
      //       this.Mobilemasterform.get('AccountNumber').disable();
      //       this.Mobilemasterform.get('IndianGSTNumber').disable();
      //       this.Mobilemasterform.get('GSTState').disable();
      //       this.Mobilemasterform.get('IndianMobileNumber').disable(); 
      //     },
      //     (err: any) => {
      //       console.log(err)
      //     }
      //   );
    }
    else {
      this.panelTitle = 'Add New Mobile Master Content';
      this.identity = 0;
      this.Action = true;
    }

    this.Mobilemasterform = this.fb.group({
      AccountName: ['', [Validators.required]],
      AccountNumber: ['', [Validators.required]],
      IndianGSTNumber: ['', [Validators.required]],
      GSTState: [0, [Validators.min(1)]],
      IndianMobileNumber: ['', [Validators.required]],
      IsActive: [0,]
    });
    this.GetStates();

  }
  states: State[];

  GetStates() {
    this._jsonPrivateUtilityService.getStates(1)
      .subscribe(
        (data: State[]) => {
          this.states = data;
        },
        (err: any) => {
          console.log(err);
        }
      );
  }


  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("Mobilemasterlist", "ViewEdit")) {
      return;
    }

    // stop here if form is invalid
    if (this.Mobilemasterform.invalid) {
      return;
    }
    let GSTStateCode = this.states.filter(a => a.StateID == this.Mobilemasterform.controls['GSTState'].value)[0].GSTStateCode;
    let State = this.states.filter(a => a.StateID == this.Mobilemasterform.controls['GSTState'].value)[0].State;
    if (GSTStateCode != this.Mobilemasterform.controls['IndianGSTNumber'].value.slice(0, 2)) {
      this.alertService.error('GST Number must start with ' + GSTStateCode + ' for ' + State + ' state.!');
      return;
    }
    this.Insert();

  }



  Insert() {
    this.obj.BankName = "Citi Bank";
    this.obj.AccountType = "Current Account";
    this.obj.IFSC = " CITI0000004";
    this.obj.AccountName = this.Mobilemasterform.controls['AccountName'].value;
    this.obj.AccountNumber = this.Mobilemasterform.controls['AccountNumber'].value;
    this.obj.IndianGSTNumber = this.Mobilemasterform.controls['IndianGSTNumber'].value;
    this.obj.GSTState = this.Mobilemasterform.controls['GSTState'].value;
    this.obj.IndianMobileNumber = this.Mobilemasterform.controls['IndianMobileNumber'].value;
    this.obj.IsActive = this.Mobilemasterform.controls['IsActive'].value;


    this._mobileMasterService.Insert(this.obj).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.alertService.success(data.Msg);
          this.identity = 0;
          this._router.navigate(['/CrossBorder/Mobilemasterlist']); 
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





}
