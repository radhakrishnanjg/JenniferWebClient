import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { Country, State, Customer, Customerwarehouse } from '../../_services/model';
import { CustomerwarehouseService } from '../../_services/service/customerwarehouse.service';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { UtilityService } from '../../_services/service/utility.service';

@Component({
  selector: 'app-customerwarehouse',
  templateUrl: './customerwarehouse.component.html',
  styleUrls: ['./customerwarehouse.component.css']
})
export class CustomerwarehouseComponent implements OnInit {

  customerwarehouseform: FormGroup;
  lstCustomer: Customer[];
  countries: Country[];
  states: State[];
  lst: Customerwarehouse[];
  obj: Customerwarehouse = {} as any;
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
    
    private _customerwarehouseService: CustomerwarehouseService,
    private utilityService: UtilityService,
    private _PrivateutilityService: PrivateutilityService,
    private _authorizationGuard: AuthorizationGuard
  ) { }

  formErrors = {
    'CustomerID': '',
    'WarehouseName': '',
    'Address1': '',
    'Address2': '',
    'City': '',
    'PostalCode': '',
    'StateID': '',
    'CountryID': '',
    'GSTNumber': '',
    'ContactPerson': '',
    'ContactNumber': '',
    'Email': '',

  };
  validationMessages = {

    'CustomerID': {
      'min': 'This field  is required.'
    },
    'WarehouseName': {
      'required': 'This field is required.',
      'maxlength': 'This field must be less than 30 characters.'
    },
    'GSTNumber': {
      'required': 'This field is required.',
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
      'pattern': 'City must be alphabets(a-Z)',
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


  };

  logValidationErrors(group: FormGroup = this.customerwarehouseform): void {
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
          console.log(err)
          //
        }
      );

    //
    this._PrivateutilityService.getCustomers()
      .subscribe(
        (data: Customer[]) => {
          this.lstCustomer = data;
          //
        },
        (err: any) => {
          console.log(err)
          //
        }
      );


    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
      if (this.identity > 0) {
        this.panelTitle = "Edit Customer Warehouse";
        this.action = false;
        //
        this._customerwarehouseService.searchById(this.identity)
          .subscribe(
            (data: Customerwarehouse) => {
              var CountryID = data.CountryID.toString();
              //
              this.utilityService.getStates(parseInt(CountryID))
                .subscribe(
                  (statesa: State[]) => {
                    this.states = statesa;
                    //
                  },
                  (err: any) => {
                    console.log(err)
                    //
                  }
                );
              //
              this._PrivateutilityService.getCustomers()
                .subscribe(
                  (data1: Customer[]) => {
                    this.lstCustomer = data1;
                    //
                  },
                  (err: any) => {
                    console.log(err)
                    //
                  }
                );

              var StateID = data.StateID.toString();
              var CustomerID = data.CustomerID.toString();
              this.customerwarehouseform.patchValue({
                CustomerID: CustomerID,
                WarehouseName: data.WarehouseName,
                Address1: data.Address1,
                City: data.City,
                Address2: data.Address2,

                PostalCode: data.PostalCode,
                StateID: StateID,
                CountryID: data.CountryID,
                GSTNumber: data.GSTNumber,
                ContactPerson: data.ContactPerson,

                ContactNumber: data.ContactNumber,
                Email: data.Email,
                IsActive: data.IsActive,
              });
              this.customerwarehouseform.get('CustomerID').disable();
              this.customerwarehouseform.get('CountryID').disable();
              this.customerwarehouseform.get('StateID').disable();
            },
            (err: any) =>
              console.log(err)
          );
      }
      else {
        this.action = true;
        this.panelTitle = "Add New Customer Warehouse";
      }
    });

    this.customerwarehouseform = this.fb.group({
      CustomerID: [0, [Validators.min(1)]],
      WarehouseName: ['', [Validators.required, Validators.maxLength(30)]],
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

      IsActive: [0,],

    });
  }

  onchangeCustomerID(selectedValue: number) {
    if (selectedValue != 0) {
      let CustomerType = this.lstCustomer.filter(a => a.CustomerID == selectedValue)[0].CustomerType;
      if (CustomerType == "B2B") {
        this.customerwarehouseform.get('GSTNumber').enable();
      } else {
        $('#GSTNumber').val(' ');
        this.customerwarehouseform.patchValue({ GSTNumber: ' ' });
        this.customerwarehouseform.get('GSTNumber').disable(); 
      }
    }
  }

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
  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("Customerwarehouselist", "ViewEdit")) {
      return;
    }
    // stop here if form is invalid
    if (this.customerwarehouseform.invalid) {
      return;
    }
    if (this.customerwarehouseform.pristine) {
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

    this.obj.CustomerID = this.customerwarehouseform.controls['CustomerID'].value;
    this.obj.WarehouseName = this.customerwarehouseform.controls['WarehouseName'].value;
    this.obj.GSTNumber = this.customerwarehouseform.controls['GSTNumber'].value;

    this.obj.Address1 = this.customerwarehouseform.controls['Address1'].value;
    this.obj.Address2 = this.customerwarehouseform.controls['Address2'].value;
    this.obj.CountryID = this.customerwarehouseform.controls['CountryID'].value;
    this.obj.StateID = this.customerwarehouseform.controls['StateID'].value;
    this.obj.City = this.customerwarehouseform.controls['City'].value;
    this.obj.PostalCode = this.customerwarehouseform.controls['PostalCode'].value;

    this.obj.ContactPerson = this.customerwarehouseform.controls['ContactPerson'].value;
    this.obj.ContactNumber = this.customerwarehouseform.controls['ContactNumber'].value;
    this.obj.Email = this.customerwarehouseform.controls['Email'].value;

    this.obj.IsActive = this.customerwarehouseform.controls['IsActive'].value;

    //
    this._customerwarehouseService.exist(this.identity, this.obj.WarehouseName, this.obj.CustomerID)
      .subscribe(
        (data) => {
          if (data == true) {
            this.alertService.error('This warehouse is already registered');
          }
          else {
            //
            this._customerwarehouseService.add(this.obj).subscribe(
              (data) => {
                if (data != null && data == true) {
                  //
                  this.alertService.success('Customer warehouse data has been added successful');
                  this._router.navigate(['/Customerwarehouselist']);
                }
                else {
                  //
                  this.alertService.error('Customer warehouse data not saved!');
                  this._router.navigate(['/Customerwarehouselist']);
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

  Update() {
    this.obj.CustomerWarehouseID = this.identity;
    this.obj.CustomerID = this.customerwarehouseform.controls['CustomerID'].value;
    this.obj.WarehouseName = this.customerwarehouseform.controls['WarehouseName'].value;
    this.obj.GSTNumber = this.customerwarehouseform.controls['GSTNumber'].value;

    this.obj.Address1 = this.customerwarehouseform.controls['Address1'].value;
    this.obj.Address2 = this.customerwarehouseform.controls['Address2'].value;
    this.obj.CountryID = this.customerwarehouseform.controls['CountryID'].value;
    this.obj.StateID = this.customerwarehouseform.controls['StateID'].value;
    this.obj.City = this.customerwarehouseform.controls['City'].value;
    this.obj.PostalCode = this.customerwarehouseform.controls['PostalCode'].value;

    this.obj.ContactPerson = this.customerwarehouseform.controls['ContactPerson'].value;
    this.obj.ContactNumber = this.customerwarehouseform.controls['ContactNumber'].value;
    this.obj.Email = this.customerwarehouseform.controls['Email'].value;

    this.obj.IsActive = this.customerwarehouseform.controls['IsActive'].value;

    //
    this._customerwarehouseService.exist(this.identity, this.obj.WarehouseName, this.obj.CustomerID)
      .subscribe(
        (data) => {
          if (data == true) {
            this.alertService.error('This warehouse is already registered');
          }
          else {
            //
            this._customerwarehouseService.update(this.obj).subscribe(
              (data) => {
                if (data != null && data == true) {
                  //
                  this.alertService.success('Customer warehouse detail data has been updated successful');
                  this._router.navigate(['/Customerwarehouselist']);
                }
                else {
                  //
                  this.alertService.error('Customer warehouse detail not saved!');
                  this._router.navigate(['/Customerwarehouselist']);
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
}
