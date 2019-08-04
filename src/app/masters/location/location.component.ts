import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsernameValidator } from '../../_validators/username';
import { ToastrService } from 'ngx-toastr';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { Country, State, Location } from '../../_services/model';
import { LocationService } from '../../_services/service/location.service';
import { UtilityService } from '../../_services/service/utility.service';
import { ContactService } from '../../_services/service/contact.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {
  locationform: FormGroup;
  countries: Country[];
  states: State[];
  lst: Location[];
  obj: Location = {} as any;
  panelTitle: string;
  action: boolean;
  identity: number = 0; 
  emailPattern = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$";
  constructor(
    private alertService: ToastrService,
    private fb: FormBuilder,
    private _router: Router,
    private aroute: ActivatedRoute,
    public _spinner: NgxSpinnerService,
    private usernameValidator: UsernameValidator,
    private _locationService: LocationService,
    private utilityService: UtilityService,
    private _authorizationGuard: AuthorizationGuard,
    private _contactService: ContactService,

  ) { }

  formErrors = {

    'LocationName': '',
    'LocaitonAliasName': '',
    'Address1': '',
    'Address2': '',
    'City': '',
    'PostalCode': '',
    'StateID': '',
    'CountryID': '',
    'GSTNumber': '',
    'ContactPerson': '',
    'ContactNumber': '',
    'Email': ''


  };

  validationMessages = {

    'LocationName': {
      'required': 'This field is required.',  
      'LocationNameInUse': 'Location Name already used.',
    },
    'LocaitonAliasName': {
      'required': 'This field is required.', 
    },

    'GSTNumber': {
      'required': 'This field is required.', 
      'pattern': 'This field must be Alphanumeric.',
      'GSTNumberInUse': 'GSTNumber already used.',
    },

    'Address1': {
      'required': 'This field is required', 
    },
    'Address2': {
      'maxlength': 'Address2 must be less than 100 charecters.',
    },
    'CountryID': {
      'required': 'This field is required',
      'min': 'This field is required.',
    },
    'StateID': {
      'required': 'This field is required',
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

  logValidationErrors(group: FormGroup = this.locationform): void {
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

    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
      if (this.identity > 0) {
        this.panelTitle = "Edit Location";
        this.action = false;  
        this._spinner.show();
        this._locationService.searchById(this.identity)
          .subscribe(
            (data: Location) => {
              this.obj.lstContact = data.lstContact;
              this._spinner.hide();
              var CountryID = data.CountryID.toString();
              this._spinner.show();
              this.utilityService.getStates(parseInt(CountryID))
                .subscribe(
                  (statesa: State[]) => {
                    this.states = statesa;
                    this._spinner.hide();
                  },
                  (err: any) => {
                    this._spinner.hide();
                    console.log(err);
                  }
                );

              var StateID = data.StateID.toString();
              this.locationform.patchValue({
                LocationName: data.LocationName,
                LocaitonAliasName: data.LocaitonAliasName,
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
                IsInvoicing: data.IsInvoicing,
              });
              this.locationform.get('LocationName').disable();
              this.locationform.get('GSTNumber').disable();
              this.locationform.get('StateID').disable();
            },
            (err: any) => {
              this._spinner.hide();
              console.log(err);
            }
          );
      }
      else {
        this.action = true;
        this.panelTitle = "Add New Location";
        this._spinner.show();
        this._contactService.searchByType('Internal').subscribe(
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

    this.locationform = this.fb.group({
      LocationName: ['', [Validators.required],
        this.usernameValidator.existLocationName(this.identity)],
      LocaitonAliasName: ['', [Validators.required]],
      GSTNumber: ['', [Validators.required, Validators.pattern("^([a-zA-Z0-9]+)$")],
        this.usernameValidator.existLocationGSTNumber(this.identity)],

      Address1: ['', [Validators.required]],
      Address2: ['', [Validators.maxLength(100)]],
      CountryID: [0, [Validators.required, Validators.min(1)]],
      StateID: [0, [Validators.required, Validators.min(1)]],
      City: ['', [Validators.required, Validators.pattern("^([a-zA-Z ]+)$")]],
      PostalCode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern("^([0-9]+)$")]],

      ContactPerson: ['', [Validators.required, Validators.pattern("^([a-zA-Z ]+)$")]],
      ContactNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(12),Validators.pattern("^([0-9]+)$")]],
      Email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],

      IsActive: [0,],
      IsInvoicing: [0,],
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

  ContactIDFieldsChange(values: any) {
    this.obj.lstContact.filter(a => a.ContactID == values.currentTarget.id)[0].IsActive = values.currentTarget.checked;
  }
  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("Locationlist", "ViewEdit")) {
      return;
    }
    // stop here if form is invalid
    if (this.locationform.invalid) {
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

    this.obj.LocationName = this.locationform.controls['LocationName'].value;
    this.obj.LocaitonAliasName = this.locationform.controls['LocaitonAliasName'].value;
    this.obj.GSTNumber = this.locationform.controls['GSTNumber'].value;

    this.obj.Address1 = this.locationform.controls['Address1'].value;
    this.obj.Address2 = this.locationform.controls['Address2'].value;
    this.obj.CountryID = this.locationform.controls['CountryID'].value;
    this.obj.StateID = this.locationform.controls['StateID'].value;
    this.obj.City = this.locationform.controls['City'].value;
    this.obj.PostalCode = this.locationform.controls['PostalCode'].value;

    this.obj.ContactPerson = this.locationform.controls['ContactPerson'].value;
    this.obj.ContactNumber = this.locationform.controls['ContactNumber'].value;
    this.obj.Email = this.locationform.controls['Email'].value;

    this.obj.IsInvoicing = this.locationform.controls['IsInvoicing'].value;
    this.obj.IsActive = this.locationform.controls['IsActive'].value;
    if (this.obj.lstContact != null && this.obj.lstContact.length > 0) {
      this.obj.lstContact = this.obj.lstContact.filter(a => a.IsActive == true);
    }
    this._spinner.show();
    this._locationService.add(this.obj).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this._spinner.hide();
          this.alertService.success(data.Msg);
          this._router.navigate(['/Locationlist']);
        }
        else {
          this._spinner.hide();
          this.alertService.error(data.Msg);
          this._router.navigate(['/Locationlist']);
        }
        this.identity = 0;
      },
      (error: any) => {
        this._spinner.hide();
        console.log(error);
      }
    );
  }

  Update() {
    this.obj.LocationID = this.identity;
    this.obj.LocationName = this.locationform.controls['LocationName'].value;
    this.obj.LocaitonAliasName = this.locationform.controls['LocaitonAliasName'].value;
    this.obj.GSTNumber = this.locationform.controls['GSTNumber'].value;

    this.obj.Address1 = this.locationform.controls['Address1'].value;
    this.obj.Address2 = this.locationform.controls['Address2'].value;
    this.obj.CountryID = this.locationform.controls['CountryID'].value;
    this.obj.StateID = this.locationform.controls['StateID'].value;
    this.obj.City = this.locationform.controls['City'].value;
    this.obj.PostalCode = this.locationform.controls['PostalCode'].value;

    this.obj.ContactPerson = this.locationform.controls['ContactPerson'].value;
    this.obj.ContactNumber = this.locationform.controls['ContactNumber'].value;
    this.obj.Email = this.locationform.controls['Email'].value;

    this.obj.IsInvoicing = this.locationform.controls['IsInvoicing'].value;
    this.obj.IsActive = this.locationform.controls['IsActive'].value;
    if (this.obj.lstContact != null && this.obj.lstContact.length > 0) {
      this.obj.lstContact = this.obj.lstContact.filter(a => a.IsActive == true);
    }
    this._spinner.show();
    this._locationService.update(this.obj).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this._spinner.hide();
          this.alertService.success(data.Msg);
          this._router.navigate(['/Locationlist']);
        }
        else {
          this._spinner.hide();
          this.alertService.error(data.Msg);
          this._router.navigate(['/Locationlist']);
        }
        this.identity = 0;
      },
      (error: any) => {
        this._spinner.hide();
        console.log(error);
      }
    );
  }

}
