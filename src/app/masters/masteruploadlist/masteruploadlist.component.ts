import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MasteruploadService } from '../../_services/service/masterupload.service';
import { MasterUpload } from '../../_services/model';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-masteruploadlist',
  templateUrl: './masteruploadlist.component.html',
  styleUrls: ['./masteruploadlist.component.css']
})
export class MasteruploadlistComponent implements OnInit {

  lst: MasterUpload[];
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

  onLoad(SearchBy: string, Search: string) {

    this._spinner.show();
    return this._masteruploadService.search(SearchBy, Search).subscribe(
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


}
