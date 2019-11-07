import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators, } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { Dropdown, Apisettings } from '../../_services/model';
import { Goodsdispute } from '../../_services/model';
import { GoodsDisputeService } from '../../_services/service/goods-dispute.service';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { UsernameValidator } from '../../_validators/username';

@Component({
  selector: 'app-goods-dispute',
  templateUrl: './goods-dispute.component.html',
  styleUrls: ['./goods-dispute.component.css']
})
export class GoodsDisputeComponent implements OnInit {

  Goodsdisputeform: FormGroup;
  lst: Goodsdispute[];
  obj: Goodsdispute = new Goodsdispute();
  lstDisputeType: Dropdown[] = [];
  InventoryType: string = '';
  ItemName: string = '';
  GRNNumber: string = '';
  GRNInwardID: number = 0;
  panelTitle: string = "Goods Disputes";
  action: boolean;
  identity: number = 0;
  selectedFile1: File;
  selectedFile2: File;
  selectedFile3: File;
  selectedFile4: File;
  selectedFile5: File;
  selectedFile6: File;
  selectedFile7: File;
  selectedFile8: File;
  selectedFile9: File;
  selectedFile10: File;

  constructor(
    private fb: FormBuilder,
    
    private _goodsDisputeService: GoodsDisputeService,
    private _privateutilityServiceService: PrivateutilityService,
    private alertService: ToastrService,
    private _router: Router,
    private _authorizationGuard: AuthorizationGuard,
    private usernameValidator: UsernameValidator,
  ) { }

  formErrors = {
    'JenniferItemSerial': '',
    'DisputeType': '',
    'OtherItemID': '',
    'VideoLink': '',
    'Remarks': '',
    'FileData1': '',
    'FileData2': '',
    'FileData3': '',
    'FileData4': ''
  }
  validationMessages = {
    'JenniferItemSerial': {
      'required': 'This Field is required', 
      'JenniferSerialNumberInUse': 'Jennifer Serial Number is invalid or used',
    },
    'DisputeType': {
      'min': 'This Field is required',
    },
    'OtherItemID': {
      'required': 'This Field is required',
    },
    'VideoLink': {
      'required': 'This Field is required.'
    },
    'Remarks': {
      'maxlength': 'This Field must be less than or equal to 250 charecters.'
    },
    'FileData1': {
      'required': 'This Field is required',
    },
    'FileData2': {
      'required': 'This Field is required',
    },
    'FileData3': {
      'required': 'This Field is required.'
    },
    'FileData4': {
      'required': 'This Field is required.'
    }
  }

  logValidationErrors(group: FormGroup = this.Goodsdisputeform): void {
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
    this.getDisputeType();
    this.identity=0;
    this.Goodsdisputeform = this.fb.group({
      JenniferItemSerial: ['', [Validators.required],
      this.usernameValidator.existJenniferSerialNumberinDispute(this.identity),],
      DisputeType: [0, [Validators.min(1)]],
      OtherItemID: ['',],
      VideoLink: ['', [Validators.required]],
      Remarks: ['', [Validators.maxLength(250),]],
      FileData1: ['', [Validators.required]],
      FileData2: ['', [Validators.required]],
      FileData3: ['', [Validators.required]],
      FileData4: ['', [Validators.required]],
      FileData5: ['',],
      FileData6: ['',],
      FileData7: ['',],
      FileData8: ['',],
      FileData9: ['',],
      FileData10: ['',]
    });
  }

  public getDisputeType(): void {
    //
    this._privateutilityServiceService.GetValues('DisputeType').subscribe(
      (res) => {
        this.lstDisputeType = res;
        //
        console.log(this.lstDisputeType)
      }, (err) => {
        //
        console.log(err);
      });
  }

  public getGoodsInwardDisplay(): void {
    let JenniferItemSerial = this.Goodsdisputeform.controls['JenniferItemSerial'].value;
    if (JenniferItemSerial != null && JenniferItemSerial != '') {
      //
      this._privateutilityServiceService.GetGoodsInwardDisplay(JenniferItemSerial).subscribe(
        (data) => {
          if (data != null) {
            this.GRNInwardID = data.GRNInwardID;
            this.ItemName = data.ItemName;
            this.GRNNumber = data.GRNNumber;
            this.InventoryType = data.InventoryType;
          }
          else {
            this.GRNInwardID = 0;
            this.ItemName = '';
            this.GRNNumber = '';
            this.InventoryType = '';
          }
          //
        },
        (err) => {
          //
          console.log(err);
        }
      );
    }
  }

  onFileChanged1(e: any) { 
    this.selectedFile1 = e.target.files[0];
  }

  onFileChanged2(e: any) { 
    this.selectedFile2 = e.target.files[0];
  }

  onFileChanged3(e: any) {
     
    this.selectedFile3 = e.target.files[0];
  }

  onFileChanged4(e: any) { 
    this.selectedFile4 = e.target.files[0];
  }

  onFileChanged5(e: any) {
    this.selectedFile5 = e.target.files[0];
  }

  onFileChanged6(e: any) {
    this.selectedFile6 = e.target.files[0];
  }

  onFileChanged7(e: any) {
    this.selectedFile7 = e.target.files[0];
  }

  onFileChanged8(e: any) {
    this.selectedFile8 = e.target.files[0];
  }

  onFileChanged9(e: any) {
    this.selectedFile9 = e.target.files[0];
  }

  onFileChanged10(e: any) {
    this.selectedFile10 = e.target.files[0];
  }

  public SaveData(): void {
    if (this.Goodsdisputeform.invalid) {
      return;
    }
    if (this._authorizationGuard.CheckAcess("Goodsdisputelist", "ViewEdit")) {
      return;
    } 
    if (this.GRNInwardID == 0) {
      this.alertService.error("Please enter valid Jennifer Item Serial Number.!");
      return;
    }
    if (this.Goodsdisputeform.controls["DisputeType"].value == 'DifferentMobileReceived' &&
      this.Goodsdisputeform.controls["OtherItemID"].value == "") {
      this.alertService.error("Please enter Other Item Code.!");
      return;
    }
    this.obj.GRNInwardID = this.GRNInwardID;
    this.obj.JenniferItemSerial = this.Goodsdisputeform.controls["JenniferItemSerial"].value;
    this.obj.DisputeType = this.Goodsdisputeform.controls["DisputeType"].value;
    this.obj.OtherItemID = this.Goodsdisputeform.controls["OtherItemID"].value;
    this.obj.VideoLink = this.Goodsdisputeform.controls["VideoLink"].value;
    this.obj.Remarks = this.Goodsdisputeform.controls["Remarks"].value;
    this.Insert();

  }

  Insert(): void {

    if (this.selectedFile1 != null) {
      var filesizeMB1 = Math.round(this.selectedFile1.size / 1024 / 1024);
      var fileexte1 = this.selectedFile1.name.split('.').pop();
      if (!this.isInArray(Apisettings.IMGFiles_Ext, fileexte1)) {
        this.alertService.error("File 1 must be extension with " + Apisettings.IMGFiles_Ext);
        return;
      }
      else if (filesizeMB1 > parseInt(Apisettings.IMGFiles_Fileszie.toString().toString())) {
        this.alertService.error("File 1 size must be less than or equal to " + parseInt(Apisettings.IMGFiles_Fileszie.toString()) + " MB.!");
        return;
      }
    }

    if (this.selectedFile2 != null) {
      var filesizeMB2 = Math.round(this.selectedFile2.size / 1024 / 1024);
      var fileexte2 = this.selectedFile2.name.split('.').pop();
      if (!this.isInArray(Apisettings.IMGFiles_Ext, fileexte2)) {
        this.alertService.error("File 2 must be extension with " + Apisettings.IMGFiles_Ext);
        return;
      }
      else if (filesizeMB2 > parseInt(Apisettings.IMGFiles_Fileszie.toString())) {
        this.alertService.error("File 2 size must be less than or equal to " + parseInt(Apisettings.IMGFiles_Fileszie.toString()) + " MB.!");
        return;
      }
    }

    if (this.selectedFile3 != null) {
      var filesizeMB3 = Math.round(this.selectedFile3.size / 1024 / 1024);
      var fileexte3 = this.selectedFile3.name.split('.').pop();
      if (!this.isInArray(Apisettings.IMGFiles_Ext, fileexte3)) {
        this.alertService.error("File 3 must be extension with " + Apisettings.IMGFiles_Ext);
        return;
      }
      else if (filesizeMB3 > parseInt(Apisettings.IMGFiles_Fileszie.toString())) {
        this.alertService.error("File 3 size must be less than or equal to " + parseInt(Apisettings.IMGFiles_Fileszie.toString()) + " MB.!");
        return;
      }
    }

    if (this.selectedFile4 != null) {
      var filesizeMB4 = Math.round(this.selectedFile4.size / 1024 / 1024);
      var fileexte4 = this.selectedFile4.name.split('.').pop();
      if (!this.isInArray(Apisettings.IMGFiles_Ext, fileexte4)) {
        this.alertService.error("File 4 must be extension with " + Apisettings.IMGFiles_Ext);
        return;
      }
      else if (filesizeMB4 > parseInt(Apisettings.IMGFiles_Fileszie.toString())) {
        this.alertService.error("File 4 size must be less than or equal to " + parseInt(Apisettings.IMGFiles_Fileszie.toString()) + " MB.!");
        return;
      }
    }

    if (this.selectedFile5 != null) {
      var filesizeMB5 = Math.round(this.selectedFile5.size / 1024 / 1024);
      var fileexte5 = this.selectedFile5.name.split('.').pop();
      if (!this.isInArray(Apisettings.IMGFiles_Ext, fileexte5)) {
        this.alertService.error("File 5 must be extension with " + Apisettings.IMGFiles_Ext);
        return;
      }
      else if (filesizeMB5 > parseInt(Apisettings.IMGFiles_Fileszie.toString())) {
        this.alertService.error("File 5 size must be less than or equal to " + parseInt(Apisettings.IMGFiles_Fileszie.toString()) + " MB.!");
        return;
      }
    }

    if (this.selectedFile6 != null) {
      var filesizeMB6 = Math.round(this.selectedFile6.size / 1024 / 1024);
      var fileexte6 = this.selectedFile6.name.split('.').pop();
      if (!this.isInArray(Apisettings.IMGFiles_Ext, fileexte6)) {
        this.alertService.error("File 6 must be extension with " + Apisettings.IMGFiles_Ext);
        return;
      }
      else if (filesizeMB6 > parseInt(Apisettings.IMGFiles_Fileszie.toString())) {
        this.alertService.error("File 6 size must be less than or equal to " + parseInt(Apisettings.IMGFiles_Fileszie.toString()) + " MB.!");
        return;
      }
    }

    if (this.selectedFile7 != null) {
      var filesizeMB7 = Math.round(this.selectedFile7.size / 1024 / 1024);
      var fileexte7 = this.selectedFile7.name.split('.').pop();
      if (!this.isInArray(Apisettings.IMGFiles_Ext, fileexte7)) {
        this.alertService.error("File 7 must be extension with " + Apisettings.IMGFiles_Ext);
        return;
      }
      else if (filesizeMB7 > parseInt(Apisettings.IMGFiles_Fileszie.toString())) {
        this.alertService.error("File 7 size must be less than or equal to " + parseInt(Apisettings.IMGFiles_Fileszie.toString()) + " MB.!");
        return;
      }
    }

    if (this.selectedFile8 != null) {
      var filesizeMB8 = Math.round(this.selectedFile8.size / 1024 / 1024);
      var fileexte8 = this.selectedFile8.name.split('.').pop();
      if (!this.isInArray(Apisettings.IMGFiles_Ext, fileexte8)) {
        this.alertService.error("File 8 must be extension with " + Apisettings.IMGFiles_Ext);
        return;
      }
      else if (filesizeMB8 > parseInt(Apisettings.IMGFiles_Fileszie.toString())) {
        this.alertService.error("File 8 size must be less than or equal to " + parseInt(Apisettings.IMGFiles_Fileszie.toString()) + " MB.!");
        return;
      }
    }

    if (this.selectedFile9 != null) {
      var filesizeMB9 = Math.round(this.selectedFile9.size / 1024 / 1024);
      var fileexte9 = this.selectedFile9.name.split('.').pop();
      if (!this.isInArray(Apisettings.IMGFiles_Ext, fileexte9)) {
        this.alertService.error("File 9 must be extension with " + Apisettings.IMGFiles_Ext);
        return;
      }
      else if (filesizeMB9 > parseInt(Apisettings.IMGFiles_Fileszie.toString())) {
        this.alertService.error("File 9 size must be less than or equal to " + parseInt(Apisettings.IMGFiles_Fileszie.toString()) + " MB.!");
        return;
      }
    }

    if (this.selectedFile10 != null) {
      var filesizeMB10 = Math.round(this.selectedFile10.size / 1024 / 1024);
      var fileexte10 = this.selectedFile10.name.split('.').pop();
      if (!this.isInArray(Apisettings.IMGFiles_Ext, fileexte10)) {
        this.alertService.error("File 10 must be extension with " + Apisettings.IMGFiles_Ext);
        return;
      }
      else if (filesizeMB10 > parseInt(Apisettings.IMGFiles_Fileszie.toString())) {
        this.alertService.error("File 10 size must be less than or equal to " + parseInt(Apisettings.IMGFiles_Fileszie.toString()) + " MB.!");
        return;
      }
    }

    //
    this._goodsDisputeService.Insert(this.obj.GRNInwardID, this.obj.JenniferItemSerial,
      this.obj.DisputeType, this.obj.OtherItemID, this.obj.Remarks, this.obj.VideoLink,
      this.selectedFile1, this.selectedFile2, this.selectedFile3, this.selectedFile4,
      this.selectedFile5, this.selectedFile6, this.selectedFile7, this.selectedFile8,
      this.selectedFile9, this.selectedFile10).subscribe(
        (data) => {
          if (data!=null && data == true) {
            //
            this.alertService.success('Goods dispute data has been added successful');
            this._router.navigate(['/Goodsdisputelist']);
          }
          else {
            //
            this.alertService.error('Goods dispute creation failed!');
            this._router.navigate(['/Goodsdisputelist']);
          }
          this.identity = 0;
        },
        (error: any) => {
          //
          console.log(error);
        }
      )
  }

  isInArray(array, word) {
    return array.indexOf(word.toLowerCase()) > -1;
  }
}
