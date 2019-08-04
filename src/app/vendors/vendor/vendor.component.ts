import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsernameValidator } from '../../_validators/username';
import { ToastrService } from 'ngx-toastr';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { Country, State, Dropdown, Vendor } from '../../_services/model';
import { VendorService } from '../../_services/service/vendor.service';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { UtilityService } from '../../_services/service/utility.service';
import { ContactService } from '../../_services/service/contact.service';
@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css']
})
export class VendorComponent implements OnInit {
  vendorform: FormGroup;
  countries: Country[];
  states: State[];
  lstAccountType: Dropdown[];
  lst: Vendor[];
  obj: Vendor = {} as any;
  panelTitle: string;
  action: boolean;
  identity: number = 0;
  Searchaction: boolean = true;
  emailPattern = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$";
  constructor(
    private alertService: ToastrService,
    private fb: FormBuilder,
    private _router: Router,
    private aroute: ActivatedRoute,
    public _spinner: NgxSpinnerService,
    private usernameValidator: UsernameValidator,
    private _customerService: VendorService,
    private utilityService: UtilityService,
    private _PrivateutilityService: PrivateutilityService,
    private _authorizationGuard: AuthorizationGuard,
    private _contactService: ContactService,
  ) { }

  formErrors = {
    'VendorName': '',
    'VendorAliasName': '',
    'Address1': '',
    'Address2': '',
    'CountryID': '',
    'City': '',
    'ContactPerson': '',
    'GSTNumber': '',
    'BankName': '',
    'AccountType': '',
    'IFSCCode': '',
    'StateID': '',
    'PostalCode': '',
    'ContactNumber': '',
    'Email': '',
    'BeneficiaryName': '',
    'AccountNumber': '',
  };
  validationMessages = {
    'VendorName': {
      'required': 'This field is required.',
      'VendorNameInUse': 'Vendor Name already used.',

    },
    'VendorAliasName': {
      'required': 'This field is required',
    },
    'GSTNumber': {
      'required': 'This field is required',
      'pattern': 'This field must be Alphanumeric',
    },

    'Address1': {
      'required': 'This field is required',
    },
    'Address2': {
      'maxlength': 'This field must be less than 100 charecters.',
    },
    'CountryID': { 
      'min': 'This field is required.',
    },
    'StateID': { 
      'min': 'This field is required.',
    },
    'City': {
      'required': 'This field is required',
      'pattern': 'This field must be alphabets(a-Z)',
    },
    'PostalCode': {
      'required': 'This field is required.',
      'pattern': 'This field must be 6 digit numeric(0-9).',
      'minlength': 'This field must be 6 digit numeric(0-9).',
      'maxlength': 'This field must be 6 digit numeric(0-9).',
    },

    'ContactPerson': {
      'required': 'This field is required',
      'pattern': 'This field must be alphabets(a-Z)',
    },
    'ContactNumber': {
      'maxlength': 'This field must be 10 - 12 charecters.',
      'minlength': 'This field must be 10 - 12 charecters.',
      'pattern': 'This field must be numeric(0-9)',
      'required': 'This field is required',
    },
    'Email': {
      'required': 'This field is required',
      'pattern': 'Email must be valid one.',
    },

    'BankName': {
      'pattern': 'This field must be alphabets(a-Z)',
    },
    'BeneficiaryName': {
      'maxlength': 'This field must be less than 30 charecters.',
    },
    'IFSCCode': {
      'pattern': 'This field must be Alphanumeric',
    },
    'AccountNumber': {
      'pattern': 'This field must be Alphanumeric',
    },

  };

  logValidationErrors(group: FormGroup = this.vendorform): void {
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
  ngOnInit() {

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
    this._spinner.show();
    this._PrivateutilityService.GetValues('BankAccountType')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstAccountType = data;
          this._spinner.hide();
        },
        (err: any) => {
          this._spinner.hide();
          console.log(err);
        }
      );

    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
      if (this.identity > 0) {
        this.panelTitle = "Edit Vendor";
        this.action = false;
        this._spinner.show();
        this._customerService.searchById(this.identity)
          .subscribe(
            (data: Vendor) => {
              this.obj.lstContact = data.lstContact;
              var CountryID = data.CountryID.toString();
              this.utilityService.getStates(parseInt(CountryID))
                .subscribe(
                  (statesa: State[]) => {
                    this.states = statesa;
                    this._spinner.hide();
                  },
                  (err: any) => 
                  {
                    this._spinner.hide();
                  }
                );

              var StateID = data.StateID.toString();
              this.vendorform.patchValue({
                VendorName: data.VendorName,
                VendorAliasName: data.VendorAliasName,
                GSTNumber: data.GSTNumber,

                Address1: data.Address1,
                Address2: data.Address2,
                CountryID: data.CountryID,
                StateID: StateID,
                City: data.City,
                PostalCode: data.PostalCode,

                ContactPerson: data.ContactPerson,
                ContactNumber: data.ContactNumber,
                Email: data.Email,

                AccountNumber: data.AccountNumber,
                BeneficiaryName: data.BeneficiaryName,
                BankName: data.BankName,
                IFSCCode: data.IFSCCode,
                AccountType: data.AccountType,

                IsActive: data.IsActive,
              });
              //this.vendorform.get('VendorName').disable();
              this.vendorform.get('StateID').disable();
            },
            (err: any) =>
              console.log(err)
          );
      }
      else {
        this.action = true;
        this.panelTitle = "Add New Vendor";
        this._spinner.show();
        this._contactService.searchByType('External').subscribe(
          (data) => {
            this.obj.lstContact = data;
            if (this.obj.lstContact != null && this.obj.lstContact.length > 0) {
              this.obj.lstContact.map(a => a.IsActive = false);
            }
            this._spinner.hide();
          },
          (err) => {
            this._spinner.hide();
            console.log(err);
          }
        );
      }
    });



    this.vendorform = this.fb.group({
      VendorName: ['', [Validators.required],
        this.usernameValidator.existVendorName(this.identity)],
      VendorAliasName: ['', [Validators.required]],
      GSTNumber: ['', [Validators.required, Validators.pattern("^([a-zA-Z0-9]+)$")]],

      Address1: ['', [Validators.required]],
      Address2: ['', [Validators.maxLength(100)]],
      CountryID: [0, [ Validators.min(1)]],
      StateID: [0, [ Validators.min(1)]],
      City: ['', [Validators.required, Validators.pattern("^([a-zA-Z ]+)$")]],
      PostalCode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern("^([0-9]+)$")]],

      ContactPerson: ['', [Validators.required, Validators.pattern("^([a-zA-Z ]+)$")]],
      ContactNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(12), Validators.pattern("^([0-9]+)$")]],
      Email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],

      AccountType: ['',],
      AccountNumber: ['', [Validators.pattern("^([a-zA-Z0-9]+)$")]],
      BeneficiaryName: ['', [Validators.maxLength(30)]],
      BankName: ['', [Validators.pattern("^([a-zA-Z ]+)$")]],
      IFSCCode: ['', [Validators.pattern("^([a-zA-Z0-9]+)$")]],

      IsActive: [0,],
    });
  }

  onchangeCountryID(selectedValue: string) {
    let countrid = parseInt(selectedValue);
    if (countrid > 0) {
      this._spinner.show();
      this.utilityService.getStates(countrid)
        .subscribe(
          (data: State[]) => {
            this.states = data;
            this._spinner.hide();
          },
          (err: any) => {
            this._spinner.hide();
            console.log(err);
          }
        );
    }
  }

  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("Vendorlist", "ViewEdit")) {
      return;
    }
    // stop here if form is invalid
    if (this.vendorform.invalid) {
      return;
    }
    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
    });
    if (this.identity > 0) {
      this.Update();
    }
    else {
      this.Insert();
    }
  }

  Insert() {

    this.obj.VendorName = this.vendorform.controls['VendorName'].value;
    this.obj.VendorAliasName = this.vendorform.controls['VendorAliasName'].value;
    this.obj.GSTNumber = this.vendorform.controls['GSTNumber'].value;

    this.obj.Address1 = this.vendorform.controls['Address1'].value;
    this.obj.Address2 = this.vendorform.controls['Address2'].value;
    this.obj.CountryID = this.vendorform.controls['CountryID'].value;
    this.obj.StateID = this.vendorform.controls['StateID'].value;
    this.obj.City = this.vendorform.controls['City'].value;
    this.obj.PostalCode = this.vendorform.controls['PostalCode'].value;

    this.obj.ContactPerson = this.vendorform.controls['ContactPerson'].value;
    this.obj.ContactNumber = this.vendorform.controls['ContactNumber'].value;
    this.obj.Email = this.vendorform.controls['Email'].value;

    this.obj.AccountType = this.vendorform.controls['AccountType'].value;
    this.obj.AccountNumber = this.vendorform.controls['AccountNumber'].value;
    this.obj.BeneficiaryName = this.vendorform.controls['BeneficiaryName'].value;
    this.obj.BankName = this.vendorform.controls['BankName'].value;
    this.obj.IFSCCode = this.vendorform.controls['IFSCCode'].value;

    this.obj.IsActive = this.vendorform.controls['IsActive'].value;
    if (this.obj.lstContact != null && this.obj.lstContact.length > 0) {
      this.obj.lstContact = this.obj.lstContact.filter(a => a.IsActive == true);
    }
    this._spinner.show();
    this._customerService.existGSTNumber(this.obj.VendorID, this.obj.GSTNumber)
      .subscribe(
        (data) => {
          if (data == true) {
            this.alertService.error('This GSTNumber has been registered already!');
          }
          else {
            this._spinner.show();
            this._customerService.add(this.obj).subscribe(
              (data) => {
                if (data != null && data.Flag == true) {
                  this._spinner.hide();
                  this.alertService.success(data.Msg);
                  this._router.navigate(['/Vendorlist']);
                }
                else {
                  this._spinner.hide();

                  this.alertService.error(data.Msg);
                  this._router.navigate(['/Vendorlist']);
                }
                this.identity = 0;
              },
              (error: any) => {
                this._spinner.hide();
                console.log(error);
              }
            );
          }
          this._spinner.hide();
        },
        (error: any) => {
          this._spinner.hide();
        }
      );



  }

  Update() {
    this.obj.VendorID = this.identity;
    this.obj.VendorName = this.vendorform.controls['VendorName'].value;
    this.obj.VendorAliasName = this.vendorform.controls['VendorAliasName'].value;
    this.obj.GSTNumber = this.vendorform.controls['GSTNumber'].value;

    this.obj.Address1 = this.vendorform.controls['Address1'].value;
    this.obj.Address2 = this.vendorform.controls['Address2'].value;
    this.obj.CountryID = this.vendorform.controls['CountryID'].value;
    this.obj.StateID = this.vendorform.controls['StateID'].value;
    this.obj.City = this.vendorform.controls['City'].value;
    this.obj.PostalCode = this.vendorform.controls['PostalCode'].value;

    this.obj.ContactPerson = this.vendorform.controls['ContactPerson'].value;
    this.obj.ContactNumber = this.vendorform.controls['ContactNumber'].value;
    this.obj.Email = this.vendorform.controls['Email'].value;

    this.obj.AccountType = this.vendorform.controls['AccountType'].value;
    this.obj.AccountNumber = this.vendorform.controls['AccountNumber'].value;
    this.obj.BeneficiaryName = this.vendorform.controls['BeneficiaryName'].value;
    this.obj.BankName = this.vendorform.controls['BankName'].value;
    this.obj.IFSCCode = this.vendorform.controls['IFSCCode'].value;

    this.obj.IsActive = this.vendorform.controls['IsActive'].value;
    if (this.obj.lstContact != null && this.obj.lstContact.length > 0) {
      this.obj.lstContact = this.obj.lstContact.filter(a => a.IsActive == true);
    }
    this._spinner.show();
    this._customerService.existGSTNumber(this.obj.VendorID, this.obj.GSTNumber)
      .subscribe(
        (data) => {
          if (data == true) {
            this.alertService.error('This GSTNumber has been registered already!');
          }
          else {
            this._spinner.show();
            this._customerService.update(this.obj).subscribe(
              (data) => {
                if (data != null && data.Flag == true) {
                  this._spinner.hide();
                  this.alertService.success(data.Msg);
                  this._router.navigate(['/Vendorlist']);
                }
                else {
                  this._spinner.hide();
                  this.alertService.error(data.Msg);
                  this._router.navigate(['/Vendorlist']);
                }
                this.identity = 0;
              },
              (error: any) => {
                this._spinner.hide();
                console.log(error);
              }
            );
          }
          this._spinner.hide();
        },
        (error: any) => {
          this._spinner.hide();
        }
      );

  }

  ContactIDFieldsChange(values: any) {
    this.obj.lstContact.filter(a => a.ContactID == values.currentTarget.id)[0].IsActive = values.currentTarget.checked;
  }
}
