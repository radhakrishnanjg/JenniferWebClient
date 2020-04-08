import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { GstfinancefileuploadService } from '../../_services/service/gstfinancefileupload.service';
import { Dropdown, TallyProcess } from '../../_services/model';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { AuthorizationGuard } from '../../_guards/Authorizationguard';

import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
@Component({
  selector: 'app-tallyprocesslist',
  templateUrl: './tallyprocesslist.component.html',
  styleUrls: ['./tallyprocesslist.component.css']
})
export class TallyprocesslistComponent implements OnInit {

  catgoryForm: FormGroup;
  panelTitle: string;
  action: boolean;
  identity: number = 0;
  deleteColumn: string;
  dtOptions: DataTables.Settings = {};
  SearchBy: string = '';
  SearchKeyword: string = '';
  Searchaction: boolean = true;
  constructor(
    private alertService: ToastrService,
    private _GstfinancefileuploadService: GstfinancefileuploadService,

    private _authorizationGuard: AuthorizationGuard,
    private fb: FormBuilder,
    private _PrivateutilityService: PrivateutilityService,
  ) { }


  //#region Validation Start
  formErrors = {
    'TransactionType': '',
    'GSTMonth': '',
    'FromDate': '',
    'Todate': '',
  };

  // This object contains all the validation messages for this form
  validationMessages = {

    'TransactionType': {
      'required': 'This Field is required.',
    },

    'GSTMonth': {
      'required': 'This Field is required.',
    },

    'FromDate': {
      'required': 'This Field is required.',
    },

    'Todate': {
      'required': 'This Field is required.',
    },
  };

  logValidationErrors(group: FormGroup = this.catgoryForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
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
  //#endregion Validation End
  Year: number;
  Month: string;
  lstTallyTransactionType: Dropdown[] = [] as any;
  ngOnInit() {
    this.Year = (new Date()).getFullYear();
    var d = new Date();
    var month = new Array();
    month[0] = "Jan";
    month[1] = "Feb";
    month[2] = "Mar";
    month[3] = "Apr";
    month[4] = "May";
    month[5] = "Jun";
    month[6] = "Jul";
    month[7] = "Aug";
    month[8] = "Sept";
    month[9] = "Oct";
    month[10] = "Nov";
    month[11] = "Dec";
    // this.Month = month[d.getMonth() - 1];
    if (d.getMonth() == 0) {
      this.Month = month[11];
      this.Year = this.Year - 1;
    }
    else {
      this.Month = month[d.getMonth() - 1];
    }
    this._PrivateutilityService.GetValues('TallyTransactionType')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstTallyTransactionType = data;
        },
        (err: any) =>
          console.log(err)
      );


    this.SearchBy = '';
    this.SearchKeyword = '';
    this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
    //initial load
    this.panelTitle = 'New Process';
    this.action = true;
    this.identity = 0;
    this.catgoryForm = this.fb.group({
      TransactionType: ['', [Validators.required]],
      GSTMonth: ['', [Validators.required]],
      FromDate: ['', [Validators.required]],
      Todate: ['', [Validators.required]],
    });

    this.catgoryForm.patchValue({
      GSTMonth: this.Month + '-' + this.Year,
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

  newButtonClick() {
    if (this._authorizationGuard.CheckAcess("Tallyprocesslist", "ViewEdit")) {
      return;
    }
    $('#modalpopupcategoryupsert').modal('show');
    this.logValidationErrors();
    this.panelTitle = 'New Process';
    this.action = true;
    this.identity = 0;
    this.catgoryForm = this.fb.group({
      TransactionType: ['', [Validators.required]],
      GSTMonth: ['', [Validators.required]],
      FromDate: ['', [Validators.required]],
      Todate: ['', [Validators.required]],
    });

    this.catgoryForm.patchValue({
      GSTMonth: this.Month + '-' + this.Year,
    });
  }


  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("Tallyprocesslist", "ViewEdit")) {
      return;
    }
    // stop here if form is invalid
    if (this.catgoryForm.invalid) {
      return;
    }
    if (this.catgoryForm.controls['Todate'].value != null &&
      new Date(this.catgoryForm.controls['FromDate'].value) >=
      new Date(this.catgoryForm.controls['Todate'].value)) {
      this.alertService.error('The To Date must be greater than or equal to the From Date!');
      return;
    } 
    $('#modalpopupcategoryupsert').modal('hide');
    this.Insert();
  }
  objTallyProcess: TallyProcess = {} as any;
  Insert() {
    this.objTallyProcess.TransactionType = this.catgoryForm.controls['TransactionType'].value;
    this.objTallyProcess.GSTMonth = this.catgoryForm.controls['GSTMonth'].value;
    this.objTallyProcess.FromDate = this.catgoryForm.controls['FromDate'].value;
    this.objTallyProcess.Todate = this.catgoryForm.controls['Todate'].value;
    this._GstfinancefileuploadService.InsertTallyProcess(this.objTallyProcess).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.alertService.success(data.Msg);
        }
        else {
          this.alertService.error(data.Msg);
        }
        $('#modalpopupcategoryupsert').modal('hide');
        this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
        this.identity = 0;
      },
      (error: any) => {
        console.log(error);
      }
    );

  }

  public Download(BatchID: string): void {
    this.objTallyProcess.BatchID = BatchID;
    this._GstfinancefileuploadService.DownloadLTallyProcess(this.objTallyProcess)
      .subscribe(data => {
        if (data != null) {
          this._GstfinancefileuploadService.DownloadTallyFile(BatchID)
            .subscribe(data1 => {
              saveAs(data1, "BatchID_" + BatchID + '.xls');//+ '.xls'
              this.alertService.success("File downloaded succesfully.!");
            },
              (err) => {
                console.log(err);
              }
            );
        } else {
          this.alertService.error(data.Msg);
        }
      },
        (err) => {
          console.log(err);
        }
      );
  }
  onLoad(SearchBy: string, Search: string, IsActive: Boolean) {
    return this._GstfinancefileuploadService.SearchProcessedRecords(SearchBy, Search).subscribe(
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

  //#region Paging Sorting and Filtering Start
  public allowUnsort = false;
  public sort: SortDescriptor[] = [{
    field: 'TransactionType',
    dir: 'asc'
  }];
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  private items: TallyProcess[] = [] as any;
  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'TransactionType', operator: 'contains', value: '' }]
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
            field: 'TransactionType',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'StoreName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'GSTMonth',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'DateRange',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ProcessedBy',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ProcessedDate',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'RejectedReason',
            operator: 'contains',
            value: inputValue
          },
        ],
      }
    });
  }
  //#endregion Paging Sorting and Filtering End

}
