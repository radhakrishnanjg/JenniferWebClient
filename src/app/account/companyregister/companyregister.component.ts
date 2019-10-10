import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService, } from '../../_services/service/authentication.service';
import { AccountService } from '../../_services/service/account.service';
import { ToastrService } from 'ngx-toastr';
import { UtilityService } from '../../_services/service/utility.service';

import { FormGroup, FormBuilder, Validators, } from '@angular/forms';
import { Router } from '@angular/router';
import { CompanyRegister, Country, State, } from '../../_services/model';
import { UsernameValidator } from '../../_validators/username';
@Component({
  selector: 'app-companyregister',
  templateUrl: './companyregister.component.html',
  styleUrls: ['./companyregister.component.css']
})
export class CompanyregisterComponent implements OnInit {

  //#region Validation 
  formErrors = {
    'CompanyName': '',
    'CompnayAliasName': '',
    'EMail': '',
    'MobileNumber': '',
    'PrimaryAddress1': '',
    'PrimaryAddress2': '',
    'PrimaryCity': '',
    'PrimaryDistrict': '',
    'PrimaryStateID': '',
    'PrimaryCountryID': '',
    'PrimaryPostalCode': '',
    'PrimaryGST': '',
    'ContactPerson': '',
    'ContactNumber': '',
    'SecondaryAddress1': '',
    'SecondaryAddress2': '',
    'SecondaryDistrict': '',
    'SecondaryCity': '',
    'SecondaryStateID': '',
    'SecondaryCountryID': '',
    'SecondaryPostalCode': '',
    'SecondaryGST': '',
    'CompanyLogoPath': '',
    // additional validations
    'CompanyNameInUse': '',
    'CompanyEmailInUse': '',
    'CompanyPrimaryGSTInUse': '',
    'CompanySecondaryGSTInUse': '',
  }

  validationMessages = {
    'CompanyName': {
      'required': 'This field is required.',
      'CompanyNameInUse': 'Company Name is already registered!',
    },
    'CompnayAliasName': {
      'maxlength': 'This field Name must be less than or equal to 10 characters.'
    },
    'EMail': {
      'required': 'This field is required.',
      'email': 'This field must be valid E-mail.',
      'CompanyEmailInUse': 'Email is already registered!',
    },

    'MobileNumber': {
      'required': 'This field is required.',
      'minlength': 'This field must be 10 digit numeric value.',
      'maxlength': 'This field must be 10 digit numeric value.',
      'pattern': 'This field must be 10 digit numeric value.',
    },
    'PrimaryAddress1': {
      'required': 'This field is required.',
    },
    'PrimaryAddress2': {
      'required': 'This field is required.',
    },

    'PrimaryPostalCode': {
      'required': 'This field is required.',
      'minlength': 'This field must be 6 digit numeric value.',
      'maxlength': 'This field must be 6 digit numeric value.',
      'pattern': 'This field must be 6 digit numeric value.',
    },
    'PrimaryCity': {
      'required': 'This field is required.',
    },
    'PrimaryDistrict': {
      'required': 'This field is required.',
    },
    'PrimaryStateID': {
      'min': 'This field is required.',
    },
    'PrimaryCountryID': {
      'min': 'This field  is required.',
    },
    'PrimaryGST': {
      'required': 'This field is required.',
      'CompanyPrimaryGSTInUse': 'Primary GST is already registered!',
    },
    'ContactPerson': {
      'required': 'This field is required.',
      'pattern': 'This field must be alphabets(a-Z)'
    },
    'ContactNumber': {
      'required': 'This field is required.',
    },
    'SecondaryAddress1': {
      'required': 'This field is required.',
    },
    'SecondaryAddress2': {
      'required': 'This field is required.',
    },

    'SecondaryPostalCode': {
      'required': 'This field is required.',
    },
    'SecondaryDistrict': {
      'required': 'This field is required.',
    },
    'SecondaryCity': {
      'required': 'This field is required.',
    },
    'SecondaryStateID': {
      'min': 'This field is required.',
    },
    'SecondaryCountryID': {
      'min': 'This field is required.',
    },
    'SecondaryGST': {
      'required': 'This field is required.',
      'CompanySecondaryGSTInUse': 'Secondary GST is already registered!',
    },
    // 'CompanyLogoPath': {
    //   'required': 'CompanyLogoPath is required.',
    // },

  };

  logValidationErrors(group: FormGroup = this.registerForm): void {
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

  //#endregion

  //#region variable declaration 
  registerForm: FormGroup;
  countries: Country[];
  states: State[];
  secondarystates: State[];
  objCompanyRegister: CompanyRegister = {} as any;
  issameaddress: boolean;
  selectedFile: File;
  secondaryValues = [
    'SecondaryCountryID',
    'SecondaryStateID',
    'SecondaryDistrict',
    'SecondaryCity',
    'SecondaryAddress1',
    'SecondaryAddress2',
    'SecondaryGST',
    'SecondaryPostalCode'
  ];

  emailPattern = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$";
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private accountService: AccountService,
    private alertService: ToastrService,
    public _spinner: NgxSpinnerService,
    private utilityService: UtilityService,
    private usernameValidator: UsernameValidator
  ) { }

  //#endregion

  get f() { return this.registerForm.controls; }

  ngOnInit() {
    this.objCompanyRegister.IsPrimarySecondarySame = false;
    this._spinner.show();
    this.utilityService.getCountries()
      .subscribe(
        (data: Country[]) => {
          this.countries = data;
          this._spinner.hide();
        },
        (err: any) => {
          this._spinner.hide();
          console.log(err);
        }
      );

    this.registerForm = this.fb.group({


      CompanyName: ['', [Validators.required]
        , this.usernameValidator.checkCompanyName()
      ],
      CompnayAliasName: ['', [Validators.maxLength(10)]],
      EMail: ['', [Validators.required, Validators.pattern(this.emailPattern)]
        , this.usernameValidator.existCompanyEmail()
      ],
      MobileNumber: ['', [Validators.required,Validators.minLength(10)]],
      PrimaryAddress1: ['', [Validators.required]],

      PrimaryAddress2: ['', [Validators.maxLength(100)]],
      PrimaryPostalCode: ['', [Validators.required,Validators.minLength(6)]],
      PrimaryCity: ['', [Validators.required]],
      PrimaryDistrict: ['', [Validators.required]],
      PrimaryStateID: [0, [Validators.min(1),]],
      PrimaryCountryID: [0, [Validators.min(1),]],

      PrimaryGST: ['', [Validators.required]
      ],
      ContactPerson: ['', [Validators.required, Validators.pattern("^([a-zA-Z ]+)$")]],
      ContactNumber: ['', [Validators.minLength(10)]],
      SecondaryAddress1: ['', [Validators.required]],
      SecondaryAddress2: ['', [Validators.maxLength(100)]],
      SecondaryPostalCode: ['', [Validators.required,Validators.minLength(6)]],

      SecondaryDistrict: ['', [Validators.required]],
      SecondaryCity: ['', [Validators.required]],
      SecondaryStateID: [0, [Validators.min(1),]],
      SecondaryCountryID: [0, [Validators.min(1),]],
      SecondaryGST: ['', [Validators.required]],
      //  CompanyLogoPath: ['', [Validators.required]],
      issameaddress: '',

    },
    );


  }

  RegisterCompany() {
    this.registerForm.controls['PrimaryCountryID'].setValue($('#PrimaryCountryID').val());
    this.registerForm.controls['PrimaryStateID'].setValue($('#PrimaryStateID').val());
    this.registerForm.controls['SecondaryCountryID'].setValue($('#SecondaryCountryID').val());
    this.registerForm.controls['SecondaryStateID'].setValue($('#SecondaryStateID').val());
    this.registerForm.controls['SecondaryDistrict'].setValue($('#SecondaryDistrict').val());
    this.registerForm.controls['SecondaryCity'].setValue($('#SecondaryCity').val());
    this.registerForm.controls['SecondaryAddress1'].setValue($('#SecondaryAddress1').val());

    this.registerForm.controls['SecondaryAddress2'].setValue($('#SecondaryAddress2').val());
    this.registerForm.controls['SecondaryGST'].setValue($('#SecondaryGST').val());
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    // var filesizeMB = Math.round(this.selectedFile.size / 1024 / 1024);
    // var fileexte = this.selectedFile.name.split('.').pop();
    // if (!this.isInArray(Apisettings.IMGFiles_Ext, fileexte)) {
    //   this.alertService.error("File must be extension with " + Apisettings.IMGFiles_Ext );
    //   return;
    // }
    // else if (filesizeMB <= Apisettings.IMGFiles_Fileszie) {
    //   this.alertService.error("File size must be less than or equal to or equal to " + Apisettings.IMGFiles_Fileszie );
    //   return;
    // }
    //this.objCompanyRegister.CompanyLogoPath=this.selectedFile.;
    if (this.registerForm.controls['PrimaryStateID'].value != this.registerForm.controls['SecondaryStateID'].value) {
      if (!this.accountService.ExistCompanySecondaryGST(this.objCompanyRegister.SecondaryGST)) {
        this.alertService.error("Secondary GST already exist.");
        return;
      }
    }
    this.objCompanyRegister.CompanyName = this.registerForm.controls['CompanyName'].value;
    this.objCompanyRegister.CompnayAliasName = this.registerForm.controls['CompnayAliasName'].value;
    this.objCompanyRegister.EMail = this.registerForm.controls['EMail'].value;
    this.objCompanyRegister.MobileNumber = this.registerForm.controls['MobileNumber'].value;
    this.objCompanyRegister.PrimaryCountryID = this.registerForm.controls['PrimaryCountryID'].value;

    this.objCompanyRegister.PrimaryStateID = this.registerForm.controls['PrimaryStateID'].value;
    this.objCompanyRegister.PrimaryDistrict = this.registerForm.controls['PrimaryDistrict'].value;
    this.objCompanyRegister.PrimaryCity = this.registerForm.controls['PrimaryCity'].value;
    this.objCompanyRegister.PrimaryAddress1 = this.registerForm.controls['PrimaryAddress1'].value;
    this.objCompanyRegister.PrimaryAddress2 = this.registerForm.controls['PrimaryAddress2'].value;
    this.objCompanyRegister.PrimaryPostalCode = this.registerForm.controls['PrimaryPostalCode'].value;


    this.objCompanyRegister.PrimaryGST = this.registerForm.controls['PrimaryGST'].value;
    this.objCompanyRegister.ContactPerson = this.registerForm.controls['ContactPerson'].value;
    this.objCompanyRegister.ContactNumber = this.registerForm.controls['ContactNumber'].value;
    this.objCompanyRegister.SecondaryCountryID = this.registerForm.controls['SecondaryCountryID'].value;
    this.objCompanyRegister.SecondaryStateID = this.registerForm.controls['SecondaryStateID'].value;
    this.objCompanyRegister.SecondaryPostalCode = this.registerForm.controls['SecondaryPostalCode'].value;


    this.objCompanyRegister.SecondaryDistrict = this.registerForm.controls['SecondaryDistrict'].value;
    this.objCompanyRegister.SecondaryCity = this.registerForm.controls['SecondaryCity'].value;
    this.objCompanyRegister.SecondaryAddress1 = this.registerForm.controls['SecondaryAddress1'].value;
    this.objCompanyRegister.SecondaryAddress2 = this.registerForm.controls['SecondaryAddress2'].value;
    this.objCompanyRegister.SecondaryGST = this.registerForm.controls['SecondaryGST'].value;

    this._spinner.show();
    this.accountService.RegisterCompany(this.selectedFile, this.objCompanyRegister).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.alertService.success(data.Msg);
          this.Reset();
          //this._router.navigate(['/Users']);
          this._spinner.hide();
        }
        else {
          this.alertService.error(data.Msg);
          //this._router.navigate(['/Users']);
          this._spinner.hide();
        }
      },
      (err: any) => {
        console.log(err);
        this._spinner.hide();
      }
    );
    this.enableValue(this.secondaryValues);
  }


  onchangePrimaryCountryID(selectedValue: string) {
    let countrid = parseInt(selectedValue);
    this.registerForm.controls['PrimaryCountryID'].setValue(countrid);
    if (countrid > 0) {
      this._spinner.show();
      this.utilityService.getStates(countrid)
        .subscribe(
          (data: State[]) => {
            this.states = data;
            this._spinner.hide();
          },
          (err: any) => {
            console.log(err);
            this._spinner.hide();
          }
        );
    }

  }

  onchangeSecondaryCountryID(selectedValue: string) {
    let countrid = parseInt(selectedValue);
    this._spinner.show();
    this.utilityService.getStates(countrid)
      .subscribe(
        (data: State[]) => {
          this.secondarystates = data;
          this._spinner.hide();
        },
        (err: any) => {
          console.log(err);
          this._spinner.hide();
        }
      );
  }
  disableValue(keys: string[]): void {
    keys.forEach(obj => { this.registerForm.controls[obj].disable() });
  }

  enableValue(keys: string[]): void {
    keys.forEach(obj => {
      this.registerForm.controls[obj].enable();
      this.registerForm.controls[obj].setValue('');
    });
  }
  onchangeissameaddress(event: any) {
    if ($('#PrimaryCountryID').val() == "0") {
      this.alertService.error("Please enter all the primary details.");
      return;
    }
    else if ($('#PrimaryStateID').val() == "0") {
      this.alertService.error("Please enter all the primary details.");
      return;
    }
    else if ($('#PrimaryDistrict').val() == "") {
      this.alertService.error("Please enter all the primary details.");
      return;
    } else if ($('#PrimaryCity').val() == "") {
      this.alertService.error("Please enter all the primary details.");
      return;
    } else if ($('#PrimaryAddress1').val() == "") {
      this.alertService.error("Please enter all the primary details.");
      return;
    }
    // else if ($('#PrimaryAddress2').val() == "") {
    //   this.alertService.error("Please enter all the primary details.");
    //   return;
    // }
    else if ($('#PrimaryGST').val() == "") {
      this.alertService.error("Please enter all the primary details.");
      return;
    }
    else {

    }


    if (event.target.checked) {
      this.objCompanyRegister.IsPrimarySecondarySame = true;
      this.disableValue(this.secondaryValues);
      let countrid = parseInt($('#PrimaryCountryID').val().toString());
      let stateid = parseInt($('#PrimaryStateID').val().toString());
      this.registerForm.patchValue({
        SecondaryCountryID: countrid,
        SecondaryStateID: stateid,
        SecondaryDistrict: $('#PrimaryDistrict').val(),
        SecondaryCity: $('#PrimaryCity').val(),
        SecondaryAddress1: $('#PrimaryAddress1').val(),
        SecondaryAddress2: $('#PrimaryAddress2').val(),
        SecondaryGST: $('#PrimaryGST').val(),
        SecondaryPostalCode: $('#PrimaryPostalCode').val()
      });
      this._spinner.show();
      this.utilityService.getStates(countrid)
        .subscribe(
          (data: State[]) => {
            this.secondarystates = data;
            this._spinner.hide();
            let PrimaryStateID = parseInt($('#PrimaryStateID').val().toString());
            setTimeout(function sd() {
              this.registerForm.patchValue({
                PrimaryStateID: PrimaryStateID,
              });
            }, 1000);
          },
          (err: any) => {
            this._spinner.hide();
            console.log(err)
          }
        );
    } else {
      this.objCompanyRegister.IsPrimarySecondarySame = false;
      this.enableValue(this.secondaryValues);

    }
  }

  onFileChanged(e: any) {
    this.selectedFile = e.target.files[0];
  }
  isInArray(array, word) {
    return array.indexOf(word.toLowerCase()) > -1;
  }

  Reset() {
    // Resets to blank object
    this.registerForm.reset();

    // Resets to provided model
    //this.registerForm.reset({ fullname:  '', EmailId: '', mobile: '', PasswordGroup : null });
  }

}
