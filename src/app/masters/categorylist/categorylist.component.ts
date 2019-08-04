import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../../_services/service/category.service';
import { Category, ProductGroup } from '../../_services/model';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { AuthorizationGuard } from '../../_guards/Authorizationguard';
import { AbstractControl } from '@angular/forms'; 

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
  lstCategory: Category[];
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
    private _spinner: NgxSpinnerService,
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
      // if (abstractControl && abstractControl.value && abstractControl.value.length > 0 && !abstractControl.value.replace(/\s/g, '').length) {
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
        },
        (err: any) =>
          console.log(err)
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

  onLoad(SearchBy: string, Search: string, IsActive: Boolean) {
    this._spinner.show();
    return this._categoryService.search(SearchBy, Search, IsActive).subscribe(
      (employeeList) => {
        this.lstCategory = employeeList;

        this.dtOptions = {
          pagingType: 'full_numbers',
          "language": {
            "search": 'Filter',
          },
        };
        // this.dataTable = $(this.table.nativeElement);

        // this.dataTable.DataTable(this.dtOptions);
        this._spinner.hide();
      },
      (err) => {
        this._spinner.hide();
        console.log(err);
      }
    );
  }

  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("Categorylist", "ViewEdit")) {
      return;
    }
    if (this.catgoryForm.controls['CategoryName'].value.replace(/\s/g, '').length == 0) {
      this.alertService.error('Please enter Category Name!');
      return;
    }
    // stop here if form is invalid
    if (this.catgoryForm.invalid) {
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
    this._spinner.show();
    this._categoryService.exist(this.identity,
      this.objCategory.CategoryName, this.objCategory.ProductGroupID)
      .subscribe(
        (data) => {
          if (data == true) {
            this.alertService.error('This Category has been registered already!');
          }
          else {
            this._spinner.show();
            this._categoryService.add(this.objCategory).subscribe(
              (data) => {
                if (data != null && data == true) {
                  this._spinner.hide();
                  this.alertService.success('Category data has been added successfully');
                }
                else {
                  this._spinner.hide();
                  this.alertService.error('Category creation failed!');
                }
                $('#modalpopupcategoryupsert').modal('hide');
                this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
                this.identity = 0;
              },
              (error: any) => {
                this._spinner.hide();
                console.log(error);
              }
            );
          }
          this._spinner.hide();
        },
        (error: any) => {
          this._spinner.hide();
        }
      );


  }

  Update() {
    this.objCategory.CategoryID = this.identity;
    this.objCategory.ProductGroupID = this.catgoryForm.controls['ProductGroupID'].value;
    this.objCategory.CategoryName = this.catgoryForm.controls['CategoryName'].value;
    this.objCategory.IsActive = this.catgoryForm.controls['IsActive'].value;
    this._spinner.show();

    this._categoryService.exist(this.identity, this.objCategory.CategoryName, this.objCategory.ProductGroupID)
      .subscribe(
        (data) => {
          if (data == true) {
            this.alertService.error('This Category has been registered already!');
          }
          else {
            this._spinner.show();
            this._categoryService.update(this.objCategory).subscribe(
              (data) => {
                if (data != null && data == true) {
                  this._spinner.hide();
                  this.alertService.success('Category data has been updated successful');
                }
                else {
                  this._spinner.hide();
                  this.alertService.error('Category not saved!');
                }
                $('#modalpopupcategoryupsert').modal('hide');
                this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
                this.identity = 0;
              },
              (error: any) => {
                this._spinner.hide();
                console.log(error);
              }
            );
          }
          this._spinner.hide();
        },
        (error: any) => {
          this._spinner.hide();
        }
      );

  }

  delete() {
    this._spinner.show();
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
        this._spinner.hide();
      },
      (error: any) => {
        this._spinner.hide();
        console.log(error);
      }
    );
  }

}
