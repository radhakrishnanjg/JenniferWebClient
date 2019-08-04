import { Component, OnInit, ViewChild } from '@angular/core';
import {NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {Observable, Subject, merge} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { GoodsinwardService } from  '../../_services/service/goodsinward.service';
import { PrivateutilityService } from  '../../_services/service/privateutility.service';
import { Goodsinward } from  '../../_services/model';
import { AuthorizationGuard } from  '../../_guards/Authorizationguard'

@Component({
  selector: 'app-goodsinwardlist',
  templateUrl: './goodsinwardlist.component.html',
  styleUrls: ['./goodsinwardlist.component.css']
})
export class GoodsinwardlistComponent implements OnInit {


  lst: Goodsinward[];
  obj: Goodsinward;
  InwardGRNNumbers: string[]=[];  
  dtOptions: DataTables.Settings = {}; 
  selectedDeleteId: number;
  identity: number = 0;
  deleteColumn:string ='';
  SearchBy: string = '';
  SearchKeyword: string = '';

  constructor(
    private alertService: ToastrService,
    private router: Router,
    private _goodsinwardService: GoodsinwardService,
    private _privateUtilityService: PrivateutilityService,
    private _spinner: NgxSpinnerService,
    private _authorizationGuard: AuthorizationGuard
  ) { }

  ngOnInit() {
    this.onLoad('', '');
  }

  onLoad(SearchBy: string, Search: string) {

    this._spinner.show();
    return this._goodsinwardService.search(SearchBy, Search).subscribe(
      (data) => {
        this.lst = data;
        this.dtOptions = {
          pagingType: 'full_numbers',
          "language": {
            "search":'Filter',
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
    this.SearchBy = '',
    this.SearchKeyword = '' 
  }
  confirmDeleteid(id: number, DeleteColumnValue: string) {
    
    if (this._authorizationGuard.CheckAcess("Shipmentoutwardlist", "ViewEdit")) {
      return;
    } 
    this.selectedDeleteId = + id;
    this.deleteColumn = DeleteColumnValue;
    $('#modaldeleteconfimation').modal('show');
  }

  delete() {
    this._spinner.show();
    this._goodsinwardService.delete(this.selectedDeleteId).subscribe(
      (data) => {
        if (data) {
          this.onLoad(this.SearchBy, this.SearchKeyword);
          this.alertService.success('Goods Inward data has been deleted successfully');
        }
        else {
          this.alertService.error('Goods Inward - ' + this.deleteColumn + ' is being used in the application, Can’t be deleted.!');
        }
        $('#modaldeleteconfimation').modal('hide');
        this._spinner.hide();
      },
      (error: any) => {
        this._spinner.hide();
        console.log(error);
      }
    )
  }
}
