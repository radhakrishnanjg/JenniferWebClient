import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { GoodsDisputeService } from '../../_services/service/goods-dispute.service';
import { Goodsdispute } from '../../_services/model';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'

@Component({
  selector: 'app-goods-dispute-list',
  templateUrl: './goods-dispute-list.component.html',
  styleUrls: ['./goods-dispute-list.component.css']
})
export class GoodsDisputeListComponent implements OnInit {
  //#region variable declartion

  lst: Goodsdispute[];
  obj: Goodsdispute;
  dtOptions: DataTables.Settings = {};
  SearchBy: string = '';
  SearchKeyword: string = '';
  //#endregion

  constructor(
    private alertService: ToastrService,
    private router: Router,
    private _goodsDisputeService: GoodsDisputeService,
    private _spinner: NgxSpinnerService,
    private _authorizationGuard: AuthorizationGuard
  ) { }

  ngOnInit() {
    this.onLoad('', '');
  }

  onLoad(SearchBy: string, Search: string) {

    this._spinner.show();
    return this._goodsDisputeService.search(SearchBy, Search).subscribe(
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
    this.SearchBy = '',
      this.SearchKeyword = ''
  }

  editButtonClick(id: number) {
    if (this._authorizationGuard.CheckAcess("Goodsdisputelist", "ViewEdit")) {
      return;
    }
    this.router.navigate(['/Goodsdisputeview', id]);
  }

}
