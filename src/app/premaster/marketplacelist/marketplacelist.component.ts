import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UsernameValidator } from '../../_validators/username';
import { MarketplaceService } from '../../_services/service/marketplace.service';
import { Marketplace } from '../../_services/model';
import { AuthorizationGuard } from '../../_guards/Authorizationguard';
import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
@Component({
  selector: 'app-marketplacelist',
  templateUrl: './marketplacelist.component.html',
  styleUrls: ['./marketplacelist.component.css']
})
export class MarketplacelistComponent implements OnInit {
 
  objMarketplace: Marketplace = {} as any;
  marketplaceForm: FormGroup;
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
    private _usernameValidator: UsernameValidator,
    private _marketplaceService: MarketplaceService,
    private _spinner: NgxSpinnerService,
    private _authorizationGuard: AuthorizationGuard,
    private fb: FormBuilder,
  ) { }

  //#region Validation Start
  formErrors = {
    'MarketPlace': '',
  };

  // This object contains all the validation messages for this form
  validationMessages = {
    'MarketPlace': {
      'required': 'This Field is required.',
      'maxlength': 'This Field must be less than or equal to 20 characters.',
      'pattern': 'This Field must be a Alphabet.',
      'MarketPlaceInUse': 'This Marketplace is already registered!'
    },
  };

  logValidationErrors(group: FormGroup = this.marketplaceForm): void {
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
  //#endregion Validation End


  ngOnInit() {



    this.SearchBy = '';
    this.SearchKeyword = '';
    this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);

    this.marketplaceForm = this.fb.group({
      MarketPlace: ['', [Validators.required, Validators.maxLength(20)]
        , this._usernameValidator.existMarketPlace(this.identity)
      ],
      IsActive: [0,],
    });
    this.panelTitle = "Add New Marketplace";
    this.action = true;
    this.identity = 0;
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
    if (this._authorizationGuard.CheckAcess("Marketplacelist", "ViewEdit")) {
      return;
    }
    $('#modalpopupbrandupsert').modal('show');
    this.logValidationErrors();
    this.panelTitle = "Add New Marketplace";
    this.action = true;
    this.identity = 0;

    this.marketplaceForm = this.fb.group({
      MarketPlace: ['', [Validators.required, Validators.maxLength(20)]
        , this._usernameValidator.existMarketPlace(this.identity)
      ],
      IsActive: [0,],
    });
    this.marketplaceForm.patchValue({
      MarketPlace: '',
      IsActive: '',
    });
  }

  editButtonClick(id: number) {
    if (this._authorizationGuard.CheckAcess("Marketplacelist", "ViewEdit")) {
      return;
    }

    this.panelTitle = "Edit Marketplace";
    this.action = false;
    this.identity = + id;

    this.marketplaceForm = this.fb.group({
      MarketPlace: ['', [Validators.required, Validators.maxLength(20)]
        , this._usernameValidator.existMarketPlace(this.identity)
      ],
      IsActive: [0,],
    });
    this._marketplaceService.searchById(this.identity)
      .subscribe(
        (data: Marketplace) => {
          this.marketplaceForm.patchValue({
            MarketPlace: data.MarketPlace,
            IsActive: data.IsActive,
          });
          this.logValidationErrors();
        },
        (err: any) =>
          console.log(err)
      );
    $('#modalpopupbrandupsert').modal('show');
  }

  confirmDeleteid(id: number, DeleteColumnvalue: string) {
    if (this._authorizationGuard.CheckAcess("Marketplacelist", "ViewEdit")) {
      return;
    }
    this.identity = + id;
    this.deleteColumn = DeleteColumnvalue;
    $('#modaldeleteconfimation').modal('show');
  }

  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("Marketplacelist", "ViewEdit")) {
      return;
    }
    // stop here if form is invalid
    if (this.marketplaceForm.invalid) {
      return;
    }
    if (this.marketplaceForm.pristine) {
      this.alertService.error('Please change the value for any one control to proceed further!');
      return;
    }
    if (this.identity > 0) {
      this.Update();
    }
    else {
      this.Insert();
    }
  }

  Insert() {
    this.objMarketplace.MarketPlace = this.marketplaceForm.controls['MarketPlace'].value;;
    this.objMarketplace.IsActive = this.marketplaceForm.controls['IsActive'].value;

    this._spinner.show();
    this._marketplaceService.add(this.objMarketplace).subscribe(
      (data) => {
        if (data != null && data == true) {
          this._spinner.hide();
          this.alertService.success('Marketplace data has been added successfully');
        }
        else {
          this._spinner.hide();
          this.alertService.error('Marketplace creation failed!');
        }
        $('#modalpopupbrandupsert').modal('hide');
        this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
        this.identity = 0;
      },
      (error: any) => {
        this._spinner.hide();
        console.log(error);
      }
    );


  }

  Update() {
    this.objMarketplace.MarketplaceID = this.identity;
    this.objMarketplace.MarketPlace = this.marketplaceForm.controls['MarketPlace'].value;
    this.objMarketplace.IsActive = this.marketplaceForm.controls['IsActive'].value;

    this._spinner.show();
    this._marketplaceService.update(this.objMarketplace).subscribe(
      (data) => {
        if (data != null && data == true) {
          this._spinner.hide();
          this.alertService.success('Marketplace data has been updated successful');
        }
        else {
          this._spinner.hide();
          this.alertService.error('Marketplace not saved!');
        }
        $('#modalpopupbrandupsert').modal('hide');
        this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
        this.identity = 0;
      },
      (error: any) => {
        this._spinner.hide();
        console.log(error);
      }
    );

  }

  delete() {
    this._spinner.show();
    this._marketplaceService.delete(this.identity).subscribe(
      (data) => {
        if (data) {
          this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
          this.alertService.success('Marketplace data has been deleted successful');
        } else {
          this.alertService.error('Marketplace – ' + this.deleteColumn + ' is being used in the application, Can’t be deleted.!');
        }
        $('#modaldeleteconfimation').modal('hide');
        this.identity = 0;
        this._spinner.hide();
      },
      (error: any) => {
        this._spinner.hide();
        console.log(error);
      }
    );
  }

  onLoad(SearchBy: string, Search: string, IsActive: Boolean) {
    this._spinner.show();
    return this._marketplaceService.search(SearchBy, Search, IsActive).subscribe(
      (data) => {
        if (data != null) { 
          this.items = data;
          this.loadItems(); 
        }
        this._spinner.hide();
      },
      (err) => {
        this._spinner.hide();
        console.log(err);
      }
    );
  }

    //#region Paging Sorting and Filtering Start
    public allowUnsort = true;
    public sort: SortDescriptor[] = [{
      field: 'MarketPlace',
      dir: 'asc'
    }];
    public gridView: GridDataResult;
    public pageSize = 10;
    public skip = 0;
    private data: Object[];
    private items: Marketplace[] = [] as any;
    public state: State = {
      skip: 0,
      take: 5,
  
      // Initial filter descriptor
      filter: {
        logic: 'and',
        filters: [{ field: 'MarketPlace', operator: 'contains', value: '' }]
      }
    };
    public pageChange(event: PageChangeEvent): void {
      this.skip = event.skip;
      this.loadItems();
    }
  
    public sortChange(sort: SortDescriptor[]): void {
      this.sort = sort;
      this.loadSortItems();
    }
  
    private loadItems(): void {
      this.gridView = {
        data: this.items.slice(this.skip, this.skip + this.pageSize),
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
  
  
    //#endregion Paging Sorting and Filtering End
  
}
