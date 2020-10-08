import { Component, OnInit } from '@angular/core';

import { MasteruploadService } from '../../_services/service/masterupload.service';
import { BulkMasterUpload, MasterUpload } from '../../_services/model';
import { saveAs } from 'file-saver';
import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { Router } from '@angular/router';
import { AuthorizationGuard } from 'src/app/_guards/Authorizationguard';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-masteruploadlist',
  templateUrl: './masteruploadlist.component.html',
  styleUrls: ['./masteruploadlist.component.css']
})
export class MasteruploadlistComponent implements OnInit {
  selectedDeleteId: number; 
  SearchBy: string = '';
  SearchKeyword: string = '';

  constructor(
    private _masteruploadService: MasteruploadService,
    private alertService: ToastrService,
    private router: Router,
    private _authorizationGuard: AuthorizationGuard,
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
    this._masteruploadService.getfile(fileid)
      .subscribe(data => {
        saveAs(data, filename.toString())
      },
        (err) => {
          console.log(err);
        }
      );
  }

  downloadError(fileid: number) {
    this._masteruploadService.getErrorDetail(fileid)
      .subscribe(data => {
        saveAs(data, 'Error' + fileid.toString() + '.xlsx')
      },
        (err) => {
          console.log(err);
        }
      );
  }

  onLoad(SearchBy: string, Search: string) {
    return this._masteruploadService.search(SearchBy, Search).subscribe(
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

  AddNewLink() {
    if (this._authorizationGuard.CheckAcess("MasterUploadList", "ViewEdit")) {
      return;
    }
    this.router.navigate(['MasterUpload/Create',]);
  }

  obj: BulkMasterUpload = {} as any;
  deleteColumn: string;
  identity: number = 0;
  confirmDeleteid(id: number, DeleteColumnvalue: string) {
    if (this._authorizationGuard.CheckAcess("MasterUploadList", "ViewEdit")) {
      return;
    }
    this.identity = + id;
    this.deleteColumn = DeleteColumnvalue;
    $('#modaldeleteconfimation').modal('show');
  }

  delete() {
    this.obj.FileId = this.identity;
    this._masteruploadService.ReimbursementDelete(this.obj).subscribe(
      (data) => {
        if (data) {
          this.onLoad(this.SearchBy, this.SearchKeyword);
          this.alertService.success(data.Msg);
        } else {
          this.alertService.error(data.Msg);
        }
        $('#modaldeleteconfimation').modal('hide');
        this.identity = 0;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  //#region Paging Sorting and Filtering Start
  public allowUnsort = false;
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
            field: 'FileType',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'FileName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'UploadedByName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'UploadedDate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'FileUploadStatus',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'Remarks',
            operator: 'contains',
            value: inputValue
          },
        ],
      }
    });
  }
  //#endregion Paging Sorting and Filtering End


}
