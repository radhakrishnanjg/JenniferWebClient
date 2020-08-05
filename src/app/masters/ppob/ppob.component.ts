import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsernameValidator } from '../../_validators/username';
import { ToastrService } from 'ngx-toastr';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { Country, State, Ppob, Apisettings } from '../../_services/model';
import { PpobService } from '../../_services/service/ppob.service';
import { UtilityService } from '../../_services/service/utility.service';
import { MasteruploadService } from 'src/app/_services/service/masterupload.service';

@Component({
  selector: 'app-ppob',
  templateUrl: './ppob.component.html',
  styleUrls: ['./ppob.component.css']
})
export class PpobComponent implements OnInit {
  PPOBform: FormGroup;
  countries: Country[];
  states: State[];
  lst: Ppob[];
  obj: Ppob = {} as any;
  panelTitle: string;
  action: boolean;
  identity: number = 0;
  emailPattern = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$";
  dtOptions: DataTables.Settings = {};

  constructor(
    private alertService: ToastrService,
    private fb: FormBuilder,
    private _router: Router,
    private aroute: ActivatedRoute,
    private _masteruploadService: MasteruploadService,
    private usernameValidator: UsernameValidator,
    private _ppobService: PpobService,
    private utilityService: UtilityService,
    private _authorizationGuard: AuthorizationGuard,
  ) { }

  formErrors = {

    'CountryID': '',
    'StateID': '',
    'City': '',
    'GSTNumber': '',
    'Address1': '',
    'Address2': '',
    'ContactName': '',

    'ContactNumber': '',
    'Email': '',
    'Pincode': '',

  };

  validationMessages = {

    'StateID': {
      'required': 'This field is required',
      'min': 'This field is required.',
    },

    'GSTNumber': {
      'required': 'This field is required.',
      'pattern': 'This field must be Alphanumeric.',
      'GSTNumberInUse': 'GSTNumber is already registered!',
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

    'City': {
      'required': 'This field is required',
      'pattern': 'This field must be alphabets(a-Z)',
    },

    'ContactName': {
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
    'Pincode': {
      'required': 'This field is required.',
      'pattern': 'This field must be 6 digit numeric(0-9).',
      'minlength': 'This field must be 6 digit numeric(0-9).',
      'maxlength': 'This field must be 6 digit numeric(0-9).',
    },
  };

  logValidationErrors(group: FormGroup = this.PPOBform): void {
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

    this.utilityService.getCountries()
      .subscribe(
        (data: Country[]) => {
          this.countries = data;
        },
        (err: any) => {
          console.log(err);
        }
      );

    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
      if (this.identity > 0) {
        this.panelTitle = "Edit PPOB";
        this.action = false;
        this._ppobService.PPOBSearchById(this.identity)
          .subscribe(
            (data: Ppob) => {
              this.obj = data;
              this.dtOptions = {
                paging: false,
                scrollY: '400px',
                "language": {
                  "search": 'Filter',
                },
              };
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

              var StateID = data.StateID.toString();
              this.PPOBform.patchValue({
                StateID: StateID,
                GSTNumber: data.GSTNumber,
                GSTPortalUserName: data.GSTPortalUserName,
                GSTPortalPassword: data.GSTPortalPassword,
                Address1: data.Address1,
                City: data.City,
                Address2: data.Address2,
                CountryID: data.CountryID,
                ContactName: data.ContactName,
                ContactNumber: data.ContactNumber,
                Email: data.Email,
                Pincode: data.Pincode,
                IsActive: data.IsActive,
              });
              this.ImagePath = data.GSTFilePath;
              this.PPOBform.get('GSTNumber').disable();
              this.PPOBform.get('CountryID').disable();
              this.PPOBform.get('StateID').disable();
            },
            (err: any) => {
              //
              console.log(err);
            }
          );
      }
      else {
        this.action = true;
        this.panelTitle = "Add New PPOB";
      }
    });

    this.PPOBform = this.fb.group({

      CountryID: [0, [Validators.required, Validators.min(1)]],
      StateID: [0, [Validators.required, Validators.min(1)]],
      GSTNumber: ['', [Validators.required, Validators.pattern("^([a-zA-Z0-9]+)$")],],
      GSTPortalUserName: [''],
      GSTPortalPassword: [''],
      Address1: ['', [Validators.required]],
      Address2: ['', [Validators.maxLength(100)]],
      City: ['', [Validators.required, Validators.pattern("^([a-zA-Z ]+)$")]],
      ContactName: ['', [Validators.required, Validators.pattern("^([a-zA-Z ]+)$")]],
      ContactNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(12), Validators.pattern("^([0-9]+)$")]],
      Email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      Pincode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern("^([0-9]+)$")]],
      GSTFilePath: [''],
      ImagePathFlag: [''],

      IsActive: [0,],
    });
  }

  onchangeCountryID(selectedValue: string) {
    let countrid = parseInt(selectedValue);
    if (countrid > 0) {
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

  isInArray(array, word) {
    return array.indexOf(word.toLowerCase()) > -1;
  }

  selectedDegreeFile1: File;
  ImagePath: string = '';
  onFileChangedImagePath(event) {
    this.selectedDegreeFile1 = event.target.files[0]
    if (this.selectedDegreeFile1.name.length > 0) {
      var filesizeMB = Math.round(this.selectedDegreeFile1.size / 1024 / 1024);
      var fileexte = this.selectedDegreeFile1.name.split('.').pop();
      var allowedmb = parseInt(Apisettings.CommonFiles_Fileszie.toString())
      if (!this.isInArray(Apisettings.CommonFiles_Ext, fileexte)) {
        this.alertService.error("File must be extension with " + Apisettings.CommonFiles_Ext);
        return;
      }
      else if (filesizeMB > allowedmb) {
        this.alertService.error("File size must be less than or equal to " + Apisettings.CommonFiles_Fileszie + " MB.!");
        return;
      }
      else {
        let ImagePath: string = '';
        ImagePath = this.PPOBform.controls['GSTFilePath'].value;
        this._masteruploadService.FileSave(this.selectedDegreeFile1, ImagePath).subscribe(
          (data) => {
            if (data != null && data.length > 0) {
              this.ImagePath = data;
            }
            else {
              this.alertService.error("File is not saved.!");
            }
          },
          (error: any) => {
            this.alertService.error("Error!:Image not uploaded.");
          }
        );
      }
    }
  }


  ImagePathFlag: boolean = false;
  onchangeImagePathFlag(event: any) {
    if (event.target.checked) {
      this.ImagePathFlag = true;
    } else {
      this.ImagePathFlag = false;
    }
  }

  DownloadButtonClick(ObjectId: string) {
    if (ObjectId != "") {
      this._masteruploadService.DownloadObjectFile(ObjectId)
        .subscribe(data => {
          this.alertService.success("File downloaded succesfully.!");
          saveAs(data, ObjectId)
        },
          (err) => {
            console.log(err);
          }
        );
    } else {
    }
  }


  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("PPOBlist", "ViewEdit")) {
      return;
    }
    // stop here if form is invalid
    if (this.PPOBform.invalid) {
      return;
    }
    if (this.PPOBform.pristine) {
      this.alertService.error('Please change the value for any one control to proceed further!');
      return;
    }

    if (this.ImagePath == '') {
      this.alertService.error('GST File is required.!');
      return;
    }
    let GSTStateCode = this.states.filter(a => a.StateID == this.PPOBform.controls['StateID'].value)[0].GSTStateCode;
    let State = this.states.filter(a => a.StateID == this.PPOBform.controls['StateID'].value)[0].State;
    if (GSTStateCode != this.PPOBform.controls['GSTNumber'].value.slice(0, 2)) {
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
    this.obj.CountryID = this.PPOBform.controls['CountryID'].value;
    this.obj.StateID = this.PPOBform.controls['StateID'].value;
    this.obj.GSTNumber = this.PPOBform.controls['GSTNumber'].value;
    this.obj.GSTPortalUserName = this.PPOBform.controls['GSTPortalUserName'].value;
    this.obj.GSTPortalPassword = this.PPOBform.controls['GSTPortalPassword'].value;
    this.obj.Address1 = this.PPOBform.controls['Address1'].value;
    this.obj.Address2 = this.PPOBform.controls['Address2'].value;
    this.obj.City = this.PPOBform.controls['City'].value;
    this.obj.ContactName = this.PPOBform.controls['ContactName'].value;
    this.obj.ContactNumber = this.PPOBform.controls['ContactNumber'].value;
    this.obj.Email = this.PPOBform.controls['Email'].value;
    this.obj.Pincode = this.PPOBform.controls['Pincode'].value;

    this.obj.GSTFilePath = this.ImagePath;
    this.obj.IsActive = this.PPOBform.controls['IsActive'].value;

    this._ppobService.PPOBInsert(this.obj).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.alertService.success(data.Msg);
          this._router.navigate(['/PPOBlist']);
        }
        else {
          this.alertService.error(data.Msg);
          this._router.navigate(['/PPOBlist']);
        }
        this.identity = 0;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  Update() {
    this.obj.PPOBID = this.identity;
    this.obj.CountryID = this.PPOBform.controls['CountryID'].value;
    this.obj.StateID = this.PPOBform.controls['StateID'].value;
    this.obj.GSTNumber = this.PPOBform.controls['GSTNumber'].value;
    this.obj.GSTPortalUserName = this.PPOBform.controls['GSTPortalUserName'].value;
    this.obj.GSTPortalPassword = this.PPOBform.controls['GSTPortalPassword'].value;
    this.obj.Address1 = this.PPOBform.controls['Address1'].value;
    this.obj.Address2 = this.PPOBform.controls['Address2'].value;
    this.obj.City = this.PPOBform.controls['City'].value;
    this.obj.ContactName = this.PPOBform.controls['ContactName'].value;
    this.obj.ContactNumber = this.PPOBform.controls['ContactNumber'].value;
    this.obj.Email = this.PPOBform.controls['Email'].value;
    this.obj.Pincode = this.PPOBform.controls['Pincode'].value;

    this.obj.GSTFilePath = this.ImagePath;
    this.obj.IsActive = this.PPOBform.controls['IsActive'].value;

    this._ppobService.PPOBUpdate(this.obj).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.alertService.success(data.Msg);
          this._router.navigate(['/PPOBlist']);
        }
        else {
          this.alertService.error(data.Msg);
          this._router.navigate(['/PPOBlist']);
        }
        this.identity = 0;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

}
