import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { saveAs } from 'file-saver';
//services  
import { GstfinancefileuploadService } from '../../_services/service/gstfinancefileupload.service';
import { AuthorizationGuard } from '../../_guards/Authorizationguard';
import { PrivateutilityService } from 'src/app/_services/service/privateutility.service';
//models
import { Dropdown, Gstfinancefileupload, Apisettings } from '../../_services/model';

@Component({
  selector: 'app-gst',
  templateUrl: './gst.component.html',
  styleUrls: ['./gst.component.css']
})
export class GstComponent implements OnInit {
  lstgstupload: Dropdown[];
  lstGSTYears: Dropdown[];
  lstMonths: Dropdown[];
  GstUploadForm: FormGroup;
  uploaddata: Gstfinancefileupload = {} as any;
  selectedFile: File;
  kycFiles_Ext = Apisettings.KYCFiles_Ext;
  kycFiles_Fileszie = Apisettings.KYCFiles_Fileszie;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    public _gstfinancefileuploadService: GstfinancefileuploadService,
    public _alertService: ToastrService,
    private _PrivateutilityService: PrivateutilityService,
    private _authorizationGuard: AuthorizationGuard
  ) { }

  formErrors = {
    'FileType': '',
    'Year': '',
    'Month': '',
    'File': '',
    'Remarks': '',
  };

  validationMessages = {
    'FileType': {
      'required': 'This Field is required.',
    },
    'Year': {
      'required': 'This Field is required.',
    },
    'Month': {
      'required': 'This Field is required.',
    },
    'File': {
      'required': 'Please choose the file.',
    },
    'Remarks': {
      'required': 'This Field is required.',
      'minlength': 'This Field must be greater than 3 characters.',
      'maxlength': 'This Field must be less than 500 characters.'
    },

  };

  logValidationErrors(group: FormGroup = this.GstUploadForm): void {
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

    this._PrivateutilityService.GetValues('FinanceFileTypes')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstgstupload = data;
          //
        },
        (err: any) => {
          //
          console.log(err);
        }
      );

    this._PrivateutilityService.GetValues('GSTYears')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstGSTYears = data;
          //
        },
        (err: any) => {
          //
          console.log(err);
        }
      );

    this._PrivateutilityService.GetValues('Months')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstMonths = data;
          //
        },
        (err: any) => {
          //
          console.log(err);
        }
      );

    this.GstUploadForm = this.fb.group({
      FileType: ['', [Validators.required]],
      Year: ['', [Validators.required]],
      Month: ['', [Validators.required]],
      Remarks: ['', [Validators.required,]],
      File: ['', [Validators.required]],
    });
  }

  onLoad() {
  }

  onFileChanged(e: any) {
    this.selectedFile = e.target.files[0];
  }

  onDownloadTemplate() {
    let filetype = this.GstUploadForm.controls['FileType'].value;
    if (filetype != "") {
      //
      this._gstfinancefileuploadService.getFileTemplate(filetype)
        .subscribe(data => {
          this._alertService.success('File Donloaded successfully');
          saveAs(data, filetype + '.xlsx')
        },
          (err) => {
            //
            console.log(err);
          }
        );
    } else {
      this._alertService.error("Please select file type.!");
    }
  }

  uploadFiles() {
    if (this._authorizationGuard.CheckAcess("Gstlist", "ViewEdit")) {
      return;
    }
    if (this.GstUploadForm.invalid) {
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
    //

    var Year = this.GstUploadForm.controls['Year'].value;//.startDate._d.getFullYear();
    var Month = this.GstUploadForm.controls['Month'].value//.startDate._d.getMonth();

    let ActionName= "LO";
    this._gstfinancefileuploadService.FinanceApproverCheck(ActionName)
      .subscribe(
        (CheckAcess) => {
          if (CheckAcess != "LO") {
            this._alertService.error("You dont have access to use this page,Please contact administrator.!");
            return;
          }
          this._gstfinancefileuploadService.Existence(this.uploaddata.FileID, this.GstUploadForm.controls['FileType'].value,
            parseInt(Year), parseInt(Month))
            .subscribe(
              (data) => {
                if (data == true) {
                  this._alertService.error('This record already exists');
                }
                else {
                  //
                  this._gstfinancefileuploadService.Save(this.selectedFile,
                    this.GstUploadForm.controls['Remarks'].value,
                    0,
                    this.GstUploadForm.controls['FileType'].value,
                    "I",
                    parseInt(Month),
                    "PENDING L1 APPROVAL",
                    parseInt(Year)).subscribe(
                      (data) => {
                        if (data.Flag) {
                          this._alertService.success(data.Msg);
                          this.router.navigate(['/Gstlist']);
                        }
                        else {
                          this._alertService.error(data.Msg);
                          this.router.navigate(['/Gstlist']);
                        }
                        //
                      },
                      (error: any) => {
                        //
                      }
                    );
                }
                //
              },
              (error: any) => {
                //
              }
            );
        },
        (error: any) => {
          //
        }
      );
  }

  isInArray(array, word) {
    return array.indexOf(word.toLowerCase()) > -1;
  }


}
