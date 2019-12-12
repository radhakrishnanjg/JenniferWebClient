import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
 
import { GoodsDisputeService } from '../../_services/service/goods-dispute.service';
import { Goodsdispute } from '../../_services/model';
import { AuthorizationGuard } from '../../_guards/Authorizationguard';
import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';

@Component({
  selector: 'app-goods-dispute-list',
  templateUrl: './goods-dispute-list.component.html',
  styleUrls: ['./goods-dispute-list.component.css']
})
export class GoodsDisputeListComponent implements OnInit {
  //#region variable declartion
 
  obj: Goodsdispute;
  dtOptions: DataTables.Settings = {};
  SearchBy: string = '';
  SearchKeyword: string = '';
  //#endregion

  constructor( 
    private router: Router,
    private _goodsDisputeService: GoodsDisputeService,
    
    private _authorizationGuard: AuthorizationGuard
  ) { }

  ngOnInit() {
    this.onLoad('', '');
  }

 
  Search(): void {
    this.onLoad(this.SearchBy, this.SearchKeyword);
  }

  Refresh(): void {
    this.SearchBy = '',
      this.SearchKeyword = ''
  }

  editButtonClick(id: number) {
    if (this._authorizationGuard.CheckAcess("Goodsdisputelist", "ViewEdit")) {
      return;
    }
    this.router.navigate(['/Goodsdisputeview', id]);
  }

  onLoad(SearchBy: string, Search: string) {

    //
    return this._goodsDisputeService.search(SearchBy, Search).subscribe(
      (data) => {
        if (data != null) { 
          this.items = data;
          this.loadItems(); 
        }
        //
      },

      (err) => {
        //
        console.log(err);
      }

    );
  }

  AddNewLink() {
    if (this._authorizationGuard.CheckAcess("Goodsdisputelist", "ViewEdit")) {
      return;
    }
    this.router.navigate(['/Goodsdispute/Create',]);
  }

   //#region Paging Sorting and Filtering Start
   public allowUnsort = false;
   public sort: SortDescriptor[] = [{
     field: 'GRNNumber',
     dir: 'asc'
   }];
   public gridView: GridDataResult;
   public pageSize = 10;
   public skip = 0;
   private data: Object[];
   private items: Goodsdispute[] = [] as any;
   public state: State = {
     skip: 0,
     take: 5,
 
     // Initial filter descriptor
     filter: {
       logic: 'and',
       filters: [{ field: 'GRNNumber', operator: 'contains', value: '' }]
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
 
 
   //#endregion Paging Sorting and Filtering End
 
}
