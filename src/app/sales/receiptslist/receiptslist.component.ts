import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ReceiptsService } from '../../_services/service/receipts.service';
import { Receipts } from '../../_services/model';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'

import * as moment from 'moment';
import { FormGroup, FormControl, Validators } from '@angular/forms';

const createFormGroup = dataItem => new FormGroup({
  'FileID': new FormControl(dataItem.FileID),
  'Filename': new FormControl(dataItem.Filename),
  'BankUTRNumber': new FormControl(dataItem.BankUTRNumber),
  'BankReceiptDate': new FormControl(dataItem.BankReceiptDate,
    //[Validators.pattern("/^((0|1)\d{1})-((0|1|2)\d{1})-((19|20)\d{2})/g")]
  ),
  'NoOfRecords': new FormControl(dataItem.NoOfRecords),
  'AmountAsPerFile': new FormControl(dataItem.AmountAsPerFile),
  'TotalAmt': new FormControl(dataItem.TotalAmt),
  'IsEditable': new FormControl(dataItem.IsEditable)
});

@Component({
  selector: 'app-receiptslist',
  templateUrl: './receiptslist.component.html',
  styleUrls: ['./receiptslist.component.css']
})
export class ReceiptslistComponent implements OnInit {

  //#region variable declartion

  lst: Receipts[];
  obj: Receipts;
  gridDataunreconciled: Receipts[];
  gridDatareconciled: Receipts[];
  public itemFormGroup: FormGroup;
  private editedRowIndex: number;
  selectedRowIndex: number = -1;

  dtOptions: DataTables.Settings = {};
  Searchaction: boolean = true;
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
    private _receiptsService: ReceiptsService,
    private _spinner: NgxSpinnerService,
    private _authorizationGuard: AuthorizationGuard,
  ) { }

  ngOnInit() {
    this.selectedDateRange = {
      startDate: moment().subtract(0, 'months').date(1),
      endDate: moment().subtract(1, 'days')
    };

    this.onLoad();
  }

  onLoad() {
    let startdate: Date = this.selectedDateRange.startDate._d.toISOString().substring(0, 10);
    let enddate: Date = this.selectedDateRange.endDate._d.toISOString().substring(0, 10);
    this._spinner.show();
    return this._receiptsService.search(startdate, enddate).subscribe(
      (data) => {
        this.lst = data;
        if (data != null) {
          this.gridDataunreconciled = data.filter(a => a.SearchType == 'UR');
          this.gridDataunreconciled = this.gridDataunreconciled.map(item => {
            item.BankReceiptDate = new Date(item.BankReceiptDate);
            return item;
          });
          this.gridDatareconciled = data.filter(a => a.SearchType == 'R');
          this.gridDatareconciled = this.gridDatareconciled.map(item => {
            item.BankReceiptDate = new Date(item.BankReceiptDate);
            return item;
          });
        }  
        this._spinner.hide();
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
    this.onLoad();
  }

  Refresh(): void {
    this.selectedDateRange = {
      startDate: moment().subtract(0, 'months').date(1),
      endDate: moment().subtract(1, 'days')
    };
  }

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    this.itemFormGroup = createFormGroup(dataItem);
    this.selectedRowIndex = rowIndex;
    this.obj.FileID = dataItem.FileID;
    sender.editRow(rowIndex, this.itemFormGroup);
  }

  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.itemFormGroup = undefined;
    this.obj = new Receipts();
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    const item = formGroup.value;
    this.obj.FileID = item.FileID;
    if (item.IsEditable == null || item.IsEditable == false) {
      this.alertService.error('You cannot edit this value');
      return;
    };
    if (item.BankUTRNumber.replace(/\s/g, '').length == 0) {
      this.alertService.error('Please enter the UTR Number');
      return;
    }
    if (item.BankUTRNumber == null || item.BankUTRNumber == '') {
      this.alertService.error('Please enter the UTR Number');
      return;
    };
    if (item.BankReceiptDate == null || item.BankReceiptDate == '') {
      this.alertService.error('Please enter the Receipt Date');
      return;
    };
    this.obj.BankUTRNumber = item.BankUTRNumber;
    this.obj.BankReceiptDate = item.BankReceiptDate;
    if (isNew) {
      //this.objSalesOrder.lstItem.splice(0, 0, this.objSalesorderItem);
    }
    else {
      let selectedItem = this.gridDataunreconciled[rowIndex];
      Object.assign(
        this.gridDataunreconciled.find(({ FileID }) => FileID === selectedItem.FileID),
        this.obj
      );
      this._spinner.show();
      this._receiptsService.Update(this.obj).subscribe(
        (data) => {
          if (data && data.Flag == true) {
            this.alertService.success(data.Msg);
            let selectedItem = this.gridDataunreconciled[rowIndex];
            Object.assign(
              this.gridDataunreconciled.find(({ FileID }) => FileID === selectedItem.FileID),
              this.obj,

            );
            this.gridDataunreconciled.splice(rowIndex, 1);
            this.gridDatareconciled.push(selectedItem); 
            this.obj = new Receipts();
            sender.closeRow(rowIndex);
          }
          else {
            this.alertService.error(data.Msg);
          }
          this._spinner.hide();
        },
        (error: any) => {
          this._spinner.hide();
          console.log(error);
        }
      );
    }

  }

  public saveHandler2({ sender, rowIndex, formGroup, isNew }): void {
    const item = formGroup.value;
    this.obj.FileID = item.FileID;
    if (item.IsEditable == null || item.IsEditable == false) {
      this.alertService.error('You cannot edit this value');
      return;
    };
    if (item.BankUTRNumber.replace(/\s/g, '').length == 0) {
      this.alertService.error('Please enter the UTR Number');
      return;
    }
    if (item.BankUTRNumber == null || item.BankUTRNumber == '') {
      this.alertService.error('Please enter the UTR Number');
      return;
    };
    if (item.BankReceiptDate == null || item.BankReceiptDate == '') {
      this.alertService.error('Please enter the Receipt Date');
      return;
    };
    this.obj.BankUTRNumber = item.BankUTRNumber;
    this.obj.BankReceiptDate = item.BankReceiptDate;
    if (isNew) {
      //this.objSalesOrder.lstItem.splice(0, 0, this.objSalesorderItem);
    }
    else {
      let selectedItem = this.gridDatareconciled[rowIndex];
      Object.assign(
        this.gridDatareconciled.find(({ FileID }) => FileID === selectedItem.FileID),
        this.obj
      );
      this._spinner.show();
      this._receiptsService.Update(this.obj).subscribe(
        (data) => {
          if (data && data.Flag == true) {
            this.alertService.success(data.Msg);
            let selectedItem = this.gridDatareconciled[rowIndex];
            Object.assign(
              this.gridDatareconciled.find(({ FileID }) => FileID === selectedItem.FileID),
              this.obj
            );
            this.obj = new Receipts();
            sender.closeRow(rowIndex);
          }
          else {
            this.alertService.error(data.Msg);
          }
          this._spinner.hide();
        },
        (error: any) => {
          this._spinner.hide();
          console.log(error);
        }
      );
    }

  }

}