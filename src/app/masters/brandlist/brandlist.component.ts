import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { UsernameValidator } from '../../_validators/username';
import { BrandService } from '../../_services/service/brand.service';
import { Brand } from '../../_services/model';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
@Component({
  selector: 'app-brandlist',
  templateUrl: './brandlist.component.html',
  styleUrls: ['./brandlist.component.css']
})
export class BrandlistComponent implements OnInit {
 
  objBrand: Brand = {} as any;
  brandForm: FormGroup;
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
    private _uomService: BrandService,
    
    private _authorizationGuard: AuthorizationGuard,
    private fb: FormBuilder,
  ) { }

  //#region Validation Start
  formErrors = {
    'BrandName': '',
  };

  // This object contains all the validation messages for this form
  validationMessages = {
    'BrandName': {
      'required': 'This Field is required.',
      'BrandInUse': 'This Brand is already registered!'
    },
  };

  logValidationErrors(group: FormGroup = this.brandForm): void {
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

    this.brandForm = this.fb.group({
      BrandName: ['', [Validators.required, Validators.maxLength(30)]
        , this._usernameValidator.existBrand(this.identity,"AA")
      ],
      IsActive: [0,],
    });
    this.panelTitle = "Add New Brand";
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
    if (this._authorizationGuard.CheckAcess("Brandlist", "ViewEdit")) {
      return;
    }
    $('#modalpopupbrandupsert').modal('show');
    this.logValidationErrors();
    this.panelTitle = "Add New Brand";
    this.action = true;
    this.identity = 0;

    this.brandForm = this.fb.group({
      BrandName: ['', [Validators.required, Validators.maxLength(30)]
        , this._usernameValidator.existBrand(this.identity,"AA")
      ],
      IsActive: [0,],
    });
    this.brandForm.patchValue({
      BrandName: '',
      IsActive: '',
    });
  }

  editButtonClick(id: number) {
    if (this._authorizationGuard.CheckAcess("Brandlist", "ViewEdit")) {
      return;
    }

    this.panelTitle = "Edit Brand";
    this.action = false;
    this.identity = + id;

    this.brandForm = this.fb.group({
      BrandName: ['', [Validators.required]
        , this._usernameValidator.existBrand(this.identity,"AA")
      ],
      IsActive: [0,],
    });
    //
    this._uomService.searchById(this.identity)
      .subscribe(
        (data: Brand) => {
          this.brandForm.patchValue({
            BrandName: data.BrandName,
            IsActive: data.IsActive,
          });
          this.logValidationErrors();
          //
        },
        (err: any) => {
          //
          console.log(err)
        }
      );
    $('#modalpopupbrandupsert').modal('show');
  } 

  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("Brandlist", "ViewEdit")) {
      return;
    }
    if (this.brandForm.controls['BrandName'].value.replace(/^\s+|\s+$/gm, '').length == 0) {
      this.alertService.error('Please enter BrandName!');
      return;
    }
    // stop here if form is invalid
    if (this.brandForm.invalid) {
      return;
    }
    if (this.brandForm.pristine) {
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
    this.objBrand.BrandName = this.brandForm.controls['BrandName'].value;;
    this.objBrand.IsActive = this.brandForm.controls['IsActive'].value;

    //
    this._uomService.add(this.objBrand).subscribe(
      (data) => {
        if (data != null && data == true) {
          //
          this.alertService.success('Brand data has been added successfully');
        }
        else {
          //
          this.alertService.error('Brand creation failed!');
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
    this.objBrand.BrandID = this.identity;
    this.objBrand.BrandName = this.brandForm.controls['BrandName'].value;
    this.objBrand.IsActive = this.brandForm.controls['IsActive'].value;

    //
    this._uomService.update(this.objBrand).subscribe(
      (data) => {
        if (data != null && data == true) {
          //
          this.alertService.success('Brand data has been updated successful');
        }
        else {
          //
          this.alertService.error('Brand not saved!');
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

  confirmDeleteid(id: number, DeleteColumnvalue: string) {
    if (this._authorizationGuard.CheckAcess("Brandlist", "ViewEdit")) {
      return;
    }
    this.identity = + id;
    this.deleteColumn = DeleteColumnvalue;
    $('#modaldeleteconfimation').modal('show');
  }

  delete() {
    //
    this._uomService.delete(this.identity).subscribe(
      (data) => {
        if (data) {
          this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
          this.alertService.success('Brand data has been deleted successful');
        } else {
          this.alertService.error('Brand – ' + this.deleteColumn + ' is being used in the application, Can’t be deleted.!');
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
    return this._uomService.search(SearchBy, Search, IsActive).subscribe(
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
    field: 'BrandName',
    dir: 'asc'
  }];
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  private items: Brand[] = [] as any;
  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'BrandName', operator: 'contains', value: '' }]
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
            field: 'BrandName',
            operator: 'contains',
            value: inputValue
          },
          
        ],
      }
    });
  }
  //#endregion Paging Sorting and Filtering End

}
