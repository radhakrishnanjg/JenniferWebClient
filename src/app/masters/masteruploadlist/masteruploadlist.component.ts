import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MasteruploadService } from '../../_services/service/masterupload.service';
import { MasterUpload } from '../../_services/model';
import { saveAs } from 'file-saver';
import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';

@Component({
  selector: 'app-masteruploadlist',
  templateUrl: './masteruploadlist.component.html',
  styleUrls: ['./masteruploadlist.component.css']
})
export class MasteruploadlistComponent implements OnInit {
 
  obj: MasterUpload;

  selectedDeleteId: number;
  dtOptions: DataTables.Settings = {};
  deleteColumn: string;
  SearchBy: string = '';
  SearchKeyword: string = '';

  constructor(
    private _masteruploadService: MasteruploadService,
    private _spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {

    this.onLoad('', '');
  }



  Search(): void {
    this.onLoad(this.SearchBy, this.SearchKeyword);
  }

  Refresh(): void {
    this.SearchBy = '';
    this.SearchKeyword = '';
  }


  downloadFile(fileid: number, filename: string) {
    this._spinner.show();
    this._masteruploadService.getfile(fileid)
      .subscribe(data => {
        this._spinner.hide(),
          saveAs(data, filename.toString())
      },
        (err) => {
          this._spinner.hide();
          console.log(err);
        }
      );
  }

  downloadError(fileid: number) {
    this._spinner.show();
    this._masteruploadService.getErrorDetail(fileid)
      .subscribe(data => {
        this._spinner.hide(),
          saveAs(data, 'Error' + fileid.toString() + '.xlsx')
      },
        (err) => {
          this._spinner.hide();
          console.log(err);
        }
      );
  }

  onLoad(SearchBy: string, Search: string) {

    this._spinner.show();
    return this._masteruploadService.search(SearchBy, Search).subscribe(
      (lst) => {
        if (lst != null) { 
          this.items = lst;
          this.loadItems(); 
        }
        this._spinner.hide();
      },
      (err) => {
        this._spinner.hide();
        console.log(err);
      }
    );
  }

  //#region Paging Sorting and Filtering Start
  public allowUnsort = true;
  public sort: SortDescriptor[] = [{
    field: 'FileType',
    dir: 'asc'
  }];
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  private items: MasterUpload[] = [] as any;
  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'FileType', operator: 'contains', value: '' }]
    }
  };
  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.loadItems();
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.loadSortItems();
  }

  private loadItems(): void {
    this.gridView = {
      data: this.items.slice(this.skip, this.skip + this.pageSize),
      total: this.items.length
    };
  }
  private loadSortItems(): void {
    this.gridView = {
      data: orderBy(this.items.slice(this.skip, this.skip + this.pageSize), this.sort),
      total: this.items.length
    };
  }
  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.gridView = process(this.items, this.state);
  }
  //#endregion Paging Sorting and Filtering End


}
