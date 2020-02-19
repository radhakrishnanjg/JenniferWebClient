import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { AuthorizationGuard } from '../../_guards/Authorizationguard';

import { Ticket, History } from '../../_services/model/index';
import { TicketService } from '../../_services/service/ticket.service';
import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-supporthistory',
  templateUrl: './supporthistory.component.html',
  styleUrls: ['./supporthistory.component.css']
})
export class SupporthistoryComponent implements OnInit {
  lst: Ticket[];
  obj: Ticket;

  SearchBy: string = '';
  SearchKeyword: string = '';
  Searchaction: boolean = true;

  constructor(
    private alertService: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    private _ticketService: TicketService,
    private _authorizationGuard: AuthorizationGuard

  ) {

  }

  SupportForm: FormGroup;
  ngOnInit() {
    this.onLoad('', '', true);

    this.GetUserType();
    this.SupportForm = this.fb.group({      
      Query: ['', []],
    });
  }

  Search(): void {
    this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
  }

  Refresh(): void {
    this.SearchBy = '';
    this.SearchKeyword = '';
    this.Searchaction = true;
  }

  userType: string;
  GetUserType() {
    this._ticketService.getUserType()
      .subscribe(
        (data) => {
          this.userType = data.UserType;
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  // editButtonClick(HelpMenuID: number) {
  //   if (this._authorizationGuard.CheckAcess("Helpmenulist", "ViewEdit")) {
  //     return;
  //   }
  //   this.router.navigate(['/Helpmenu', HelpMenuID]);
  // }

  onLoad(SearchBy: string, Search: string, IsActive: Boolean) {
    //
    return this._ticketService.search(SearchBy, Search).subscribe(
      (lst) => {
        if (lst != null) {
          this.items = lst;
          this.loadItems();
        }
      },
      (err) => {
        //
        console.log(err);
      }
    );
  }

  identity: number = 0;
  lstHistory: History[] = [] as any;
  lstcustomerMsg: History[] = [] as any;
  lstsupportMsg: History[] = [] as any;
  now :Date;
  SupportStatus: string;
  editButtonClick(id: number) {
    // if (this._authorizationGuard.CheckAcess("Brandlist", "ViewEdit")) {
    //   return;
    // }

    this.now = new Date();
    this.identity = + id;
    this._ticketService.searchById(this.identity)

      .subscribe(
        (data) => {
          if (data != null && data.length > 0) {
            this.lstHistory = data;
            // this.lstcustomerMsg = this.lstHistory.filter(a => a.UserType == 'C');
            // this.lstsupportMsg = this.lstHistory.filter(a => a.UserType == 'S');
            this.lstHistory = data;
            this.SupportStatus = data[0].SupportStatus;
          }
        },
        (err: any) => {
          console.log(err)
        }
      );

    this.customerMsg = '';
    $('#modalstatusconfimationUpdate').modal('show');
  }

  objTicket: Ticket = {} as any;
  customerMsg: string = '';
  Update() {
    this.objTicket.Query = this.customerMsg;
    this.objTicket.SupportQueryID = this.identity;
    if (this.customerMsg.replace(/^\s+|\s+$/gm, '').length == 0) {
      this.alertService.error('Please enter a message');
      return;
    }
    if(this.customerMsg.length > 8000) {
      this.alertService.error('This field should not exceed 8000 characters.!');
      return;
    }
    else {
      this._ticketService.insert(this.objTicket).subscribe(
        (data) => {
          if (data != null && data.Flag == true) {
            this.alertService.success(data.Msg);
          } else { 
            this.alertService.error(data.Msg);
          }
          this.onLoad('', '', true);
          this.customerMsg = '';
          $('#modalstatusconfimationUpdate').modal('hide');
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  }

  onClickCloseTicket() {   
    this._ticketService.closeTicket(this.identity).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.router.navigate(['/Supporthistory']);
          this.alertService.success(data.Msg);
          this.onLoad('', '', true);
        } else {
          this.router.navigate(['/Supporthistory']);
          this.alertService.error(data.Msg);
          this.onLoad('', '', true);
        }
        $('#modalstatusconfimationUpdate').modal('hide'); 
      },
      (error: any) => {
        //
        console.log(error);
      }
    );
  }


  // AddNewLink() {
  //   if (this._authorizationGuard.CheckAcess("Helpmenulist", "ViewEdit")) {
  //     return;
  //   }
  //   this.router.navigate(['/Helpmenu/Create',]);
  // }

  //#region Paging Sorting and Filtering Start
  public allowUnsort = false;
  public sort: SortDescriptor[] = [{
    field: 'ModuleType',
    dir: 'asc'
  }];
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  private items: Ticket[] = [] as any;
  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'ModuleType', operator: 'contains', value: '' }]
    }
  };
  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
    this.loadItems();
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.loadSortItems();
  }

  private loadItems(): void {
    this.gridView = {
      data: orderBy(this.items, this.sort).slice(this.skip, this.skip + this.pageSize),
      total: this.items.length
    };
  }
  private loadSortItems(): void {
    this.gridView = {
      data: orderBy(this.items, this.sort).slice(this.skip, this.skip + this.pageSize),
      total: this.items.length
    };
  }
  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.gridView = process(this.items, this.state);
  }

  public onFilter(inputValue: string): void {
    this.gridView = process(this.items.slice(this.skip, this.skip + this.pageSize), {
      skip: this.skip,
      take: this.skip + this.pageSize,
      filter: {
        logic: "or",
        filters: [
          {
            field: 'ModuleType',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'SupportNumber',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'Subject',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ReferenceNumber',
            operator: 'contains',
            value: inputValue
          },

        ],
      }
    });
  }
  //#endregion Paging Sorting and Filtering End
}
