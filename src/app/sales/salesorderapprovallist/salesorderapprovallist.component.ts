import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Salesorder } from '../../_services/model';
import { SalesorderService } from '../../_services/service/salesorder.service';
import { Router } from '@angular/router';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import * as moment from 'moment';

@Component({
  selector: 'app-salesorderapprovallist',
  templateUrl: './salesorderapprovallist.component.html',
  styleUrls: ['./salesorderapprovallist.component.css']
})
export class SalesorderapprovallistComponent implements OnInit {

  lst: Salesorder[];
  obj: Salesorder;

  dtOptions: DataTables.Settings = {};
  SearchBy: string;
  SearchKeyword: string;
  selectedDateRange: any;
  Searchranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  }
  InventoryType: boolean = true;
  constructor(
    private _spinner: NgxSpinnerService,
    private _salesorderService: SalesorderService,
    private _authorizationGuard: AuthorizationGuard,
    private router: Router,
  ) { }

  ngOnInit() {
    this.SearchBy = '';
    this.SearchKeyword = '';
    this.selectedDateRange = {
      startDate: moment().subtract(0, 'months').date(1),
      endDate: moment().subtract(1, 'days')
    };
    this.InventoryType = true;
    this.onLoad(this.SearchBy, this.SearchKeyword);
  }

  onLoad(SearchBy: string, Search: string) {
    let startdate: Date = this.selectedDateRange.startDate._d.toISOString().substring(0, 10);
    let enddate: Date = this.selectedDateRange.endDate._d.toISOString().substring(0, 10);
    this._spinner.show();
    this._salesorderService.search(SearchBy, Search, startdate, enddate).subscribe(
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
      (error) => {
        this._spinner.hide();
        console.log(error);
      }
    )
  }

  Search(): void { 
    this.onLoad(this.SearchBy, this.SearchKeyword);
  }

  onChange(range) {
    let startdate: string = range.startDate._d.toISOString().substring(0, 10);
    let enddate: string = range.endDate._d.toISOString().substring(0, 10);
  }

  Refresh(): void {
    this.SearchBy = '';
    this.SearchKeyword = '';
  }

  editButtonClick(id: number) {
    if (this._authorizationGuard.CheckAcess("Salesorderapprovallist", "ViewEdit")) {
      return;
    }
    this.router.navigate(['/Salesorderapproval', id]);
  }

}
