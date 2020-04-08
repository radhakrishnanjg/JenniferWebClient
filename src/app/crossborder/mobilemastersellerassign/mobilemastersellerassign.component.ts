import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MobileMasterService } from '../../_services/service/crossborder/mobilemaster.service';
import { JsonPrivateUtilityService } from '../../_services/service/crossborder/jsonprivateutility.service';
import { MobileMaster, SellerRegistration } from '../../_services/model/crossborder';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-mobilemastersellerassign',
  templateUrl: './mobilemastersellerassign.component.html',
  styleUrls: ['./mobilemastersellerassign.component.css']
})
export class MobilemastersellerassignComponent implements OnInit {
  MobileMasterSellerAssignform: FormGroup;
  obj: MobileMaster = {} as any;
  identity: number = 0;
  constructor(
    private alertService: ToastrService,
    private fb: FormBuilder,
    private _router: Router,
    private _mobileMasterService: MobileMasterService,
    private _jsonPrivateUtilityService: JsonPrivateUtilityService,
    private aroute: ActivatedRoute,
  ) { }


  formErrors = {

    'SellerFormID': '',


  };

  validationMessages = {

    'SellerFormID': {
      'min': 'This field is required.',

    },

  };

  logValidationErrors(group: FormGroup = this.MobileMasterSellerAssignform): void {
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
      if (this.identity > 0) {
        this._mobileMasterService.SearchById(this.identity).subscribe(
          (data: MobileMaster) => {
            this.obj = data;
          },
          (err: any) => {
            console.log(err);
          }
        );
      }
    });

    this.MobileMasterSellerAssignform = this.fb.group({
      SellerFormID: [0, [Validators.min(1)]],


    });
    this.GetSellerRegistration();
  }


  lstSellerRegistration: SellerRegistration[];
  GetSellerRegistration() {
    this._jsonPrivateUtilityService.getsellerregistrations()
      .subscribe(
        (data: SellerRegistration[]) => {
          this.lstSellerRegistration = data;
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  SaveData(): void {
    // if (this._authorizationGuard.CheckAcess("Helpmenulist", "ViewEdit")) {
    //   return;
    // }

    // stop here if form is invalid
    if (this.MobileMasterSellerAssignform.invalid) {
      return;
    }

 
    if (this.identity > 0) {
      this.SellerAssigned();
    }
     
  } 

  SellerAssigned() {
    this.obj.JenniferMobileMasterID = this.identity;
    this.obj.SellerFormID = this.MobileMasterSellerAssignform.controls['SellerFormID'].value;

    this._mobileMasterService.SellerAssigned(this.obj.SellerFormID, this.obj.JenniferMobileMasterID).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.alertService.success(data.Msg);
          this._router.navigate(['/CrossBorder/Mobilemasterlist']);
        }
        else {
          this.alertService.error(data.Msg);
          // this._router.navigate(['/CrossBorder/Mobilemasterlist']);
        }
        this.identity = 0;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }



}
