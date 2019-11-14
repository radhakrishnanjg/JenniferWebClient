import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GstfinancefileuploadService } from '../../_services/service/gstfinancefileupload.service';
import { Dropdown, Gstfinancefileupload, GSTApprovalStatusViewModel, Apisettings } from '../../_services/model';

import { AuthorizationGuard } from '../../_guards/Authorizationguard';
import * as moment from 'moment';
import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { PrivateutilityService } from 'src/app/_services/service/privateutility.service';

@Component({
  selector: 'app-gstlist',
  templateUrl: './gstlist.component.html',
  styleUrls: ['./gstlist.component.css']
})
export class GstlistComponent implements OnInit {

  obj: Gstfinancefileupload;
  lstgstapproval: Dropdown[];
  lstgstupload: Dropdown[];
  deleteColumn: string;
  selectedDeleteId: number;
  dtOptions: DataTables.Settings = {};
  ApprovalStatus: string = '';
  FileType: string = '';
  FileName: string = '';

  constructor(
    private alertService: ToastrService,
    private router: Router,
    public _gstfinancefileuploadService: GstfinancefileuploadService,
    private _PrivateutilityService: PrivateutilityService,
    private _authorizationGuard: AuthorizationGuard
  ) { }

  ngOnInit() {


    this._PrivateutilityService.GetValues('FinanceApproval')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstgstapproval = data;
          //
        },
        (err: any) => {
          //
          console.log(err);
        }
      );

    this._PrivateutilityService.GetValues('FinanceFileTypes')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstgstupload = data;
          //
        },
        (err: any) => {
          //
          console.log(err);
        }
      );

    this.onLoad(this.ApprovalStatus, this.FileType, this.FileName);
  }

  Search(): void {
    this.onLoad(this.ApprovalStatus, this.FileType, this.FileName);
  }

  Refresh(): void {
    this.ApprovalStatus = '';
    this.FileType = '';
    this.FileName = '';
  }

  confirmDeleteid(FileID: number, DeleteColumnvalue: string) {
    if (this._authorizationGuard.CheckAcess("Gstlist", "ViewEdit")) {
      return;
    }

    this.selectedDeleteId = + FileID;
    this.deleteColumn = DeleteColumnvalue;
    $('#modaldeleteconfimation').modal('show');
  }

  delete() {
    this._gstfinancefileuploadService.Delete(this.selectedDeleteId).subscribe(
      (data) => {
        if (data) {
          this.onLoad(this.ApprovalStatus, this.FileType, this.FileName);
          this.alertService.success('Gst data has been deleted successful');
        } else {
          this.alertService.error('Gst – ' + this.deleteColumn + ' is being used in the application, Can’t be deleted.!');
        }
        $('#modaldeleteconfimation').modal('hide');
      },
      (error: any) => {
        console.log(error);
      }
    );
  }


  downloadActualFile(downloadFilePath: string,
    fileName: string) {
    debugger
    this._gstfinancefileuploadService.downloadActualFile(downloadFilePath, fileName)
      .subscribe(data => {
        this.alertService.success('File Donloaded successfully');
        saveAs(data, fileName)
      },
        (err) => {
          //
          console.log(err);
        }
      );
  }

  onLoad(ApprovalStatus: string, FileType: string, FileName: string, ) {

    return this._gstfinancefileuploadService.Search(ApprovalStatus, FileType, FileName).subscribe(
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
  private items: Gstfinancefileupload[] = [] as any;
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
