import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { DownloadDetail, DownloadMaster, Dropdown } from '../../_services/model';
import { DownloadService } from '../../_services/service/download.service';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { UtilityService } from '../../_services/service/utility.service';
import { AuthenticationService } from 'src/app/_services/service/authentication.service';

@Component({
  selector: 'app-reportmaster',
  templateUrl: './reportmaster.component.html',
  styleUrls: ['./reportmaster.component.css']
})
export class ReportmasterComponent implements OnInit {
  reportmasterform: FormGroup;
  reportdetailform: FormGroup;
  lstText_Type: Dropdown[];
  lstReport_Type: Dropdown[];
  objDownloadMaster: DownloadMaster = {} as any;
  lstDownloadDetail: DownloadDetail[] = [] as any;
  objDownloadDetail: DownloadDetail = {} as any;  
  panelTitle: string;
  action: boolean;
  identity: number = 0;
  Searchaction: boolean = true;
  constructor(
    private _router: Router,
    private _downloadService: DownloadService,
    private alertService: ToastrService,
    private fb: FormBuilder,
    private aroute: ActivatedRoute,
    public _spinner: NgxSpinnerService,
    private _PrivateutilityService: PrivateutilityService,
    private _authorizationGuard: AuthorizationGuard, 
  ) { }

  formErrors = {
    'Report_Type': '',
    'Screen_Name': '',
    'SP_Name': '',
    'P_Count': ''
  }

  formErrors1 = {
    'Text_Type': '',
    'Display_Name': '',
    'P_Name': ''
  }




  validationMessages = {
    'Report_Type': {
      'min': 'This field is required'
    },
    'Screen_Name': {
      'required': 'This field is required',
      'pattern': 'This field must be Alphabets(a-Z)'
    },
    'SP_Name': {
      'required': 'This field is required',
      'pattern' : 'No special characters other than underscore and dot(_/.)'
    },
    'P_Count': {
      'required': 'This field is required',
      'max': 'You can enter 5 parameters only'
    }
  }

  validationMessages1 = {
    'Text_Type': {
      'min': 'This field is required'
    },
    'Display_Name': {
      'required': 'This field is required'
    },
    'P_Name': {
      'required': 'This field is required'
    }
  }

  logValidationErrors(group: FormGroup = this.reportmasterform): void {
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

  logValidationErrors1(group: FormGroup = this.reportdetailform): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl && abstractControl.value && abstractControl.value.length > 0 && !abstractControl.value.replace(/\s/g, '').length) {
        abstractControl.setValue('');
      }
      this.formErrors1[key] = '';
      if (abstractControl && !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty)) {
        const messages = this.validationMessages1[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors1[key] += messages[errorKey] + ' ';
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
    this._PrivateutilityService.GetValues('ReportType').subscribe(
      (data: Dropdown[]) => {
        this.lstReport_Type = data;
        this._spinner.hide();
      },
      (error: any) => {
        this._spinner.hide();
        console.log(error);
      }
    )

    this._spinner.show();
    this._PrivateutilityService.GetValues('InputType').subscribe(
      (data: Dropdown[]) => {
        this.lstText_Type = data;
        this._spinner.hide();
      },
      (error: any) => {
        this._spinner.hide();
        console.log(error);
      }
    )

    this.aroute.paramMap.subscribe(params => { 
      this.identity = +params.get('id');
      if (this.identity > 0) {
        this.panelTitle = "View Report";
        this.action = false;
        this._spinner.show();
        this._downloadService.searchById(this.identity).subscribe(
          (data: DownloadMaster) => {
            this.objDownloadMaster = data; 
            
          },
          (err : any) => {
            this._spinner.hide();
            console.log(err);
          }
        );
      }
      else {
        this.action = true;
        this.panelTitle = "Add New Report";
      }
    }); 

    this.reportmasterform = this.fb.group({
      Report_Type: [0, [Validators.min(1)]],
      Screen_Name: ['', [Validators.required, Validators.pattern("^([a-zA-Z ]+)$")]],
      SP_Name: ['', [Validators.required, Validators.pattern("^([a-zA-Z0-9_.]+)$")]],
      P_Count: ['', [Validators.required, Validators.max(5)]],
    });

    this.reportdetailform = this.fb.group({
      Text_Type: [0, [Validators.min(1)]],
      Display_Name: ['', [Validators.required]],
      P_Name: ['', [Validators.required]],
    });
  }

  onAddButtonClick(): void {

    if (this.reportdetailform.invalid) {
      return;
    }
    this.objDownloadDetail = new DownloadDetail();
    this.objDownloadDetail.Text_Type = this.reportdetailform.controls['Text_Type'].value;
    this.objDownloadDetail.Display_Name = this.reportdetailform.controls['Display_Name'].value;
    this.objDownloadDetail.P_Name = this.reportdetailform.controls['P_Name'].value;
    if (this.lstDownloadDetail.filter(a => a.P_Name == this.objDownloadDetail.P_Name).length == 0) {
      this.lstDownloadDetail.push(this.objDownloadDetail);
      this.reportdetailform.controls['Text_Type'].setValue(0);
      this.reportdetailform.controls['Display_Name'].setValue('');
      this.reportdetailform.controls['P_Name'].setValue('');
    }
    else {
      this.alertService.error('Parameter already exist in the list.!');
      return;
    }
  }

  clearValue(): void {
    this.reportdetailform.controls['Text_Type'].setValue(0);
    this.reportdetailform.controls['Display_Name'].setValue('');
    this.reportdetailform.controls['P_Name'].setValue('');
  }

  removeRow(index): void {
    this.lstDownloadDetail.splice(index, 1);
  }

  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("Reportmasterlist", "ViewEdit")) {
      return;
    } 
    this.Insert();  
  }

  Insert() {
    this.objDownloadMaster.Report_Type  = this.reportmasterform.controls['Report_Type'].value;
    this.objDownloadMaster.Screen_Name  = this.reportmasterform.controls['Screen_Name'].value;
    this.objDownloadMaster.SP_Name  = this.reportmasterform.controls['SP_Name'].value;
    this.objDownloadMaster.P_Count  = this.reportmasterform.controls['P_Count'].value;
    this.objDownloadMaster.lstDetail  = this.lstDownloadDetail;
    this._spinner.show();
    
    if (this.objDownloadMaster.P_Count == this.lstDownloadDetail.length) {
      this._downloadService.add(this.objDownloadMaster).subscribe(
        (data) => {
          if (data && data.Flag) {
            this._spinner.hide();
            this.alertService.success(data.Msg);
            this._router.navigate(['/Reportmasterlist']);
          }
          else {
            this._spinner.hide();
            this.alertService.error(data.Msg);
            this._router.navigate(['/Reportmasterlist']);
          }
          this._spinner.hide(); 
        },
        (error: any) => {
          this._spinner.hide();
          console.log(error);
        }
      );
    }
    else {
      this.alertService.error('Total Parameters is not matching with parameters count, please correct it.!');
    }
    this._spinner.hide();
    
  }

}
