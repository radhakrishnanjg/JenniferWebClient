import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; 
import { UserService } from '../../_services/service/user.service';
import { ToastrService } from 'ngx-toastr'; 
import { IUser  } from '../../_services/model';
import { AuthorizationGuard } from 'src/app/_guards/Authorizationguard';
import { CrossborderuserService } from 'src/app/_services/service/crossborder/crossborderuser.service';

@Component({
  selector: 'app-crossborderuser',
  templateUrl: './crossborderuser.component.html',
  styleUrls: ['./crossborderuser.component.css']
})
export class CrossborderuserComponent implements OnInit {
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
    private _authorizationGuard: AuthorizationGuard, 
    private _crossborderuserService: CrossborderuserService,
    
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
        this._crossborderuserService.searchById(this.identity)
          .subscribe(
            (employee: IUser) => { 
              this.userForm.patchValue({
                FirstName: employee.FirstName,
                LastName: employee.LastName,
                Email: employee.Email,
                IsActive: employee.IsActive,
              });
            },
            (err: any) => {
              console.log(err); 
            }
          );
      }
      else { 
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

  onchangeEmail() {
    let email = this.userForm.controls['Email'].value; 
    this._userService.getFullName(email).subscribe(
      (data) => {
        if (data != null) {
          this.userForm.patchValue({
            FirstName: data.FirstName,
            LastName: data.LastName,
            IsActive: data.IsActive
          });
          debugger
          this.identity = data.UserId;
           
          this.userForm.get('FirstName').disable();
          this.userForm.get('LastName').disable();
          this.UserTypeErrorMessage = 'This email already registered.';
        } 
        else {
          this.identity = 0;
        }
      },
      (error: any) => { 
        console.log(error);
      }
    ); 
  } 

  SaveData(): void { 
    // if (this._authorizationGuard.CheckAcess("/CrossBorderCrossborderuserlist", "ViewEdit")) {
    //   return;
    // }
    // stop here if form is invalid
    if (this.userForm.invalid) {
      return;
    }
    
    this.obj.FirstName = this.userForm.controls['FirstName'].value;
    this.obj.LastName = this.userForm.controls['LastName'].value;
    this.obj.Email = this.userForm.controls['Email'].value;
    this.obj.IsActive = this.userForm.controls['IsActive'].value;
    if (this.identity > 0) {
      this.obj.UserId = this.identity;
      
      this._crossborderuserService.update(this.obj).subscribe(
        (data) => {
          if (data != null && data.Flag == true) { 
            this.alertService.success(data.Msg);
            this._router.navigate(['/CrossBorder/Crossborderuserlist']);
          }
          else { 
            this.alertService.error(data.Msg);
            this._router.navigate(['/CrossBorder/Crossborderuserlist']);
          }
          this.identity = 0;
        },
        (error: any) => { 
          console.log(error);
        }
      );

    }
    else { 
      this._crossborderuserService.insert(this.obj).subscribe(
        (data) => {
          if (data != null && data.Flag == true) { 
            this.alertService.success(data.Msg);
            this._router.navigate(['/CrossBorder/Crossborderuserlist']);
          }
          else { 
            this.alertService.error(data.Msg);
            this._router.navigate(['/CrossBorder/Crossborderuserlist']);
          }
          this.identity = 0;
        },
        (error: any) => { 
          console.log(error);
        }
      );
    }
  }
}
