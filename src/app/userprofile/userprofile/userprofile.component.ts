import { Component, OnInit } from '@angular/core';

import { UserService } from '../../_services/service/user.service';
import { ToastrService } from 'ngx-toastr';

import { FormGroup, FormBuilder, Validators, } from '@angular/forms';
import { IUser, Apisettings } from '../../_services/model';
import { AuthenticationService } from 'src/app/_services/service/authentication.service'; 
import { environment } from 'src/environments/environment';
import { EncrDecrService } from 'src/app/_services/service/encr-decr.service';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {


  //#region variable declaration 
  profileForm: FormGroup;
  obj: IUser = {} as any;
  selectedFile: File;
  ImagePath: string;
  ImagePathChange: boolean = false;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private alertService: ToastrService, 
    public _authenticationService: AuthenticationService,
    private EncrDecr: EncrDecrService,
  ) { }

  //#endregion


  formErrors = {
    'FirstName': '', 
  }

  validationMessages = {
    'FirstName': {
      'required': 'This field is required'
    }
  }

  logValidationErrors(group: FormGroup = this.profileForm): void {
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

    let currentUser = this._authenticationService.currentUserValue;
    this.profileForm = this.fb.group({
      FirstName: [currentUser.FirstName, [Validators.required]],
      LastName: [currentUser.LastName],
      IsMailRequired: [currentUser.IsMailRequired],
      FileData: [''],
    });
    this.obj = currentUser;
    let itempath = this.obj.ImagePath == null || this.obj.ImagePath == '' ?
      environment.defaultImageUrl : this.obj.ImagePath;
    this.ImagePath = environment.basedomain + itempath;
  }

  ProfileUpdate() {

    if (this.profileForm.invalid) {
      return;
    } 
    if (this.profileForm.pristine) {
      this.alertService.error('Please change the value for any one control to proceed further!');
      return;
    }
    this.obj.FirstName = this.profileForm.controls['FirstName'].value;
    this.obj.LastName = this.profileForm.controls['LastName'].value;
    this.obj.IsMailRequired = this.profileForm.controls['IsMailRequired'].value;  
    //
    this.userService.profileUpdate(this.obj).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.alertService.success(data.Msg.split('|')[0]);
          //
          let itempath = data.Msg.split('|')[1];
          this.ImagePath = environment.basedomain + itempath;
          this.obj.ImagePath = itempath;
          var encrypted = this.EncrDecr.set('Radha@123!()', JSON.stringify(this.obj));
          localStorage.setItem('currentJennifer1', encrypted);
          this.ImagePathChange = false;
        }
        else {
          this.alertService.error(data.Msg);
          //
        }
      },
      (err: any) => {
        //
        console.log(err);
      }
    );
  }

  isInArray(array, word) {
    return array.indexOf(word.toLowerCase()) > -1;
  }

  onchangeImagePathChange(event: any) {
    if (event.target.checked) {
      this.ImagePathChange = true;
    } else {
      this.ImagePathChange = false;
    }
  }

  onFileChanged(e: any) {
    this.selectedFile = e.target.files[0];
    var filesizeMB = Math.round(this.selectedFile.size / 1024 / 1024);
    var fileexte = this.selectedFile.name.split('.').pop();
    var allowedmb = parseInt(Apisettings.IMGFiles_Fileszie.toString())
    if (!this.isInArray(Apisettings.IMGFiles_Ext, fileexte)) {
      this.alertService.error("File must be extension with " + Apisettings.IMGFiles_Ext);
      return;
    }
    else if (filesizeMB > allowedmb) {
      this.alertService.error("File size must be less than or equal to " + Apisettings.IMGFiles_Fileszie + " MB.!");
      return;
    } else {
      //
      this.obj.ImagePathData = this.selectedFile;
      this.obj.FirstName = this.profileForm.controls['FirstName'].value;
      this.obj.LastName = this.profileForm.controls['LastName'].value;
      this.obj.IsMailRequired = this.profileForm.controls['IsMailRequired'].value;
      this.userService.updateImage(this.obj).subscribe(
        (data) => {
          if (data != null && data.Flag == true) {
            this.alertService.success('Your profile image updated');
            //
            let itempath = data.Msg.split('|')[1];
            this.ImagePath = environment.basedomain + itempath;
            this.obj.ImagePath = itempath; 
            var encrypted = this.EncrDecr.set('Radha@123!()', JSON.stringify(this.obj));
            localStorage.setItem('currentJennifer1', encrypted);
            this.ImagePathChange = false;
          }
          else {
            this.alertService.error(data.Msg);
            //
          }
        },
        (err: any) => {
          //
          console.log(err);
        }
      );
    }
  }

}
