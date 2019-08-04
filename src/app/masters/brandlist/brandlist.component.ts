import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'; 
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UsernameValidator } from  '../../_validators/username';
import { BrandService } from  '../../_services/service/brand.service';
import { Brand } from  '../../_services/model'; 
import { AuthorizationGuard } from  '../../_guards/Authorizationguard'
@Component({
  selector: 'app-brandlist',
  templateUrl: './brandlist.component.html',
  styleUrls: ['./brandlist.component.css']
})
export class BrandlistComponent implements OnInit {
 
  lstBrand: Brand[];
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
    private _spinner: NgxSpinnerService,
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
      'BrandInUse': 'This Brand has been registered already'
    },
  };

  logValidationErrors(group: FormGroup = this.brandForm): void {
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
 

    
    this.SearchBy = '';
    this.SearchKeyword = '';
    this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
 
    this.brandForm = this.fb.group({
      BrandName: ['', [Validators.required, Validators.maxLength(30)]
        , this._usernameValidator.existBrand(this.identity)
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
        , this._usernameValidator.existBrand(this.identity)
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
        , this._usernameValidator.existBrand(this.identity)
      ],
      IsActive: [0,],
    });
    this._uomService.searchById(this.identity)
      .subscribe(
        (data: Brand) => {
          this.brandForm.patchValue({
            BrandName: data.BrandName,
            IsActive: data.IsActive,
          }); 
          this.logValidationErrors();
        },
        (err: any) =>
          console.log(err)
      );
    $('#modalpopupbrandupsert').modal('show');
  }

  

  onLoad(SearchBy: string, Search: string, IsActive: Boolean) {
    this._spinner.show();
    return this._uomService.search(SearchBy, Search, IsActive).subscribe(
      (lst) => {
        this.lstBrand = lst;
        this.dtOptions = {
          pagingType: 'full_numbers',
          "language": {
            "search": 'Filter',
          },
        };
		
        this._spinner.hide();
      },
      (err) => {
        this._spinner.hide();
        console.log(err);
      }
    );
  }

  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("Brandlist", "ViewEdit")) {
      return;
    }
    if (this.brandForm.controls['BrandName'].value.replace(/\s/g, '').length == 0) {
      this.alertService.error('Please enter BrandName!');
      return;
    }
    // stop here if form is invalid
    if (this.brandForm.invalid) {
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

    this._spinner.show();
    this._uomService.add(this.objBrand).subscribe(
      (data) => {
        if (data !=null && data == true) {
          this._spinner.hide();
          this.alertService.success('Brand data has been added successfully');
        }
        else {
          this._spinner.hide();
          this.alertService.error('Brand creation failed!');
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
    this.objBrand.BrandID = this.identity;
    this.objBrand.BrandName = this.brandForm.controls['BrandName'].value;
    this.objBrand.IsActive = this.brandForm.controls['IsActive'].value;

    this._spinner.show();
    this._uomService.update(this.objBrand).subscribe(
      (data) => {
        if (data !=null && data == true) {
          this._spinner.hide();
          this.alertService.success('Brand data has been updated successful');
        }
        else {
          this._spinner.hide();
          this.alertService.error('Brand not saved!');
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

  confirmDeleteid(id: number, DeleteColumnvalue: string) {
    if (this._authorizationGuard.CheckAcess("Brandlist", "ViewEdit")) {
      return;
    }
    this.identity = + id;
    this.deleteColumn = DeleteColumnvalue;
    $('#modaldeleteconfimation').modal('show');
  }
  delete() {
    this._spinner.show();
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
        this._spinner.hide();
      },
      (error: any) => {
        this._spinner.hide();
        console.log(error);
      }
    );
  }

}
