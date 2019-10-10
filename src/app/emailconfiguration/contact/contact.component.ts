import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsernameValidator } from '../../_validators/username';
import { ToastrService } from 'ngx-toastr';
import { AuthorizationGuard } from '../../_guards/Authorizationguard';
import { Contact, Dropdown } from '../../_services/model';
import { ContactService } from '../../_services/service/contact.service';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { UtilityService } from '../../_services/service/utility.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contactform: FormGroup;
  lstContactType: Dropdown[];
  lst: Contact[];
  obj: Contact = {} as any;
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
    private _contactService: ContactService,
    private utilityService: UtilityService,
    private _PrivateutilityService: PrivateutilityService,
    private _authorizationGuard: AuthorizationGuard
  ) { }

  formErrors = {
    'ContactType': '',
    'ContactName': '',
    'MobileNumber': '',
    'Email': '',
    'Designation': '',
    'LandphoneNumber': '',
    'Department': '',
    'Organization': '',
    'Other1': '',
    'Other2': ''
  };

  validationMessages = {
    'ContactType': {
      'required': 'This Field is required',
    },
    'ContactName': {
      'required': 'This Field is required.',
      'maxlength': 'This Field must be less than 20 characters.',
      'pattern': 'This Field must be Alphanumeric.'
    },
    'MobileNumber': {
      'maxlength': 'This Field must be 10 - 12 characters.',
      'minlength': 'This Field must be 10 - 12 characters.',
      'pattern': 'This Field  must be Numeric',
      'required': 'This Field is required',
      'Contact_MobileInUse': 'Mobile Number is already registered!'
    },
    'Email': {
      'required': 'This Field is required',
      'pattern': 'This Field must be valid one.',
      'maxlength': 'This Field must be less than 50 characters.',
      'Contact_EmailInUse': 'Email is already registered!'
    },
    'Designation': {
      'required': 'This Field is required'
    },
    'LandphoneNumber': {
      'maxlength': 'This Field can not exceed 12 digits'
    },
    'Department': {
      'required': 'This Field is required'
    },
    'Organization': {
      'required': 'This Field is required'
    },
    'Other1': {
      'required': 'Other 1 must be less than 50 characters'
    },
    'Other2': {
      'required': 'Other 2 must be less than 50 characters'
    }

  }

  logValidationErrors(group: FormGroup = this.contactform): void {
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

    this._PrivateutilityService.GetValues('ContactType')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstContactType = data
        },
        (err: any) => console.log(err)
      );

    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
      if (this.identity > 0) {
        this.panelTitle = "Edit Contact";
        this.action = false;
        this._contactService.searchById(this.identity)
          .subscribe(
            (data: Contact) => {

              this.contactform.patchValue({
                ContactType: data.ContactType,
                ContactName: data.ContactName,
                MobileNumber: data.MobileNumber,
                LandphoneNumber: data.LandphoneNumber,

                Email: data.Email,
                Designation: data.Designation,
                Department: data.Department,
                Organization: data.Organization,
                Other1: data.Other1,
                Other2: data.Other2,

                IsActive: data.IsActive,
              });
              this.contactform.get('ContactName').disable();
              this.contactform.get('Email').disable();
              this.contactform.get('MobileNumber').disable();
            },
            (err: any) =>
              console.log(err)
          );
      }
      else {
        this.action = true;
        this.panelTitle = "Add New Contact";
      }
    });

    this.contactform = this.fb.group({
      ContactType: ['', [Validators.required,]],
      ContactName: ['', [Validators.required,
      Validators.pattern("^([a-zA-Z 0-9]+)$")]],
      MobileNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(12),
      Validators.pattern("^([0-9]+)$")],
        this.usernameValidator.existContact_Mobile(this.identity)],
      Email: ['', [Validators.required, , Validators.pattern(this.emailPattern)],
        this.usernameValidator.existContact_Email(this.identity)],
      LandphoneNumber: ['', [Validators.maxLength(12)]],
      Other1: ['', []],
      Other2: ['', []],

      Designation: ['', [Validators.required]],
      Department: ['', [Validators.required]],
      Organization: ['', [Validators.required]],

      IsActive: [0,],
    });
  }

  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("Contactlist", "ViewEdit")) {
      return;
    }
    // stop here if form is invalid
    if (this.contactform.invalid) {
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

    this.obj.ContactType = this.contactform.controls['ContactType'].value;
    this.obj.ContactName = this.contactform.controls['ContactName'].value;
    this.obj.MobileNumber = this.contactform.controls['MobileNumber'].value;
    this.obj.LandphoneNumber = this.contactform.controls['LandphoneNumber'].value;

    this.obj.Email = this.contactform.controls['Email'].value;
    this.obj.Designation = this.contactform.controls['Designation'].value;
    this.obj.Department = this.contactform.controls['Department'].value;
    this.obj.Organization = this.contactform.controls['Organization'].value;
    this.obj.Other1 = this.contactform.controls['Other1'].value;
    this.obj.Other2 = this.contactform.controls['Other2'].value;

    this.obj.IsActive = this.contactform.controls['IsActive'].value;

    this._spinner.show();
    this._contactService.add(this.obj).subscribe(
      (data) => {
        if (data!=null && data == true) {
          this._spinner.hide();
          this.alertService.success('Contact data has been added successful');
          this._router.navigate(['/Contactlist']);
        }
        else {
          this._spinner.hide();
          this.alertService.error('Contact creation failed!');
          this._router.navigate(['/Contactlist']);
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
    this.obj.ContactID = this.identity;

    this.obj.ContactType = this.contactform.controls['ContactType'].value;
    this.obj.ContactName = this.contactform.controls['ContactName'].value;
    this.obj.MobileNumber = this.contactform.controls['MobileNumber'].value;
    this.obj.LandphoneNumber = this.contactform.controls['LandphoneNumber'].value;

    this.obj.Email = this.contactform.controls['Email'].value;
    this.obj.Designation = this.contactform.controls['Designation'].value;
    this.obj.Department = this.contactform.controls['Department'].value;
    this.obj.Organization = this.contactform.controls['Organization'].value;
    this.obj.Other1 = this.contactform.controls['Other1'].value;
    this.obj.Other2 = this.contactform.controls['Other2'].value;

    this.obj.IsActive = this.contactform.controls['IsActive'].value;

    this._spinner.show();
    this._contactService.update(this.obj).subscribe(
      (data) => {
        if (data!=null && data == true) {
          this._spinner.hide();
          this.alertService.success('Contact detail data has been updated successful');
          this._router.navigate(['/Contactlist']);
        }
        else {
          this._spinner.hide();
          this.alertService.error('Contact detail not saved!');
          this._router.navigate(['/Contactlist']);
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
