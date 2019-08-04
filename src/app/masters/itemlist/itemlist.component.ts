import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthorizationGuard } from  '../../_guards/Authorizationguard'
import { ItemService } from  '../../_services/service/item.service';
import { ToastrService } from 'ngx-toastr';
import { Item } from  '../../_services/model';
import { environment } from  '../../../environments/environment';
@Component({
  selector: 'app-itemlist',
  templateUrl: './itemlist.component.html',
  styleUrls: ['./itemlist.component.css']
})
export class ItemlistComponent implements OnInit {
  lst: Item[];
  objItem: Item;

  selectedDeleteId: number;
  dtOptions: DataTables.Settings = {};
  deleteColumn: string;
  SearchBy: string = '';
  SearchKeyword: string = '';
  Searchaction: boolean = true;

  constructor(
    private alertService: ToastrService,
    private router: Router,
    private _itemService: ItemService,
    private _spinner: NgxSpinnerService,
    private _authorizationGuard: AuthorizationGuard
  ) { }

  ngOnInit() {


    this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
  }

  onLoad(SearchBy: string, Search: string, IsActive: Boolean) {

    this._spinner.show();
    return this._itemService.getItems(SearchBy, Search, IsActive).subscribe(
      (data) => {
        this.lst = data;
        this.dtOptions = {
          pagingType: 'full_numbers',
          "language": {
            "search": 'Filter',
          },
        };
        if (this.lst != null && this.lst.length > 0) {
          this.lst.map(a => a.ImagePath = a.ImagePath == null
            ? environment.basedomain + environment.defaultImageUrl : environment.basedomain + a.ImagePath)
        }
        this._spinner.hide();
      },
      (err) => {
        this._spinner.hide();
        console.log(err);
      }
    );
  }

  Search() {
    this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
  }

  Refresh() {

    this.SearchBy = '';
    this.SearchKeyword = '';
    this.Searchaction = true;
  }


  editButtonClick(id: number) {
    if (this._authorizationGuard.CheckAcess("Itemlist", "ViewEdit")) {
      return;
    }
    this.router.navigate(['/Item', id]);
  }

  confirmDeleteid(id: number, DeleteColumnvalue: string) {
    if (this._authorizationGuard.CheckAcess("Itemlist", "ViewEdit")) {
      return;
    }

    this.selectedDeleteId = + id;
    this.deleteColumn = DeleteColumnvalue;
    $('#modaldeleteconfimation').modal('show');
  }

  delete() {
    this._spinner.show();
    this._itemService.delete(this.selectedDeleteId).subscribe(
      (data) => {
        if (data) {
          this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
          this.alertService.success('Item data has been deleted successful');
        } else {
          this.alertService.error('Item – ' + this.deleteColumn + ' is being used in the application, Can’t be deleted.!');
        }
        $('#modaldeleteconfimation').modal('hide');

        this._spinner.hide();
      },
      (error: any) => {
        this._spinner.hide();
        console.log(error);
      }
    );
  }


}
