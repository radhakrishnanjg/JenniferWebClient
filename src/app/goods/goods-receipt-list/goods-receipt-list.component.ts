import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import * as moment from 'moment';
import { GoodsReceipt } from '../../_services/model/goodsreceipt.model';
import { GoodsReceiptService } from '../../_services/service/goods-receipt.service';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-goods-receipt-list',
  templateUrl: './goods-receipt-list.component.html',
  styleUrls: ['./goods-receipt-list.component.css']
})
export class GoodsReceiptListComponent implements OnInit {
  lstGoodsReceipt: GoodsReceipt[];
  obj: GoodsReceipt;
  identity: number = 0;
  deleteColumn: string;
  selectedDeleteId: number;
  dtOptions: DataTables.Settings = {};
  SearchBy: string = '';
  SearchKeyword: string = '';
  selectedDateRange: any;
  Searchranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  }
  //#endregion

  constructor(
    private alertService: ToastrService,
    private router: Router,
    private _goodsReceiptService: GoodsReceiptService,
    private _spinner: NgxSpinnerService,
    private _authorizationGuard: AuthorizationGuard
  ) { }

  ngOnInit() {

    this.SearchBy = '';
    this.SearchKeyword = '';
    this.selectedDateRange = {
      startDate: moment().subtract(0, 'months').date(1),
      endDate: moment().subtract(1, 'days')
    };

    this.onLoad(this.SearchBy, this.SearchKeyword);

  }

  onLoad(SearchBy: string, Search: string) {
    let startdate: Date = this.selectedDateRange.startDate._d.toISOString().substring(0, 10);
    let enddate: Date = this.selectedDateRange.endDate._d.toISOString().substring(0, 10);
    this._spinner.show();
    this._goodsReceiptService.search(SearchBy, Search, startdate, enddate).subscribe(
      (data) => {
        this.lstGoodsReceipt = data;
        this.dtOptions = {
          pagingType: 'full_numbers',
          "language": {
            "search": 'Filter',
          },
        };
        this._spinner.hide();
        //$('.modal-backdrop').removeClass('in');
      },
      (err) => {
        this._spinner.hide();
        console.log(err);
      }
    );
  }

  onChange(range) {
    let startdate: string = range.startDate._d.toISOString().substring(0, 10);
    let enddate: string = range.endDate._d.toISOString().substring(0, 10);
  }

  Search(): void {
    this.onLoad(this.SearchBy, this.SearchKeyword);
  }

  Refresh(): void {
    this.SearchBy = '';
    this.SearchKeyword = '';
  }

  editButtonClick(id: number) {
    if (this._authorizationGuard.CheckAcess("Goodsreceiptlist", "ViewEdit")) {
      return;
    }
    this.router.navigate(['/Goodsreceipt', id]);
  }

  viewButtonClick(id: number) {
    if (this._authorizationGuard.CheckAcess("Goodsreceiptlist", "ViewEdit")) {
      return;
    }
    this.router.navigate(['/Goodsreceiptview', id]);
  }

  confirmDeleteid(id: number, DeleteColumnvalue: string) {
    if (this._authorizationGuard.CheckAcess("Goodsreceiptlist", "ViewEdit")) {
      return;
    }
    this.identity = + id;
    this.deleteColumn = DeleteColumnvalue;
    $('#modaldeleteconfimation').modal('show');
  }

  delete() {
    this._spinner.show();
    this._goodsReceiptService.Delete(this.identity).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.onLoad(this.SearchBy, this.SearchKeyword);
          this.alertService.success(data.Msg);
        } else {
          this.alertService.error(data.Msg);
        }
        $('#modaldeleteconfimation').modal('hide');
        this.identity = 0;
        this._spinner.hide();
      },
      (error: any) => {
        this._spinner.hide();
        console.log(error);
      }
    );
  }

  DownloadButtonClick(GRNNumber: string) {
    if (GRNNumber != "") {
      this._spinner.show();
      this._goodsReceiptService.DownloadLabels(GRNNumber)
        .subscribe(data => {
          this.alertService.success("File downloaded succesfully.!");
          this._spinner.hide(),
            saveAs(data, GRNNumber + '.zip')
        },
          (err) => {
            this._spinner.hide();
            console.log(err);
          }
        );
    } else {
    }
  }

}
