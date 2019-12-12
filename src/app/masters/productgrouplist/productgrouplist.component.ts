import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { UsernameValidator } from '../../_validators/username';
import { ProductgroupService } from '../../_services/service/productgroup.service';
import { ProductGroup } from '../../_services/model';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'

import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
@Component({
  selector: 'app-productgrouplist',
  templateUrl: './productgrouplist.component.html',
  styleUrls: ['./productgrouplist.component.css']
})
export class ProductgrouplistComponent implements OnInit {

  objProductGroup: ProductGroup = {} as any;
  ProductGroupForm: FormGroup;
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
    private _productgroupService: ProductgroupService,
    
    private _authorizationGuard: AuthorizationGuard,
    private fb: FormBuilder,
  ) { }

  //#region Validation Start
  formErrors = {
    'ProductGroupName': '',
  };

  // This object contains all the validation messages for this form
  validationMessages = {
    'ProductGroupName': {
      'required': 'This Field is required.',
      'ProductGroupInUse': 'This ProductGroup is already registered!'
    },
  };

  logValidationErrors(group: FormGroup = this.ProductGroupForm): void {
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



    this.SearchBy = '';
    this.SearchKeyword = '';
    this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);

    this.ProductGroupForm = this.fb.group({
      ProductGroupName: ['', [Validators.required]
        , this._usernameValidator.existProductGroup(this.identity)
      ],
      IsActive: [0,],
    });
    this.panelTitle = "Add New Product Group";
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
    if (this._authorizationGuard.CheckAcess("Productgrouplist", "ViewEdit")) {
      return;
    }
    $('#modalpopupbrandupsert').modal('show');
    this.logValidationErrors();
    this.panelTitle = "Add New ProductGroup";
    this.action = true;
    this.identity = 0;

    this.ProductGroupForm = this.fb.group({
      ProductGroupName: ['', [Validators.required, Validators.maxLength(30)]
        , this._usernameValidator.existProductGroup(this.identity)
      ],
      IsActive: [0,],
    });
    this.ProductGroupForm.patchValue({
      ProductGroupName: '',
      IsActive: '',
    });
  }

  editButtonClick(id: number) {
    if (this._authorizationGuard.CheckAcess("Productgrouplist", "ViewEdit")) {
      return;
    }

    this.panelTitle = "Edit Product Group";
    this.action = false;
    this.identity = + id;

    this.ProductGroupForm = this.fb.group({
      ProductGroupName: ['', [Validators.required, Validators.maxLength(30)]
        , this._usernameValidator.existProductGroup(this.identity)
      ],
      IsActive: [0,],
    });
    //
    this._productgroupService.searchById(this.identity)
      .subscribe(
        (data: ProductGroup) => {
          this.ProductGroupForm.patchValue({
            ProductGroupName: data.ProductGroupName,
            IsActive: data.IsActive,
          });
          this.logValidationErrors();
          //
        },
        (err: any) => {
          console.log(err);
          //
        }
      );
    $('#modalpopupbrandupsert').modal('show');
  }

  confirmDeleteid(id: number, DeleteColumnvalue: string) {
    if (this._authorizationGuard.CheckAcess("Productgrouplist", "ViewEdit")) {
      return;
    }
    this.identity = + id;
    this.deleteColumn = DeleteColumnvalue;
    $('#modaldeleteconfimation').modal('show');
  }

  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("Productgrouplist", "ViewEdit")) {
      return;
    }
    if (this.ProductGroupForm.controls['ProductGroupName'].value.replace(/^\s+|\s+$/gm, '').length == 0) {
      this.alertService.error('Please enter ProductGroup Name!');
      return;
    }
    // stop here if form is invalid
    if (this.ProductGroupForm.invalid) {
      return;
    }
    if (this.ProductGroupForm.pristine) {
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
    this.objProductGroup.ProductGroupName = this.ProductGroupForm.controls['ProductGroupName'].value;;
    this.objProductGroup.IsActive = this.ProductGroupForm.controls['IsActive'].value;

    //
    this._productgroupService.add(this.objProductGroup).subscribe(
      (data) => {
        if (data != null && data == true) {
          //
          this.alertService.success('ProductGroup data has been added successfully');
        }
        else {
          //
          this.alertService.error('ProductGroup creation failed!');
        }
        $('#modalpopupbrandupsert').modal('hide');
        this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
        this.identity = 0;
      },
      (error: any) => {
        //
        console.log(error);
      }
    );


  }

  Update() {
    this.objProductGroup.ProductGroupID = this.identity;
    this.objProductGroup.ProductGroupName = this.ProductGroupForm.controls['ProductGroupName'].value;
    this.objProductGroup.IsActive = this.ProductGroupForm.controls['IsActive'].value;

    //
    this._productgroupService.update(this.objProductGroup).subscribe(
      (data) => {
        if (data != null && data == true) {
          //
          this.alertService.success('ProductGroup data has been updated successful');
        }
        else {
          //
          this.alertService.error('ProductGroup not saved!');
        }
        $('#modalpopupbrandupsert').modal('hide');
        this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
        this.identity = 0;
      },
      (error: any) => {
        //
        console.log(error);
      }
    );

  }

  delete() {
    //
    this._productgroupService.delete(this.identity).subscribe(
      (data) => {
        if (data) {
          this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
          this.alertService.success('ProductGroup data has been deleted successful');
        } else {
          this.alertService.error('ProductGroup – ' + this.deleteColumn + ' is being used in the application, Can’t be deleted.!');
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
    return this._productgroupService.search(SearchBy, Search, IsActive).subscribe(
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
  private items: ProductGroup[] = [] as any;
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


  //#endregion Paging Sorting and Filtering End

}
