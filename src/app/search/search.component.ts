import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SearchService } from '../_services/service/search.service';
import { Search } from '../_services/model';
import { AuthorizationGuard } from '../_guards/Authorizationguard'
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  //@Input() SearchBy: string;
  lst: Search[] = [];
  totalrows: number;
  SearchBy: string = '';
  constructor(
    private _router: Router,
    private _searchService: SearchService,
    private _spinner: NgxSpinnerService,
    private _authorizationGuard: AuthorizationGuard,
    private aroute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.onLoad();
  }

  onLoad() {
    this.aroute.paramMap.subscribe(params => {
      this.SearchBy = params.get('key');
      this._spinner.show();
      return this._searchService.search(this.SearchBy).subscribe(
        (data) => {
          this.lst = data;
          this.totalrows = this.lst.length;
          this._spinner.hide();
        },

        (err) => {
          this._spinner.hide();
          console.log(err);
        }
      );
    });
  }


  navigate(ScreenType: string, uniqueID1: number, uniqueID2: number) {
    if (ScreenType == 'PO') {
      if (this._authorizationGuard.CheckAcess("Polist", "ViewEdit")) {
        return;
      }
      this._router.navigate(['POview', uniqueID1]);
    }
    else if (ScreenType == 'SHIP') {
      if (this._authorizationGuard.CheckAcess("Poshipmentlist", "ViewEdit")) {
        return;
      }
      this._router.navigate(['Poshipmentview', uniqueID2, uniqueID1]);
    }
    else if (ScreenType == 'GRN') {
      if (this._authorizationGuard.CheckAcess("Goodsreceiptlist", "ViewEdit")) {
        return;
      }
      this._router.navigate(['Goodsreceiptview', uniqueID1]);
    }
    else if (ScreenType == 'SO') {
      if (this._authorizationGuard.CheckAcess("Salesorderlist", "ViewEdit")) {
        return;
      }
      this._router.navigate(['Salesorderview', uniqueID1]);
    }
  }

}
