import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MobileMasterService } from '../../_services/service/crossborder/mobilemaster.service';
import { MobileMaster } from '../../_services/model/crossborder';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-mobilemasterotp',
  templateUrl: './mobilemasterotp.component.html',
  styleUrls: ['./mobilemasterotp.component.css']
})
export class MobilemasterotpComponent implements OnInit {
  MobileMasterOTPAssignform: FormGroup;
  obj: MobileMaster = {} as any;
  identity: number = 0;

  constructor(
    private fb: FormBuilder,
    private _router: Router,
    private alertService: ToastrService,
    private _mobileMasterService: MobileMasterService,
    private aroute: ActivatedRoute,
  ) { }

  sellerId: number;
  ngOnInit() {
    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
      if (this.identity > 0) {
        this._mobileMasterService.SearchById(this.identity).subscribe(
          (data: MobileMaster) => {
            this.obj = data;
            this.sellerId = data.SellerFormID;
          },
          (err: any) => {
            console.log(err);
          }
        );
      }
    });

    this.MobileMasterOTPAssignform = this.fb.group({
      IsOTPSent: ['',[Validators.requiredTrue]],


    });
  }
  IsOTPSent: boolean;
  onchangeIsOTPSent(event: any) {
    if (event.target.checked) {
      this.IsOTPSent = true;
    } else {
      this.IsOTPSent = false;
    }
  }

  SaveData(): void {
    // if (this._authorizationGuard.CheckAcess("Helpmenulist", "ViewEdit")) {
    //   return;
    // }

    // stop here if form is invalid
    if (this.MobileMasterOTPAssignform.invalid) {
      return;
    }


    if (this.identity > 0) {
      this.OTPAssigned();
    }

  }


  OTPAssigned() {
    this.obj.SellerFormID = this.sellerId;
    this.obj.IsOTPSent = this.MobileMasterOTPAssignform.controls['IsOTPSent'].value;

    this._mobileMasterService.OTPAssigned(this.obj.SellerFormID, this.obj.IsOTPSent).subscribe(
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
