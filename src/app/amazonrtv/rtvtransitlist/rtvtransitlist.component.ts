import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

import { AmazonautortvService } from '../../_services/service/amazonautortv.service';
import { ToastrService } from 'ngx-toastr';
import { MWSShipment } from '../../_services/model';
import { AuthorizationGuard } from '../../_guards/Authorizationguard';
import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';

@Component({
  selector: 'app-rtvtransitlist',
  templateUrl: './rtvtransitlist.component.html',
  styleUrls: ['./rtvtransitlist.component.css']
})
export class RtvtransitlistComponent implements OnInit {
  obj: MWSShipment;
  constructor(
    private alertService: ToastrService,
    private router: Router,
    private _amazonautortvService: AmazonautortvService,
    private _spinner: NgxSpinnerService,
    private _authorizationGuard: AuthorizationGuard
  ) { }

  ngOnInit() {
    this.onLoad();
  }

  onLoad() {
    return this._amazonautortvService.GetInTransit().subscribe(
      (data) => {
        if (data != null) {
          this.items = data;
          this.loadItems();
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  //#region Paging Sorting and Filtering Start
  public allowUnsort = true;
  public sort: SortDescriptor[] = [{
    field: 'RemovalOrderID',
    dir: 'asc'
  }];
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  private items: MWSShipment[] = [] as any;
  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'RemovalOrderID', operator: 'contains', value: '' }]
    }
  };
  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
    this.loadItems();
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.loadSortItems();
  }

  private loadItems(): void {
    this.gridView = {
      data: orderBy(this.items, this.sort).slice(this.skip, this.skip + this.pageSize),
      total: this.items.length
    };
  }
  private loadSortItems(): void {
    this.gridView = {
      data: orderBy(this.items, this.sort).slice(this.skip, this.skip + this.pageSize),
      total: this.items.length
    };
  }
  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.gridView = process(this.items, this.state);
  }

  public onFilter(inputValue: string): void {
    this.gridView = process(this.items.slice(this.skip, this.skip + this.pageSize), {
      skip: this.skip,
      take: this.skip + this.pageSize,
      filter: {
        logic: "or",
        filters: [
          {
            field: 'RemovalOrderID',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'RemovalDate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'TrackingNumber',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ShipmentDate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'Carrier',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ItemCode',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ItemCode2',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'InventoryType',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'Qty',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'InTransitValue',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ShipmentStatus',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'Ageing_on_Shipment',
            operator: 'contains',
            value: inputValue
          },
        ],
      }
    });
  }
  //#endregion Paging Sorting and Filtering End

}