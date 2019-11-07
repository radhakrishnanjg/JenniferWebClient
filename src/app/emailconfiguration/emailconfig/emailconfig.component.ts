import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { ContactService } from '../../_services/service/contact.service';
import { Emailtemplate, Contact } from '../../_services/model';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'; 
@Component({
  selector: 'app-emailconfig',
  templateUrl: './emailconfig.component.html',
  styleUrls: ['./emailconfig.component.css']
})
export class EmailconfigComponent implements OnInit {

  emailtemplateform: FormGroup;
  //#region variable declartion 

  obj: Emailtemplate = {} as any;
  lstemailtemplates: Emailtemplate[];
  lstContact: Contact[];
  Internalflag: boolean = false;
  Externalflag: boolean = false;
  MarketPlaceflag: boolean = false;
  HtmlContent: string = '';
  MailTo: string = '';
  //#endregion
  constructor(
    private alertService: ToastrService,
    private _router: Router,
    private _contactService: ContactService,
    
    private _authorizationGuard: AuthorizationGuard,
    private _PrivateutilityService: PrivateutilityService,
    private fb: FormBuilder,
  ) { }


  formErrors = {
    'EmailTemplateID': '',

  };
  validationMessages = {

    'EmailTemplateID': {
      'min': 'Email Template is required.'
    },

  };

  logValidationErrors(group: FormGroup = this.emailtemplateform): void {
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
    //
    this._PrivateutilityService.getEmailTemplates()
      .subscribe(
        (data: Emailtemplate[]) => {
          this.lstemailtemplates = data;
          //
        },
        (err: any) => {
          console.log(err);
          //
        }
      );
    this.emailtemplateform = this.fb.group({
      EmailTemplateID: [0, [Validators.min(1)]],
    });
  }

  filterInternal(ContactType: string): Contact[] {
    let result: Contact[] = [];
    if (this.lstContact != null && this.lstContact.length > 0) {
      result = this.lstContact.filter(a => a.ContactType == ContactType);
      this.Internalflag = result.length > 0 ? true : false;
    }
    return result;
  }
  filterExternal(ContactType: string): Contact[] {
    let result: Contact[] = [];
    if (this.lstContact != null && this.lstContact.length > 0) {
      result = this.lstContact.filter(a => a.ContactType == ContactType);
      this.Externalflag = result.length > 0 ? true : false;
    }
    return result;
  }
  filterMarketPlace(ContactType: string): Contact[] {
    let result: Contact[] = [];
    if (this.lstContact != null && this.lstContact.length > 0) {
      result = this.lstContact.filter(a => a.ContactType == ContactType);
      this.MarketPlaceflag = result.length > 0 ? true : false;
    }
    return result;
  }


  onchangeEmailTemplateID(selectedValue: string) {
    let EmailTemplateID = parseInt(selectedValue);
    if (EmailTemplateID != 0) {
      //
      this._contactService.searchByTemplateID(EmailTemplateID)
        .subscribe(
          (data: Contact[]) => {
            if (data != null) {
              this.lstContact = data;
              this.filterInternal('INTERNAL');
              this.filterExternal('EXTERNAL');
              this.filterMarketPlace('MARKETPLACE');
              this.HtmlContent = this.lstemailtemplates.filter(a => a.EmailTemplateID == EmailTemplateID)[0].TemplateBody;
              
              this.MailTo = this.lstContact.filter(a => a.IsActive == true).map(a => a.Email).toString();
            }
            //
          },
          (err: any) => {
            //
            console.log(err);
          }
        );
    }
  }

  ContactIDFieldsChange(values: any) {
    this.lstContact.filter(a => a.ContactID == values.currentTarget.id)[0].IsActive = values.currentTarget.checked;
  }

  Save(buttonType): void {
    if (buttonType === "Preview") {
      this.MailTo = this.lstContact.filter(a => a.IsActive == true).map(a => a.Email).toString();
    }
    if (buttonType === "Save") {
      console.log(buttonType);
      this.SaveData();
    }

  }
  SaveData() {
    if (this._authorizationGuard.CheckAcess("Emailconfig", "ViewEdit")) {
      return;
    }
    // stop here if form is invalid
    if (this.emailtemplateform.invalid) {
      return;
    }

    this.obj.EmailTemplateID = this.emailtemplateform.controls['EmailTemplateID'].value;
    let contactids: number[] = [];
    if (this.lstContact == null || this.lstContact.filter(a => a.IsActive == true).map(a => a.ContactID).length == 0) {
      this.alertService.error('Please select atleast one contact!');
      return;
    }
    contactids = this.lstContact.filter(a => a.IsActive == true).map(a => a.ContactID);
    //
    this._contactService.emailTemplateUpsert(this.obj, contactids).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          //
          this.alertService.success(data.Msg);
          this.onchangeEmailTemplateID(this.obj.EmailTemplateID.toString());
        }
        else {
          //
          this.alertService.error(data.Msg);
          this._router.navigate(['/Emailconfig']);
        }
      },
      (error: any) => {
        //
        console.log(error);
      }
    );
  }
}
