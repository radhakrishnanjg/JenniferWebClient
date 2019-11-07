import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsernameValidator } from '../../_validators/username';
import { UserService } from '../../_services/service/user.service';
import { ToastrService } from 'ngx-toastr';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { IUser, Companydetails, Dropdown, Item } from '../../_services/model';


import { AuthorizationGuard } from '../../_guards/Authorizationguard'
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],

})

export class UserComponent implements OnInit {
  users: IUser[];
  obj: IUser = {} as any;
  userForm: FormGroup;
  panelTitle: string;
  action: boolean;
  identity: number = 0;
  UserType: number = 0;
  UserTypeErrorMessage: string = '';
  constructor(
    public _userService: UserService,
    private alertService: ToastrService,
    private aroute: ActivatedRoute,
    private _router: Router,
    private fb: FormBuilder,
    private usernameValidator: UsernameValidator,
    private _PrivateutilityService: PrivateutilityService,
    private _authorizationGuard: AuthorizationGuard,
    
  ) { }


  formErrors = {
    'FirstName': '',
    'LastName': '',
    'Email': '',
    'password': '',
  };

  // This object contains all the validation messages for this form
  validationMessages = {
    'FirstName': {
      'required': 'This Field is required.',
      'pattern': 'This field must be alphabets(a-Z)',
    },
    'LastName': {
      'pattern': 'This field must be alphabets(a-Z)',
    },
    'Email': {
      'required': 'This Field is required.',
      'email': 'This Field  must be valid one.',
      'maxlength': 'This Field must be less than or equal to 50 characters.',
      'EmailIdInUse': 'This email is already registered!'
    },
  };

  logValidationErrors(group: FormGroup = this.userForm): void {
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


    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
      if (this.identity > 0) {

        this.panelTitle = "Edit user";
        this.action = false;
        //
        this._PrivateutilityService.getEditUserStores(this.identity)
          .subscribe(
            (data: Companydetails[]) => {
              this.obj.lstUserStores = data;
              //
            },
            (err: any) => {
              console.log(err);
              //
            }
          );
        //
        this._userService.getUserMasterUploadScreensEdit(this.identity)
          .subscribe(
            (data: Dropdown[]) => {
              this.obj.lstmasterscreens = data;
              this.obj.lstmasterscreens.map(a => a.UserId = this.identity);
              //
            },
            (err: any) => {
              console.log(err);
              //
            }
          );
        //
        this._userService.getUser(this.identity)
          .subscribe(
            (employee: IUser) => {
              //
              this.userForm.patchValue({
                FirstName: employee[0].FirstName,
                LastName: employee[0].LastName,
                Email: employee[0].Email,
                IsActive: employee[0].IsActive,
              });
            },
            (err: any) => {
              console.log(err);
              //
            }
          );
      }
      else {
        //
        this._PrivateutilityService.getComanyDetails()
          .subscribe(
            (data: Companydetails[]) => {
              this.obj.lstUserStores = data;
              //
            },
            (err: any) => {
              console.log(err);
              //
            }
          );
        //
        // this._PrivateutilityService.GetValues('MasterUpload')
        this._userService.getUserMasterUploadScreensEdit(0)
          .subscribe(
            (data: Dropdown[]) => {
              this.obj.lstmasterscreens = data;
              this.uncheckallmasterupload();
              //this.obj.lstmasterscreens.map(a => a.UserId = this.identity);
              //
            },
            (err: any) => {
              console.log(err);
              //
            }
          );
        this.action = true;
        this.panelTitle = "Add New user";
      }
    });


    this.userForm = this.fb.group({
      FirstName: ['', [Validators.required, Validators.pattern("^([a-zA-Z ]+)$")]],
      LastName: ['', [Validators.pattern("^([a-zA-Z ]+)$")]],
      Email: ['', [Validators.required, Validators.email]
        //, this.usernameValidator.CheckUserEmail(this.identity)
      ],
      IsActive: [0,],
    });

  }
  //getFullName

  onchangeEmail() {
    let email = this.userForm.controls['Email'].value;
    //
    this._userService.getFullName(email).subscribe(
      (data) => {
        if (data != null) {
          this.userForm.patchValue({
            FirstName: data.FirstName,
            LastName: data.LastName,
            IsActive: data.IsActive
          });
          this.identity = data.UserId;

          //
          this._PrivateutilityService.getEditUserStores(this.identity)
            .subscribe(
              (data: Companydetails[]) => {
                this.obj.lstUserStores = data;
                //
              },
              (err: any) => {
                console.log(err);
                //
              }
            );

          //
          this._userService.getUserMasterUploadScreensEdit(this.identity)
            .subscribe(
              (data: Dropdown[]) => {
                this.obj.lstmasterscreens = data;
                this.obj.lstmasterscreens.map(a => a.UserId = this.identity);
                //
              },
              (err: any) => {
                console.log(err);
                //
              }
            );

          this.userForm.get('FirstName').disable();
          this.userForm.get('LastName').disable();
          this.UserTypeErrorMessage = 'This email already registered.';
        }
        //
      },
      (error: any) => {
        //
        console.log(error);
      }
    );

  }

  storeFieldsChange(values: any) {
    this.obj.lstUserStores.filter(a => a.CompanyDetailID == values.currentTarget.id)[0].IsActive
      = values.currentTarget.checked;
  }
  masterscreenFieldsChange(values: any) {
    this.obj.lstmasterscreens.filter(a => a.DropdownValue == values.currentTarget.id)[0].IsActive = values.currentTarget.checked;
  }
  checkallstore() {
    for (var i = 0; i < this.obj.lstUserStores.length; i++) {
      this.obj.lstUserStores[i].IsActive = true;
      $('#' + this.obj.lstUserStores[i].CompanyDetailID).prop("checked", true);
    }
  }
  uncheckallstore() {
    for (var i = 0; i < this.obj.lstUserStores.length; i++) {
      this.obj.lstUserStores[i].IsActive = false;
      $('#' + this.obj.lstUserStores[i].CompanyDetailID).prop("checked", false);
    }
  }

  checkallmasterupload() {

    for (var i = 0; i < this.obj.lstmasterscreens.length; i++) {
      this.obj.lstmasterscreens[i].IsActive = true;
      $('#' + this.obj.lstmasterscreens[i].DropdownValue).prop("checked", true);
    }
  }
  uncheckallmasterupload() {
    for (var i = 0; i < this.obj.lstmasterscreens.length; i++) {
      this.obj.lstmasterscreens[i].IsActive = false;
      $('#' + this.obj.lstmasterscreens[i].DropdownValue).prop("checked", false);
    }
  }

  SaveData(): void {

    if (this._authorizationGuard.CheckAcess("Userlist", "ViewEdit")) {
      return;
    }
    // stop here if form is invalid
    if (this.userForm.invalid) {
      return;
    }
    if (this.obj.lstUserStores.filter(a => a.IsActive == true).length == 0) {
      this.alertService.error('Select atleast one store name.!');
      return;
    }
    this.obj.FirstName = this.userForm.controls['FirstName'].value;
    this.obj.LastName = this.userForm.controls['LastName'].value;
    this.obj.Email = this.userForm.controls['Email'].value;
    this.obj.IsActive = this.userForm.controls['IsActive'].value;
    if (this.identity > 0) {
      this.obj.UserId = this.identity;
      this.obj.lstUserStores = this.obj.lstUserStores;
      this.obj.lstmasterscreens = this.obj.lstmasterscreens;

      //
      this._userService.update(this.obj).subscribe(
        (data) => {
          if (data != null && data.Flag == true) {
            //
            this.alertService.success(data.Msg);
            this._router.navigate(['/Userlist']);
          }
          else {
            //
            this.alertService.error(data.Msg);
            this._router.navigate(['/Userlist']);
          }
          this.identity = 0;
        },
        (error: any) => {
          //
          console.log(error);
        }
      );

    }
    else {
      this.obj.lstUserStores = this.obj.lstUserStores.filter(a => a.IsActive == true);
      this.obj.lstmasterscreens = this.obj.lstmasterscreens.filter(a => a.IsActive == true);

      //
      this._userService.add(this.obj).subscribe(
        (data) => {
          if (data != null && data.Flag == true) {
            //
            this.alertService.success(data.Msg);
            this._router.navigate(['/Userlist']);
          }
          else {
            //
            this.alertService.error(data.Msg);
            this._router.navigate(['/Userlist']);
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

}
