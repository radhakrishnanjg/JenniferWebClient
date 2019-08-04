import { Component, OnInit } from '@angular/core'; 
import { NgxSpinnerService } from 'ngx-spinner'; 
import { InventorydetailService } from  '../../_services/service/inventorydetail.service';
import { Inventorydetail } from  '../../_services/model'; 

@Component({
  selector: 'app-inventorydetaillist',
  templateUrl: './inventorydetaillist.component.html',
  styleUrls: ['./inventorydetaillist.component.css']
})
export class InventorydetaillistComponent implements OnInit {

  lst: Inventorydetail[];
  obj: Inventorydetail;
    
  dtOptions: DataTables.Settings = {}; 
  SearchBy: string = '';
  SearchKeyword: string = '';  
  SearchInventoryType: string = '';
  constructor( 
    private _inventoryTypeService: InventorydetailService,
    private _spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.onLoad('', '');
  }

  onLoad(SearchBy: string, Search: string) {
 
    this._spinner.show();
    return this._inventoryTypeService.search(SearchBy, Search).subscribe(
      (data) => {
        this.lst = data;
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
  }

}
