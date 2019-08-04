import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { GoodsDisputeService } from '../../_services/service/goods-dispute.service';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { Goodsdispute, } from '../../_services/model';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-goodsdisputeview',
  templateUrl: './goodsdisputeview.component.html',
  styleUrls: ['./goodsdisputeview.component.css']
})
export class GoodsdisputeviewComponent implements OnInit {
  obj: Goodsdispute;
  identity: number = 0;
  goodsDisputeViewform: FormGroup;

  constructor(
    public _goodsdisputeService: GoodsDisputeService,
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
        this._goodsdisputeService.searchById(this.identity)
          .subscribe(
            (data: Goodsdispute) => {
              this.obj = data;

              let itempath1 = data.Image1 == null ? environment.defaultImageUrl : data.Image1;
              this.obj.Image1 = environment.basedomain + itempath1;
              this.obj.Image2 = environment.basedomain + data.Image2;
              this.obj.Image3 = environment.basedomain + data.Image3;
              this.obj.Image4 = environment.basedomain + data.Image4;
              if (data.Image5 != null) {
                this.obj.Image5 = environment.basedomain + data.Image5;
              }
              else {
                this.obj.Image5 = environment.basedomain + environment.defaultImageUrl;
              }
              if (data.Image6 != null) {
                this.obj.Image6 = environment.basedomain + data.Image6;
              }
              else {
                this.obj.Image6 = environment.basedomain + environment.defaultImageUrl;
              }
              if (data.Image7 != null) {
                this.obj.Image7 = environment.basedomain + data.Image7;
              }
              else {
                this.obj.Image7 = environment.basedomain + environment.defaultImageUrl;
              }
              if (data.Image8 != null) {
                this.obj.Image8 = environment.basedomain + data.Image8;
              }
              else {
                this.obj.Image8 = environment.basedomain + environment.defaultImageUrl;
              }
              if (data.Image9 != null) {
                this.obj.Image9 = environment.basedomain + data.Image9;
              }
              else {
                this.obj.Image9 = environment.basedomain + environment.defaultImageUrl;
              }
              if (data.Image10 != null) {
                this.obj.Image10 = environment.basedomain + data.Image10;
              }
              else {
                this.obj.Image10 = environment.basedomain + environment.defaultImageUrl;
              }
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

  DownloadButtonClick(DisputeID: number) {
    if (DisputeID != 0) {
      this._spinner.show();
      this._goodsdisputeService.DownloadImages(DisputeID)
        .subscribe(data => {
          this._alertService.success("File downloaded succesfully.!");
          this._spinner.hide(),
            saveAs(data, DisputeID + '.zip')
        },
          (err) => {
            this._spinner.hide();
            console.log(err);
          }
        );
    } else {
    }
  }

}
