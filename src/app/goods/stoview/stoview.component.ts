import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { StoService } from '../../_services/service/sto.service';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { Sto, Stodetail } from '../../_services/model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-stoview',
  templateUrl: './stoview.component.html',
  styleUrls: ['./stoview.component.css']
})
export class StoviewComponent implements OnInit {
  obj: Sto;
  lstItem: Stodetail[];
  identity: number = 0;
  TotalUnits : number = 0;
  TotalRate : number = 0;
  TotalDiscountValue : number = 0;
  Amount : number = 0;

  constructor(
    public _stoService: StoService,
    public _privateutilityService: PrivateutilityService,
    public _alertService: ToastrService,
    public _spinner: NgxSpinnerService,
    private aroute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
      if (this.identity > 0) {
        this._spinner.show();
        this._stoService.searchById(this.identity)
          .subscribe(
            (data: Sto) => {
              this.obj = data; 
              this.TotalUnits = data.lstItem.reduce((acc, a) => acc + a.Units, 0);
              this.TotalRate = data.lstItem.reduce((acc, a) => acc + a.Rate, 0);
              this.TotalDiscountValue = data.lstItem.reduce((acc, a) => acc + a.DiscountValue, 0);
              this.Amount = data.lstItem.reduce((acc, a) => acc + a.TotalAmount, 0);

              this._spinner.hide();
            },
            (err: any) => {
              console.log(err);
              this._spinner.hide();
            }
          );
      }
    });
  }

}
