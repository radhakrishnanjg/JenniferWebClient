import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AmazonAutoRTVConfiguration, Dropdown, Location } from '../../_services/model';
import { AmazonautortvService } from '../../_services/service/amazonautortv.service';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'


@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {

  Configurationform: FormGroup;
  obj: AmazonAutoRTVConfiguration = {} as any;
  identity: number = 0;
  Fromlocations: Location[] = [] as any;
  Tolocations: Location[] = [] as any;
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
    private _authorizationGuard: AuthorizationGuard,
  ) { }

  formErrors = {
    'FromLocationID': '',
    'ToLocationID': '',
    'InventoryType': '',
    'FrequencyType': '',
  };
  validationMessages = {
    'FromLocationID': {
      'min': 'This field is required',

    },
    'ToLocationID': {
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

    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
    });

    this.LoadRTVFrequencyType();
    if (this.identity > 0) {
      this.panelTitle = 'Edit Configuration';
      this.action = false;
      this._amazonautortvService.SearchById(this.identity)
        .subscribe(
          (data: AmazonAutoRTVConfiguration) => {
            this.Configurationform.patchValue({
              FrequencyType: data.FrequencyType,
              IsActive: data.IsActive,
              FromLocationID: data.RTVLocationID,
              ToLocationID: data.RTVReceivingLocationID,
              InventoryType: data.InventoryType,
            });
            this.FromLocationName = data.RTVLocationName;
            this.ToLocationName = data.RTVReceivingLocationName;
            this.InventoryType = data.InventoryType;
            this.onchangeFrequencyType(data.FrequencyType);

          },
          (err: any) => {
            console.log(err);
          }
        );
    }
    else {
      this.panelTitle = 'Add New Configuration';
      this.action = true;
      this.LoadRTVInventoryType();
      this.getLocations();
    } 

    this.Configurationform = this.fb.group({
      FromLocationID: [0, [Validators.min(1),]],
      ToLocationID: [0, [Validators.min(1),]],
      InventoryType: [0, [Validators.min(1),]],
      FrequencyType: [0, [Validators.min(1),]],
      IsActive: [0,],
    });
  }

  onchangeFrequencyType(value: string) {  
    this.DropDownDescription = this.lstFrequencytype.filter(a => a.DropdownValue == value)[0].DropDownDescription; 
  }

  public getLocations(): void {
    this._PrivateutilityService.GetRTVLocations().subscribe(
      (data) => {
        this.Fromlocations = data.filter(a => a.IsInvoicing == false);
        this.Tolocations = data.filter(a => a.IsInvoicing == true);
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

  public LoadRTVFrequencyType() {
    this._PrivateutilityService.GetValues('RTVFrequencyType')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstFrequencytype = data;
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("Configurationlist", "ViewEdit")) {
      return;
    }

    // stop here if form is invalid
    if (this.Configurationform.invalid) {
      return;
    }
    if (this.Configurationform.pristine) {
      this.alertService.error('Please change the value for any one control to proceed further!');
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
    this.obj.RTVLocationID = this.Configurationform.controls['FromLocationID'].value;
    this.obj.RTVReceivingLocationID = this.Configurationform.controls['ToLocationID'].value;
    this.obj.InventoryType = this.Configurationform.controls['InventoryType'].value;
    this.obj.FrequencyType = this.Configurationform.controls['FrequencyType'].value;

    this._amazonautortvService.Exist(this.obj.RTVLocationID, this.obj.RTVReceivingLocationID,
      this.obj.InventoryType, this.obj.ConfigID)
      .subscribe(
        (data) => {
          if (data == true) {
            this.alertService.error('This location combination is already registered');
          }
          else {
            this._amazonautortvService.Insert(this.obj).subscribe(
              (data) => {
                if (data != null && data.Flag == true) {
                  //
                  this.alertService.success(data.Msg);
                  this._router.navigate(['/Configurationlist']);
                }
                else {
                  this.alertService.error(data.Msg);
                  this._router.navigate(['/Configurationlist']);
                }
                this.identity = 0;
              },
              (error: any) => {
                console.log(error);
              }
            );
          }
        },
        (error: any) => {
        }
      );
  }

  Update() {
    this.obj.ConfigID = this.identity;
    this.obj.RTVLocationID = this.Configurationform.controls['FromLocationID'].value;
    this.obj.RTVReceivingLocationID = this.Configurationform.controls['ToLocationID'].value;
    this.obj.InventoryType = this.Configurationform.controls['InventoryType'].value;
    this.obj.FrequencyType = this.Configurationform.controls['FrequencyType'].value;
    this.obj.IsActive = this.Configurationform.controls['IsActive'].value;

    this._amazonautortvService.Exist(this.obj.RTVLocationID, this.obj.RTVReceivingLocationID,
      this.obj.InventoryType, this.obj.ConfigID)
      .subscribe(
        (data) => {
          if (data == true) {
            this.alertService.error('This location combination is already registered');
          }
          else {
            this._amazonautortvService.Update(this.obj).subscribe(
              (data) => {
                if (data != null && data.Flag == true) {
                  this.alertService.success(data.Msg);
                  this._router.navigate(['/Configurationlist']);
                }
                else {
                  this.alertService.error(data.Msg);
                  this._router.navigate(['/Configurationlist']);
                }
                this.identity = 0;
              },
              (error: any) => {
                console.log(error);
              }
            );
          }
        },
        (error: any) => {
        }
      );


  }

}
