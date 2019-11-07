import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { PicklistService } from '../../_services/service/picklist.service';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { Picklistheader, Picklistsummary, Picklistdetail } from '../../_services/model';

@Component({
  selector: 'app-picklist',
  templateUrl: './picklist.component.html',
  styleUrls: ['./picklist.component.css']
})
export class PicklistComponent implements OnInit {

  picklistForm: FormGroup;
  objPicklistheader: Picklistheader = {} as any;
  lstPicklistsummary: Picklistsummary[] = [] as any;
  lstPicklistdetail: Picklistdetail[] = [] as any;
  objPicklistdetail: Picklistdetail = {} as any;
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
  constructor(
    private alertService: ToastrService,
    private router: Router,
    private _picklistService: PicklistService,
    
    private _authorizationGuard: AuthorizationGuard,
    private aroute: ActivatedRoute,
  ) { }


  ngOnInit() {
    this.Btnenable = false;
    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
    });
    //
    return this._picklistService.searchById(this.identity).subscribe(
      (data) => {
        if (data != null) {
          this.OrderID = data.OrderID;
          this.LocationName = data.LocationName;
          this.InventoryType = data.InventoryType;
          this.identity = data.PickListNumber;
          this.PicklistQty = data.PicklistQty;
          this.objPicklistheader = data;

          //
          return this._picklistService.processSearchByID(this.objPicklistheader).subscribe(
            (data1) => {
              if (data1 != null) {
                this.lstPicklistsummary = data1.lstSummary;
                if (data1.lstSerialNums != null && data1.lstSerialNums.length > 0) {
                  this.Btnenable = true;
                  this.lstPicklistdetail = data1.lstSerialNums;
                  this.dtOptions = {
                    "scrollY": "200px",
                    "scrollCollapse": true,
                    "paging": false,
                    "ordering": false,
                    "searching": false
                  };
                }
              }
              //
            },
            (err) => {
              //
              console.log(err);
            }
          );
        }
        //
      },
      (err) => {
        //
        console.log(err);
      }
    );
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
        this.objPicklistdetail.Flag = false;
        this.lstPicklistdetail.push(this.objPicklistdetail);
        // this.JenniferItemSerial = '';
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

  CheckCount(): void {
    let scannedqty = this.lstPicklistdetail.length;
    if (scannedqty > this.PicklistQty) {
      this.CheckCountvalue = true;
    } else {
      this.CheckCountvalue = false;
    }
  }

  RemoveunwantedItems(): void {
    let scannedqty = this.lstPicklistdetail.length;
    if (scannedqty > this.PicklistQty) {
      let removeqty = scannedqty - this.PicklistQty;
      this.lstPicklistdetail.splice(removeqty, this.PicklistQty);
    }
  }

  Process(): void {
    if (this._authorizationGuard.CheckAcess("Picklistsearch", "ViewEdit")) {
      return;
    }
    let scannedqty = this.lstPicklistdetail.length;
    if (this.lstPicklistdetail.filter(a => a.JenniferItemSerial != "").length == 0) {
      this.alertService.error('Required Jennifer Item Serial Numbers!');
      return;
    }
    else if (scannedqty > this.PicklistQty) {
      this.alertService.error('Jennifer Item Serial Numbers scanned quantity is greater than Picklist Qty.Please remove some Numbers.!');
      return;
    }
    else { 
      this.objPicklistheader.PickListNumber = this.identity;
      this.objPicklistheader.lstSerialNums = this.lstPicklistdetail;
      //
      this._picklistService.process(this.objPicklistheader).subscribe(
        (data1) => {
          if (data1 != null) {
            this.lstPicklistdetail = data1.lstSerialNums;
            this.lstPicklistsummary = data1.lstSummary;
            this.Btnenable = true;
            this.dtOptions = {
              "scrollY": "200px",
              "scrollCollapse": true,
              "paging": false,
              "ordering": false,
              "searching": false
            };
          }
          this.CheckCount();
          //
        },
        (err) => {
          //
          console.log(err);
        }
      );
    }

  }

  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("Picklistsearch", "ViewEdit")) {
      return;
    }
    // stop here if form is invalid
    if (this.Status == undefined || this.Status == "") {
      this.alertService.error('Please select the status.!');
      return;
    }
    else if (this.lstPicklistdetail.filter(a => a.Flag == false).length > 0) {
      this.alertService.error('Invalid Jennifer Item Serial Numbers are scanned in the list.Please remove it!');
      return;
    }
    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
    });
    if (this.identity > 0) { 
      if (this.Status == "Draft") {
        this.SaveAsDraft();
      }
      else {
        this.SaveAsClose();
      }
    }

  }

  SaveAsDraft(): void {
    if (this.lstPicklistdetail.filter(a => a.JenniferItemSerial != "").length == 0) {
      this.alertService.error('Required Jennifer Item Serial Numbers!');
      return;
    }
    this.objPicklistheader.PickListNumber = this.identity;
    this.objPicklistheader.lstSerialNums = this.lstPicklistdetail;
    //
    this._picklistService.saveAsDraft(this.objPicklistheader).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          //
          this.alertService.success(data.Msg);
          this.router.navigate(['/Picklistsearch']);
        }
        else {
          //
          this.alertService.error(data.Msg);
          this.router.navigate(['/Picklistsearch']);
        }
        this.identity = 0;
      },
      (error: any) => {
        //
        console.log(error);
      }
    );
  }

  SaveAsClose(): void {
    this.objPicklistheader.PickListNumber = this.identity;
    this.objPicklistheader.lstSerialNums = this.lstPicklistdetail;
    //
    this._picklistService.saveAsClose(this.objPicklistheader).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          //
          this.alertService.success(data.Msg);
          this.router.navigate(['/Picklistsearch']);
        }
        else {
          //
          this.alertService.error(data.Msg);
          this.router.navigate(['/Picklistsearch']);
        }
        this.identity = 0;
      },
      (error: any) => {
        //
        console.log(error);
      }
    );
  }

}
