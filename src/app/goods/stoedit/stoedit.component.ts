import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { StoService } from '../../_services/service/sto.service';
import { Sto, Stodetail } from '../../_services/model';
import { AuthorizationGuard } from '../../_guards/Authorizationguard';
import { Router } from '@angular/router';
import { isNumeric } from "rxjs/util/isNumeric"
@Component({
  selector: 'app-stoedit',
  templateUrl: './stoedit.component.html',
  styleUrls: ['./stoedit.component.css']
})
export class StoeditComponent implements OnInit {

  obj: Sto;
  identity: number = 0;
  TotalUnits: number = 0;
  TotalItemRate: number = 0;
  TotalDiscountValue: number = 0;
  TotalMultiplierValue: number = 0;
  TotalDirectCost: number = 0;
  TotalTaxAmount: number = 0;
  TotalTotalAmount: number = 0;
  TotalQty: number = 0;
  IsDiscountApplicable: boolean;
  constructor(
    public _stoService: StoService,
    public _alertService: ToastrService,
    public _spinner: NgxSpinnerService,
    private aroute: ActivatedRoute,
    private alertService: ToastrService,
    private _authorizationGuard: AuthorizationGuard,
    private router: Router
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
              this.obj.lstItem.forEach((element, index) => {
                this.updateList(index, 'ItemRate', element.ItemRate);
              });
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

  public updateList(id: number, property: string, value: number) {
    const editField: number = parseFloat(value.toString());
    if (!isNumeric(editField)) {
      this.alertService.error('Entered Rate must be a positive integer.');
      return;
    }
    else if (editField < 0) {
      this.alertService.error('Entered Rate must be greater than zero.!');
      return;
    }
    else {
      this.obj.lstItem[id][property] = editField;
      this.obj.lstItem[id]["DirectCost"] = editField * this.obj.lstItem[id]["Qty"];
      this.obj.lstItem[id]["TaxAmount"] = this.obj.lstItem[id]["DirectCost"]
        * this.obj.lstItem[id]["TaxRate"] / 100;
      this.obj.lstItem[id]["DiscountValue"] =
        (this.obj.lstItem[id]["DirectCost"] * this.obj.lstItem[id]["DisCountPer"] / 100)
        + (this.obj.lstItem[id]["TaxAmount"] * this.obj.lstItem[id]["DisCountPer"] / 100);
      this.obj.lstItem[id]["TotalAmount"] =
        parseFloat(this.obj.lstItem[id]["DirectCost"].toString()) +
        parseFloat(this.obj.lstItem[id]["TaxAmount"].toString()) -
        parseFloat(this.obj.lstItem[id]["DiscountValue"].toString());
      this.TotalItemRate = this.obj.lstItem.reduce((acc, a) => acc + a.ItemRate, 0);
      this.TotalDiscountValue = this.obj.lstItem.reduce((acc, a) => acc + a.DiscountValue, 0);
      this.TotalDirectCost = this.obj.lstItem.reduce((acc, a) => acc + a.DirectCost, 0);
      this.TotalTaxAmount = this.obj.lstItem.reduce((acc, a) => acc + a.TaxAmount, 0);
      this.TotalTotalAmount = this.obj.lstItem.reduce((acc, a) => acc + a.TotalAmount, 0);
      this.TotalQty = this.obj.lstItem.reduce((acc, a) => acc + a.Qty, 0);

    }
  }

  onchangeIsDiscountApplicable(event: any) {
    if (event.target.checked) {
      this.IsDiscountApplicable = true;
    } else {
      this.IsDiscountApplicable = false;
    }
    if (this.IsDiscountApplicable == true) {
      this._spinner.show();
      this._stoService.getStockDiscountItems(this.identity, this.IsDiscountApplicable)
        .subscribe(
          (data: Stodetail[]) => {
            //this.obj.lstItem = data;
            data.forEach((element) => {
              this.updateListByDiscount(element.ItemID, element.DiscountID, element.DisCountPer);
            });
            this._spinner.hide();
          },
          (err: any) => {
            console.log(err);
            this._spinner.hide();
          }
        );
    }
    else {
      this.obj.lstItem.forEach((element) => {
        this.updateListByDiscount(element.ItemID, 0, 0);
      });
    }
  }

  public updateListByDiscount(ItemID: number, DiscountID: number, value: number) {
    const editField: number = parseFloat(value.toString());
    this.obj.lstItem.filter(a => a.ItemID == ItemID)[0].DiscountID = DiscountID;
    this.obj.lstItem.filter(a => a.ItemID == ItemID)[0].DisCountPer = editField;
    this.obj.lstItem.filter(a => a.ItemID == ItemID)[0].DirectCost =
      this.obj.lstItem.filter(a => a.ItemID == ItemID)[0].Qty *
      this.obj.lstItem.filter(a => a.ItemID == ItemID)[0].ItemRate;
    this.obj.lstItem.filter(a => a.ItemID == ItemID)[0].TaxAmount =
      this.obj.lstItem.filter(a => a.ItemID == ItemID)[0].DirectCost *
      this.obj.lstItem.filter(a => a.ItemID == ItemID)[0].TaxRate / 100;
    this.obj.lstItem.filter(a => a.ItemID == ItemID)[0].DiscountValue =
      (this.obj.lstItem.filter(a => a.ItemID == ItemID)[0].DirectCost * editField / 100)
      + (this.obj.lstItem.filter(a => a.ItemID == ItemID)[0].TaxAmount * editField / 100);
    this.obj.lstItem.filter(a => a.ItemID == ItemID)[0].TotalAmount =
      parseFloat(this.obj.lstItem.filter(a => a.ItemID == ItemID)[0].DirectCost.toString()) +
      parseFloat(this.obj.lstItem.filter(a => a.ItemID == ItemID)[0].TaxAmount.toString()) -
      parseFloat(this.obj.lstItem.filter(a => a.ItemID == ItemID)[0].DiscountValue.toString());

    this.TotalItemRate = this.obj.lstItem.reduce((acc, a) => acc + a.ItemRate, 0);
    this.TotalDiscountValue = this.obj.lstItem.reduce((acc, a) => acc + a.DiscountValue, 0);
    this.TotalDirectCost = this.obj.lstItem.reduce((acc, a) => acc + a.DirectCost, 0);
    this.TotalTaxAmount = this.obj.lstItem.reduce((acc, a) => acc + a.TaxAmount, 0);
    this.TotalTotalAmount = this.obj.lstItem.reduce((acc, a) => acc + a.TotalAmount, 0);
    this.TotalQty = this.obj.lstItem.reduce((acc, a) => acc + a.Qty, 0);
  }



  public SaveData(): void {

    if (this._authorizationGuard.CheckAcess("StoList", "ViewEdit")) {
      return;
    }
    if (this.obj.lstItem == null || this.obj.lstItem.length == 0) {
      this._alertService.error("Order Item required");
      return;
    }
    else if (this.obj.InventoryType == 'SELLABLE' && this.obj.lstItem.filter(a => a.SalesRateCardID <= 0).length > 0) {
      this._alertService.error("Sales rates are not available for highligthted items,So you can't proceed further.!");
      return;
    }
    else if (this.obj.InventoryType == 'UNSELLABLE' && this.obj.lstItem.filter(a => a.ItemRate <= 0).length > 0) {
      this._alertService.error("Rates are not defined for the highligthted items,So you can't proceed further.!");
      return;
    }
    this.obj.DiscountApplicable = this.IsDiscountApplicable;
    this.obj.TaxNature = this.obj.lstItem[0].TaxNature;
    this._spinner.show();
    this._stoService.Update(this.obj).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this._alertService.success(data.Msg);
          this.router.navigate(['/StoList']);
        }
        else {
          this._alertService.error(data.Msg);
          this.router.navigate(['/StoList']);
        }
        this._spinner.hide();
      }, (err) => {
        this._spinner.hide();
        console.log(err);
      });
  }

}
