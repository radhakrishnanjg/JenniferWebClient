import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SalesShipmentService } from '../../_services/service/sales-shipment.service';
import { SalesShipment } from '../../_services/model';

@Component({
  selector: 'app-sales-shipment-list',
  templateUrl: './sales-shipment-list.component.html',
  styleUrls: ['./sales-shipment-list.component.css']
})
export class SalesShipmentListComponent implements OnInit {
  shipmentList: SalesShipment[];
  obj: SalesShipment;
  deleteColumn: string;
  SearchBy: string = '';
  SearchKeyword: string = '';
  Searchaction: boolean = true;
  dtOptions: DataTables.Settings = {};
  selectedDeleteId: number;
  constructor(
    private _shipmentService: SalesShipmentService,
    private _spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {

    this.SearchBy = '';
    this.SearchKeyword = '';

    this.onLoad(this.SearchBy, this.SearchKeyword);
  }

  onLoad(SearchBy: string, Search: string, ) {

    this._spinner.show();
    return this._shipmentService.search(SearchBy, Search).subscribe(
      (data) => {
        this.shipmentList = data;
        this.dtOptions = {
          pagingType: 'full_numbers',
          "language": {
            "search": 'Filter',
          },
        }; 
        this._spinner.hide();
      },
      (err) => {
        this._spinner.hide();
        console.log(err);
      }
    );
  }

  Search(): void {
    this.onLoad(this.SearchBy, this.SearchKeyword);
  }

  Refresh(): void {
    this.SearchBy = '';
    this.SearchKeyword = '';
    this.Searchaction = true;
  }

}
