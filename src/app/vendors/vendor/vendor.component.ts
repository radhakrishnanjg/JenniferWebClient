import { Component, OnInit } from '@angular/core';

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
import { switchMap, tap, flatMap } from 'rxjs/operators';
// import {do }from 'rxjs/operators';
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
  emailPattern = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$";
  dtOptions: DataTables.Settings = {};
  constructor(
    private alertService: ToastrService,
    private fb: FormBuilder,
    private _router: Router,
    private aroute: ActivatedRoute,

    private usernameValidator: UsernameValidator,
    private _vendorService: VendorService,
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
      'VendorNameInUse': 'Vendor Name is already registered!',

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
    },

    'ContactPerson': {
      'required': 'This field is required',
      'pattern': 'This field must be alphabets(a-Z)',
    },
    'ContactNumber': {
      'minlength': 'This field must be 10 - 12 charecters.',
      'pattern': 'This field must be numeric(0-9)',
      'required': 'This field is required',
    },
    'Email': {
      'required': 'This field is required',
      'pattern': 'Email must be valid one.',
      'VendorEmailInUse': 'Vendor Email is already registered!',
    },

    'BankName': {
      'pattern': 'This field must be alphabets(a-Z)',
    },
    'BeneficiaryName': {
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

    this.BindCountries();
    this.BindAccountTypes();

    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
      if (this.identity > 0) {
        this.panelTitle = "Edit Vendor";
        this.action = false;
        this._vendorService.searchById(this.identity).pipe(
          tap(data => {
            this.obj.lstContact = data.lstContact;
            this.dtOptions = {
              paging: false,
              scrollY: '400px',
              "language": {
                "search": 'Filter',
              },
            };
            this.BindVenderData(data);
          }),
          flatMap(u => this.utilityService.getStates(u.CountryID))
        ).subscribe(p => {
          this.states = p;

        }),
          (err) => {

            console.log(err);
          };
      }
      else {
        this.action = true;
        this.panelTitle = "Add New Vendor";
        this.BindNewContacts();
      }
    });



    this.vendorform = this.fb.group({
      VendorName: ['', [Validators.required],
        this.usernameValidator.existVendorName(this.identity)],
      VendorAliasName: ['', [Validators.required]],
      GSTNumber: ['', [Validators.required, Validators.pattern("^([a-zA-Z0-9]+)$")]],

      Address1: ['', [Validators.required]],
      Address2: ['', []],
      CountryID: [0, [Validators.min(1)]],
      StateID: [0, [Validators.min(1)]],
      City: ['', [Validators.required, Validators.pattern("^([a-zA-Z ]+)$")]],
      PostalCode: ['', [Validators.required, Validators.minLength(6), Validators.pattern("^([0-9]+)$")]],

      ContactPerson: ['', [Validators.required, Validators.pattern("^([a-zA-Z ]+)$")]],
      ContactNumber: ['', [Validators.required, Validators.minLength(10), Validators.pattern("^([0-9]+)$")]],
      Email: ['', [Validators.required, Validators.pattern(this.emailPattern)],
        this.usernameValidator.existVendorEmail(this.identity)],

      AccountType: ['',],
      AccountNumber: ['', [Validators.pattern("^([a-zA-Z0-9]+)$")]],
      BeneficiaryName: ['', []],
      BankName: ['', [Validators.pattern("^([a-zA-Z ]+)$")]],
      IFSCCode: ['', [Validators.pattern("^([a-zA-Z0-9]+)$")]],

      IsActive: [0,],
      IsEOR: [0,],
      IsEORApprovalRequired: [0,],
    });
  }

  private BindNewContacts() {

    this._contactService.searchByType('External').subscribe((data) => {
      this.obj.lstContact = data;
      if (this.obj.lstContact != null && this.obj.lstContact.length > 0) {
        this.obj.lstContact.map(a => a.IsActive = false);
      }
      this.dtOptions = {
        paging: false,
        scrollY: 'auto',
        "language": {
          "search": 'Filter',
        },
      };

    }, (err) => {

      console.log(err);
    });
  }

  private BindCountries() {

    this.utilityService.getCountries()
      .subscribe(
        (data: Country[]) => {
          this.countries = data;

        },
        (err: any) => {

          console.log(err);
        }
      );
  }

  private BindAccountTypes() {

    this._PrivateutilityService.GetValues('BankAccountType')
      .subscribe((data: Dropdown[]) => {
        this.lstAccountType = data;

      }, (err: any) => {

        console.log(err);
      });
  }

  private BindVenderData(data: Vendor) {
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
      IsEOR: data.IsEOR,
      IsEORApprovalRequired: data.IsEORApprovalRequired,
    });
    this.vendorform.get('CountryID').disable();
    this.vendorform.get('StateID').disable();
    this.vendorform.get('IsEOR').disable();
    this.vendorform.get('Email').disable();
  }


  onchangeCountryID(selectedValue: string) {
    let countrid = parseInt(selectedValue);
    if (countrid > 0) {

      this.utilityService.getStates(countrid)
        .subscribe(
          (data: State[]) => {
            this.states = data;

          },
          (err: any) => {

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
    if (this.vendorform.pristine) {
      this.alertService.error('Please change the value for any one control to proceed further!');
      return;
    }
    let GSTStateCode = this.states.filter(a => a.StateID == this.vendorform.controls['StateID'].value)[0].GSTStateCode;
    let State = this.states.filter(a => a.StateID == this.vendorform.controls['StateID'].value)[0].State;
    if (GSTStateCode != this.vendorform.controls['GSTNumber'].value.slice(0, 2)) {
      this.alertService.error('GST Number must start with ' + GSTStateCode + ' for ' + State + ' state.!');
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
    // only is EOR on insert time
    this.obj.IsEOR = this.vendorform.controls['IsEOR'].value;
    this.obj.IsEORApprovalRequired = this.vendorform.controls['IsEORApprovalRequired'].value;

    if (this.obj.lstContact != null && this.obj.lstContact.length > 0) {
      this.obj.lstContact = this.obj.lstContact.filter(a => a.IsActive == true);
    }

    this._vendorService.existGSTNumber(this.obj.VendorID, this.obj.GSTNumber)
      .subscribe(
        (data) => {
          if (data == true) {
            this.alertService.error('This GSTNumber is already registered');
          }
          else {
            this._vendorService.add(this.obj).subscribe(
              (data) => {
                if (data != null && data.Flag == true) {
                  this.alertService.success(data.Msg);
                  this._router.navigate(['/Vendorlist']);
                }
                else {
                  this.alertService.error(data.Msg);
                  this._router.navigate(['/Vendorlist']);
                }
                this.identity = 0;
              },
              (error: any) => {
                console.log(error);
              }
            );
          }
        },
        (error: any) => {
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
    this.obj.IsEORApprovalRequired = this.vendorform.controls['IsEORApprovalRequired'].value;
    if (this.obj.lstContact != null && this.obj.lstContact.length > 0) {
      this.obj.lstContact = this.obj.lstContact.filter(a => a.IsActive == true);
    }
    this._vendorService.existGSTNumber(this.obj.VendorID, this.obj.GSTNumber)
      .subscribe(
        (data) => {
          if (data == true) {
            this.alertService.error('This GSTNumber is already registered');
          }
          else {

            this._vendorService.update(this.obj).subscribe(
              (data) => {
                if (data != null && data.Flag == true) {
                  this.alertService.success(data.Msg);
                  this._router.navigate(['/Vendorlist']);
                }
                else {

                  this.alertService.error(data.Msg);
                  this._router.navigate(['/Vendorlist']);
                }
                this.identity = 0;
              },
              (error: any) => {

                console.log(error);
              }
            );
          }

        },
        (error: any) => {

        }
      );

  }

  ContactIDFieldsChange(values: any) {
    this.obj.lstContact.filter(a => a.ContactID == values.currentTarget.id)[0].IsActive = values.currentTarget.checked;
  }

  checkcontacts(value: boolean) {
    for (var i = 0; i < this.obj.lstContact.length; i++) {
      this.obj.lstContact[i].IsActive = value;
      $('#' + this.obj.lstContact[i].ContactID).prop("checked", value);
    }
  }
}
