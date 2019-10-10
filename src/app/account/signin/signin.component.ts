import { Component, OnInit } from '@angular/core';
// Import FormGroup and FormControl classes
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService, } from '../../_services/service/authentication.service';

import { DeviceDetectorService } from 'ngx-device-detector';
import { Userlog, IUser, } from '../../_services/model/';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})

export class SigninComponent implements OnInit {

  //#region Variable declaration
  objuser: IUser;
  signinForm: FormGroup;
  accessForm: FormGroup;
  expiredDate: Date;
  ipAddress: any;
  objuserlog: Userlog = {} as any;
  loading = false;
  //#endregion

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private alertService: ToastrService,
    private cookieService: CookieService,
    public _spinner: NgxSpinnerService,
    private httpClient: HttpClient,
    private deviceService: DeviceDetectorService,
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/Signin']);
    }
  }
  //#region Validation


  formErrors = {
    'Email': '',
    'password': '',
    'rememberme': ''
  };

  // This object contains all the validation messages for this form
  validationMessages = {
    'Email': {
      'required': 'Email is required.',
      'email': 'Email must be valid one.',
    },
    'password': {
      'required': 'Password is required.',
      'minlength': 'Password must be greater than 6 characters.',
    },

  };

  logValidationErrors(group: FormGroup = this.signinForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl && abstractControl.value && abstractControl.value.length > 0 && !abstractControl.value.replace(/\s/g, '').length) {
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



  //#endregion

  ngOnInit() {

    localStorage.clear();
    this.signinForm = this.fb.group({
      Email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)],],
      rememberme: '',
    },
    );

    // added remember functions
    const cookieUsernameExists: boolean = this.cookieService.check('gauuid1');
    const cookiePasswordExists: boolean = this.cookieService.check('gauuid2');
    if (cookieUsernameExists && cookiePasswordExists) {
      const Username: string = this.cookieService.get('gauuid1');
      const Password: string = this.cookieService.get('gauuid2');
      this._spinner.show();
      this.authenticationService.login(Username, Password)
        .pipe(first())
        .subscribe(
          datalogin => {
            if (datalogin == null) {
              this.alertService.error('Invalid credentials');
              this._spinner.hide();
              this.loading = false;
            }
            else {
              if (datalogin.IsForceChangePwd) {
                this.alertService.warning('Login Successful.Please change the password,currently you are using auto generated password.!');
              }
              else {
                this.alertService.success('Login Successful.!');
              }
              this.router.navigate(['/Dashboard1']);
              this._spinner.hide();
              this._spinner.hide();
              this.loading = false;
            }
          },
          error => {
            this.alertService.error('Invalid credentials');
            this._spinner.hide();
          });
    }

  }

  //&& data.length > 0
  // convenience getter for easy access to form fields
  get f() { return this.signinForm.controls; }
  PageSignin() {

    //add uselog 
    let browserInfo = '';
    let deviceInfo = null;
    deviceInfo = this.deviceService.getDeviceInfo();
    browserInfo = "browser:" + deviceInfo.browser + "|" + "browser_version:" + deviceInfo.browser_version + "|" +
      "device:" + deviceInfo.device + "|" + "os:" + deviceInfo.os + "|" +
      "os_version:" + deviceInfo.os_version + "|" + "userAgent:" + deviceInfo.userAgent + "|" +
      "isMobile:" + this.deviceService.isMobile() + "|" + "isTablet:" + this.deviceService.isTablet() + "|" +
      "isDesktopDevice:" + this.deviceService.isDesktop();

    this.objuserlog.BrowserInfo = browserInfo;//'';//browserInfo == undefined ? '' : browserInfo;


    this.objuserlog.Type = 'SIGNIN';
    this.objuserlog.MACAddress = '';
    this._spinner.show();
    this.objuserlog.IPAddress = '';
    this._spinner.show();
    this.loading = true;

    // this.httpClient.get<{ ip: string }>('https://jsonip.com')
    //   .pipe(
    //     tap(output => {
    //       this.objuserlog.IPAddress = output.ip;
    //     }),
    //     switchMap(output1 =>
    //       this.LoginCheck(this.f.Email.value, this.f.password.value);
    //     ),
    //     tap(output2 => {
    //       console.log(output2);
    //     }),
    //   )
    //   .subscribe(output2 => console.log(output2));

    this.LoginCheck(this.f.Email.value, this.f.password.value);
  }

  LoginCheck(username: string, password: string) {
    this._spinner.show();
    this.authenticationService.login(this.f.Email.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        datalogin => {
          if (datalogin == null) {
            this.alertService.error('Invalid credentials');
            this._spinner.hide();
            this.loading = false;
          }
          else {
            if (this.f.rememberme.value) {
              this.expiredDate = new Date();
              this.expiredDate.setDate(this.expiredDate.getDate() + 15);
              this.cookieService.set('gauuid1', this.f.Email.value);
              this.cookieService.set('gauuid2', this.f.password.value);
            }
            this.objuser = datalogin;
            this._spinner.show();
            this.authenticationService.adduserLog(this.objuserlog)
              .subscribe(
                data => {
                  if (data) {
                    if (datalogin.IsForceChangePwd) {
                      this.alertService.warning('Login Successful.Please change the password,Because currently you are using auto generated password.!');
                    }
                    else {
                      this.alertService.success('Login Successful.!');
                    }
                    this.router.navigate(['/Dashboard1']);
                    this._spinner.hide();
                  }
                },
                error => {
                  this.loading = false;
                  this._spinner.hide();
                })
            this._spinner.hide();
            this.loading = false;
          }
        },
        error => {
          this.alertService.error('Invalid credentials');
          this._spinner.hide();
          this.loading = false;
        }
      );

    return of(this.objuser);
  }
}


