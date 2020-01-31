import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { DropdownService } from '../../_services/service/dropdown.service';
import { Dropdown } from '../../_services/model';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { AuthorizationGuard } from '../../_guards/Authorizationguard';
import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';

@Component({
  selector: 'app-dropdownlist',
  templateUrl: './dropdownlist.component.html',
  styleUrls: ['./dropdownlist.component.css']
})
export class DropdownlistComponent implements OnInit {

  lstDropdownMaster: Dropdown[];
  objDropdown: Dropdown = {} as any;
  dropdownForm: FormGroup;
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
    private _dropdownService: DropdownService,

    private _authorizationGuard: AuthorizationGuard,
    private fb: FormBuilder,
    private _PrivateutilityService: PrivateutilityService,
  ) { }


  //#region Validation Start
  formErrors = {
    'DropdownTypeName': '',
    'DropdownValue': '',
    'DropDownDescription': '',
    'DisplayOrder': '',
  };

  // This object contains all the validation messages for this form
  validationMessages = {
    'DropdownTypeName': {
      'required': 'This Field is required.',
    },
    'DropdownValue': {
      'required': 'This Field is required.',
      'maxlength': 'This Field must be less than or equal to 100 characters.',
      'pattern': 'This Field must be a Alphabet.'
    },
    'DropDownDescription': {
      'required': 'This Field is required.',
      'maxlength': 'This Field must be less than or equal to 250 characters.',
      'pattern': 'This Field must be a Alphabet.'
    },
    'DisplayOrder': {
      'required': 'This Field is required.',
      'pattern': 'This Field  must be numeric value.',
    }
  };

  logValidationErrors(group: FormGroup = this.dropdownForm): void {
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
    //
    this._PrivateutilityService.GetMasterDropdowns()
      .subscribe(
        (data: Dropdown[]) => {
          this.lstDropdownMaster = data;
          //
        },
        (err: any) => {
          console.log(err);
          //
        }
      );


    this.SearchBy = '';
    this.SearchKeyword = '';
    this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);

    this.panelTitle = 'Add New Dropdown';
    this.action = true;
    this.identity = 0;
    this.dropdownForm = this.fb.group({
      DropdownTypeName: ['', [Validators.required]],
      DropdownValue: ['', [Validators.required, Validators.maxLength(100)]],
      DropDownDescription: ['', [Validators.required, Validators.maxLength(250)]],
      DisplayOrder: ['', [Validators.required, Validators.pattern("^([0-9]+)$")]],
      IsActive: [0,],
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
    if (this._authorizationGuard.CheckAcess("Dropdownlist", "ViewEdit")) {
      return;
    }
    $('#modalpopupdropdownupsert').modal('show');
    this.logValidationErrors();
    this.dropdownForm = this.fb.group({
      DropdownTypeName: ['', [Validators.required]],
      DropdownValue: ['', [Validators.required, Validators.maxLength(100)]],
      DropDownDescription: ['', [Validators.required, Validators.maxLength(250)]],
      DisplayOrder: ['', [Validators.required, Validators.pattern("^([0-9]+)$")]],
      IsActive: [0,],
    });
    this.panelTitle = "Add New Dropdown";
    this.action = true;
    this.dropdownForm.patchValue({
      DropdownTypeName: '',
      DropdownValue: '',
      DropDownDescription: '',
      DisplayOrder: '',
      IsActive: '',
    });
    // this.dropdownForm.get('Dropdown').enable();
    $('#DropdownTypeName').removeAttr("disabled");
  }

  editButtonClick(id: number) {
    if (this._authorizationGuard.CheckAcess("Dropdownlist", "ViewEdit")) {
      return;
    }
    this.dropdownForm = this.fb.group({
      DropdownTypeName: ['', [Validators.required]],
      DropdownValue: ['', [Validators.required, Validators.maxLength(100)]],
      DropDownDescription: ['', [Validators.required, Validators.maxLength(250)]],
      DisplayOrder: ['', [Validators.required, Validators.pattern("^([0-9]+)$")]],
      IsActive: [0,],
    });
    this.panelTitle = "Edit Dropdown";
    this.action = false;
    this.identity = + id;
    //
    this._dropdownService.searchById(this.identity)
      .subscribe(
        (data: Dropdown) => {
          this.dropdownForm.patchValue({
            DropdownTypeName: data.DropdownType,
            DropdownValue: data.DropdownValue,
            DropDownDescription: data.DropDownDescription,
            DisplayOrder: data.DisplayOrder,
            IsActive: data.IsActive,
          });
          $("#DropdownTypeName").attr("disabled", "disabled");
          this.logValidationErrors();
          //
        },
        (err: any) => {
          console.log(err);
          //
        }
      );
    $('#modalpopupdropdownupsert').modal('show');
  }

  confirmDeleteid(id: number, DeleteColumnvalue: string) {
    if (this._authorizationGuard.CheckAcess("Dropdownlist", "ViewEdit")) {
      return;
    }
    this.identity = + id;
    this.deleteColumn = DeleteColumnvalue;
    $('#modaldeleteconfimation').modal('show');
  }

  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("Dropdownlist", "ViewEdit")) {
      return;
    }
    // stop here if form is invalid
    if (this.dropdownForm.invalid) {
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
    this.objDropdown.DropdownType = this.dropdownForm.controls['DropdownTypeName'].value;
    this.objDropdown.DropdownValue = this.dropdownForm.controls['DropdownValue'].value;
    this.objDropdown.DropDownDescription = this.dropdownForm.controls['DropDownDescription'].value;
    this.objDropdown.DisplayOrder = this.dropdownForm.controls['DisplayOrder'].value;
    this.objDropdown.IsActive = this.dropdownForm.controls['IsActive'].value;

    //
    this._dropdownService.exist(this.objDropdown.DropdownID, this.objDropdown.DropdownType, this.objDropdown.DropdownValue)
      .subscribe(
        (data) => {
          if (data == true) {
            this.alertService.error('This Dropdown has been registered already!');
          }
          else {
            //
            this._dropdownService.add(this.objDropdown).subscribe(
              (data) => {
                if (data != null && data == true) {
                  //
                  this.alertService.success('Dropdown data has been added successfully');
                }
                else {
                  //
                  this.alertService.error('Dropdown creation failed!');
                }
                $('#modalpopupdropdownupsert').modal('hide');
                this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
                this.identity = 0;
              },
              (error: any) => {
                //
                console.log(error);
              }
            );
          }
          //
        },
        (error: any) => {
          //
        }
      );


  }

  Update() {
    this.objDropdown.DropdownID = this.identity;
    this.objDropdown.DropdownType = this.dropdownForm.controls['DropdownTypeName'].value;
    this.objDropdown.DropdownValue = this.dropdownForm.controls['DropdownValue'].value;
    this.objDropdown.DropDownDescription = this.dropdownForm.controls['DropDownDescription'].value;
    this.objDropdown.DisplayOrder = this.dropdownForm.controls['DisplayOrder'].value;
    this.objDropdown.IsActive = this.dropdownForm.controls['IsActive'].value;
    //
    this._dropdownService.exist(this.objDropdown.DropdownID, this.objDropdown.DropdownType, this.objDropdown.DropdownValue)
      .subscribe(
        (data) => {
          if (data == true) {
            this.alertService.error('This Dropdown has been registered already!');
          }
          else {
            //
            this._dropdownService.update(this.objDropdown).subscribe(
              (data) => {
                if (data != null && data == true) {
                  //
                  this.alertService.success('Dropdown data has been updated successful');
                }
                else {
                  //
                  this.alertService.error('Dropdown not saved!');
                }
                $('#modalpopupdropdownupsert').modal('hide');
                this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
                this.identity = 0;
              },
              (error: any) => {
                //
                console.log(error);
              }
            );
          }
          //
        },
        (error: any) => {
          //
        }
      );

  }

  delete() {
    //
    this._dropdownService.delete(this.identity).subscribe(
      (data) => {
        if (data) {
          this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
          this.alertService.success('Dropdown data has been deleted successful');
        } else {
          this.alertService.error('Dropdown – ' + this.deleteColumn + ' is being used in the application, Can’t be deleted.!');
        }
        $('#modaldeleteconfimation').modal('hide');
        this.identity = 0;
        //
      },
      (error: any) => {
        //
        console.log(error);
      }
    );
  }

  onLoad(SearchBy: string, Search: string, IsActive: Boolean) {



    //
    this._dropdownService.search(SearchBy, Search, IsActive).subscribe(
      (data) => {
        if (data != null) {
          this.items = data;
          this.loadItems();
        }
        //
      },
      (err) => {
        //
        console.log(err);
      }
    );


  }

  //#region Paging Sorting and Filtering Start
  public allowUnsort = false;
  public sort: SortDescriptor[] = [{
    field: 'DropdownType',
    dir: 'asc'
  }];
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  private items: Dropdown[] = [] as any;
  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'DropdownType', operator: 'contains', value: '' }]
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
            field: 'DropdownType',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'DropdownValue',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'DropDownDescription',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'DisplayOrder',
            operator: 'contains',
            value: inputValue
          },
        ],
      }
    });
  }
  //#endregion Paging Sorting and Filtering End

}
