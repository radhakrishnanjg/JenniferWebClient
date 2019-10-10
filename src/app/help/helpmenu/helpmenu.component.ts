import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthorizationGuard } from '../../_guards/Authorizationguard';
import { Helpmenu, Dropdown } from '../../_services/model';
import { HelpmenuService } from '../../_services/service/helpmenu.service';
import { PrivateutilityService } from '../../_services/service/privateutility.service';

@Component({
  selector: 'app-helpmenu',
  templateUrl: './helpmenu.component.html',
  styleUrls: ['./helpmenu.component.css']
})
export class HelpmenuComponent implements OnInit {
  Helpmenuform: FormGroup;
  lst: Helpmenu[];
  lstMenuType: Dropdown[];
  obj: Helpmenu = {} as any;
  panelTitle: string;
  action: boolean;
  identity: number = 0;
  constructor(

    private alertService: ToastrService,
    private fb: FormBuilder,
    private _router: Router,
    private aroute: ActivatedRoute,
    public _spinner: NgxSpinnerService,
    private _helpmenuService: HelpmenuService,
    private _authorizationGuard: AuthorizationGuard,
    private _PrivateutilityService: PrivateutilityService,

  ) {

  }

  formErrors = {

    'MenuType': '',
    'LinkText': '',
    'ShortDescription': '',


  };

  validationMessages = {

    'MenuType': {
      'required': 'This field is required.',

    },
    'LinkText': {
      'required': 'This field is required.',
    },

    'ShortDescription': {
      'required': 'This field is required.',

    },

  };

  logValidationErrors(group: FormGroup = this.Helpmenuform): void {
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



    this.BindMenuTypes();
    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
    });
    if (this.identity > 0) {
      this.action = false;
      this.panelTitle = 'Edit Help Content';
      this._spinner.show();
      this._helpmenuService.searchById(this.identity)
        .subscribe(
          (data: Helpmenu) => {
            var ParentId = data.ParentId.toString();
            this.onchangeMenuType(data.MenuType);
            this.Helpmenuform.patchValue({
              LinkText: data.LinkText,
              ShortDescription: data.ShortDescription,
              PageContent: data.PageContent,
              IsActive: data.IsActive,
              MenuType: data.MenuType,
              ParentId: ParentId,
            });
            this._spinner.hide();
            this.Helpmenuform.get('MenuType').disable();
            this.Helpmenuform.get('ParentId').disable();
          },
          (err: any) => {
            this._spinner.hide();
            console.log(err)
          }
        );
    }
    else {
      this.panelTitle = 'Add New Help Content';
      this.identity = 0;
      this.action = true;
    }

    this.Helpmenuform = this.fb.group({
      MenuType: [0, [Validators.required]],
      ParentId: [0, []],
      LinkText: ['', [Validators.required]],
      ShortDescription: ['', [Validators.required]],
      PageContent: ['', []],
      IsActive: [0,],
    });

  }


  BindMenuTypes() {
    this._spinner.show();
    this._PrivateutilityService.GetValues('HelpMenuType')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstMenuType = data;
          this._spinner.hide();
        },
        (err: any) => {
          this._spinner.hide();
          console.log(err);
        }
      );
  }

  onchangeMenuType(selectedValue: string) {
    if (selectedValue == 'S' || selectedValue == 'C') {
      this._spinner.show();
      this._helpmenuService.getMenus(selectedValue)
        .subscribe(
          (data: Helpmenu[]) => {
            debugger
            this.lst = data;
            this._spinner.hide();
          },
          (err: any) => {
            this._spinner.hide();
            console.log(err);
          }
        );
    }
  }

  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("Helpmenulist", "ViewEdit")) {
      return;
    }
    // stop here if form is invalid
    if (this.Helpmenuform.invalid) {
      return;
    }
    // if (this.Helpmenuform.pristine) {
    //   this.alertService.error('Please change the value for any one control to proceed further!');
    //   return;
    // }
    if (this.Helpmenuform.controls['MenuType'].value == 'S' ||
      this.Helpmenuform.controls['MenuType'].value == 'C') {
      if (this.Helpmenuform.controls['ParentId'].value == '0') {
        this.alertService.error('Please select Parent Menu!');
        return;
      }
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

    this.obj.MenuType = this.Helpmenuform.controls['MenuType'].value;
    this.obj.ParentId = this.Helpmenuform.controls['ParentId'].value;
    this.obj.LinkText = this.Helpmenuform.controls['LinkText'].value;
    this.obj.ShortDescription = this.Helpmenuform.controls['ShortDescription'].value;
    this.obj.PageContent = this.Helpmenuform.controls['PageContent'].value;



    this._spinner.show();
    this._helpmenuService.Insert(this.obj).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this._spinner.hide();
          this.alertService.success(data.Msg);
          this._router.navigate(['/Helpmenulist']);
        }
        else {
          this._spinner.hide();
          this.alertService.error(data.Msg);
          this._router.navigate(['/Helpmenulist']);
        }
        this.identity = 0;
      },
      (error: any) => {
        this._spinner.hide();
        console.log(error);
      }
    );
  }

  Update() {
    this.obj.HelpMenuID = this.identity;
    this.obj.MenuType = this.Helpmenuform.controls['MenuType'].value;
    this.obj.ParentId = this.Helpmenuform.controls['ParentId'].value;
    this.obj.LinkText = this.Helpmenuform.controls['LinkText'].value;
    this.obj.ShortDescription = this.Helpmenuform.controls['ShortDescription'].value;
    this.obj.PageContent = this.Helpmenuform.controls['PageContent'].value;
    this.obj.IsActive = this.Helpmenuform.controls['IsActive'].value;

    this._spinner.show();
    this._helpmenuService.Update(this.obj).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this._spinner.hide();
          this.alertService.success(data.Msg);
          this._router.navigate(['/Helpmenulist']);
        }
        else {
          this._spinner.hide();
          this.alertService.error(data.Msg);
          this._router.navigate(['/Helpmenulist']);
        }
        this.identity = 0;
      },
      (error: any) => {
        this._spinner.hide();
        console.log(error);
      }
    );
  }

}
