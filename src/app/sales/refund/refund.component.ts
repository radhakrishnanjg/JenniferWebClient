import { Component, OnInit } from '@angular/core';
import { Refund, Dropdown } from '../../_services/model';
import { CreditnoteService } from '../../_services/service/creditnote.service';
import { AuthorizationGuard } from 'src/app/_guards/Authorizationguard';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PrivateutilityService } from 'src/app/_services/service/privateutility.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-refund',
  templateUrl: './refund.component.html',
  styleUrls: ['./refund.component.css']
})
export class RefundComponent implements OnInit {
  obj: Refund = {} as any;
  identity: number;
  refundForm: FormGroup;

  constructor(
    private _creditnoteService: CreditnoteService,
    private _authorizationGuard: AuthorizationGuard,
    private _router: Router,
    private aroute: ActivatedRoute,
    private fb: FormBuilder,
    private _PrivateutilityService: PrivateutilityService,
    private alertService: ToastrService,
  ) { }

  formErrors = {
    'TransactionDate': '',
    'RefundMode': '',
    'RefundAmount': ''
  }

  validationMessages = {
    'TransactionDate': {
      'required': 'This field is required'
    },
    'RefundMode': {
      'required': 'This field is required'
    },
    'RefundAmount': {
      'required': 'This field is required',
      'min': 'Refund Amount must be greater than 0'
    }
  }

  logValidationErrors(group: FormGroup = this.refundForm): void {
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

  MinDate: moment.Moment;
  MaxDate: moment.Moment;
  RefundAmount: number = 0.00;
  ngOnInit() {
    var end = moment().endOf('day');
    var currentend = new Date();
    var differ = end.diff(currentend, 'minutes');
    this.MaxDate = moment().add(differ, 'minutes');

    this.getRefundMode();
    this.getCurrentServerDateTime();

    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
      if (this.identity > 0) {
        this._creditnoteService.RefundSearchByCNID(this.identity).subscribe(
          (data: Refund) => {
            this.obj = data;
            this.RefundAmount = data.RefundAmount
          },
          (err: any) => {
            console.log(err);
          }
        )
      }
    });

    this.refundForm = this.fb.group({
      RefundMode: ['', [Validators.required]],
      TransactionNumber: [''],
      TransactionDate: ['', [Validators.required]],
      Remarks: [''],
      RefundAmount: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  private getCurrentServerDateTime() {
    this._PrivateutilityService.getCurrentDate()
      .subscribe(
        (data: Date) => {
          var mcurrentDate = moment(data, 'YYYY-MM-DD[T]HH:mm').format('MM-DD-YYYY HH:mm').toLocaleString();
          this.refundForm.patchValue({
            TransactionDate: { startDate: new Date(mcurrentDate) },
          });
          this.MinDate = moment(data).add(0, 'days');
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  lstRefundMode: Dropdown[];
  getRefundMode() {
    this._PrivateutilityService.GetValues('PaymentMode').subscribe(
      (data: Dropdown[]) => {
        this.lstRefundMode = data;
      },
      (err) => {
        console.log(err);
      }
    )
  }

  RefundMode: string;
  onchangeRefundMode(selectedValue: string) {
    this.RefundMode = selectedValue;
  }

  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("Creditnotelist", "ViewEdit")) {
      return;
    }
    if (this.refundForm.controls['RefundMode'].value == 'ONLINE' &&
      this.refundForm.controls['TransactionNumber'].value == '') {
      this.alertService.error("Please Enter the UTR Number!");
      return;
    }
    if (this.refundForm.controls['RefundAmount'].value > this.obj.PendingTotalAmount) {
      this.alertService.error("Refund Amount must be less than or equal to Pending Amount.!");
      return;
    }
    this.Insert();
  }

  Insert() {
    this.obj = new Refund();
    this.obj.CNID = this.identity;
    this.obj.RefundMode = this.refundForm.controls['RefundMode'].value;
    this.obj.TransactionNumber = this.refundForm.controls['TransactionNumber'].value;
    if (this.refundForm.controls['TransactionDate'].value.startDate._d != undefined) {
      let TransactionDate = new Date(moment(
        new Date(this.refundForm.controls['TransactionDate'].value.startDate._d.toLocaleString())).format("MM-DD-YYYY HH:mm"));
      this.obj.TransactionDate = TransactionDate;

    } else {
      let TransactionDate = new Date(moment(new Date(this.refundForm.controls['TransactionDate'].value.startDate.toLocaleString())).format("MM-DD-YYYY HH:mm"));
      this.obj.TransactionDate = TransactionDate;
    }

    this.obj.Remarks = this.refundForm.controls['Remarks'].value;
    this.obj.RefundAmount = this.refundForm.controls['RefundAmount'].value;

    this._creditnoteService.RefundInsert(this.obj).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.alertService.success(data.Msg);
          this._router.navigate(['/Refundlist']);
        }
        else {
          this.alertService.error(data.Msg);
          this._router.navigate(['/Refundlist']);
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
