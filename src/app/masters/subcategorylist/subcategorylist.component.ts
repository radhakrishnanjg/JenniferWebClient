import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { SubcategoryService } from '../../_services/service/subcategory.service';
import { ProductGroup, Category, SubCategory } from '../../_services/model';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
@Component({
  selector: 'app-subcategorylist',
  templateUrl: './subcategorylist.component.html',
  styleUrls: ['./subcategorylist.component.css']
})
export class SubcategorylistComponent implements OnInit {
  lstProductGroup: ProductGroup[];
  lstCategory: Category[];
  objSubCategory: SubCategory = {} as any;
  subcatgoryForm: FormGroup;
  panelTitle: string;
  action: boolean;
  identity: number = 0;
  deleteColumn: string;
  dtOptions: DataTables.Settings = {};
  SearchBy: string = '';
  SearchKeyword: string = '';
  Searchaction: boolean = true;

  ProductGroupName: string = '';
  CategoryName: string = '';
  constructor(
    private alertService: ToastrService,
    private _subcategoryService: SubcategoryService,

    private _authorizationGuard: AuthorizationGuard,
    private fb: FormBuilder,
    private _PrivateutilityService: PrivateutilityService,
  ) { }


  //#region Validation Start
  formErrors = {
    'ProductGroupID': '',
    'CategoryID': '',
    'SubCategoryName': '',
  };

  // This object contains all the validation messages for this form
  validationMessages = {
    'CategoryID': {
      'min': 'This Field is required.',
    },
    'SubCategoryName': {
      'required': 'This Field is required.',
    },
  };

  logValidationErrors(group: FormGroup = this.subcatgoryForm): void {
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

  onchangeProductGroupID(selectedValue: string) {
    let id = parseInt(selectedValue);
    if (id > 0) {
      //
      this._PrivateutilityService.getCategories(id)
        .subscribe(
          (data: Category[]) => {
            this.lstCategory = data;
            //
          },
          (err: any) => {
            console.log(err);
            //
          }
        );
    }
  }

  ngOnInit() {
    //
    this._PrivateutilityService.getProductGroups()
      .subscribe(
        (data: ProductGroup[]) => {
          this.lstProductGroup = data;
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

    this.panelTitle = 'Add New SubCategory';
    this.action = true;
    this.identity = 0;
    this.subcatgoryForm = this.fb.group({
      ProductGroupID: [0,],
      CategoryID: [0, [Validators.min(1)]],
      SubCategoryName: ['', [Validators.required, Validators.maxLength(40)]],
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
    if (this._authorizationGuard.CheckAcess("SubCategorylist", "ViewEdit")) {
      return;
    }
    $('#modalpopupsubcategoryupsert').modal('show');
    this.logValidationErrors();
    this.subcatgoryForm = this.fb.group({
      ProductGroupID: [0,],
      CategoryID: [0, [Validators.min(1)]],
      SubCategoryName: ['', [Validators.required]],
      IsActive: [0,],
    });
    this.panelTitle = "Add New SubCategory";
    this.action = true;
    this.subcatgoryForm.patchValue({
      SubCategory: '',
      SubCategoryName: '',
      MultiplierValue: '',
      IsActive: '',
    });
    $('#CategoryID').removeAttr("disabled");
  }

  editButtonClick(id: number) {
    if (this._authorizationGuard.CheckAcess("SubCategorylist", "ViewEdit")) {
      return;
    }
    this.subcatgoryForm = this.fb.group({
      ProductGroupID: [0,],
      CategoryID: [0, [Validators.min(1)]],
      SubCategoryName: ['', [Validators.required, Validators.maxLength(40)]],
      IsActive: [0,],
    });
    this.panelTitle = "Edit SubCategory";
    this.action = false;
    this.identity = + id;
    //
    this._subcategoryService.searchById(this.identity)
      .subscribe(
        (data: SubCategory) => {
          var CategoryID = data.CategoryID.toString();
          this.subcatgoryForm.patchValue({
            SubCategoryName: data.SubCategoryName,
            CategoryID: CategoryID,
            IsActive: data.IsActive,
          });
          this.ProductGroupName = data.ProductGroupName;
          this.CategoryName = data.CategoryName;
          $("#CategoryID").attr("disabled", "disabled");
          this.logValidationErrors();
          //
        },
        (err: any) => {
          console.log(err);
          //
        }
      );
    $('#modalpopupsubcategoryupsert').modal('show');
  }

  confirmDeleteid(id: number, DeleteColumnvalue: string) {
    if (this._authorizationGuard.CheckAcess("SubCategorylist", "ViewEdit")) {
      return;
    }
    this.identity = + id;
    this.deleteColumn = DeleteColumnvalue;
    $('#modaldeleteconfimation').modal('show');
  }

  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("SubCategorylist", "ViewEdit")) {
      return;
    }
    if (this.subcatgoryForm.controls['SubCategoryName'].value.replace(/^\s+|\s+$/gm, '').length == 0) {
      this.alertService.error('Please enter SubCategory Name!');
      return;
    }
    // stop here if form is invalid
    if (this.subcatgoryForm.invalid) {
      return;
    }
    if (this.subcatgoryForm.pristine) {
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
    this.objSubCategory.CategoryID = this.subcatgoryForm.controls['CategoryID'].value;
    this.objSubCategory.SubCategoryName = this.subcatgoryForm.controls['SubCategoryName'].value;
    this.objSubCategory.IsActive = this.subcatgoryForm.controls['IsActive'].value;
    //
    this._subcategoryService.exist(this.identity,
      this.objSubCategory.SubCategoryName, this.objSubCategory.CategoryID)
      .subscribe(
        (data) => {
          if (data == true) {
            this.alertService.error('This SubCategory is already registered');
          }
          else {
            //
            this._subcategoryService.add(this.objSubCategory).subscribe(
              (data) => {
                if (data != null && data == true) {
                  //
                  this.alertService.success('SubCategory data has been added successfully');
                }
                else {
                  //
                  this.alertService.error('SubCategory creation failed!');
                }
                $('#modalpopupsubcategoryupsert').modal('hide');
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
    this.objSubCategory.SubCategoryID = this.identity;
    this.objSubCategory.CategoryID = this.subcatgoryForm.controls['CategoryID'].value;
    this.objSubCategory.SubCategoryName = this.subcatgoryForm.controls['SubCategoryName'].value;
    this.objSubCategory.IsActive = this.subcatgoryForm.controls['IsActive'].value;
    //

    this._subcategoryService.exist(this.identity, this.objSubCategory.SubCategoryName, this.objSubCategory.CategoryID)
      .subscribe(
        (data) => {
          if (data == true) {
            this.alertService.error('This SubCategory is already registered');
          }
          else {
            //
            this._subcategoryService.update(this.objSubCategory).subscribe(
              (data) => {
                if (data != null && data == true) {
                  //
                  this.alertService.success('SubCategory data has been updated successful');
                }
                else {
                  //
                  this.alertService.error('SubCategory not saved!');
                }
                $('#modalpopupsubcategoryupsert').modal('hide');
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
    this._subcategoryService.delete(this.identity).subscribe(
      (data) => {
        if (data) {
          this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
          this.alertService.success('SubCategory data has been deleted successful');
        } else {
          this.alertService.error('SubCategory – ' + this.deleteColumn + ' is being used in the application, Can’t be deleted.!');
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
    return this._subcategoryService.search(SearchBy, Search, IsActive).subscribe(
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
  private items: SubCategory[] = [] as any;
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
          {
            field: 'SubCategoryName',
            operator: 'contains',
            value: inputValue
          },
           
        ],
      }
    });
  }
  //#endregion Paging Sorting and Filtering End

}
