import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Apisettings, MasterUpload, Dropdown } from '../../_services/model';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from '../../_services/service/user.service';
import { MasteruploadService } from '../../_services/service/masterupload.service';
import { AuthorizationGuard } from '../../_guards/Authorizationguard';
import { saveAs } from 'file-saver';
import * as $ from 'jquery'
@Component({
  selector: 'app-masterupload',
  templateUrl: './masterupload.component.html',
  styleUrls: ['./masterupload.component.css']
})
export class MasteruploadComponent implements OnInit {
  lstmasterscreens: Dropdown[];
  MasterUploadForm: FormGroup;
  uploaddata: MasterUpload = {} as any;
  selectedFile: File;
  kycFiles_Ext = Apisettings.KYCFiles_Ext;
  kycFiles_Fileszie = Apisettings.KYCFiles_Fileszie;
  $: any;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    public _masteruploadService: MasteruploadService,
    public _alertService: ToastrService,
    public _spinner: NgxSpinnerService,
    private _UserService: UserService,
    private _authorizationGuard: AuthorizationGuard
  ) {
  }

  formErrors = {
    'FileType': '',
    'FileData': '',
    'Remarks': '',
  };

  validationMessages = {
    'FileType': {
      'required': 'This Field is required.',
    },
    'Remarks': {
      'required': 'This Field is required.',
      'minlength': 'This Field must be greater than 3 characters.',
      'maxlength': 'This Field must be less than 500 characters.'
    },
    'FileData': {
      'required': 'This Field is required.',
    },
  };

  logValidationErrors(group: FormGroup = this.MasterUploadForm): void {
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
    this._spinner.show();
    this._UserService.getUserMasterUploadScreens()
      .subscribe(
        (data: Dropdown[]) => {
          this.lstmasterscreens = data;
          this._spinner.hide();
        },
        (err: any) => {
          this._spinner.hide();
          console.log(err)
        }
      );

    this.MasterUploadForm = this.fb.group({
      FileType: ['', [Validators.required]],
      Remarks: ['', [Validators.required,]],
      FileData: ['', [Validators.required]],
    });
  }
  onLoad() {
  }
  onFileChanged(e: any) {
    this.selectedFile = e.target.files[0];
  }

  onDownloadTemplate() {

    let filetype = this.MasterUploadForm.controls['FileType'].value;
    if (filetype != "") {
      this._spinner.show();
      this._masteruploadService.getFileTemplate(filetype)
        .subscribe(data => {
          this._spinner.hide(),
            saveAs(data, filetype + '.xlsx')
        },
          (err) => {
            this._spinner.hide();
            console.log(err);
          }
        );
    } else {
      this._alertService.error("Please select file type.!");
    }
  }

  uploadFiles() {
    if (this._authorizationGuard.CheckAcess("MasterUploadList", "ViewEdit")) {
      return;
    }
    if (this.MasterUploadForm.invalid) {
      return;
    }
    var filesizeMB = Math.round(this.selectedFile.size / 1024 / 1024);
    var fileexte = this.selectedFile.name.split('.').pop();
    var allowedmb = parseInt(Apisettings.KYCFiles_Fileszie.toString())
    if (!this.isInArray(Apisettings.KYCFiles_Ext, fileexte)) {
      this._alertService.error("File must be extension with " + Apisettings.KYCFiles_Ext);
      return;
    }
    else if (filesizeMB > allowedmb) {
      this._alertService.error("File size must be less than or equal to " + Apisettings.KYCFiles_Fileszie + " MB");
      return;
    }
    this.uploaddata.FileType = this.MasterUploadForm.controls['FileType'].value;
    this.uploaddata.Remarks = this.MasterUploadForm.controls['Remarks'].value;
    this._spinner.show();
    this._masteruploadService.save(this.selectedFile, this.uploaddata.Remarks, this.uploaddata.FileType).subscribe(
      (data) => {
        if (data.Flag) {
          this._alertService.success(data.Msg);
          this.router.navigate(['/MasterUploadList']);
        }
        else {
          this._alertService.error(data.Msg);
          this.router.navigate(['/MasterUploadList']);
        }
        this._spinner.hide();
      },
      (error: any) => {
        this._spinner.hide();
      }
    );

  }

  isInArray(array, word) {
    return array.indexOf(word.toLowerCase()) > -1;
  }

}
