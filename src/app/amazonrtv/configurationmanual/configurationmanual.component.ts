import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AmazonAutoRTVOrder, BulkDownloadTemplate, Customerwarehouse, Dropdown, Location } from '../../_services/model';
import { AmazonautortvService } from '../../_services/service/amazonautortv.service';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { JsonPrivateUtilityService } from 'src/app/_services/service/crossborder/jsonprivateutility.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-configurationmanual',
  templateUrl: './configurationmanual.component.html',
  styleUrls: ['./configurationmanual.component.css']
})
export class ConfigurationmanualComponent implements OnInit {

  Configurationform: FormGroup;
  obj: AmazonAutoRTVOrder = {} as any;
  identity: number = 0;
  Fromlocations: Location[] = [] as any;
  lstInventorytype: Dropdown[];
  lstFrequencytype: Dropdown[];
  panelTitle: string;
  action: boolean;
  FromLocationName: string;
  ToLocationName: string;
  InventoryType: string;
  DropDownDescription: string;


  constructor(
    private alertService: ToastrService,
    private fb: FormBuilder,
    private _router: Router,
    private aroute: ActivatedRoute,
    private _amazonautortvService: AmazonautortvService,
    private _PrivateutilityService: PrivateutilityService,
    private _JsonPrivateUtilityService: JsonPrivateUtilityService,
    private _authorizationGuard: AuthorizationGuard,
  ) { }

  formErrors = {
    'FromLocationID': '',
    'CustomerWareHouseID': '',
    'InventoryType': '',
    'FrequencyType': '',
  };
  validationMessages = {
    'FromLocationID': {
      'min': 'This field is required',

    },
    'CustomerWareHouseID': {
      'min': 'This field is required',

    },
    'InventoryType': {
      'min': 'This field is required',

    },
    'FrequencyType': {
      'min': 'This field is required',
    }
  };

  logValidationErrors(group: FormGroup = this.Configurationform): void {
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

    this.panelTitle = 'Add New RTV Upload';
    this.action = true;
    this.LoadRTVInventoryType();
    this.GetRTVLocations();
    this.GetRTVCustomerWarehouses();

    this.Configurationform = this.fb.group({
      FromLocationID: [0, [Validators.min(1),]],
      CustomerWareHouseID: [0, [Validators.min(1),]],
      InventoryType: [0, [Validators.min(1),]],
      FrequencyType: ['ONETIME',],
      IsActive: [0,],
      RTVType: ['Manual',],
    });
  }


  onDownloadTemplate() {
    let RTVLocationID = this.Configurationform.controls['FromLocationID'].value;
    if (RTVLocationID == null || RTVLocationID == 0) {
      this.alertService.error('Select From Location.!');
      return;
    }
    this._amazonautortvService.BulkDownloadTemplate(RTVLocationID).subscribe(
      (data: BulkDownloadTemplate[]) => {
        if (data.length > 0) {
          this._amazonautortvService.exportAsExcelFile(data, "InventoryDetail");
        }
        else {
          this.alertService.error('No Records Found!');
        }
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  onchangeFrequencyType(value: string) {
    this.DropDownDescription = this.lstFrequencytype.filter(a => a.DropdownValue == value)[0].DropDownDescription;
  }

  public GetRTVLocations(): void {
    this._PrivateutilityService.GetRTVLocations().subscribe(
      (data) => {
        this.Fromlocations = data.filter(a => a.IsInvoicing == false);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  Tolocations: Customerwarehouse[] = [] as any;
  public GetRTVCustomerWarehouses(): void {
    this._JsonPrivateUtilityService.GetRTVCustomerWarehouses().subscribe(
      (data) => {
        this.Tolocations = data;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  public LoadRTVInventoryType() {
    this._PrivateutilityService.GetValues('RTVInventoryType')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstInventorytype = data;
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  isInArray(array, word) {
    return array.indexOf(word.toLowerCase()) > -1;
  }
  flag: boolean = true;
  JsonData: any;
  selectedFile: File;
  errorMsg: string = '';
  storeData: any;
  worksheet0: any;
  onFileChanged(e: any) {
    this.errorMsg = '';
    this.JsonData = '';

    this.selectedFile = e.target.files[0];
    this.readExcel();
  }

  readExcel() {
    let readFile = new FileReader();
    readFile.onload = (e) => {
      this.storeData = readFile.result;
      var data = new Uint8Array(this.storeData);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      this.worksheet0 = workbook.Sheets[first_sheet_name];
    }
    readFile.readAsArrayBuffer(this.selectedFile);
  }

  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("Configurationlist", "ViewEdit")) {
      return;
    }
    if (this.selectedFile == null) {
      this.alertService.error('Please select File.!');
      return;
    }
    // stop here if form is invalid
    if (this.Configurationform.invalid) {
      return;
    }
    this.Insert();
  }
  // ViewChild is used to access the input element. 

  @ViewChild('takeInput', {})

  // this InputVar is a reference to our input. 

  InputVar: ElementRef;
  Insert() {
    this.obj.RTVType = this.Configurationform.controls['RTVType'].value;
    this.obj.RTVLocationID = this.Configurationform.controls['FromLocationID'].value;
    this.obj.CustomerWareHouseID = this.Configurationform.controls['CustomerWareHouseID'].value;
    this.obj.InventoryType = this.Configurationform.controls['InventoryType'].value;
    this.obj.FrequencyType = this.Configurationform.controls['FrequencyType'].value;

    this.JsonData = JSON.stringify(XLSX.utils.sheet_to_json(this.worksheet0, { raw: false }));
    this.obj.JsonData = this.JsonData;
    this.obj.Action = "I";
    this._amazonautortvService.BulkAction(this.obj).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.errorMsg = '';
          this.flag = data.Flag;
          this.alertService.success(data.Msg);
          this._router.navigate(['/Configurationlist']);
        }
        else {
          this.errorMsg = data.Msg;
          this.flag = data.Flag;
          // We will clear the value of the input  
          // field using the reference variable.  
          this.InputVar.nativeElement.value = "";
        }
        this.identity = 0;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }


}
