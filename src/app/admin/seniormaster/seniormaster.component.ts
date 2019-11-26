import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TrimPipe } from 'ngx-pipes';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
//SERVICES 
import { SeniormasterService } from '../../_services/service/seniormaster.service';
import { PasPrivateutilityService } from '../../_services/service/pasprivateutility.service';
import { UniqueValidator } from '../../_validators/UniqueValidator';
//MODAL IMPORT
import { Department, SeniorMaster } from '../../_services/model';
@Component({
  selector: 'app-seniormaster',
  templateUrl: './seniormaster.component.html',
  styleUrls: ['./seniormaster.component.css']
})
export class SeniormasterComponent implements OnInit {
  lstDepartment: Department[] = [] as any;
  objSeniorMaster: SeniorMaster = {} as any;
  SeniorMasterForm: FormGroup;
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
    private _SeniorMasterService: SeniormasterService,
    private _pasPrivateutilityService: PasPrivateutilityService,
    private _uniqueValidator: UniqueValidator,
    private _trimPipe: TrimPipe,
    private fb: FormBuilder
  ) { }

  //#region Validation Start
  formErrors = {
    'TableName': '',
    'DisplayName': '',
    'FieldName': '',
    // 'WhereClause': '',
    // 'DepartmentID': '',
  };

  // This object contains all the validation messages for this form
  validationMessages = {
    'TableName': {
      'required': 'This Field is required.',
      'UniqueError': 'This value is already registered!'
    },
    'DisplayName': {
      'required': 'This Field is required.',
    },
    'FieldName': {
      'required': 'This Field is required.',
    },
    // 'WhereClause': {
    //   'required': 'This Field is required.',
    // },
    // 'DepartmentID': {
    //   'min': 'This Field is required.',
    // },
  };

  logValidationErrors(group: FormGroup = this.SeniorMasterForm): void {
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

    this.SeniorMasterForm = this.fb.group({
      TableName: ['', [Validators.required,]
        , this._uniqueValidator.SeniorMasterTableNameExist(this.identity)
      ],
      DisplayName: ['', [Validators.required,]],
      FieldName: ['', [Validators.required,]],
      WhereClause: ['', []],
      DepartmentID: [0, []],
      IsActive: [0,],
    });
    this.panelTitle = "Add New SeniorMaster";
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

  LoadDepartments() {
    this._pasPrivateutilityService.GetDepartments()
      .subscribe(
        (data: Department[]) => {
          this.lstDepartment = data;
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  newButtonClick() {
    // if (this._authorizationGuard.CheckAcess("SeniorMasterlist", "ViewEdit")) {
    //   return;
    // }

    $('#modalpopupSeniorMasterupsert').modal('show');
    this.logValidationErrors();
    this.panelTitle = "Add New Senior Master";
    this.action = true;
    this.identity = 0;
    this.LoadDepartments();
    this.SeniorMasterForm = this.fb.group({
      TableName: ['', [Validators.required,]
        , this._uniqueValidator.SeniorMasterTableNameExist(this.identity)
      ],
      DisplayName: ['', [Validators.required,]],
      FieldName: ['', [Validators.required,]],
      WhereClause: ['', []],
      DepartmentID: [0, []],
      IsActive: [0,],
    });
    this.SeniorMasterForm.patchValue({
      SeniorMasterName: '',
      IsActive: '',
    });
  }

  editButtonClick(id: number) {
    // if (this._authorizationGuard.CheckAcess("SeniorMasterlist", "ViewEdit")) {
    //   return;
    // }

    this.panelTitle = "Edit Senior Master";
    this.action = false;
    this.identity = + id;
    this.LoadDepartments();
    this.SeniorMasterForm = this.fb.group({
      TableName: ['', [Validators.required,]
        , this._uniqueValidator.SeniorMasterTableNameExist(this.identity)
      ],
      DisplayName: ['', [Validators.required,]],
      FieldName: ['', [Validators.required,]],
      WhereClause: ['', []],
      DepartmentID: [0, []],
      IsActive: [0,],
    });
    //
    this._SeniorMasterService.SearchById(this.identity)
      .subscribe(
        (data: SeniorMaster) => {
          var DepartmentID = data.DepartmentID;
          this.SeniorMasterForm.patchValue({
            DepartmentID: DepartmentID,
            TableName: data.TableName,
            DisplayName: data.DisplayName,
            FieldName: data.FieldName,
            WhereClause: data.WhereClause,
            IsActive: data.IsActive,
          });
        },
        (err: any) => {
          console.log(err)
        }
      );
    $('#modalpopupSeniorMasterupsert').modal('show');
  }

  SaveData(): void {
    // if (this._authorizationGuard.CheckAcess("SeniorMasterlist", "ViewEdit")) {
    //   return;
    // }
    if (this.SeniorMasterForm.controls['TableName'].value.replace(/^\s+|\s+$/gm, '').length == 0) {
      this.alertService.error('Please enter Table Name!');
      return;
    }
    else if (this.SeniorMasterForm.controls['DisplayName'].value.replace(/^\s+|\s+$/gm, '').length == 0) {
      this.alertService.error('Please enter Display Name!');
      return;
    }
    else if (this.SeniorMasterForm.controls['FieldName'].value.replace(/^\s+|\s+$/gm, '').length == 0) {
      this.alertService.error('Please enter Field Name!');
      return;
    }
    // stop here if form is invalid
    if (this.SeniorMasterForm.invalid) {
      return;
    }
    if (this.SeniorMasterForm.pristine) {
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
    this.objSeniorMaster.DepartmentID = this.SeniorMasterForm.controls['DepartmentID'].value;
    this.objSeniorMaster.TableName = this.SeniorMasterForm.controls['TableName'].value;
    this.objSeniorMaster.DisplayName = this.SeniorMasterForm.controls['DisplayName'].value;
    this.objSeniorMaster.FieldName = this.SeniorMasterForm.controls['FieldName'].value;
    this.objSeniorMaster.WhereClause = this.SeniorMasterForm.controls['WhereClause'].value;

    this._SeniorMasterService.Insert(this.objSeniorMaster).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.alertService.success(data.Msg);
        }
        else {
          this.alertService.error(data.Msg);
        }
        $('#modalpopupSeniorMasterupsert').modal('hide');
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
    this.objSeniorMaster.SeniorMasterTableID = this.identity;
    this.objSeniorMaster.DepartmentID = this.SeniorMasterForm.controls['DepartmentID'].value;
    this.objSeniorMaster.TableName = this.SeniorMasterForm.controls['TableName'].value;
    this.objSeniorMaster.DisplayName = this.SeniorMasterForm.controls['DisplayName'].value;
    this.objSeniorMaster.FieldName = this.SeniorMasterForm.controls['FieldName'].value;
    this.objSeniorMaster.WhereClause = this.SeniorMasterForm.controls['WhereClause'].value;
    this.objSeniorMaster.IsActive = this.SeniorMasterForm.controls['IsActive'].value;

    this._SeniorMasterService.Update(this.objSeniorMaster).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.alertService.success(data.Msg);
        }
        else {
          this.alertService.error(data.Msg);
        }
        $('#modalpopupSeniorMasterupsert').modal('hide');
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
    // if (this._authorizationGuard.CheckAcess("SeniorMasterlist", "ViewEdit")) {
    //   return;
    // }
    this.identity = + id;
    this.deleteColumn = DeleteColumnvalue;
    $('#modaldeleteconfimation').modal('show');
  }

  delete() {
    this.objSeniorMaster.SeniorMasterTableID = this.identity;
    this._SeniorMasterService.Delete(this.objSeniorMaster).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
          this.alertService.success(data.Msg);
        } else {
          this.alertService.error('SeniorMaster – ' + this.deleteColumn + ' is being used in the application, Can’t be deleted.!');
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
    return this._SeniorMasterService.Search(SearchBy, Search, IsActive).subscribe(
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
    field: 'TableName',
    dir: 'asc'
  }];
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  private items: SeniorMaster[] = [] as any;
  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'TableName', operator: 'contains', value: '' }]
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
