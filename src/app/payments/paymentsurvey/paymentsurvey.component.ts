import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthorizationGuard } from '../../_guards/Authorizationguard';
import { SurveyMaster, Survey1Answers, whichareaofthepaymentsummarydoyounotunderstand } from '../../_services/model';
import { TicketService } from '../../_services/service/ticket.service';
import { PrivateutilityService } from '../../_services/service/privateutility.service';

@Component({
  selector: 'app-paymentsurvey',
  templateUrl: './paymentsurvey.component.html',
  styleUrls: ['./paymentsurvey.component.css']
})
export class PaymentsurveyComponent implements OnInit {
  PaymentSurveyForm: FormGroup;
  ChineseForm: FormGroup;
  lst: Survey1Answers[];
  obj: Survey1Answers = {} as any;
  panelTitle: string;
  action: boolean;
  pattern: string;
  constructor(
    private alertService: ToastrService,
    private fb: FormBuilder,
    private _router: Router,
    private aroute: ActivatedRoute,

    private _ticketService: TicketService,
    private _authorizationGuard: AuthorizationGuard,
    private _PrivateutilityService: PrivateutilityService,
  ) { }

  formErrors = {
    'Doyouunderstandthepaymentsummarycompletely': '',
    'whichareaofthepaymentsummarydoyounotunderstand': '',
    'whichareaofthepaymentsummarydoyounotunderstandOther': '',
    'DoyouthinkthistoolJenniferhashelpedyouunderstandthepaymentsummarybetter': '',
    'DoyouthinkthistoolJenniferhashelpedyouunderstandthepaymentsummarybetterOther': '',
    'CommentsSection': '',
  };

  validationMessages = {
    'Doyouunderstandthepaymentsummarycompletely': {
      'required': 'This field is required.',

    },
    'whichareaofthepaymentsummarydoyounotunderstand': {
      'required': 'This field is required.',
    },

    'whichareaofthepaymentsummarydoyounotunderstandOther': {
      'required': 'This field is required.',

    },
    'DoyouthinkthistoolJenniferhashelpedyouunderstandthepaymentsummarybetter': {
      'required': 'This field is required.',

    },
    'DoyouthinkthistoolJenniferhashelpedyouunderstandthepaymentsummarybetterOther': {
      'required': 'This field is required.',
    },

    'CommentsSection': {
      'required': 'This field is required.',

    },
  };

  logValidationErrors(group: FormGroup = this.PaymentSurveyForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key); 
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

  logValidationErrorschinese(group: FormGroup = this.ChineseForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key); 
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
    this.PaymentSurveyForm = this.fb.group({
      Doyouunderstandthepaymentsummarycompletely: ['', [Validators.required]],
      whichareaofthepaymentsummarydoyounotunderstand: ['', []],
      whichareaofthepaymentsummarydoyounotunderstandOther: ['', []],
      DoyouthinkthistoolJenniferhashelpedyouunderstandthepaymentsummarybetter: ['', [Validators.required]],
      DoyouthinkthistoolJenniferhashelpedyouunderstandthepaymentsummarybetterOther: ['', []],
      CommentsSection: ['', [Validators.required]],
    });
    this.ChineseForm = this.fb.group({
      Doyouunderstandthepaymentsummarycompletely: ['', [Validators.required]],
      whichareaofthepaymentsummarydoyounotunderstand: ['', []],
      whichareaofthepaymentsummarydoyounotunderstandOther: ['', []],
      DoyouthinkthistoolJenniferhashelpedyouunderstandthepaymentsummarybetter: ['', [Validators.required]],
      DoyouthinkthistoolJenniferhashelpedyouunderstandthepaymentsummarybetterOther: ['', []],
      CommentsSection: ['', [Validators.required]],
    });
    const ReportDescription: whichareaofthepaymentsummarydoyounotunderstand[] = [
      {
        IsActive: false,
        Value: "MarketplaceCredits",
      },
      {
        IsActive: false,
        Value: "NetRevenue",
      },
      {
        IsActive: false,
        Value: "IORInvestments",
      },
      {
        IsActive: false,
        Value: "TaxesandCommissions",
      },
      {
        IsActive: false,
        Value: "Others",
      },
    ];
    this.lstUserStores = ReportDescription;
  }
  
  lstUserStores: whichareaofthepaymentsummarydoyounotunderstand[] = [] as any;
  storeFieldsChange(values: any) {
    this.lstUserStores.filter(a => a.Value == values.currentTarget.id)[0].IsActive
      = values.currentTarget.checked;
  }

  whichareaofthepaymentsummarydoyounotunderstandOtherFlag: boolean = false;
  whichareaofthepaymentsummarydoyounotunderstandChange(values: any) {
    console.log(values.currentTarget.id);
    if (values.currentTarget.id == "Others" && values.currentTarget.checked == true) {
      this.whichareaofthepaymentsummarydoyounotunderstandOtherFlag = true;
    }
    else if (values.currentTarget.id == "Others" && values.currentTarget.checked == false)  {
      this.whichareaofthepaymentsummarydoyounotunderstandOtherFlag = false;
    }

    //this.obj.whichareaofthepaymentsummarydoyounotunderstand = values.currentTarget.value;
    this.lstUserStores.filter(a => a.Value == values.currentTarget.id)[0].IsActive = values.currentTarget.checked;

  }



  DoyouunderstandthepaymentsummarycompletelyChangeYesFlag: boolean = false;
  DoyouunderstandthepaymentsummarycompletelyChangeYes(values: any) {
    console.log(values.currentTarget.checked);
    this.DoyouunderstandthepaymentsummarycompletelyChangeYesFlag = values.currentTarget.checked;
  }

  whichareaofthepaymentsummarydoyounotunderstandFlag: boolean = false;
  DoyouunderstandthepaymentsummarycompletelyChange(values: any) {
    console.log(values.currentTarget.checked);
    this.whichareaofthepaymentsummarydoyounotunderstandFlag = values.currentTarget.checked;
    this.DoyouunderstandthepaymentsummarycompletelyChangeYesFlag = false;
  }

  DoyouthinkthistoolJenniferhashelpedyouunderstandthepaymentsummarybetterOtherYesFlag: boolean = false;
  DoyouthinkthistoolJenniferhashelpedyouunderstandthepaymentsummarybetterOtherYesChange(values: any) {
    console.log(values.currentTarget.checked);
    this.DoyouthinkthistoolJenniferhashelpedyouunderstandthepaymentsummarybetterOtherYesFlag = values.currentTarget.checked;
  }

  DoyouthinkthistoolJenniferhashelpedyouunderstandthepaymentsummarybetterOtherFlag: boolean = false;
  DoyouthinkthistoolJenniferhashelpedyouunderstandthepaymentsummarybetterChange(values: any) {
    console.log(values.currentTarget.checked);
    this.DoyouthinkthistoolJenniferhashelpedyouunderstandthepaymentsummarybetterOtherFlag = values.currentTarget.checked;
    this.DoyouthinkthistoolJenniferhashelpedyouunderstandthepaymentsummarybetterOtherYesFlag = false;
  }

  Insert() {
    if (this.PaymentSurveyForm.invalid) {
      return;
    }
    this.obj.Doyouunderstandthepaymentsummarycompletely = 
    this.PaymentSurveyForm.controls['Doyouunderstandthepaymentsummarycompletely'].value;
    this.obj.whichareaofthepaymentsummarydoyounotunderstandOther = 
    this.PaymentSurveyForm.controls['whichareaofthepaymentsummarydoyounotunderstandOther'].value;
    this.obj.DoyouthinkthistoolJenniferhashelpedyouunderstandthepaymentsummarybetter =
     this.PaymentSurveyForm.controls['DoyouthinkthistoolJenniferhashelpedyouunderstandthepaymentsummarybetter'].value;
    this.obj.DoyouthinkthistoolJenniferhashelpedyouunderstandthepaymentsummarybetterOther =
     this.PaymentSurveyForm.controls['DoyouthinkthistoolJenniferhashelpedyouunderstandthepaymentsummarybetterOther'].value;
    this.obj.CommentsSection = this.PaymentSurveyForm.controls['CommentsSection'].value;

    // this.obj.whichareaofthepaymentsummarydoyounotunderstand = this.lstUserStores.filter(a => a.IsActive == true).toString()

    this.obj.whichareaofthepaymentsummarydoyounotunderstand = this.lstUserStores.filter(a => a.IsActive == true).map(a => a.Value).toString();

    if (this.obj.Doyouunderstandthepaymentsummarycompletely == 'Yes') {
      this.obj.whichareaofthepaymentsummarydoyounotunderstandOther = '';
    }
    if (this.obj.Doyouunderstandthepaymentsummarycompletely == 'No'
      && (this.obj.whichareaofthepaymentsummarydoyounotunderstand == null ||
        this.obj.whichareaofthepaymentsummarydoyounotunderstand == undefined ||
        this.obj.whichareaofthepaymentsummarydoyounotunderstand == '')) {
      this.alertService.error('Please share your concern');
      return;
    }
    if (this.obj.whichareaofthepaymentsummarydoyounotunderstand.match(/Others/g)
      && (this.obj.whichareaofthepaymentsummarydoyounotunderstandOther == null ||
        this.obj.whichareaofthepaymentsummarydoyounotunderstandOther == undefined ||
        this.obj.whichareaofthepaymentsummarydoyounotunderstandOther == '')) {
      this.alertService.error('Please share your concern');
      return;
    }
    else {
      this.obj.whichareaofthepaymentsummarydoyounotunderstandOther == ''
    }
    if (this.obj.DoyouthinkthistoolJenniferhashelpedyouunderstandthepaymentsummarybetter != 'Other') {
      this.obj.DoyouthinkthistoolJenniferhashelpedyouunderstandthepaymentsummarybetterOther = '';
    }
    if (this.obj.DoyouthinkthistoolJenniferhashelpedyouunderstandthepaymentsummarybetter == 'Other'
      && (this.obj.DoyouthinkthistoolJenniferhashelpedyouunderstandthepaymentsummarybetterOther == null ||
        this.obj.DoyouthinkthistoolJenniferhashelpedyouunderstandthepaymentsummarybetterOther == undefined ||
        this.obj.DoyouthinkthistoolJenniferhashelpedyouunderstandthepaymentsummarybetterOther == '')) {
      this.alertService.error('Please share your concern');
      return;
    }

    // console.log(this.obj);
    this._ticketService.survey1Insert(this.obj).subscribe(
      (data) => {
        if (data != null && data.Flag == true) { 
          this.alertService.success(data.Msg); 
        }
        else { 
          this.alertService.error(data.Msg);
        } 
        this.GetSurveys();
      }, 
      (error: any) => { 
        console.log(error);
      }
    );
  }
  InsertChinese() {
    if (this.ChineseForm.invalid) {
      return;
    }
    this.obj.Doyouunderstandthepaymentsummarycompletely = 
    this.ChineseForm.controls['Doyouunderstandthepaymentsummarycompletely'].value;
    this.obj.whichareaofthepaymentsummarydoyounotunderstandOther =
     this.ChineseForm.controls['whichareaofthepaymentsummarydoyounotunderstandOther'].value;
    this.obj.DoyouthinkthistoolJenniferhashelpedyouunderstandthepaymentsummarybetter =
     this.ChineseForm.controls['DoyouthinkthistoolJenniferhashelpedyouunderstandthepaymentsummarybetter'].value;
    this.obj.DoyouthinkthistoolJenniferhashelpedyouunderstandthepaymentsummarybetterOther =
     this.ChineseForm.controls['DoyouthinkthistoolJenniferhashelpedyouunderstandthepaymentsummarybetterOther'].value;
    this.obj.CommentsSection = this.ChineseForm.controls['CommentsSection'].value;
 
    this.obj.whichareaofthepaymentsummarydoyounotunderstand = this.lstUserStores.filter(a => a.IsActive == true).map(a => a.Value).toString();

    if (this.obj.Doyouunderstandthepaymentsummarycompletely == 'Yes') {
      this.obj.whichareaofthepaymentsummarydoyounotunderstandOther = '';
    }
    if (this.obj.Doyouunderstandthepaymentsummarycompletely == 'No'
      && (this.obj.whichareaofthepaymentsummarydoyounotunderstand == null ||
        this.obj.whichareaofthepaymentsummarydoyounotunderstand == undefined ||
        this.obj.whichareaofthepaymentsummarydoyounotunderstand == '')) {
      this.alertService.error('Please share your concern');
      return;
    }
    if (this.obj.whichareaofthepaymentsummarydoyounotunderstand.match(/Others/g)
      && (this.obj.whichareaofthepaymentsummarydoyounotunderstandOther == null ||
        this.obj.whichareaofthepaymentsummarydoyounotunderstandOther == undefined ||
        this.obj.whichareaofthepaymentsummarydoyounotunderstandOther == '')) {
      this.alertService.error('Please share your concern');
      return;
    }
    else {
      this.obj.whichareaofthepaymentsummarydoyounotunderstandOther == ''
    }
    if (this.obj.DoyouthinkthistoolJenniferhashelpedyouunderstandthepaymentsummarybetter != 'Other') {
      this.obj.DoyouthinkthistoolJenniferhashelpedyouunderstandthepaymentsummarybetterOther = '';
    }
    if (this.obj.DoyouthinkthistoolJenniferhashelpedyouunderstandthepaymentsummarybetter == 'Other'
      && (this.obj.DoyouthinkthistoolJenniferhashelpedyouunderstandthepaymentsummarybetterOther == null ||
        this.obj.DoyouthinkthistoolJenniferhashelpedyouunderstandthepaymentsummarybetterOther == undefined ||
        this.obj.DoyouthinkthistoolJenniferhashelpedyouunderstandthepaymentsummarybetterOther == '')) {
      this.alertService.error('Please share your concern');
      return;
    }

    // console.log(this.obj);
    this._ticketService.survey1Insert(this.obj).subscribe(
      (data) => {
        if (data != null && data.Flag == true) { 
          this.alertService.success(data.Msg); 
        }
        else { 
          this.alertService.error(data.Msg);
        } 
        this.GetSurveys();
      }, 
      (error: any) => { 
        console.log(error);
      }
    );
  }

  lstSurveyMaster: SurveyMaster[] = [] as any;
  GetSurveys() {
    this._ticketService.pendingSurvey()
      .subscribe(
        (data) => {
          if (data != null && data.length > 0) {
            this.lstSurveyMaster = data;
            this._router.navigate(['/' + this.lstSurveyMaster[0].AngularRoute]);
          }
          else {
            this._router.navigate(['/Statementlist']);
          }
        },
        (err: any) => {
          console.log(err);
        }
      );
  }
}
