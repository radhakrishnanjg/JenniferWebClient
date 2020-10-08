import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { AuthorizationGuard } from '../../_guards/Authorizationguard';

import { Ticket, History, Dropdown } from '../../_services/model/index';
import { TicketService } from '../../_services/service/ticket.service';
import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';
import { PrivateutilityService } from '../../_services/service/privateutility.service';

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
    private fb: FormBuilder,
    private _ticketService: TicketService,
    private _PrivateutilityService: PrivateutilityService,

  ) {

  }

  formErrors = {

    'ModuleType': '',
    'Subject': '',
    'ReferenceNumber': '',
    'Query': '',

  };

  validationMessages = {

    'ModuleType': {
      'required': 'This field is required.',

    },
    'Subject': {
      'required': 'This field is required.',
    },

    'ReferenceNumber': {
      'required': 'This field is required.',
    },

    'Query': {
      'required': 'This field is required.',
    },

  };

  logValidationErrors(group: FormGroup = this.SupportQueryForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl && abstractControl.value && abstractControl.value.length > 0 && !abstractControl.value.replace(/^\s+|\s+$/gm, '').length) {
        abstractControl.setValue('');
      }
      this.formErrors[key] = '';
      if (abstractControl && !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty)) {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }
    });
  } 
  SupportForm: FormGroup;
  SupportQueryForm: FormGroup;
  ngOnInit() {

    this.SupportQueryForm = this.fb.group({
      ModuleType: ['', [Validators.required]],
      Subject: ['', [Validators.required]],
      ReferenceNumber: ['', [Validators.required],],
      Query: ['', [Validators.required],],

    });
    this.onLoad('', '', true);
    this.GetModuleType();
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

  lstModuleType: Dropdown[];
  GetModuleType() {
    this._PrivateutilityService.GetValues('ModuleType')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstModuleType = data;
        },
        (err: any) => {
          console.log(err);
        }
      );
  } 
  SaveData() {
    this.objTicket.Query = this.SupportQueryForm.controls['Query'].value;;
    this.objTicket.ModuleType = this.SupportQueryForm.controls['ModuleType'].value;;
    this.objTicket.Subject = this.SupportQueryForm.controls['Subject'].value;;
    this.objTicket.ReferenceNumber = this.SupportQueryForm.controls['ReferenceNumber'].value;;
    this.objTicket.SupportQueryID = 0;

    this._ticketService.insert(this.objTicket).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          $('#modalstatusconfimation').modal('hide');
          this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
          this.alertService.success(data.Msg);
        } else {
          this.alertService.error(data.Msg);
        }
      },
      (error: any) => {
        console.log(error);
      }
    );
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

  onLoad(SearchBy: string, Search: string, IsActive: Boolean) {
    return this._ticketService.search(SearchBy, Search).subscribe(
      (lst) => {
        if (lst != null) {
          this.items = lst;
          this.loadItems();
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  identity: number = 0;
  lstHistory: History[] = [] as any;
  lstcustomerMsg: History[] = [] as any;
  lstsupportMsg: History[] = [] as any;
  now: Date;
  SupportStatus: string;
  ModuleType: string;
  IsForwarded:boolean;
  editButtonClick(id: number) {
    this.now = new Date();
    this.identity = + id;
    this._ticketService.searchById(this.identity)

      .subscribe(
        (data) => {
          if (data != null && data.length > 0) {
            this.lstHistory = data;
            this.lstHistory = data;
            this.SupportStatus = data[0].SupportStatus;
            this.ModuleType = data[0].ModuleType;
            this.IsForwarded = data[0].IsForwarded;
            
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

  Save(buttonType) {
    if (buttonType === "Update") { 
      this.objTicket.Query = this.customerMsg;
      this.objTicket.SupportQueryID = this.identity;
      if (this.customerMsg.replace(/^\s+|\s+$/gm, '').length == 0) {
        this.alertService.error('Please enter a message');
        return;
      }
      if (this.customerMsg.length > 8000) {
        this.alertService.error('This field should not exceed 8000 characters.!');
        return;
      }
      else {
        this.objTicket.Action = "Update";
        this.objTicket.IsForwarded = false;
        this._ticketService.insert(this.objTicket).subscribe(
          (data) => {
            if (data != null && data.Flag == true) {
              this.alertService.success(data.Msg);
              this.onLoad('', '', true);
              this.customerMsg = '';
              $('#modalstatusconfimationUpdate').modal('hide');
            } else {
              this.alertService.error(data.Msg);
            }
          },
          (error: any) => {
            console.log(error);
          }
        );
      }
    }
    if (buttonType === "Forward") {
      console.log(buttonType);
      this.objTicket.Query = this.customerMsg;
      this.objTicket.SupportQueryID = this.identity;
      this.objTicket.IsForwarded = true;
      if (this.customerMsg.replace(/^\s+|\s+$/gm, '').length == 0) {
        this.alertService.error('Please enter a message');
        return;
      }
      if (this.customerMsg.length > 8000) {
        this.alertService.error('This field should not exceed 8000 characters.!');
        return;
      }
      else {
        this.objTicket.Action = "Forward";
        this._ticketService.insert(this.objTicket).subscribe(
          (data) => {
            if (data != null && data.Flag == true) {
              this.alertService.success(data.Msg);
              this.onLoad('', '', true);
              this.customerMsg = '';
              $('#modalstatusconfimationUpdate').modal('hide');
            } else {
              this.alertService.error(data.Msg);
            }
          },
          (error: any) => {
            console.log(error);
          }
        );
      }
    }
    if (buttonType === "Close") {
      console.log(buttonType);
      this.objTicket.Action = "Close";
      this._ticketService.closeTicket(this.identity).subscribe(
        (data) => {
          if (data != null && data.Flag == true) {
            $('#modalstatusconfimationUpdate').modal('hide');
            this.alertService.success(data.Msg);
            this.onLoad('', '', true);
          } else {
            this.alertService.error(data.Msg);
          }
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  }



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
