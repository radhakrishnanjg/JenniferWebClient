import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { VendoritemService } from '../../_services/service/vendoritem.service';
import { Vendoritem, Vendor, Dropdown, ProductGroup, Category, SubCategory, Item } from '../../_services/model';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';

import { UsernameValidator } from '../../_validators/username';
@Component({
  selector: 'app-vendoritemlist',
  templateUrl: './vendoritemlist.component.html',
  styleUrls: ['./vendoritemlist.component.css']
})
export class VendoritemlistComponent implements OnInit {
  lstCustomer: Vendor[];
  lstProductGroup: ProductGroup[];
  lstCategory: Category[];
  lstSubCategory: SubCategory[];
  lstItem: Item[];
  lstCommercialType: Dropdown[];
  objVendoritem: Vendoritem = {} as any;
  vendortemForm: FormGroup;
  panelTitle: string;
  action: boolean;
  identity: number = 0;
  deleteColumn: string;
  dtOptions: DataTables.Settings = {};
  SearchBy: string = '';
  SearchKeyword: string = '';
  Searchaction: boolean = true;
  ItemCode: string = '';
  constructor(
    private alertService: ToastrService,
    private _vendoritemService: VendoritemService,
    
    private _authorizationGuard: AuthorizationGuard,
    private fb: FormBuilder,
    private _PrivateutilityService: PrivateutilityService,
    private usernameValidator: UsernameValidator,
  ) { }


  //#region Validation Start
  formErrors = {
    'VendorItemCode': '',
    'VendorID': '',
    'ItemID': '',
    'CommercialType': '',
  };

  // This object contains all the validation messages for this form
  validationMessages = {
    'VendorItemCode': {
      'required': 'This Field is required.',
      'VendorItemCodeInUse': 'Vendor ItemCode is already registered!',
    },
    'VendorID': {
      'min': 'This Field is required.',
    },
    'ItemID': {
      'min': 'This Field is required.',
    },
    'CommercialType': {
      'required': 'This Field is required.',
    },
  };

  logValidationErrors(group: FormGroup = this.vendortemForm): void {
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

    this.panelTitle = 'Add New Vendor item code ';
    this.action = true;
    this.identity = 0;
    this.vendortemForm = this.fb.group({
      VendorItemCode: ['', [Validators.required],
        this.usernameValidator.existVendorItemCode(this.identity)],
      VendorID: [0, [Validators.min(1)]],
      ProductGroupID: [0, []],
      CategoryID: [0, []],
      SubCategoryID: [0, []],
      ItemID: [0, [Validators.min(1)]],
      CommercialType: ['', [Validators.required,]],
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
    if (this._authorizationGuard.CheckAcess("Vendoritemlist", "ViewEdit")) {
      return;
    }
    //
    this._PrivateutilityService.getVendors()
      .subscribe(
        (data: Vendor[]) => {
          this.lstCustomer = data;
          //
        },
        (err: any) => {
          console.log(err);
          //
        }
      );


    //
    this._PrivateutilityService.GetValues('Commercial Type')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstCommercialType = data;
          //
        },
        (err: any) => {
          console.log(err);
          //
        }
      );
    //
    this._PrivateutilityService.getProductGroups()
      .subscribe(
        (data: ProductGroup[]) => {
          this.lstProductGroup = data
        },
        (err: any) => {
          console.log(err);
          //
        }
      );

    $('#modalpopupvendoritemupsert').modal('show');
    this.logValidationErrors();
    this.vendortemForm = this.fb.group({
      VendorItemCode: ['', [Validators.required],
        this.usernameValidator.existVendorItemCode(this.identity)],
      VendorID: [0, [Validators.required, Validators.min(1)]],
      ProductGroupID: [0, []],
      CategoryID: [0, []],
      SubCategoryID: [0, []],
      ItemID: [0, [Validators.required, Validators.min(1)]],
      CommercialType: ['', [Validators.required,]],
      IsActive: [0,],
    });
    this.panelTitle = "Add New Vendor Item Code";
    this.action = true;
    this.vendortemForm.patchValue({
      VendorItemCode: '',
      VendorID: 0,
      ItemID: 0,
      IsActive: '',
    });
    $('#VendorID').removeAttr("disabled");
    $('#ItemID').removeAttr("disabled");
    $('#VendorItemCode').removeAttr("disabled");
  }

  editButtonClick(id: number) {
    if (this._authorizationGuard.CheckAcess("Vendoritemlist", "ViewEdit")) {
      return;
    }
    //
    this._PrivateutilityService.getVendors()
      .subscribe(
        (data: Vendor[]) => {
          this.lstCustomer = data;
          //
        },
        (err: any) => {
          console.log(err);
          //
        }
      );


    //
    this._PrivateutilityService.GetValues('Commercial Type')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstCommercialType = data;
          //
        },
        (err: any) => {
          console.log(err);
          //
        }
      );
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

    this.vendortemForm = this.fb.group({
      VendorItemCode: ['', [Validators.required],
        this.usernameValidator.existVendorItemCode(this.identity)],
      VendorID: [0, [Validators.required, Validators.min(1)]],
      ProductGroupID: [0, []],
      CategoryID: [0, []],
      SubCategoryID: [0, []],
      ItemID: [0, [Validators.required, Validators.min(1)]],
      CommercialType: ['', [Validators.required,]],
      IsActive: [0,],
    });
    this.panelTitle = "Edit vendor item code";
    this.action = false;
    this.identity = + id;
    //
    this._vendoritemService.searchById(this.identity)
      .subscribe(
        (data: Vendoritem) => {
          var VendorID = data.VendorID.toString();
          var ItemID = data.ItemID.toString();
          this.vendortemForm.patchValue({
            VendorItemCode: data.VendorItemCode,
            VendorID: VendorID,
            ItemID: ItemID,
            CommercialType: data.CommercialType,
            IsActive: data.IsActive,
          });
          this.ItemCode = data.ItemCode;
          $("#VendorID").attr("disabled", "disabled");
          $("#ItemID").attr("disabled", "disabled");
          $("#VendorItemCode").attr("disabled", "disabled");
          this.logValidationErrors();

          //
        },
        (err: any) => {
          console.log(err);
          //
        }
      );
    $('#modalpopupvendoritemupsert').modal('show');
  }

  confirmDeleteid(id: number, DeleteColumnvalue: string) {
    if (this._authorizationGuard.CheckAcess("Vendoritemlist", "ViewEdit")) {
      return;
    }
    this.identity = + id;
    this.deleteColumn = DeleteColumnvalue;
    $('#modaldeleteconfimation').modal('show');
  }



  onchangeProductGroupID(selectedValue: string) {
    let id = parseInt(selectedValue);
    if (id > 0) {
      //
      this._PrivateutilityService.getCategories(id)
        .subscribe(
          (statesa: Category[]) => {
            this.lstCategory = statesa;
            //
          },
          (err: any) => {
            console.log(err);
            //
          }
        );
    }
  }

  onchangeCategoryID(selectedValue: string) {
    let id = parseInt(selectedValue);
    if (id > 0) {
      //
      this._PrivateutilityService.getSubCategories(id)
        .subscribe(
          (data: SubCategory[]) => {
            this.lstSubCategory = data
            //
          },
          (err: any) => {
            console.log(err);
            //
          }
        );
    }
  }

  onchangeSubCategoryID(selectedValue: string) {
    let id = parseInt(selectedValue);
    if (id > 0) {
      //
      this._PrivateutilityService.getItems(id)
        .subscribe(
          (data: Item[]) => {
            this.lstItem = data;
            //
          },
          (err: any) => {
            console.log(err);
            //
          }
        );
    }
  }



  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("Vendoritemlist", "ViewEdit")) {
      return;
    }
    if (this.vendortemForm.controls['VendorItemCode'].value.replace(/^\s+|\s+$/gm, '').length == 0) {
      this.alertService.error('Please enter Vendor ItemCode!');
      return;
    }
    // stop here if form is invalid
    if (this.vendortemForm.invalid) {
      return;
    }
    if (this.vendortemForm.pristine) {
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
    this.objVendoritem.VendorItemCode = this.vendortemForm.controls['VendorItemCode'].value;
    this.objVendoritem.VendorID = this.vendortemForm.controls['VendorID'].value;
    this.objVendoritem.ItemID = this.vendortemForm.controls['ItemID'].value;
    this.objVendoritem.CommercialType = this.vendortemForm.controls['CommercialType'].value;
    this.objVendoritem.IsActive = this.vendortemForm.controls['IsActive'].value;

    //
    this._vendoritemService.exist(this.objVendoritem.VendorItemID,
      this.objVendoritem.ItemID, this.objVendoritem.VendorID)
      .subscribe(
        (data) => {
          if (data == true) {
            this.alertService.error('This Vendor Item Code has been registered already,You can not update again!');
          }
          else {
            //
            this._vendoritemService.add(this.objVendoritem).subscribe(
              (data) => {
                if (data != null && data == true) {
                  //
                  this.alertService.success('Vendor item code  data has been added successfully');
                }
                else {
                  //
                  this.alertService.error('Vendor item code  creation failed!');
                }
                $('#modalpopupvendoritemupsert').modal('hide');
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
    this.objVendoritem.VendorItemID = this.identity;
    this.objVendoritem.VendorItemCode = this.vendortemForm.controls['VendorItemCode'].value;
    this.objVendoritem.VendorID = this.vendortemForm.controls['VendorID'].value;
    this.objVendoritem.ItemID = this.vendortemForm.controls['ItemID'].value;
    this.objVendoritem.CommercialType = this.vendortemForm.controls['CommercialType'].value;
    this.objVendoritem.IsActive = this.vendortemForm.controls['IsActive'].value;
    //

    this._vendoritemService.exist(this.objVendoritem.VendorItemID,
      this.objVendoritem.ItemID, this.objVendoritem.VendorID)
      .subscribe(
        (data) => {
          if (data == true) {
            this.alertService.error('This Vendor Item Code has been registered already,You can not update again!');
          }
          else {
            //
            this._vendoritemService.update(this.objVendoritem).subscribe(
              (data) => {
                if (data != null && data == true) {
                  //
                  this.alertService.success('Vendor item code  data has been updated successful');
                }
                else {
                  //
                  this.alertService.error('Vendor item code  not saved!');
                }
                $('#modalpopupvendoritemupsert').modal('hide');
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
    this._vendoritemService.delete(this.identity).subscribe(
      (data) => {
        if (data) {
          this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
          this.alertService.success('Vendor item code  data has been deleted successful');
        } else {
          this.alertService.error('Vendor item code  – ' + this.deleteColumn + ' is being used in the application, Can’t be deleted.!');
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
    return this._vendoritemService.search(SearchBy, Search, IsActive).subscribe(
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
    field: 'VendorName',
    dir: 'asc'
  }];
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  private items: Vendoritem[] = [] as any;
  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'VendorName', operator: 'contains', value: '' }]
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
    this.gridView = process(this.items, {
      skip: this.skip,
      take: this.skip + this.pageSize,
      filter: {
        logic: "or",
        filters: [
          {
            field: 'VendorName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'ItemCode',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'VendorItemCode',
            operator: 'contains',
            value: inputValue
          }, 
          {
            field: 'CommercialType',
            operator: 'contains',
            value: inputValue
          },  
        ],
      }
    })  ;  
  }
  //#endregion Paging Sorting and Filtering End


}
