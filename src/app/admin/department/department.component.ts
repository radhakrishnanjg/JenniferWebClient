import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'; 
import { ToastrService } from 'ngx-toastr';
import { TrimPipe } from 'ngx-pipes';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
//SERVICES 
import { DepartmentService } from '../../_services/service/department.service';
import { UniqueValidator } from '../../_validators/UniqueValidator';
//MODAL IMPORT
import { Department } from '../../_services/model';
@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {

  objDepartment: Department = {} as any;
  DepartmentForm: FormGroup;
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
    private _departmentService: DepartmentService,
    private _uniqueValidator: UniqueValidator,
    private _trimPipe: TrimPipe,
    private fb: FormBuilder) { }

  //#region Validation Start
  formErrors = {
    'Code': '',
    'Name': '',
  };

  // This object contains all the validation messages for this form
  validationMessages = {
    'Code': {
      'required': 'This Field is required.',
      'UniqueError': 'This value is already registered!'
    },
    'Name': {
      'required': 'This Field is required.',
    },
  };

  logValidationErrors(group: FormGroup = this.DepartmentForm): void {
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

    this.DepartmentForm = this.fb.group({
      Code: ['', [Validators.required, Validators.maxLength(10)]
        , this._uniqueValidator.DepartmentCodeExist(this.identity)
      ],
      Name: ['', [Validators.required, Validators.maxLength(50)]],
      IsActive: [0,],
    });
    this.panelTitle = "Add New Department";
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
    // if (this._authorizationGuard.CheckAcess("Departmentlist", "ViewEdit")) {
    //   return;
    // }

    $('#modalpopupDepartmentupsert').modal('show');
    this.logValidationErrors();
    this.panelTitle = "Add New Department";
    this.action = true;
    this.identity = 0;

    this.DepartmentForm = this.fb.group({
      Code: ['', [Validators.required, Validators.maxLength(10)]
        , this._uniqueValidator.DepartmentCodeExist(this.identity)
      ],
      Name: ['', [Validators.required, Validators.maxLength(50)]],
      IsActive: [0,],
    });
    this.DepartmentForm.patchValue({
      DepartmentName: '',
      IsActive: '',
    });
  }

  editButtonClick(id: number) {
    // if (this._authorizationGuard.CheckAcess("Departmentlist", "ViewEdit")) {
    //   return;
    // }

    this.panelTitle = "Edit Department";
    this.action = false;
    this.identity = + id;

    this.DepartmentForm = this.fb.group({
      Code: ['', [Validators.required, Validators.maxLength(10)]
        , this._uniqueValidator.DepartmentCodeExist(this.identity)
      ],
      Name: ['', [Validators.required, Validators.maxLength(50)]],
      IsActive: [0,],
    });
    //
    this._departmentService.SearchById(this.identity)
      .subscribe(
        (data: Department) => {
          this.DepartmentForm.patchValue({
            Code: data.Code,
            Name: data.Name,
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
    $('#modalpopupDepartmentupsert').modal('show');
  }

  SaveData(): void {
    // if (this._authorizationGuard.CheckAcess("Departmentlist", "ViewEdit")) {
    //   return;
    // }
    if (this.DepartmentForm.controls['Code'].value.replace(/^\s+|\s+$/gm, '').length == 0) {
      this.alertService.error('Please enter Code!');
      return;
    }
    if (this.DepartmentForm.controls['Name'].value.replace(/^\s+|\s+$/gm, '').length == 0) {
      this.alertService.error('Please enter Name!');
      return;
    }
    // stop here if form is invalid
    if (this.DepartmentForm.invalid) {
      return;
    }
    if (this.DepartmentForm.pristine) {
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
    this.objDepartment.Code = this.DepartmentForm.controls['Code'].value;
    this.objDepartment.Name = this.DepartmentForm.controls['Name'].value;

    this._departmentService.Insert(this.objDepartment).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.alertService.success(data.Msg);
        }
        else {
          this.alertService.error(data.Msg);
        }
        $('#modalpopupDepartmentupsert').modal('hide');
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
    this.objDepartment.DepartmentID = this.identity;
    this.objDepartment.Code = this.DepartmentForm.controls['Code'].value;
    this.objDepartment.Name = this.DepartmentForm.controls['Name'].value;
    this.objDepartment.IsActive = this.DepartmentForm.controls['IsActive'].value;

    this._departmentService.Update(this.objDepartment).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.alertService.success(data.Msg);
        }
        else {
          this.alertService.error(data.Msg);
        }
        $('#modalpopupDepartmentupsert').modal('hide');
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
    // if (this._authorizationGuard.CheckAcess("Departmentlist", "ViewEdit")) {
    //   return;
    // }
    this.identity = + id;
    this.deleteColumn = DeleteColumnvalue;
    $('#modaldeleteconfimation').modal('show');
  }

  delete() {
    this.objDepartment.DepartmentID = this.identity;
    this._departmentService.Delete(this.objDepartment).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
          this.alertService.success(data.Msg);
        } else {
          this.alertService.error('Department – ' + this.deleteColumn + ' is being used in the application, Can’t be deleted.!');
        }
        $('#modaldeleteconfimation').modal('hide');
        this.identity = 0;
      },
      (error: any) => {
        //
        console.log(error);
      }
    );
  }

  onLoad(SearchBy: string, Search: string, IsActive: boolean) {

    return this._departmentService.Search(SearchBy, Search, IsActive).subscribe(
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
    field: 'DepartmentName',
    dir: 'asc'
  }];
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  private items: Department[] = [] as any;
  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'Code', operator: 'contains', value: '' }]
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
