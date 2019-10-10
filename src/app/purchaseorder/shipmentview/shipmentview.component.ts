import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PoshipmentService } from '../../_services/service/poshipment.service';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { Poshipment, Poorderitem, } from '../../_services/model';
import * as moment from 'moment';

@Component({
  selector: 'app-shipmentview',
  templateUrl: './shipmentview.component.html',
  styleUrls: ['./shipmentview.component.css']
})
export class ShipmentviewComponent implements OnInit {

  lstshipmentqty: Poorderitem[];
  obj: Poshipment = {} as any;
  selectedFile: File[];
  identity: number = 0;
  POId: number = 0;
  panelTitle: string;
  action: boolean;
  TotalPOQty: number = 0;
  TotalAvailableQty: number = 0;
  TotalShipmentQty: number = 0;
  constructor(
    public _poshipmentService: PoshipmentService,
    public _privateutilityService: PrivateutilityService,
    public _alertService: ToastrService,
    public _spinner: NgxSpinnerService,
    private aroute: ActivatedRoute,
  ) {
  }

  ngOnInit() {



    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
      this.POId = +params.get('PoId');
      if (this.identity > 0) {
        this.panelTitle = "View Shipment";
        this.action = false;

        this._spinner.show();
        this._poshipmentService.searchById(this.POId, this.identity)
          .subscribe(
            (data: Poshipment) => {
              this.obj = data;
              var Appointment = moment(data.Appointment, 'YYYY-MM-DD[T]HH:mm').format('MM-DD-YYYY HH:mm').toString();
              this.obj.Appointment = new Date(Appointment);

              this.lstshipmentqty = data.lstItem;
              this.TotalPOQty = this.lstshipmentqty.reduce((acc, a) => acc + a.POQty, 0);
              this.TotalAvailableQty = this.lstshipmentqty.reduce((acc, a) => acc + a.AvailableQty, 0);
              this.TotalShipmentQty = this.lstshipmentqty.reduce((acc, a) => acc + a.ShipmentQty, 0);
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
