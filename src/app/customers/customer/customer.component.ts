import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsernameValidator } from '../../_validators/username';
import { ToastrService } from 'ngx-toastr';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { Country, State, Customer, Dropdown } from '../../_services/model';
import { CustomerService } from '../../_services/service/customer.service';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { UtilityService } from '../../_services/service/utility.service';
import { ContactService } from '../../_services/service/contact.service';
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerform: FormGroup;
  countries: Country[];
  states: State[];
  lstAccountType: Dropdown[];
  lstCustomerType: Dropdown[];
  lst: Customer[];
  obj: Customer = {} as any;
  panelTitle: string;
  action: boolean;
  identity: number = 0;
  Searchaction: boolean = true;
  emailPattern = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$";
  dtOptions: DataTables.Settings = {};
  constructor(
    private alertService: ToastrService,
    private fb: FormBuilder,
    private _router: Router,
    private aroute: ActivatedRoute,

    private usernameValidator: UsernameValidator,
    private _customerService: CustomerService,
    private utilityService: UtilityService,
    private _PrivateutilityService: PrivateutilityService,
    private _authorizationGuard: AuthorizationGuard,
    private _contactService: ContactService,
  ) { }

  formErrors = {
    'CustomerType': '',
    'CustomerName': '',
    'CustomerAliasName': '',
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
    'CustomerType': {
      'min': 'This field is required',
    },
    'CustomerName': {
      'required': 'This field is required.',
      'CustomerNameInUse': 'Customer Name is already registered!',
    },
    'CustomerAliasName': {
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

  logValidationErrors(group: FormGroup = this.customerform): void {
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


    //
    this.utilityService.getCountries()
      .subscribe(
        (data: Country[]) => {
          this.countries = data;
          //
        },
        (err: any) => {
          //
          console.log(err);
        }
      );

    //
    this._PrivateutilityService.GetValues('BankAccountType')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstAccountType = data;
          //
        },
        (err: any) => {
          //
          console.log(err);
        }
      );
    //
    this._PrivateutilityService.GetValues('CustomerType')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstCustomerType = data;
          //
        },
        (err: any) => {
          //
          console.log(err);
        }
      );

    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
      if (this.identity > 0) {
        this.panelTitle = "Edit Customer";
        this.action = false;
        //
        this._customerService.searchById(this.identity)
          .subscribe(
            (data: Customer) => {
              this.obj.lstContact = data.lstContact;
              this.dtOptions = {
                paging: false,
                scrollY: '400px',
                "language": {
                  "search": 'Filter',
                },
              };
              var CountryID = data.CountryID.toString();
              //
              this.utilityService.getStates(parseInt(CountryID))
                .subscribe(
                  (statesa: State[]) => {
                    this.states = statesa;
                    //
                  },
                  (err: any) => {
                    //
                    console.log(err);
                  }
                );

              var StateID = data.StateID.toString();
              this.customerform.patchValue({
                CustomerType: data.CustomerType,
                CustomerName: data.CustomerName,
                CustomerAliasName: data.CustomerAliasName,
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
              //this.customerform.get('CustomerName').disable();
              this.customerform.get('CustomerType').disable();
              this.customerform.get('CountryID').disable();
              this.customerform.get('StateID').disable();
              this.onchangeCustomerType(data.CustomerType);
            },
            (err: any) =>
              console.log(err)
          );
      }
      else {
        this.action = true;
        this.panelTitle = "Add New Customer";
        //
        this._contactService.searchByType('External').subscribe(
          (data) => {
            this.obj.lstContact = data;

            if (this.obj.lstContact != null && this.obj.lstContact.length > 0) {
              this.obj.lstContact.map(a => a.IsActive = false);
            }
            this.dtOptions = {
              paging: false,
              scrollY: '400px',
              "language": {
                "search": 'Filter',
              },
            };
            //
          },
          (err) => {
            //
            console.log(err);
          }
        );
      }
    });

    this.customerform = this.fb.group({
      CustomerType: [0, [Validators.min(1)]],
      CustomerName: ['', [Validators.required]
        //,this.usernameValidator.existCustomerName(this.identity)
      ],
      CustomerAliasName: ['', [Validators.required]],
      GSTNumber: ['', [Validators.required, Validators.pattern("^([a-zA-Z0-9]+)$")]],

      Address1: ['', [Validators.required]],
      Address2: ['', [Validators.maxLength(100)]],
      CountryID: [0, [Validators.min(1)]],
      StateID: [0, [Validators.min(1)]],
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
  public customPatterns = { '0': { pattern: new RegExp('\[a-zA-Z\]') } };
  onchangeCountryID(selectedValue: string) {
    let countrid = parseInt(selectedValue);
    if (countrid > 0) {
      //
      this.utilityService.getStates(countrid)
        .subscribe(
          (data: State[]) => {
            this.states = data;
            //
          },
          (err: any) => {
            //
            console.log(err);
          }
        );
    }
  }

  onchangeCustomerType(selectedValue: string) {
    if (selectedValue == "B2B") {
      this.customerform.get('GSTNumber').enable();
    } else {
      $('#GSTNumber').val(' ');
      this.customerform.patchValue({ GSTNumber: ' ' });
      this.customerform.get('GSTNumber').disable();

    }
  }

  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("Customerlist", "ViewEdit")) {
      return;
    }

    // stop here if form is invalid
    if (this.customerform.invalid) {
      return;
    }
    if (this.customerform.pristine) {
      this.alertService.error('Please change the value for any one control to proceed further!');
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

    this.obj.CustomerType = this.customerform.controls['CustomerType'].value;
    this.obj.CustomerName = this.customerform.controls['CustomerName'].value;
    this.obj.CustomerAliasName = this.customerform.controls['CustomerAliasName'].value;
    this.obj.GSTNumber = this.customerform.controls['GSTNumber'].value;

    this.obj.Address1 = this.customerform.controls['Address1'].value;
    this.obj.Address2 = this.customerform.controls['Address2'].value;
    this.obj.CountryID = this.customerform.controls['CountryID'].value;
    this.obj.StateID = this.customerform.controls['StateID'].value;
    this.obj.City = this.customerform.controls['City'].value;
    this.obj.PostalCode = this.customerform.controls['PostalCode'].value;

    this.obj.ContactPerson = this.customerform.controls['ContactPerson'].value;
    this.obj.ContactNumber = this.customerform.controls['ContactNumber'].value;
    this.obj.Email = this.customerform.controls['Email'].value;

    this.obj.AccountType = this.customerform.controls['AccountType'].value;
    this.obj.AccountNumber = this.customerform.controls['AccountNumber'].value;
    this.obj.BeneficiaryName = this.customerform.controls['BeneficiaryName'].value;
    this.obj.BankName = this.customerform.controls['BankName'].value;
    this.obj.IFSCCode = this.customerform.controls['IFSCCode'].value;

    this.obj.IsActive = this.customerform.controls['IsActive'].value;
    if (this.obj.lstContact != null && this.obj.lstContact.length > 0) {
      this.obj.lstContact = this.obj.lstContact.filter(a => a.IsActive == true);
    }
    if (this.obj.CustomerType == "B2B") {
      //
      this._customerService.existGSTNumber(this.obj.CustomerID, this.obj.GSTNumber)
        .subscribe(
          (data) => {
            if (data == true) {
              this.alertService.error('This GSTNumber is already registered');
            }
            else {
              //
              this._customerService.add(this.obj).subscribe(
                (data) => {
                  if (data != null && data.Flag == true) {
                    //
                    this.alertService.success(data.Msg);
                    this._router.navigate(['/Customerlist']);
                  }
                  else {
                    //
                    this.alertService.error(data.Msg);
                    this._router.navigate(['/Customerlist']);
                  }
                  this.identity = 0;
                },
                (error: any) => {
                  //
                  console.log(error);
                }
              );
            }
            //
          },
          (error: any) => {
            //
          }
        );
    }
    else {
      //
      this._customerService.add(this.obj).subscribe(
        (data) => {
          if (data != null && data.Flag == true) {
            //
            this.alertService.success(data.Msg);
            this._router.navigate(['/Customerlist']);
          }
          else {
            //
            this.alertService.error(data.Msg);
            this._router.navigate(['/Customerlist']);
          }
          this.identity = 0;
        },
        (error: any) => {
          //
          console.log(error);
        }
      );
    }

  }

  Update() {
    this.obj.CustomerID = this.identity;
    this.obj.CustomerType = this.customerform.controls['CustomerType'].value;
    this.obj.CustomerName = this.customerform.controls['CustomerName'].value;
    this.obj.CustomerAliasName = this.customerform.controls['CustomerAliasName'].value;
    this.obj.GSTNumber = this.customerform.controls['GSTNumber'].value;

    this.obj.Address1 = this.customerform.controls['Address1'].value;
    this.obj.Address2 = this.customerform.controls['Address2'].value;
    this.obj.CountryID = this.customerform.controls['CountryID'].value;
    this.obj.StateID = this.customerform.controls['StateID'].value;
    this.obj.City = this.customerform.controls['City'].value;
    this.obj.PostalCode = this.customerform.controls['PostalCode'].value;

    this.obj.ContactPerson = this.customerform.controls['ContactPerson'].value;
    this.obj.ContactNumber = this.customerform.controls['ContactNumber'].value;
    this.obj.Email = this.customerform.controls['Email'].value;

    this.obj.AccountType = this.customerform.controls['AccountType'].value;
    this.obj.AccountNumber = this.customerform.controls['AccountNumber'].value;
    this.obj.BeneficiaryName = this.customerform.controls['BeneficiaryName'].value;
    this.obj.BankName = this.customerform.controls['BankName'].value;
    this.obj.IFSCCode = this.customerform.controls['IFSCCode'].value;

    this.obj.IsActive = this.customerform.controls['IsActive'].value;
    if (this.obj.lstContact != null && this.obj.lstContact.length > 0) {
      this.obj.lstContact = this.obj.lstContact.filter(a => a.IsActive == true);
    }
    if (this.obj.CustomerType == "B2B") {
      //
      this._customerService.existGSTNumber(this.obj.CustomerID, this.obj.GSTNumber)
        .subscribe(
          (data) => {
            if (data == true) {
              this.alertService.error('This GSTNumber is already registered');
            }
            else {
              //
              this._customerService.update(this.obj).subscribe(
                (data) => {
                  if (data != null && data.Flag == true) {
                    //
                    this.alertService.success(data.Msg);
                    this._router.navigate(['/Customerlist']);
                  }
                  else {
                    //
                    this.alertService.error(data.Msg);
                    this._router.navigate(['/Customerlist']);
                  }
                  this.identity = 0;
                },
                (error: any) => {
                  //
                  console.log(error);
                }
              );
            }
            //
          },
          (error: any) => {
            //
          }
        );
    } else {
      //
      this._customerService.update(this.obj).subscribe(
        (data) => {
          if (data != null && data.Flag == true) {
            //
            this.alertService.success(data.Msg);
            this._router.navigate(['/Customerlist']);
          }
          else {
            //
            this.alertService.error(data.Msg);
            this._router.navigate(['/Customerlist']);
          }
          this.identity = 0;
        },
        (error: any) => {
          //
          console.log(error);
        }
      );
    }

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
