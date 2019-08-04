import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DownloadService } from  '../../_services/service/download.service';
import { Download, DownloadMaster, DownloadDetail } from  '../../_services/model';
import { AuthorizationGuard } from  '../../_guards/Authorizationguard'

@Component({
  selector: 'app-reportmasterlist',
  templateUrl: './reportmasterlist.component.html',
  styleUrls: ['./reportmasterlist.component.css']
})
export class ReportmasterlistComponent implements OnInit {
  lst: DownloadMaster[];
  obj: DownloadMaster;

  selectedDeleteId: number; 
  dtOptions: DataTables.Settings = {};
  deleteColumn: string;
  SearchBy: string = '';
  SearchKeyword: string = '';
  Searchaction: boolean = true;
  constructor(
    private alertService: ToastrService,
    private router: Router,
    private _downloadService: DownloadService,
    private _spinner: NgxSpinnerService,
    private _authorizationGuard: AuthorizationGuard
  ) { }

  ngOnInit() {
    this.SearchBy = '';
    this.SearchKeyword = '';
    this.Searchaction = true; 

    this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
  }

  onLoad(SearchBy: string, Search: string, IsActive: boolean) { 
    this._spinner.show();
    return this._downloadService.search(SearchBy, Search, IsActive).subscribe(
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
    this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
  }

  Refresh(): void {
    this.SearchBy = '';
    this.SearchKeyword = '';
    this.Searchaction = true;
  }

  confirmDeleteid(id: number, DeleteColumnvalue: string) {
    if (this._authorizationGuard.CheckAcess("Reportmasterlist", "ViewEdit")) {
      return;
    }

    this.selectedDeleteId = + id; 
    this.deleteColumn = DeleteColumnvalue;
    $('#modaldeleteconfimation').modal('show');
  }

  delete() {
    this._spinner.show();
    this._downloadService.delete(this.selectedDeleteId).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
          this.alertService.success(data.Msg);
        } else {
          this.alertService.error(data.Msg);
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

  viewButtonClick(id: number) {
    if (this._authorizationGuard.CheckAcess("Reportmasterlist", "ViewEdit")) {
      return;
    }
    this.router.navigate(['/Reportmaster', id]);
  }
}
