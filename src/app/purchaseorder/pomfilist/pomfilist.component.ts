import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { process, State } from '@progress/kendo-data-query';

import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { PrivateutilityService } from 'src/app/_services/service/privateutility.service';
import { PoMFI } from '../../_services/model';
import { PoService } from '../../_services/service/po.service'

@Component({
  selector: 'app-pomfilist',
  templateUrl: './pomfilist.component.html',
  styleUrls: ['./pomfilist.component.css']
})
export class PomfilistComponent implements OnInit {
  obj: PoMFI;
  lst: PoMFI[];
  constructor(
    private alertService: ToastrService,
    private router: Router,
    public _PoService: PoService,
    private _PrivateutilityService: PrivateutilityService,
    private _authorizationGuard: AuthorizationGuard,
  ) { }

  ngOnInit() {
    this.onLoad();
  }

  onLoad() {
    return this._PoService.MFISearch().subscribe(
      (lst) => {
        if (lst != null) {
          this.items = lst;
          this.loadItems();
        }
      },
      (err) => {

        console.log(err);
      }
    );
  }

  public allowUnsort = false;
  public sort: SortDescriptor[] = [{
    field: 'RemovalOrderID',
    dir: 'asc'
  }];
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  private items: PoMFI[] = [] as any;
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

}
