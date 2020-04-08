import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SellerregistrationService } from '../../_services/service/crossborder/sellerregistration.service';
import { SellerRegistration, Dropdown, IORPartners, EORPartners, Apisettings, Country } from '../../_services/model/crossborder';
import { UsernameValidator } from 'src/app/_validators/username';


@Component({
  selector: 'app-sellerregistration',
  templateUrl: './sellerregistration.component.html',
  styleUrls: ['./sellerregistration.component.css']
})
export class SellerregistrationComponent implements OnInit {
  obj: SellerRegistration = {} as any;
  registerFormPayoneer: FormGroup;
  registerFormOthers: FormGroup;
  PSP: string = '';
  emailPattern = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$";
  captchaLength: number = 0;
  captchaStartTime: Date = new Date();
  resolved(captchaResponse: string) {
    this.captchaStartTime = new Date();
    console.log(`Resolved captcha with response: ${captchaResponse}`);
    this.captchaLength = `${captchaResponse}`.length;
  }

  constructor(
    private alertService: ToastrService,
    private usernameValidator: UsernameValidator,
    private _sellerregistrationService: SellerregistrationService,
    private fb: FormBuilder,
  ) { }

  //#region Validation Start
  formErrors1 = {
    'VendorID': '',
    'PSPAccountID': '',
    'PayoneerEmailID': '',
    'EmailOTP': '',
    'IORPartnerID': '',
  };

  formErrors2 = {
    'CompanyName': '',
    'CompanyPhoneNumberCode': '',
    'CompanyPhoneNumber': '',
    'CountryID': '',
    'CompanyAddress': '',
    'FileData1': '',
    'ContactPerson': '',
    'EMail': '',
    'ContactNumberCode': '',
    'ContactNumber': '',
    'WeChatID': '',
    'IORPartnerID': '',
    'PSPAccountID': '',
    'VendorID': '',
    'TotalSKU': '',
  };

  // This object contains all the validation messages for this form
  validationMessages1 = {
    'VendorID': {
      'min': 'This Field is required.',
    },
    'IORPartnerID': {
      'min': 'This Field is required.',
    },
    'PSPAccountID': {
      'required': 'This Field is required.',
      'pattern': 'This field must be Alphanumeric',
    },
    'PayoneerEmailID': {
      'required': 'This Field is required.',
      'pattern': 'Enter a valid Email',
      'EmailIdInUse': 'Email is Already exist.!'
    },
    'EmailOTP': {
      'required': 'This Field is required.',
    },
  };

  validationMessages2 = {
    'CompanyName': {
      'required': 'This Field is required.',
      'pattern': 'This field must be Alphanumeric',
    },
    'CompanyPhoneNumberCode': {
      'required': 'This Field is required.',
    },
    'CompanyPhoneNumber': {
      'required': 'This Field is required.',
    },
    'CountryID': {
      'min': 'This Field is required.',
    },
    'CompanyAddress': {
      'required': 'This Field is required.',
      'pattern': 'This field must be Alphanumeric',
    },
    'FileData1': {
      'required': 'This Field is required.',
    },
    'ContactPerson': {
      'required': 'This Field is required.',
      'pattern': 'This field must be Alphanumeric',
    },
    'EMail': {
      'required': 'This Field is required.',
      'pattern': 'Enter a valid Email',
      'EmailIdInUse': 'Email is Already exist.!'
    },
    'ContactNumberCode': {
      'required': 'This Field is required.',
    },
    'ContactNumber': {
      'required': 'This Field is required.',
    },
    'WeChatID': {
      'required': 'This Field is required.',
      'pattern': 'This field must be Alphanumeric',
    },
    'IORPartnerID': {
      'min': 'This Field is required.',
    },
    'PSPAccountID': {
      'required': 'This Field is required.',
      'pattern': 'This field must be Alphanumeric',
    },
    'VendorID': {
      'min': 'This Field is required.',
    },
    'TotalSKU': {
      'required': 'This Field is required.',
      'min': 'Total number of SKUs cannot be 0.',
    },
  };

  logValidationErrors1(group: FormGroup = this.registerFormPayoneer): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl && abstractControl.value && abstractControl.value.length > 0 && !abstractControl.value.replace(/^\s+|\s+$/gm, '').length) {
        abstractControl.setValue('');
      }
      this.formErrors1[key] = '';
      if (abstractControl && !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty)) {
        const messages = this.validationMessages1[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors1[key] += messages[errorKey] + ' ';
          }
        }
      }
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors1(abstractControl);
      }
    });
  }

  logValidationErrors2(group: FormGroup = this.registerFormOthers): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl && abstractControl.value && abstractControl.value.length > 0 && !abstractControl.value.replace(/^\s+|\s+$/gm, '').length) {
        abstractControl.setValue('');
      }
      this.formErrors2[key] = '';
      if (abstractControl && !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty)) {
        const messages = this.validationMessages2[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors2[key] += messages[errorKey] + ' ';
          }
        }
      }
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors2(abstractControl);
      }
    });
  }
  //#endregion Validation End

  ngOnInit() {
    this.loadPSP();
    this.loadLogistics();
    this.loadIOR();
    this.loadEOR();
    this.loadCountries();

    this.registerFormPayoneer = this.fb.group({
      VendorID: [0, [Validators.min(1)]],
      PSPAccountID: ['', [Validators.required, Validators.pattern("^([a-zA-Z0-9]+)$")],],
      PayoneerEmailID: ['', [Validators.required, Validators.pattern(this.emailPattern)]
      ,this.usernameValidator.isEmailCrossborderRegisterd()],
      EmailOTP: ['', [Validators.required],],
      IORPartnerID: [0, [Validators.min(1)]],  
    });

    this.registerFormOthers = this.fb.group({
      CompanyName: ['', [Validators.required, Validators.pattern("^([a-zA-Z0-9]+)$")]],
      CompanyPhoneNumberCode: ['', [Validators.required]],
      CompanyPhoneNumber: ['', [Validators.required]],
      CountryID: [0, [Validators.min(1)]],
      CompanyAddress: ['', [Validators.required, Validators.pattern("^([a-zA-Z0-9]+)$")],],
      FileData1: ['', [Validators.required]],
      ContactPerson: ['', [Validators.required, Validators.pattern("^([a-zA-Z0-9]+)$")]],
      EMail: ['', [Validators.required, Validators.pattern(this.emailPattern)],
        this.usernameValidator.isEmailCrossborderRegisterd()],
      ContactNumberCode: ['', [Validators.required]],
      ContactNumber: ['', [Validators.required]],
      WeChatID: ['', [Validators.required, Validators.pattern("^([a-zA-Z0-9]+)$")],],
      IORPartnerID: [0, [Validators.min(1)]],
      PSPAccountID: ['', [Validators.required, Validators.pattern("^([a-zA-Z0-9]+)$")]],
      VendorID: [0, [Validators.min(1)]],
      LogisticsPartner: [''],
      TotalSKU: [0, [Validators.required, Validators.min(1)]],
    });
  }

  lstPSP: Dropdown[] = [] as any;
  loadPSP() {
    this._sellerregistrationService.getvalues('PSP').subscribe(
      (data: Dropdown[]) => {
        this.lstPSP = data;
      },
      (err: any) => {
        console.log(err);
      }
    )
  }

  lstLogisticsPartner: Dropdown[] = [] as any;
  loadLogistics() {
    this._sellerregistrationService.getvalues('Courier').subscribe(
      (data: Dropdown[]) => {
        this.lstLogisticsPartner = data;
      },
      (err: any) => {
        console.log(err);
      }
    )
  }

  lstIOR: IORPartners[] = [] as any;
  loadIOR() {
    this._sellerregistrationService.getIORPartners().subscribe(
      (data: IORPartners[]) => {
        this.lstIOR = data;
      },
      (err: any) => {
        console.log(err);
      }
    )
  }

  lstVendor: EORPartners[] = [] as any;
  loadEOR() {
    this._sellerregistrationService.getEORPartners().subscribe(
      (data: EORPartners[]) => {
        this.lstVendor = data;
      },
      (err: any) => {
        console.log(err);
      }
    )
  }

  lstCountries: Country[] = [] as any;
  loadCountries() {
    this._sellerregistrationService.getCountries().subscribe(
      (data: Country[]) => {
        this.lstCountries = data;
      },
      (err: any) => {
        console.log(err);
      }
    )
  }

  OTP: string;
  otpSentTime: Date;
  onClickGetOTP() {
    if (this.registerFormPayoneer.controls['PayoneerEmailID'].value == '') {
      this.alertService.error('Please enter Payoneer Email ID');
      return;
    }
    if (this.captchaLength == 0) {
      this.alertService.error('Please confirm that you are not a robot.!');
      return;
    }

    else {
      this._sellerregistrationService.getOTP(this.registerFormPayoneer.controls['PayoneerEmailID'].value).subscribe(
        (data) => {
          this.OTP = data;
          this.otpSentTime = new Date();
          this.alertService.success('OTP has been sent to your Payoneer Email ID');
        },
        (err: any) => {
          console.log(err);
        }
      )
    }
  }

  isInArray(array, word) {
    return array.indexOf(word.toLowerCase()) > -1;
  }

  selectedDegreeFile1: File;
  BusinessLicense: string = '';
  onFileChanged(event) {
    this.selectedDegreeFile1 = event.target.files[0]
    if (this.selectedDegreeFile1.name.length > 0) {
      var filesizeMB = Math.round(this.selectedDegreeFile1.size / 1024 / 1024);
      var fileexte = this.selectedDegreeFile1.name.split('.').pop();
      var allowedmb = parseInt(Apisettings.CommonFiles_Fileszie.toString())
      if (!this.isInArray(Apisettings.CommonFiles_Ext, fileexte)) {
        this.alertService.error("File must be extension with " + Apisettings.CommonFiles_Ext);
        return;
      }
      else if (filesizeMB > allowedmb) {
        this.alertService.error("File size must be less than or equal to " + Apisettings.CommonFiles_Fileszie + " MB.!");
        return;
      }
      else {
        let BusinessLicense: string = '';
        BusinessLicense = this.registerFormOthers.controls['FileData1'].value;
        this._sellerregistrationService.FileSave(this.selectedDegreeFile1, BusinessLicense).subscribe(
          (data) => {
            if (data != null && data.length > 0) {
              this.BusinessLicense = data;
            }
            else {
              this.alertService.error("File is not saved.!");
            }
          },
          (error: any) => {
            this.alertService.error("Error!:Image not uploaded.");
          }
        );
      }
    }
  }

  RegisterCompanyPayoneer() {
    let otpenteredtime = new Date();
    let diff = Math.abs(otpenteredtime.getTime() - this.otpSentTime.getTime());
    let differenceminute = Math.abs(((diff % 86400000) % 3600000) / 60000);
    if (this.registerFormPayoneer.controls['EmailOTP'].value == this.OTP && differenceminute < 5) {
      this.obj.Action = 'I';
      this.obj.PSP = this.PSP;
      this.obj.VendorID = this.registerFormPayoneer.controls['VendorID'].value;
      this.obj.PSPAccountNumber = this.registerFormPayoneer.controls['PSPAccountID'].value;
      this.obj.Email = this.registerFormPayoneer.controls['PayoneerEmailID'].value;
      this.obj.IORPartnerID = this.registerFormPayoneer.controls['IORPartnerID'].value;
      this._sellerregistrationService.Register(this.obj).subscribe(
        (data) => {
          if (data.Flag) {
            this.alertService.success(data.Msg);
            this.registerFormPayoneer.reset();
          }
          else {
            this.alertService.error(data.Msg);
          }
        },
        (err: any) => {
          console.log(err);
        }
      );
    }
    else {
      this.alertService.error('Invalid OTP');
      return;
    }
  }

  RegisterCompany() {
    this.obj.Action = 'I';
    this.obj.PSP = this.PSP;
    this.obj.CompanyName = this.registerFormOthers.controls['CompanyName'].value;
    this.obj.CompanyPhoneNumberCountryCode = this.registerFormOthers.controls['CompanyPhoneNumberCode'].value;
    this.obj.CompanyPhoneNumber = this.registerFormOthers.controls['CompanyPhoneNumber'].value;
    this.obj.CountryID = this.registerFormOthers.controls['CountryID'].value;
    this.obj.CompanyAddress = this.registerFormOthers.controls['CompanyAddress'].value;
    this.obj.BusinessLicense = this.BusinessLicense;
    this.obj.ContactPersonName = this.registerFormOthers.controls['ContactPerson'].value;
    this.obj.Email = this.registerFormOthers.controls['EMail'].value;
    this.obj.MobileNumberCountryCode = this.registerFormOthers.controls['ContactNumberCode'].value;
    this.obj.MobileNumber = this.registerFormOthers.controls['ContactNumber'].value;
    this.obj.WechatID = this.registerFormOthers.controls['WeChatID'].value;
    this.obj.IORPartnerID = this.registerFormOthers.controls['IORPartnerID'].value;
    this.obj.PSPAccountNumber = this.registerFormOthers.controls['PSPAccountID'].value;
    this.obj.VendorID = this.registerFormOthers.controls['VendorID'].value;
    this.obj.LogisticsPartner = this.registerFormOthers.controls['LogisticsPartner'].value;
    this.obj.NoofSKUs = this.registerFormOthers.controls['TotalSKU'].value;

    this._sellerregistrationService.Register(this.obj).subscribe(
      (data) => {
        if (data.Flag) {
          this.alertService.success(data.Msg);
          this.registerFormOthers.reset();
        }
        else {
          this.alertService.error(data.Msg);
        }
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
}
