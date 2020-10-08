import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { PicklistService } from '../../_services/service/picklist.service';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { Picklistheader, Picklistsummary, Picklistdetail, JenniferItemSerials, StockAuditReport, StockAuditStatus } from '../../_services/model';

@Component({
  selector: 'app-stockaudit',
  templateUrl: './stockaudit.component.html',
  styleUrls: ['./stockaudit.component.css']
})
export class StockauditComponent implements OnInit {
  picklistForm: FormGroup;
  lstPicklistdetail: JenniferItemSerials[] = [] as any;
  objPicklistdetail: JenniferItemSerials = {} as any;
  panelTitle: string = 'PickList Detail';
  OrderID: string = '';
  LocationName: string = '';
  InventoryType: string = '';
  Status: string = '';
  identity: number = 0;
  JenniferItemSerial: string = '';
  Btnenable: boolean = false;
  PicklistQty: number = 0;
  CheckCountvalue: boolean = false;
  dtOptions: DataTables.Settings = {};
  constructor(private alertService: ToastrService,
    private router: Router,
    private _picklistService: PicklistService,
    private fb: FormBuilder,
    private _authorizationGuard: AuthorizationGuard,
    private aroute: ActivatedRoute,) { }


  refundForm: FormGroup;
  ngOnInit() {
    this.refundForm = this.fb.group({
      JenniferItemSerial1: ['', []],
    });
  }

  public onJenniferItemSerialChange(value): void {
    if (value != undefined && value != "") {
      if (this.lstPicklistdetail.filter(a => a.JenniferItemSerial == value).length > 0) {
        this.alertService.error("Jennifer Item Serial Number is already added in the Scanned list.!");
        return;
      }
      else {
        this.objPicklistdetail = new Picklistdetail();
        this.objPicklistdetail.JenniferItemSerial = value;
        this.lstPicklistdetail.push(this.objPicklistdetail);
        $('#JenniferItemSerial').val('');
        $('#JenniferItemSerial').focus();
        this.dtOptions = {
          "scrollY": "200px",
          "scrollCollapse": true,
          "paging": false,
          "ordering": false,
          "searching": false
        };
      }
    }
  }

  removeRow(index): void {
    this.lstPicklistdetail.splice(index, 1);
  }
  gridView_StockAuditReport: StockAuditReport[] = [] as any;
  Process(): void {
    if (this._authorizationGuard.CheckAcess("StockAudit", "ViewEdit")) {
      return;
    }
    if (this.lstPicklistdetail.filter(a => a.JenniferItemSerial != "").length == 0) {
      this.alertService.error('Required Jennifer Item Serial Numbers!');
      return;
    }
    else {
      this._picklistService.StockAuditCheck(this.lstPicklistdetail).subscribe(
        (data1: StockAuditReport[]) => {
          if (data1 != null) {
            this.gridView_StockAuditReport = data1;
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }
  ErrorMessage: string = '';
  gridView_StockAuditStatus: StockAuditStatus[] = [] as any;
  CheckStatus(): void {
    if (this._authorizationGuard.CheckAcess("StockAudit", "ViewEdit")) {
      return;
    }
    let JenniferItemSerial1 = this.refundForm.controls['JenniferItemSerial1'].value;
    if (JenniferItemSerial1 == '') {
      this.alertService.error('Required Jennifer Item Serial Number!');
      return;
    }
    else {
      this._picklistService.StockAuditCheckStatus(JenniferItemSerial1).subscribe(
        (data1: StockAuditStatus[]) => {
          if (data1 != null && data1.length > 0) {
            this.gridView_StockAuditStatus = data1;
            this.ErrorMessage = '';
          }
          else {
            this.ErrorMessage = 'Invalid Jennifer Serial Number';
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }
}
