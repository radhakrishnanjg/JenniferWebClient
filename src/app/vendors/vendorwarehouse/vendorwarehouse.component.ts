import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { Country, State, Vendor, Vendorwarehouse } from '../../_services/model';
import { VendorwarehouseService } from '../../_services/service/vendorwarehouse.service';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { UtilityService } from '../../_services/service/utility.service';
import { ContactService } from 'src/app/_services/service/contact.service';
@Component({
  selector: 'app-vendorwarehouse',
  templateUrl: './vendorwarehouse.component.html',
  styleUrls: ['./vendorwarehouse.component.css']
})
export class VendorwarehouseComponent implements OnInit {
  vendorwarehouseform: FormGroup;
  lstVendor: Vendor[];
  countries: Country[];
  states: State[];
  lst: Vendorwarehouse[];
  obj: Vendorwarehouse = {} as any;
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

    private _vendorwarehouseService: VendorwarehouseService,
    private utilityService: UtilityService,
    private _PrivateutilityService: PrivateutilityService,
    private _authorizationGuard: AuthorizationGuard,
    private _contactService: ContactService,
  ) { }

  formErrors = {
    'VendorID': '',
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

    'VendorID': {
      'min': 'This field is required.',
    },
    'WarehouseName': {
      'required': 'This field is required.',
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

  };

  logValidationErrors(group: FormGroup = this.vendorwarehouseform): void {
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
    this._PrivateutilityService.getVendors()
      .subscribe(
        (data: Vendor[]) => {
          this.lstVendor = data;
          //
        },
        (err: any) => {
          console.log(err);
          //
        }
      );

    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
      if (this.identity > 0) {
        this.panelTitle = "Edit Vendor Warehouse";
        this.action = false;
        this._vendorwarehouseService.searchById(this.identity)
          .subscribe(
            (data: Vendorwarehouse) => {
              var CountryID = data.CountryID.toString();
              this.utilityService.getStates(parseInt(CountryID))
                .subscribe(
                  (statesa: State[]) => {
                    this.states = statesa;
                  },
                  (err: any) => {
                    console.log(err);
                  }
                );
              this._PrivateutilityService.getVendors()
                .subscribe(
                  (data1: Vendor[]) => {
                    this.lstVendor = data1;
                  },
                  (err: any) => {
                    console.log(err);
                  }
                );

              var StateID = data.StateID.toString();
              var VendorID = data.VendorID.toString();
              this.vendorwarehouseform.patchValue({
                VendorID: VendorID,
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
              this.obj.lstContact = data.lstContact;
              this.dtOptions = {
                paging: false,
                scrollY: '400px',
                "language": {
                  "search": 'Filter',
                },
              };
              this.vendorwarehouseform.get('VendorID').disable();
              this.vendorwarehouseform.get('CountryID').disable();
              this.vendorwarehouseform.get('StateID').disable();
            },
            (err: any) =>
              console.log(err)
          );
      }
      else {
        this.action = true;
        this.panelTitle = "Add New Vendor Warehouse";
        this.BindNewContacts();
      }
    });

    this.vendorwarehouseform = this.fb.group({
      VendorID: [0, [Validators.min(1)]],
      WarehouseName: ['', [Validators.required]],
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

  onchangeCountryID(selectedValue: string) {
    let countrid = parseInt(selectedValue);
    if (countrid > 0) {
      //
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
    if (this._authorizationGuard.CheckAcess("Vendorwarehouselist", "ViewEdit")) {
      return;
    }
    // stop here if form is invalid
    if (this.vendorwarehouseform.invalid) {
      return;
    }
    if (this.vendorwarehouseform.pristine) {
      this.alertService.error('Please change the value for any one control to proceed further!');
      return;
    }
    let GSTStateCode = this.states.filter(a => a.StateID == this.vendorwarehouseform.controls['StateID'].value)[0].GSTStateCode;
    let State = this.states.filter(a => a.StateID == this.vendorwarehouseform.controls['StateID'].value)[0].State;
    if (GSTStateCode != this.vendorwarehouseform.controls['GSTNumber'].value.slice(0, 2)) {
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

    this.obj.VendorID = this.vendorwarehouseform.controls['VendorID'].value;
    this.obj.WarehouseName = this.vendorwarehouseform.controls['WarehouseName'].value;
    this.obj.GSTNumber = this.vendorwarehouseform.controls['GSTNumber'].value;

    this.obj.Address1 = this.vendorwarehouseform.controls['Address1'].value;
    this.obj.Address2 = this.vendorwarehouseform.controls['Address2'].value;
    this.obj.CountryID = this.vendorwarehouseform.controls['CountryID'].value;
    this.obj.StateID = this.vendorwarehouseform.controls['StateID'].value;
    this.obj.City = this.vendorwarehouseform.controls['City'].value;
    this.obj.PostalCode = this.vendorwarehouseform.controls['PostalCode'].value;

    this.obj.ContactPerson = this.vendorwarehouseform.controls['ContactPerson'].value;
    this.obj.ContactNumber = this.vendorwarehouseform.controls['ContactNumber'].value;
    this.obj.Email = this.vendorwarehouseform.controls['Email'].value;

    this.obj.IsActive = this.vendorwarehouseform.controls['IsActive'].value;


    if (this.obj.lstContact != null && this.obj.lstContact.length > 0) {
      this.obj.lstContact = this.obj.lstContact.filter(a => a.IsActive == true);
    }
    this._vendorwarehouseService.exist(this.identity, this.obj.WarehouseName, this.obj.VendorID)
      .subscribe(
        (data) => {
          if (data == true) {
            this.alertService.error('This warehouse is already registered');
          }
          else {
            this._vendorwarehouseService.add(this.obj).subscribe(
              (data) => {
                if (data != null && data.Flag == true) { 
                  this.alertService.success(data.Msg);
                  this.identity = 0;
                  this._router.navigate(['/Vendorwarehouselist']);
                }
                else { 
                  this.alertService.error(data.Msg); 
                }
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
    this.obj.VendorWarehouseID = this.identity;
    this.obj.VendorID = this.vendorwarehouseform.controls['VendorID'].value;
    this.obj.WarehouseName = this.vendorwarehouseform.controls['WarehouseName'].value;
    this.obj.GSTNumber = this.vendorwarehouseform.controls['GSTNumber'].value;

    this.obj.Address1 = this.vendorwarehouseform.controls['Address1'].value;
    this.obj.Address2 = this.vendorwarehouseform.controls['Address2'].value;
    this.obj.CountryID = this.vendorwarehouseform.controls['CountryID'].value;
    this.obj.StateID = this.vendorwarehouseform.controls['StateID'].value;
    this.obj.City = this.vendorwarehouseform.controls['City'].value;
    this.obj.PostalCode = this.vendorwarehouseform.controls['PostalCode'].value;

    this.obj.ContactPerson = this.vendorwarehouseform.controls['ContactPerson'].value;
    this.obj.ContactNumber = this.vendorwarehouseform.controls['ContactNumber'].value;
    this.obj.Email = this.vendorwarehouseform.controls['Email'].value;

    this.obj.IsActive = this.vendorwarehouseform.controls['IsActive'].value;


    if (this.obj.lstContact != null && this.obj.lstContact.length > 0) {
      this.obj.lstContact = this.obj.lstContact.filter(a => a.IsActive == true);
    }
    this._vendorwarehouseService.exist(this.identity, this.obj.WarehouseName, this.obj.VendorID)
      .subscribe(
        (data) => {
          if (data == true) {
            this.alertService.error('This warehouse is already registered');
          }
          else {
            this._vendorwarehouseService.update(this.obj).subscribe(
              (data) => {
                if (data != null && data.Flag == true) {
                  this.alertService.success(data.Msg);
                  this.identity = 0;
                  this._router.navigate(['/Vendorwarehouselist']);
                }
                else { 
                  this.alertService.error(data.Msg);
                } 
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
