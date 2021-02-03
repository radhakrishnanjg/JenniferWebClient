import { Component, OnInit } from '@angular/core';
// Import FormGroup and FormControl classes
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';

import { AuthenticationService, } from '../../_services/service/authentication.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Userlog, IUser, } from '../../_services/model/';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { SellerregistrationService } from '../../_services/service/crossborder/sellerregistration.service';
import { environment } from 'src/environments/environment';
// import { DOCUMENT } from '@angular/common';

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

    private httpClient: HttpClient,
    private deviceService: DeviceDetectorService,
    private _SellerregistrationService: SellerregistrationService,
    // private document: Document
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
    const cookieUsernameExists: boolean = this.cookieService.check('jennifergauuid1');
    const cookiePasswordExists: boolean = this.cookieService.check('jennifergauuid2');
    if (cookieUsernameExists && cookiePasswordExists) {
      const Username: string = this.cookieService.get('jennifergauuid1');
      const Password: string = this.cookieService.get('jennifergauuid2');
      //
      this.authenticationService.login(Username, Password)
        .pipe(first())
        .subscribe(
          datalogin => {
            if (datalogin == null) {
              this.alertService.error('Invalid credentials');
              //
              this.loading = false;
            }
            else {
              if (datalogin.IsForceChangePwd) {
                this.alertService.warning('Sign in Successful.Please change the password,currently you are using auto generated password.!');
              }
              else {
                this.alertService.success('Sign in Successful.!');
              }
              this.GetApplicationAccess(datalogin);
              this.loading = false;
            }
          },
          error => {
            this.alertService.error('Invalid credentials');
            //
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
    this.objuserlog.IPAddress = '';
    this.loading = true;
    this.LoginCheck(this.f.Email.value, this.f.password.value);
  }

  LoginCheck(username: string, password: string) {
    this.authenticationService.login(this.f.Email.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        datalogin => {
          if (datalogin == null) {
            this.alertService.error('Invalid credentials');
            this.loading = false;
          }
          else {
            if (this.f.rememberme.value) {
              this.expiredDate = new Date();
              this.expiredDate.setDate(this.expiredDate.getDate() + 15);
              this.cookieService.set('jennifergauuid1', this.f.Email.value);
              this.cookieService.set('jennifergauuid2', this.f.password.value);
            }
            this.objuser = datalogin;
            this.authenticationService.adduserLog(this.objuserlog)
              .subscribe(
                data => {
                  if (data) {
                    if (datalogin.IsForceChangePwd) {
                      this.alertService.warning('Sign in Successful.Please change the password,Because currently you are using auto generated password.!');
                    }
                    else {
                      this.alertService.success('Sign in Successful.!');
                    }
                    this.GetApplicationAccess(datalogin);
                  }
                },
                error => {
                  this.loading = false;
                })
            //
            this.loading = false;
          }
        },
        error => {
          this.objuserlog.BrowserInfo = 'Username: ' + this.f.Email.value + ' & Password: ' + this.f.password.value + '|' +
            this.objuserlog.BrowserInfo;
          this.authenticationService.adduserLogunsuccessful(this.objuserlog)
            .subscribe(
              data => {

              },
              error => {
              })
          this.alertService.error('Invalid credentials');
          //
          this.loading = false;
        }
      );

    return of(this.objuser);
  }
  SellerDomain: string = '';
  GetApplicationAccess(datalogin: IUser) {
    //jennifer Access
    if (datalogin.UserType == '0' || datalogin.UserType == '1' || datalogin.UserType == '2') {
      this.router.navigate(['/Dashboard1']);
    }
    //Seller Central Access 3|4|5|6|7|8|9|10|11|12|13|14
    else if (datalogin.UserType == '3' || datalogin.UserType == '4'
      || datalogin.UserType == '5' || datalogin.UserType == '6'
      || datalogin.UserType == '7' || datalogin.UserType == '8'
      || datalogin.UserType == '9' || datalogin.UserType == '10'
      || datalogin.UserType == '11' || datalogin.UserType == '12'
      || datalogin.UserType == '13' || datalogin.UserType == '14') {
      this.router.navigate(['/SellerCentral']);
    }
    //PSP Access 15|16|17|18
    else if (datalogin.UserType == '15' || datalogin.UserType == '16'
      || datalogin.UserType == '17' || datalogin.UserType == '18') {
      this.router.navigate(['/PSP']);
    }
  }

}


