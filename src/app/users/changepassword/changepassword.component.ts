import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService, } from '../../_services/service/user.service';
import { ToastrService } from 'ngx-toastr';
import { IChangepassword } from '../../_services/model/index';
@Component({
    selector: 'app-changepassword',
    templateUrl: './changepassword.component.html',
    styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit {
    changePasswordForm: FormGroup;
    chgpwd: IChangepassword = {} as any;
    constructor(
        private router: Router,
        private fb: FormBuilder,
        public _userService: UserService,
        public _alertService: ToastrService,
        public _spinner: NgxSpinnerService
    ) { }

    formErrors = {
        'oldpwd': '',
        'newpwd': '',
        'confmpwd': '',
    };
    validationMessages = {
        'oldpwd': {
            'required': 'Old password is required.',
            'minlength': 'OldPassword must be greater than 6 characters.',
        },
        'newpwd': {
            'required': 'New Password is required.',
            'minlength': 'New Password must be greater than 6 characters.',
        },
        'confmpwd': {
            'required': 'Confirm Password is required.',
            'minlength': 'Confirm Password must be greater than 6 characters.',
        },
        'oldandnewpasswordGroup': {
            'oldandnewpassworerror': 'New and Confirm password must be same.'
        },
        'newandconfirmpasswordGroup': {
            'newandconfirmpassworderror': 'Old and New password must be different.'
        },
    };

    logValidationErrors(group: FormGroup = this.changePasswordForm): void {
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
        this.changePasswordForm = this.fb.group({
            oldpwd: ['', [Validators.required, Validators.minLength(6)]],
            newpwd: ['', [Validators.required, Validators.minLength(6)]],
            confmpwd: ['', [Validators.required, Validators.minLength(6)]]
        }
        );
    }


    ChangePassword(): void {
        this.logValidationErrors(this.changePasswordForm);
        // stop here if form is invalid
        if (this.changePasswordForm.invalid) {
            return;
        }
        this.chgpwd.OldPassword = this.changePasswordForm.controls['oldpwd'].value;
        this.chgpwd.NewPassword = this.changePasswordForm.controls['newpwd'].value;
        this.chgpwd.ConfirmPassword = this.changePasswordForm.controls['confmpwd'].value;
        if (this.chgpwd.OldPassword == this.chgpwd.NewPassword) {
            this._alertService.error('Old and New password must be different.!');
            return;
        }
        else if (this.chgpwd.NewPassword != this.chgpwd.ConfirmPassword) {
            this._alertService.error('New and Confirm password must be same.! ');
            return;
        }
        this._spinner.show();
        this._userService.changePassword(this.chgpwd).subscribe(
            (data) => {
                this._spinner.hide();
                if (data != null && data == true) {
                    this._alertService.success('Password changed successful, You can use new password in application now.!');
                    this.router.navigate(['/Dashboard1']);
                }
                else {
                    this._alertService.error('Invalid Password.!');
                    this.router.navigate(['/Dashboard1']);
                }

            },
            (error: any) => {
                this._spinner.hide();
                this.Reset();
                this._alertService.error('Invalid Password.!');
            }
        );
    }
    Reset() {
        // Resets to blank object
        this.changePasswordForm.reset();

        // Resets to provided model
        this.changePasswordForm.reset({ OldPassword: '', NewPassword: '', ConfirmPassword: '', });
    }
    checkoldandnewpassword(group: AbstractControl): { [key: string]: any } | null {
        const oldpwd = group.get('oldpwd');
        const newpwd = group.get('newpwd');

        if (oldpwd.value !== newpwd.value || newpwd.pristine) {
            return null;
        } else {
            return { 'oldandnewpasswordGroup': true };
        }
    }
}


