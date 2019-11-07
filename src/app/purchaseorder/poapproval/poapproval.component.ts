import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { PoapprovalService } from '../../_services/service/poapproval.service';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { Poorder, Location, Result } from '../../_services/model';
@Component({
  selector: 'app-poapproval',
  templateUrl: './poapproval.component.html',
  styleUrls: ['./poapproval.component.css']
})
export class PoapprovalComponent implements OnInit {
  obj: Poorder;
  lstlocation: Location[];
  poapprovalForm: FormGroup;
  identity: number = 0;
  panelTitle: string;
  ApprovalStatus: string = '';
  objResult: Result = {} as any;
  TotalCaseSize: number = 0;
  TotalMultiplierValue: number = 0;
  TotalQty: number = 0;
  TotalTaxRate: number = 0;
  TotalTaxAmount: number = 0;
  TotalTotalAmount: number = 0;
  constructor(private router: Router,
    private fb: FormBuilder,
    public _poapprovalService: PoapprovalService,
    public _privateutilityService: PrivateutilityService,
    public _alertService: ToastrService,
    
    private _authorizationGuard: AuthorizationGuard,
    private aroute: ActivatedRoute) { }

  formErrors = {
    'ApprovalStatus': '',
    'VerifyLocationId': '',
    'VerifyTotalAmount': '',
    'Remarks': '',
  };

  validationMessages = {
    'ApprovalStatus': {
      'required': 'This Field is required.',
    },
    'VerifyLocationId': {
      'min': 'This Field is required.',
    },
    'VerifyTotalAmount': {
      'required': 'This Field is required.',
      'pattern': 'This Field must be a float value (1.00-1000000.00).',
    },
    'Remarks': {
      'required': 'This Field is required.',
      'minlength': 'This Field must be greater than 3 characters.',
    },
  };

  logValidationErrors(group: FormGroup = this.poapprovalForm): void {
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

  showapprovaldetailbycompany()
  {
    //
    this._poapprovalService.showapprovaldetailbycompany().subscribe(
      (data) => {
        this.objResult.Flag = true;
        //
      },
      (err) => {
        //
        console.log(err);
      }
    );
  }
  ngOnInit() {

    //
    this._privateutilityService.getLocations().subscribe(
      (data) => {
        this.lstlocation = data;
        //
      },
      (err) => {
        //
        console.log(err);
      }
    );

    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
      if (this.identity > 0) {
        this.panelTitle = "Update PO Approval";
        //
        this._poapprovalService.searchById(this.identity)
          .subscribe(
            (data: Poorder) => {
              this.obj = data;
              this.TotalCaseSize = data.lstItem.reduce((acc, a) => acc + a.CaseSize, 0);
              this.TotalMultiplierValue = data.lstItem.reduce((acc, a) => acc + a.MultiplierValue, 0);
              this.TotalQty = data.lstItem.reduce((acc, a) => acc + a.Qty, 0);
              this.TotalTaxRate = data.lstItem.reduce((acc, a) => acc + a.TaxRate, 0);
              this.TotalTaxAmount = data.lstItem.reduce((acc, a) => acc + a.TaxAmount, 0);
              this.TotalTotalAmount = data.lstItem.reduce((acc, a) => acc + a.TotalAmount, 0);
              if (data.ApprovalStatus == 'Approved') {
                this.objResult.Flag = true;
              }
              //
            },
            (err: any) => {
              console.log(err);
              //
            }
          );
      }
    });

    this.poapprovalForm = this.fb.group({
      ApprovalStatus: ['', [Validators.required]],
      VerifyLocationId: [0, [Validators.min(1)]],
      VerifyTotalAmount: ['', [Validators.required, Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")]],
      Remarks: ['', [Validators.required, Validators.minLength(3),]],
    });
  }
  onchangeVerifyApproval(selectedValue: number) {
    let VerifyLocationId: number = this.poapprovalForm.controls['VerifyLocationId'].value;
    let VerifyTotalAmount: number = this.poapprovalForm.controls['VerifyTotalAmount'].value;

    if (VerifyLocationId != 0 && !isNaN(VerifyTotalAmount) && VerifyTotalAmount != 0) {

      //
      this._poapprovalService.VerifyPOApproval((VerifyTotalAmount), VerifyLocationId, this.identity).subscribe(
        (data) => {
          this.objResult = data;
          //
        },
        (err) => {
          //
          console.log(err);
        }
      );
    }
    else {
      this.poapprovalForm.patchValue({
        Verify: '',
      });
    }
  }

  onchangeApprovalStatus(selectedValue: string) {
    if (selectedValue == "Reject") {
      this.poapprovalForm.patchValue({
        VerifyTotalAmount: '',
        VerifyLocationId: 0,
      });
      this.objResult.Flag = false;
    }
    else {
      this.poapprovalForm.patchValue({
        VerifyTotalAmount: '',
      });
      this.objResult.Flag = false;
      this.objResult.Msg = ' ';
    }
  } 

  Update() {
    if (this._authorizationGuard.CheckAcess("Poapprovallist", "ViewEdit")) {
      return;
    }
    if (this.poapprovalForm.invalid) {
      return;
    }
    this.obj.POID = this.identity;
    if (this.poapprovalForm.controls['ApprovalStatus'].value == "Approve") {
      this.obj.IsShipmentRequired = false;
      this.obj.ApprovalStatus = "Approved";
    } 
    else if (this.poapprovalForm.controls['ApprovalStatus'].value == "Reject") {
      this.obj.IsShipmentRequired = false;
      this.obj.ApprovalStatus = "Rejected";
    }
    this.obj.Remarks = this.poapprovalForm.controls['Remarks'].value; 
    //
    this._poapprovalService.update(this.obj).subscribe(
      (data) => {

        if (data && data.Flag == true) {
          this._alertService.success(data.Msg);
          this.router.navigate(['/Poapprovallist']);
        }
        else {
          this._alertService.error(data.Msg);
          this.router.navigate(['/Poapprovallist']);
        }
        //
        this.identity = 0;
      },
      (error: any) => {
        //
        console.log(error);
      }
    );
  }


}
