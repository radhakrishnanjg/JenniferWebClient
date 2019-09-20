import { Component, OnInit } from '@angular/core'; 
import { ActivatedRoute,   } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { GoodsReceiptService } from '../../_services/service/goods-receipt.service';
import { PrivateutilityService } from '../../_services/service/privateutility.service'; 
import { GoodsReceipt, Goodsinward, GoodsReceiptDetail } from '../../_services/model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-goodsreceiptview',
  templateUrl: './goodsreceiptview.component.html',
  styleUrls: ['./goodsreceiptview.component.css']
})
export class GoodsreceiptviewComponent implements OnInit {
  obj: GoodsReceipt;
  identity: number = 0;
  lstinward: Goodsinward[] = [] as any;
  ItemDetails: GoodsReceiptDetail[];
  dtOptions: DataTables.Settings = {};
  InventorySellable: number = 0;
  InventoryShortage: number = 0;
  InventoryDamage: number = 0;
  InventoryOthers: number = 0;
  TotalReceived: number = 0;
  constructor(
    public _goodsreceiptService: GoodsReceiptService,
    public _privateutilityService: PrivateutilityService,
    public _alertService: ToastrService,
    public _spinner: NgxSpinnerService,
    private aroute: ActivatedRoute) { }

  ngOnInit() {
    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
      if (this.identity > 0) {
        this._spinner.show();
        this._goodsreceiptService.searchById(this.identity)
          .subscribe(
            (data: GoodsReceipt) => {
              this.obj = data;
              
              let itempath1 = this.obj.ImagePath1 == null ? environment.defaultImageUrl : this.obj.ImagePath1;
              this.obj.ImagePath1 = environment.basedomain + itempath1;
              let itempath2 = this.obj.ImagePath2 == null ? environment.defaultImageUrl : this.obj.ImagePath2;
              this.obj.ImagePath2 = environment.basedomain + itempath2;
              if (this.obj.ImagePath3 != null) {
                this.obj.ImagePath3 = environment.basedomain + this.obj.ImagePath3;
              }
              else {
                this.obj.ImagePath3 = environment.basedomain + environment.defaultImageUrl;
              }
              if (this.obj.ImagePath4 != null) {
                this.obj.ImagePath4 = environment.basedomain + this.obj.ImagePath4;
              } else {
                this.obj.ImagePath4 = environment.basedomain + environment.defaultImageUrl;
              }
              this.InventorySellable = data.ItemDetails.reduce((acc, a) => acc + a.InventorySellableQty, 0);
              this.InventoryShortage = data.ItemDetails.reduce((acc, a) => acc + a.InventoryShortageQty, 0);
              this.InventoryDamage = data.ItemDetails.reduce((acc, a) => acc + a.InventoryDamageQty, 0);
              this.InventoryOthers = data.ItemDetails.reduce((acc, a) => acc + a.InventoryOthersQty, 0);
              this.TotalReceived = data.ItemDetails.reduce((acc, a) => acc + a.TotalReceivedQty, 0);

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

  filterGoodsInward(GRNDetailID: number) {
    this.lstinward = this.obj.lstInwards.filter(a => a.GRNDetailID == GRNDetailID);
    this.dtOptions = {
      paging: false,
      scrollY: '400px',
      "language": {
        "search": 'Filter',
      },
    };
  }

}
