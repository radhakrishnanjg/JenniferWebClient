import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService, } from  '../../_services/service/account.service';
@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})

export class ForgotpasswordComponent implements OnInit {
  forgotpasswordForm: FormGroup;
  isVerify: boolean = false;
  emailPattern = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$";
  constructor(
    private _accountService: AccountService,
    private alertService: ToastrService,
    private fb: FormBuilder,
    private _router: Router,
  ) { }

  formErrors = {
    'EmailId': '',
  };

  validationMessages = {
    'EmailId': {
      'required': 'Email is required.',
      'email': 'Email  must be valid one.',
      'maxlength': 'Email must be less than 50 characters.'
    },
  };

  logValidationErrors(group: FormGroup = this.forgotpasswordForm): void {
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

    this.forgotpasswordForm = this.fb.group({
      EmailId: ['', [Validators.required, 
        Validators.pattern(this.emailPattern), Validators.maxLength(50)]],
      EmailOTP: ['',]
    });
  }

  SendOTP(): void {
    // stop here if form is invalid
    if (this.forgotpasswordForm.invalid) {
      return;
    }
    this._accountService.isEmailRegisterd(this.forgotpasswordForm.controls['EmailId'].value).subscribe(
      (data) => {
        if (data) {
          this._accountService.SendEmailOTP(this.forgotpasswordForm.controls['EmailId'].value).subscribe(
            (data) => {
              this.alertService.success('Email OTP has been sent your email' );
              this.isVerify = true;
            });
        }
        else {
          this.alertService.error('Invalid email' );
          this._router.navigate(['/ForgotPassword']);
        }
      },
      (error: any) => { console.log(error); }
    );

  }

  SendPassword(): void {

    let EmailId = this.forgotpasswordForm.controls['EmailId'].value;
    let EmailOTP = this.forgotpasswordForm.controls['EmailOTP'].value;
    if (EmailOTP == null) {
      this.alertService.error('Enter Email OTP' );
      this._router.navigate(['/ForgotPassword']);
    }
    this._accountService.ForgotPassword(EmailId, EmailOTP).subscribe(
      (data) => {
        if (data) {
          this.alertService.success('Password Changed successfully, Please check your email.!');
          this._router.navigate(['/ForgotPassword']);
        }
        else {
          this.alertService.error('Invalid email' );
          this._router.navigate(['/ForgotPassword']);
        }
      },
      (error: any) => { console.log(error); }
    );

    // Resets to blank object
    this.forgotpasswordForm.reset();

    // Resets to provided model
    this.forgotpasswordForm.reset({ EmailId: '', });
  }
}
