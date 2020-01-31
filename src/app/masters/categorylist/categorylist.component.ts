import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../../_services/service/category.service';
import { Category, ProductGroup } from '../../_services/model';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { AuthorizationGuard } from '../../_guards/Authorizationguard';
import { AbstractControl } from '@angular/forms';

import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
@Component({
  selector: 'app-categorylist',
  templateUrl: './categorylist.component.html',
  styleUrls: ['./categorylist.component.css']
})


export class CategorylistComponent implements OnInit {
  //@ViewChild('dataTable') table;
  //dataTable: 
  any;
  lstProductGroup: ProductGroup[];
  objCategory: Category = {} as any;
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
    private _categoryService: CategoryService,

    private _authorizationGuard: AuthorizationGuard,
    private fb: FormBuilder,
    private _PrivateutilityService: PrivateutilityService,
  ) { }


  //#region Validation Start
  formErrors = {
    'ProductGroupID': '',
    'CategoryName': '',
  };

  // This object contains all the validation messages for this form
  validationMessages = {
    'ProductGroupID': {
      'min': 'This Field is required.',
    },
    'CategoryName': {
      'required': 'This Field is required.',
    },
  };

  logValidationErrors(group: FormGroup = this.catgoryForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      // if (abstractControl && abstractControl.value && abstractControl.value.length > 0 && !abstractControl.value.replace(/^\s+|\s+$/gm, '').length) {
      //   abstractControl.setValue('');
      // }
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

    this._PrivateutilityService.getProductGroups()
      .subscribe(
        (data: ProductGroup[]) => {
          this.lstProductGroup = data;
        },
        (err: any) =>
          console.log(err)
      );


    this.SearchBy = '';
    this.SearchKeyword = '';
    this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);

    this.panelTitle = 'Add New Category';
    this.action = true;
    this.identity = 0;
    this.catgoryForm = this.fb.group({
      ProductGroupID: [0, [Validators.min(1)]],
      CategoryName: ['', [Validators.required]],
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
    if (this._authorizationGuard.CheckAcess("Categorylist", "ViewEdit")) {
      return;
    }
    $('#modalpopupcategoryupsert').modal('show');
    this.logValidationErrors();
    this.catgoryForm = this.fb.group({
      ProductGroupID: [0, [Validators.min(1)]],
      CategoryName: ['', [Validators.required, Validators.maxLength(30)]],
      IsActive: [0,],
    });
    this.panelTitle = "Add New Category";
    this.action = true;
    this.catgoryForm.patchValue({
      Category: '',
      CategoryName: '',
      MultiplierValue: '',
      IsActive: '',
    });
    $('#ProductGroupID').removeAttr("disabled");
  }

  editButtonClick(id: number) {
    if (this._authorizationGuard.CheckAcess("Categorylist", "ViewEdit")) {
      return;
    }
    this.catgoryForm = this.fb.group({
      ProductGroupID: [0, [Validators.min(1)]],
      CategoryName: ['', [Validators.required, Validators.maxLength(30)]],
      IsActive: [0,],
    });
    this.panelTitle = "Edit Category";
    this.action = false;
    this.identity = + id;
    //
    this._categoryService.searchById(this.identity)
      .subscribe(
        (data: Category) => {
          var ProductGroupID = data.ProductGroupID.toString();
          this.catgoryForm.patchValue({
            CategoryName: data.CategoryName,
            ProductGroupID: ProductGroupID,
            IsActive: data.IsActive,
          });
          $("#ProductGroupID").attr("disabled", "disabled");
          this.logValidationErrors();
          //
        },
        (err: any) => {
          console.log(err);
          //
        }
      );
    $('#modalpopupcategoryupsert').modal('show');
  }

  confirmDeleteid(id: number, DeleteColumnvalue: string) {
    if (this._authorizationGuard.CheckAcess("Categorylist", "ViewEdit")) {
      return;
    }
    this.identity = + id;
    this.deleteColumn = DeleteColumnvalue;
    $('#modaldeleteconfimation').modal('show');
  }

  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("Categorylist", "ViewEdit")) {
      return;
    }
    if (this.catgoryForm.controls['CategoryName'].value.replace(/^\s+|\s+$/gm, '').length == 0) {
      this.alertService.error('Please enter Category Name!');
      return;
    }
    // stop here if form is invalid
    if (this.catgoryForm.invalid) {
      return;
    }
    if (this.catgoryForm.pristine) {
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
    this.objCategory.ProductGroupID = this.catgoryForm.controls['ProductGroupID'].value;
    this.objCategory.CategoryName = this.catgoryForm.controls['CategoryName'].value;
    this.objCategory.IsActive = this.catgoryForm.controls['IsActive'].value;
    //
    this._categoryService.exist(this.identity,
      this.objCategory.CategoryName, this.objCategory.ProductGroupID)
      .subscribe(
        (data) => {
          if (data == true) {
            this.alertService.error('This Category is already registered');
          }
          else {
            //
            this._categoryService.add(this.objCategory).subscribe(
              (data) => {
                if (data != null && data == true) {
                  //
                  this.alertService.success('Category data has been added successfully');
                }
                else {
                  //
                  this.alertService.error('Category creation failed!');
                }
                $('#modalpopupcategoryupsert').modal('hide');
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
    this.objCategory.CategoryID = this.identity;
    this.objCategory.ProductGroupID = this.catgoryForm.controls['ProductGroupID'].value;
    this.objCategory.CategoryName = this.catgoryForm.controls['CategoryName'].value;
    this.objCategory.IsActive = this.catgoryForm.controls['IsActive'].value;
    //

    this._categoryService.exist(this.identity, this.objCategory.CategoryName, this.objCategory.ProductGroupID)
      .subscribe(
        (data) => {
          if (data == true) {
            this.alertService.error('This Category is already registered');
          }
          else {
            //
            this._categoryService.update(this.objCategory).subscribe(
              (data) => {
                if (data != null && data == true) {
                  //
                  this.alertService.success('Category data has been updated successful');
                }
                else {
                  //
                  this.alertService.error('Category not saved!');
                }
                $('#modalpopupcategoryupsert').modal('hide');
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
    this._categoryService.delete(this.identity).subscribe(
      (data) => {
        if (data) {
          this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
          this.alertService.success('Category data has been deleted successful');
        } else {
          this.alertService.error('Category – ' + this.deleteColumn + ' is being used in the application, Can’t be deleted.!');
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
    return this._categoryService.search(SearchBy, Search, IsActive).subscribe(
      (lst) => {
        if (lst != null) {
          this.items = lst;
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
    field: 'ProductGroupName',
    dir: 'asc'
  }];
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  private items: Category[] = [] as any;
  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'ProductGroupName', operator: 'contains', value: '' }]
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
            field: 'ProductGroupName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'CategoryName',
            operator: 'contains',
            value: inputValue
          }, 
        ],
      }
    });
  }
  //#endregion Paging Sorting and Filtering End

}
