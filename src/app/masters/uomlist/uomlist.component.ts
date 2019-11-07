import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { UomService } from '../../_services/service/uom.service';
import { UOM, Dropdown } from '../../_services/model';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'

import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
@Component({
  selector: 'app-uomlist',
  templateUrl: './uomlist.component.html',
  styleUrls: ['./uomlist.component.css']
})
export class UomlistComponent implements OnInit {
  lstUOMMaster: Dropdown[];
   objUOM: UOM = {} as any;
  uomForm: FormGroup;
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
    private _uomService: UomService,
    
    private _authorizationGuard: AuthorizationGuard,
    private fb: FormBuilder,
    private _PrivateutilityService: PrivateutilityService,
  ) { }


  //#region Validation Start
  formErrors = {
    'UOM': '',
    'Description': '',
    'MultiplierValue': '',
  };

  // This object contains all the validation messages for this form
  validationMessages = {
    'UOM': {
      'required': 'This Field is required.',
      'UOMInUse': 'This UOM is already registered!'
    },
    'Description': {
      'required': 'This Field is required.',
      'pattern': 'This Field must be a Alphabet.'
    },
    'MultiplierValue': {
      'required': 'This Field is required.',
      'pattern': 'This Field  must be numeric value.',
      'min': 'This Field must be 0-100000.',
      'max': 'This Field must be 0-100000.',
    }
  };

  logValidationErrors(group: FormGroup = this.uomForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      // if (abstractControl && abstractControl.value && !abstractControl.value.replace(/^\s+|\s+$/gm, '').length) {
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
    //
    this._PrivateutilityService.GetValues('UOM')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstUOMMaster = data;
          //
        },
        (err: any) => {
          console.log(err); 
        }
      );

    this.SearchBy = '';
    this.SearchKeyword = '';
    this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);

    this.panelTitle = 'Add New UOM';
    this.action = true;
    this.identity = 0;
    this.uomForm = this.fb.group({
      UOM: ['', [Validators.required]],
      Description: ['', [Validators.required]],
      MultiplierValue: [1, [Validators.required,
      // Validators.min(0.01),
      Validators.min(1),
      Validators.max(100000),
      //  Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")
      Validators.pattern("^([0-9]+)$")
      ]

      ],
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
    if (this._authorizationGuard.CheckAcess("Uomlist", "ViewEdit")) {
      return;
    }
    $('#modalpopupuomupsert').modal('show');
    this.logValidationErrors();
    this.uomForm = this.fb.group({
      UOM: ['', [Validators.required]],
      Description: ['', [Validators.required]],
      MultiplierValue: [1, [Validators.required,
      // Validators.min(0.01),
      Validators.min(1),
      Validators.max(100000),
      //  Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")
      Validators.pattern("^([0-9]+)$")
      ]

      ],
      IsActive: [0,],
    });
    this.panelTitle = "Add New UOM";
    this.action = true;
    this.uomForm.patchValue({
      UOM: '',
      Description: '',
      MultiplierValue: 1,
      IsActive: '',
    });
    $('#UOM').removeAttr("disabled");
  }

  editButtonClick(id: number) {
    if (this._authorizationGuard.CheckAcess("Uomlist", "ViewEdit")) {
      return;
    }
    this.uomForm = this.fb.group({
      UOM: ['', [Validators.required]],
      Description: ['', [Validators.required]],
      MultiplierValue: [1, [Validators.required,
      // Validators.min(0.01),
      Validators.min(1),
      Validators.max(100000),
      //  Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")
      Validators.pattern("^([0-9]+)$")
      ]

      ],
      IsActive: [0,],
    });
    this.panelTitle = "Edit UOM";
    this.action = false;
    this.identity = + id;
    //
    this._uomService.getUOM(this.identity)
      .subscribe(
        (data: UOM) => {
          //
          this.uomForm.patchValue({
            UOM: data.UOM,
            Description: data.Description,
            MultiplierValue: data.MultiplierValue,
            IsActive: data.IsActive,
          });
          $("#UOM").attr("disabled", "disabled");
          this.logValidationErrors();
        },
        (err: any) => {
          console.log(err);
          //
        }
      );
    $('#modalpopupuomupsert').modal('show');
  }

  confirmDeleteid(id: number, DeleteColumnvalue: string) {
    if (this._authorizationGuard.CheckAcess("Uomlist", "ViewEdit")) {
      return;
    }
    this.identity = + id;
    this.deleteColumn = DeleteColumnvalue;
    $('#modaldeleteconfimation').modal('show');
  }

  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("Uomlist", "ViewEdit")) {
      return;
    }
    if (this.uomForm.controls['Description'].value.replace(/^\s+|\s+$/gm, '').length == 0) {
      this.alertService.error('Please enter Description!');
      return;
    }
    // stop here if form is invalid
    if (this.uomForm.invalid) {
      return;
    }
    if (this.uomForm.pristine) {
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
    this.objUOM.UOM = this.uomForm.controls['UOM'].value;
    this.objUOM.Description = this.uomForm.controls['Description'].value;
    this.objUOM.MultiplierValue = this.uomForm.controls['MultiplierValue'].value;
    this.objUOM.IsActive = this.uomForm.controls['IsActive'].value;

    //
    this._uomService.existUOM(this.objUOM.UOMID, this.objUOM.UOM, this.objUOM.Description)
      .subscribe(
        (data) => {
          if (data == true) {
            this.alertService.error('This UOM is already registered');
          }
          else {
            //
            this._uomService.add(this.objUOM).subscribe(
              (data) => {
                if (data != null && data == true) {
                  //
                  this.alertService.success('UOM data has been added successfully');
                }
                else {
                  //
                  this.alertService.error('UOM creation failed!');
                }
                $('#modalpopupuomupsert').modal('hide');
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
          console.log(error);
        }
      );


  }

  Update() {
    this.objUOM.UOMID = this.identity;
    this.objUOM.UOM = this.uomForm.controls['UOM'].value;
    this.objUOM.Description = this.uomForm.controls['Description'].value;
    this.objUOM.MultiplierValue = this.uomForm.controls['MultiplierValue'].value;
    this.objUOM.IsActive = this.uomForm.controls['IsActive'].value;
    //

    this._uomService.existUOM(this.objUOM.UOMID, this.objUOM.UOM, this.objUOM.Description)
      .subscribe(
        (data) => {
          if (data == true) {
            this.alertService.error('This UOM is already registered');
          }
          else {
            //
            this._uomService.update(this.objUOM).subscribe(
              (data) => {
                if (data != null && data == true) {
                  //
                  this.alertService.success('UOM data has been updated successful');
                }
                else {
                  //
                  this.alertService.error('UOM not saved!');
                }
                $('#modalpopupuomupsert').modal('hide');
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
    this._uomService.delete(this.identity).subscribe(
      (data) => {
        if (data) {
          this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
          this.alertService.success('UOM data has been deleted successful');
        } else {
          this.alertService.error('UOM – ' + this.deleteColumn + ' is being used in the application, Can’t be deleted.!');
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
    return this._uomService.getUOMS(SearchBy, Search, IsActive).subscribe(
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
  public allowUnsort = true;
  public sort: SortDescriptor[] = [{
    field: 'UOM',
    dir: 'asc'
  }];
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  private items: UOM[] = [] as any;
  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'UOM', operator: 'contains', value: '' }]
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
