import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CustomeritemService } from '../../_services/service/customeritem.service';
import { Customeritem, Customer, ProductGroup, Category, SubCategory, Item } from '../../_services/model';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
@Component({
  selector: 'app-customeritemlist',
  templateUrl: './customeritemlist.component.html',
  styleUrls: ['./customeritemlist.component.css']
})
export class CustomeritemlistComponent implements OnInit {

  lstCustomer: Customer[];
  lstProductGroup: ProductGroup[];
  lstCategory: Category[];
  lstSubCategory: SubCategory[];
  lstItem: Item[];
  lstCustomeritem: Customeritem[];
  objCustomeritem: Customeritem = {} as any;
  CustomerItemForm: FormGroup;
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
    private _customeritemService: CustomeritemService,
    private _spinner: NgxSpinnerService,
    private _authorizationGuard: AuthorizationGuard,
    private fb: FormBuilder,
    private _PrivateutilityService: PrivateutilityService,
  ) { }


  //#region Validation Start
  formErrors = {
    'CustomerItemCode': '',
    'CustomerID': '',
    'ItemID': '',
  };

  // This object contains all the validation messages for this form
  validationMessages = {
    'CustomerItemCode': {
      'required': 'This Field is required.',
    },
    'CustomerID': {
      'min': 'This Field is required.',
    },
    'ItemID': { 
      'min': 'This Field is required.',
    },
  };

  logValidationErrors(group: FormGroup = this.CustomerItemForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      // if (abstractControl && abstractControl.value && !abstractControl.value.replace(/\s/g, '').length) {
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

    this.panelTitle = 'Add New Customer item code ';
    this.action = true;
    this.identity = 0;
    this.CustomerItemForm = this.fb.group({
      CustomerItemCode: ['', [Validators.required]],
      CustomerID: [0, [ Validators.min(1)]],
      ProductGroupID: [0, []],
      CategoryID: [0, []],
      SubCategoryID: [0, []],
      ItemID: [0, [ Validators.min(1)]],
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
    if (this._authorizationGuard.CheckAcess("Customeritemlist", "ViewEdit")) {
      return;
    }
    this._spinner.show();
    this._PrivateutilityService.getCustomers()
      .subscribe(
        (data: Customer[]) => {
          this.lstCustomer = data;
          this._spinner.hide();
        },
        (err: any) => {
          console.log(err);
          this._spinner.hide();
        }
      );
    this._spinner.show();
    this._PrivateutilityService.getProductGroups()
      .subscribe(
        (data: ProductGroup[]) => {
          this.lstProductGroup = data;
          this._spinner.hide();
        },
        (err: any) => {
          console.log(err);
          this._spinner.hide();
        }
      );

    $('#modalpopupcustomeritemupsert').modal('show');
    this.logValidationErrors();
    this.CustomerItemForm = this.fb.group({
      CustomerItemCode: ['', [Validators.required, Validators.maxLength(30)]],
      CustomerID: [0, [Validators.required, Validators.min(1)]],
      ProductGroupID: [0, []],
      CategoryID: [0, []],
      SubCategoryID: [0, []],
      ItemID: [0, [Validators.required, Validators.min(1)]],
      IsActive: [0,],
    });
    this.panelTitle = "Add New Customer Item Code";
    this.action = true;
    this.CustomerItemForm.patchValue({
      CustomerItemCode: '',
      CustomerID: 0,
      ItemID: 0,
      IsActive: '',
    });
    $('#CustomerID').removeAttr("disabled");
    $('#ItemID').removeAttr("disabled");
    $('#CustomerItemCode').removeAttr("disabled");
  }

  editButtonClick(id: number) {
    if (this._authorizationGuard.CheckAcess("Customeritemlist", "ViewEdit")) {
      return;
    }
    this._spinner.show();
    this._PrivateutilityService.getCustomers()
      .subscribe(
        (data: Customer[]) => {
          this.lstCustomer = data;
          this._spinner.hide();
        },
        (err: any) => {
          console.log(err);
          this._spinner.hide();
        }
      );
    this._spinner.show();
    this._PrivateutilityService.getProductGroups()
      .subscribe(
        (data: ProductGroup[]) => {
          this.lstProductGroup = data;
          this._spinner.hide();
        },
        (err: any) => {
          console.log(err);
          this._spinner.hide();
        }
      );

    this.CustomerItemForm = this.fb.group({
      CustomerItemCode: ['', [Validators.required, Validators.maxLength(30)]],
      CustomerID: [0, [Validators.required, Validators.min(1)]],
      ProductGroupID: [0, []],
      CategoryID: [0, []],
      SubCategoryID: [0, []],
      ItemID: [0, [Validators.required, Validators.min(1)]],
      IsActive: [0,],
    });
    this.panelTitle = "Edit Customer Item Code";
    this.action = false;
    this.identity = + id;
    this._customeritemService.searchById(this.identity)
      .subscribe(
        (data: Customeritem) => {
          var CustomerID = data.CustomerID.toString();
          var ItemID = data.ItemID.toString();
          this.CustomerItemForm.patchValue({
            CustomerItemCode: data.CustomerItemCode,
            CustomerID: CustomerID,
            ItemID: ItemID,
            IsActive: data.IsActive,
          });
          $("#CustomerID").attr("disabled", "disabled");
          $("#ItemID").attr("disabled", "disabled");
          $("#CustomerItemCode").attr("disabled", "disabled");
          this.logValidationErrors();
        },
        (err: any) =>
          console.log(err)
      );
    $('#modalpopupcustomeritemupsert').modal('show');
  }

  confirmDeleteid(id: number, DeleteColumnvalue: string) {
    if (this._authorizationGuard.CheckAcess("Customeritemlist", "ViewEdit")) {
      return;
    }
    this.identity = + id;
    this.deleteColumn = DeleteColumnvalue;
    $('#modaldeleteconfimation').modal('show');
  }

  onLoad(SearchBy: string, Search: string, IsActive: Boolean) {
    this._spinner.show();
    return this._customeritemService.search(SearchBy, Search, IsActive).subscribe(
      (employeeList) => {
        this.lstCustomeritem = employeeList;
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

  onchangeProductGroupID(selectedValue: string) {
    let id = parseInt(selectedValue);
    if (id > 0) {
      this._spinner.show();
      this._PrivateutilityService.getCategories(id)
        .subscribe(
          (statesa: Category[]) => {
            this.lstCategory = statesa;
            this._spinner.hide();
          },
          (err: any) => {
            console.log(err);
            this._spinner.hide();
          }
        );
    }
  }

  onchangeCategoryID(selectedValue: string) {
    let id = parseInt(selectedValue);
    if (id > 0) {
      this._spinner.show();
      this._PrivateutilityService.getSubCategories(id)
        .subscribe(
          (data: SubCategory[]) => {
            this.lstSubCategory = data
            this._spinner.hide();
          },
          (err: any) => {
            console.log(err);
            this._spinner.hide();
          }
        );
    }
  }

  onchangeSubCategoryID(selectedValue: string) {
    let id = parseInt(selectedValue);
    if (id > 0) {
      this._spinner.show();
      this._PrivateutilityService.getItems(id)
        .subscribe(
          (data: Item[]) => {
            this.lstItem = data;
            this._spinner.hide();
          },
          (err: any) => {
            console.log(err);
            this._spinner.hide();
          }
        );
    }
  }

  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("Customeritemlist", "ViewEdit")) {
      return;
    }
    if (this.CustomerItemForm.controls['CustomerItemCode'].value.replace(/\s/g, '').length == 0) {
      this.alertService.error('Please enter Customer ItemCode!');
      return;
    }
    // stop here if form is invalid
    if (this.CustomerItemForm.invalid) {
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
    this.objCustomeritem.CustomerItemCode = this.CustomerItemForm.controls['CustomerItemCode'].value;
    this.objCustomeritem.CustomerID = this.CustomerItemForm.controls['CustomerID'].value;
    this.objCustomeritem.ItemID = this.CustomerItemForm.controls['ItemID'].value;
    this.objCustomeritem.IsActive = this.CustomerItemForm.controls['IsActive'].value;

    this._spinner.show();
    this._customeritemService.exist(this.objCustomeritem.CustomerItemID,
      this.objCustomeritem.ItemID, this.objCustomeritem.CustomerID)
      .subscribe(
        (data) => {
          if (data == true) {
            this.alertService.error('This Customer Item Code has been registered already,You can not create again!');
          }
          else {
            this._spinner.show();
            this._customeritemService.add(this.objCustomeritem).subscribe(
              (data) => {
                if (data != null && data == true) {
                  this._spinner.hide();
                  this.alertService.success('Customer item code  data has been added successfully');
                }
                else {
                  this._spinner.hide();
                  this.alertService.error('Customer item code  creation failed!');
                }
                $('#modalpopupcustomeritemupsert').modal('hide');
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
    this.objCustomeritem.CustomerItemID = this.identity;
    this.objCustomeritem.CustomerItemCode = this.CustomerItemForm.controls['CustomerItemCode'].value;
    this.objCustomeritem.CustomerID = this.CustomerItemForm.controls['CustomerID'].value;
    this.objCustomeritem.ItemID = this.CustomerItemForm.controls['ItemID'].value;
    this.objCustomeritem.IsActive = this.CustomerItemForm.controls['IsActive'].value;
    this._spinner.show();

    this._customeritemService.exist(this.objCustomeritem.CustomerItemID,
      this.objCustomeritem.ItemID, this.objCustomeritem.CustomerID)
      .subscribe(
        (data) => {
          if (data == true) {
            this.alertService.error('This Customer Item Code has been registered already,You can not update again!');
          }
          else {
            this._spinner.show();
            this._customeritemService.update(this.objCustomeritem).subscribe(
              (data) => {
                if (data != null && data == true) {
                  this._spinner.hide();
                  this.alertService.success('Customer item code  data has been updated successful');
                }
                else {
                  this._spinner.hide();
                  this.alertService.error('Customer item code  not saved!');
                }
                $('#modalpopupcustomeritemupsert').modal('hide');
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
    this._customeritemService.delete(this.identity).subscribe(
      (data) => {
        if (data) {
          this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
          this.alertService.success('Customer item code  data has been deleted successful');
        } else {
          this.alertService.error('Customer item code  – ' + this.deleteColumn + ' is being used in the application, Can’t be deleted.!');
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
