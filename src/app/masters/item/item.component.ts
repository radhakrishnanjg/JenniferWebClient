import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { AuthorizationGuard } from '../../_guards/Authorizationguard';
import { ItemService } from '../../_services/service/item.service';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { UsernameValidator } from '../../_validators/username';
import {
  Brand, Category, SubCategory, UOM, ProductGroup, Item, Apisettings, Itemtaxdetail,
  Itemhsndetail
} from '../../_services/model';
import { environment } from '../../../environments/environment';
import * as moment from 'moment';
@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  itemform: FormGroup;
  itemformupdate: FormGroup;
  taxform: FormGroup;
  hsnform: FormGroup;
  UploadForm: FormGroup;
  ImagePath: string;
  ImagePathChange: boolean = false;
  lstBrand: Brand[];
  lstProductGroup: ProductGroup[];
  lstCategory: Category[];
  lstSubCategory: SubCategory[];
  lstUOM: UOM[];
  UOMDescription: string = '';
  lst: Item[];
  obj: Item = {} as any;
  objtax: Itemtaxdetail = {} as any;
  objhsn: Itemhsndetail = {} as any;
  panelTitle: string;
  action: boolean;
  identity: number = 0;
  selectedFile: File;
  MinDate: moment.Moment;
  // taxStartDate: { startDate: moment.Moment, endDate: moment.Moment };
  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private aroute: ActivatedRoute,
    private alertService: ToastrService,
    private _usernameValidator: UsernameValidator,

    private _authorizationGuard: AuthorizationGuard,
    private _itemService: ItemService,
    private _PrivateutilityService: PrivateutilityService,
  ) { }

  //#region "Validation"

  formErrors = {
    'ItemName': '',
    'ItemCode': '',
    'BrandID': '',
    'CategoryID': '',
    'SubCategoryID': '',
    'UOMID': '',
    'TaxRate': '',
    'ItemColor': '',
    'ItemSize_Storage': '',
    'ItemModel_Style': '',
    'MRP': '',
    'HSNCode': '',
    'IsActive': '',
    'EAN_UPCCode': '',
    'IsTaxExempted': '',
    'Margin': '',
    'ProductGroupID': '',
    'TaxStartDate': '',
    'HSNStartDate': '',
  };

  formErrorsItem = {
    'ItemName': '',
    'ItemCode': '',
    'BrandID': '',
    'CategoryID': '',
    'SubCategoryID': '',
    'UOMID': '',
    'ItemColor': '',
    'ItemSize_Storage': '',
    'ItemModel_Style': '',
    'MRP': '',
    'IsActive': '',
    'EAN_UPCCode': '',
    'Margin': '',
    'ProductGroupID': '',
  };

  formErrorsTax = {
    'TaxRate': '',
    'IsTaxExempted': '',
    'TaxStartDate': '',
  };

  formErrorsHSN = {
    'HSNCode': '',
    'HSNStartDate': '',
  };

  validationMessages = {
    'ItemName': {
      'required': 'This field is required.',
    },
    'ItemCode': {
      'required': 'This field is required.',
      'ItemCodeInUse': 'Item Code is already registered!',
    },
    'BrandID': {
      'min': 'This field is required.',
    },
    'CategoryID': {
      'min': 'This field is required.',
    },
    'SubCategoryID': {
      'min': 'This field is required.',
    },
    'UOMID': {
      'min': 'This field is required.',
    },

    'ItemColor': {
      'maxlength': 'This field must be less than or equal to 20 characters.',
      'pattern': 'This field must be alphabets(a-Z).',
    },
    'ItemSize_Storage': {
      'maxlength': 'This field must be less than or equal to 20 characters.',
    },
    'ItemModel_Style': {
      'maxlength': 'This field must be less than or equal to 20 characters.',
    },
    'MRP': {
      'required': 'This field is required.',
      'pattern': 'This field must be numeric with only 2 decimals.',
      'min': 'This field must be more than 0.00',
      'max': 'This field can not exceed 10000000.00'
    },
    'Margin': {
      'pattern': 'This field must be numeric with only 2 decimals.',
      'min': 'This field must be more than 0.00',
      'max': 'This field can not exceed 100.00'
    },
    'TaxRate': {
      'required': 'This field is required.',
      'pattern': 'This field must be numeric with only 2 decimals.',
      'min': 'This field must be more than 0.00',
      'max': 'This field can not exceed 100.00'
    },
    'HSNCode': {
      'required': 'This field is required.',
    },
    'EAN_UPCCode': {
      'maxlength': 'This field must be less than or equal to 50 charecters.',
      'pattern': 'This field must be Alphanumeric.',
    },
    'ProductGroupID': {
      'min': 'This field is required.',
    },
    'TaxStartDate': {
      'required': 'This field is required.',
    },
    'HSNStartDate': {
      'required': 'This field is required.',
    }

  };

  validationMessagesItem = {
    'ItemName': {
      'required': 'This field is required.',
    },
    'ItemCode': {
      'required': 'This field is required.',
      'ItemCodeInUse': 'Item Code is already registered!',
    },
    'BrandID': {
      'min': 'This field is required.',
    },
    'CategoryID': {
      'min': 'This field is required.',
    },
    'SubCategoryID': {
      'min': 'This field is required.',
    },
    'UOMID': {
      'min': 'This field is required.',
    },

    'ItemColor': {
      'maxlength': 'This field must be less than or equal to 20 characters.',
      'pattern': 'This field must be alphabets(a-Z).',
    },
    'ItemSize_Storage': {
      'maxlength': 'This field must be less than or equal to 20 characters.',
    },
    'ItemModel_Style': {
      'maxlength': 'This field must be less than or equal to 20 characters.',
    },
    'MRP': {
      'required': 'This field is required.',
      'pattern': 'This field must be numeric with only 2 decimals.',
      'min': 'This field must be more than 0.00',
      'max': 'This field can not exceed 10000000.00'
    },
    'Margin': {
      'pattern': 'This field must be numeric with only 2 decimals.',
      'min': 'This field must be more than 0.00',
      'max': 'This field can not exceed 100.00'
    },
    'EAN_UPCCode': {
      'maxlength': 'This field must be less than or equal to 50 charecters.',
      'pattern': 'This field must be Alphanumeric.',
    },
    'ProductGroupID': {
      'min': 'This field is required.',
    },

  };

  validationMessagesTax = {
    'TaxRate': {
      'required': 'This field is required.',
      'pattern': 'This field must be numeric with only 2 decimals.',
      'min': 'This field must be more than 0.00',
      'max': 'This field can not exceed 100.00'
    },
    'TaxStartDate': {
      'required': 'This field is required.',
    },
  };

  validationMessagesHSN = {
    'HSNCode': {
      'required': 'This field is required.',
    },
    'HSNStartDate': {
      'required': 'This field is required.',
    }

  }; 

  logValidationErrors(group: FormGroup = this.itemform): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl && abstractControl.value && abstractControl.value.length > 0 && !abstractControl.value.replace(/^\s+|\s+$/gm, '').length) {
        abstractControl.setValue('');
      }
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

  logValidationErrorsItem(group: FormGroup = this.itemformupdate): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl && abstractControl.value && abstractControl.value.length > 0 && !abstractControl.value.replace(/^\s+|\s+$/gm, '').length) {
        abstractControl.setValue('');
      }
      this.formErrorsItem[key] = '';
      if (abstractControl && !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty)) {
        const messages = this.validationMessagesItem[key];

        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrorsItem[key] += messages[errorKey] + ' ';
          }
        }
      }

      if (abstractControl instanceof FormGroup) {
        this.logValidationErrorsItem(abstractControl);
      }
    });
  }

  logValidationErrorsTax(group: FormGroup = this.taxform): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl && abstractControl.value && abstractControl.value.length > 0 && !abstractControl.value.replace(/^\s+|\s+$/gm, '').length) {
        abstractControl.setValue('');
      }
      this.formErrorsTax[key] = '';
      if (abstractControl && !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty)) {
        const messages = this.validationMessagesTax[key];

        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrorsTax[key] += messages[errorKey] + ' ';
          }
        }
      }

      if (abstractControl instanceof FormGroup) {
        this.logValidationErrorsTax(abstractControl);
      }
    });
  }

  logValidationErrorsHSN(group: FormGroup = this.hsnform): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl && abstractControl.value && abstractControl.value.length > 0 && !abstractControl.value.replace(/^\s+|\s+$/gm, '').length) {
        abstractControl.setValue('');
      }
      this.formErrorsHSN[key] = '';
      if (abstractControl && !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty)) {
        const messages = this.validationMessagesHSN[key];

        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrorsHSN[key] += messages[errorKey] + ' ';
          }
        }
      }

      if (abstractControl instanceof FormGroup) {
        this.logValidationErrorsHSN(abstractControl);
      }
    });
  }

  formErrors1 = {
    'FileData': '',
  };

  validationMessages1 = {
    'FileData': {
      'required': 'File is required.',
    },
  };

  logValidationErrors1(group: FormGroup = this.UploadForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl && abstractControl.value && abstractControl.value.length > 0 && !abstractControl.value.replace(/^\s+|\s+$/gm, '').length) {
        abstractControl.setValue('');
      }
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

  //#endregion "Validation"

  endDate: string = '12-31-2099';

  ngOnInit() {
    this.getCurrentServerDateTime();
    this.getBrands();
    this.getProductGroups();
    this.getUOMs();

    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
      if (this.identity > 0) {
        this.panelTitle = "Edit Item";
        this.action = false;
        this.searchById(this.identity)
        this.updateItemForm();
        this.updateTaxForm();
        this.updateHSNForm();
      }
      else {
        this.action = true;
        this.panelTitle = "Add New Item";
        this.insertItemForm();
      }
    });

    this.UploadForm = this._fb.group({
      FileData: ['', [Validators.required]],
    });

  }

  private getCurrentServerDateTime() {
    this._PrivateutilityService.getCurrentDate()
      .subscribe(
        (data: Date) => {
          var mcurrentDate = moment(data, 'YYYY-MM-DD[T]HH:mm').add(1, 'days').format('MM-DD-YYYY HH:mm').toString();
          if (this.identity > 0) {
            this.taxform.patchValue({
              TaxStartDate: { startDate: new Date(mcurrentDate) },
            });
            this.hsnform.patchValue({
              HSNStartDate: { startDate: new Date(mcurrentDate) },
            });
          } else {
            this.itemform.patchValue({
              TaxStartDate: { startDate: new Date(mcurrentDate) },
              HSNStartDate: { startDate: new Date(mcurrentDate) },
            });
          }
          this.MinDate = moment(data).add(1, 'days');
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  private getBrands() {
    this._PrivateutilityService.getBrands()
      .subscribe(
        (data: Brand[]) => {
          this.lstBrand = data
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  private getProductGroups() {
    this._PrivateutilityService.getProductGroups()
      .subscribe(
        (data: ProductGroup[]) => {
          this.lstProductGroup = data;
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  private getUOMs() {
    this._PrivateutilityService.getUOMs()
      .subscribe(
        (data: UOM[]) => {
          this.lstUOM = data;
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  onchangeProductGroupID(selectedValue: string) {
    let id = parseInt(selectedValue);
    if (id > 0) {
      this._PrivateutilityService.getCategories(id)
        .subscribe(
          (statesa: Category[]) => {
            this.lstCategory = statesa;
          },
          (err: any) => {
            console.log(err);
          }
        );
    }
  }

  onchangeCategoryID(selectedValue: string) {
    let id = parseInt(selectedValue);
    if (id > 0) {
      this._PrivateutilityService.getSubCategories(id)
        .subscribe(
          (data: SubCategory[]) => {
            this.lstSubCategory = data
          },
          (err: any) => {
            console.log(err);
          }
        );
    }
  }

  onchangeUOMID(selectedValue: string) {
    let id = parseInt(selectedValue);
    this.UOMDescription = this.lstUOM.filter(a => a.UOMID == id)[0].Description;
  }

  private searchById(id: number) {
    this._itemService.getItem(this.identity)
      .subscribe(
        (data: Item) => {
          this.obj = data;
          var BrandID = data.BrandID.toString();
          var ProductGroupID = data.ProductGroupID.toString();
          var UOMID = data.UOMID.toString();
          var CategoryID = data.CategoryID.toString();
          var SubCategoryID = data.SubCategoryID.toString();
          this._PrivateutilityService.getCategories(parseInt(ProductGroupID))
            .subscribe(
              (statesa: Category[]) => {
                this.lstCategory = statesa;
              },
              (err: any) => {
                console.log(err);
              }
            );

          this._PrivateutilityService.getSubCategories(parseInt(CategoryID))
            .subscribe(
              (statesa: SubCategory[]) => {
                this.lstSubCategory = statesa;
              },
              (err: any) => {
                console.log(err);
              }
            );

          this.itemformupdate.patchValue({
            ItemName: data.ItemName,
            ItemCode: data.ItemCode,
            BrandID: BrandID,
            CategoryID: CategoryID,
            SubCategoryID: SubCategoryID,

            UOMID: UOMID,
            ItemColor: data.ItemColor,
            ItemSize_Storage: data.ItemSize_Storage,
            ItemModel_Style: data.ItemModel_Style,
            MRP: data.MRP,

            EAN_UPCCode: data.EAN_UPCCode,
            Margin: data.Margin,
            ProductGroupID: ProductGroupID,
            IsActive: data.IsActive,
          });

          this.taxform.patchValue({
            TaxRate: data.TaxRate.toString(),
            IsTaxExempted: data.IsTaxExempted,
          });

          this.hsnform.patchValue({
            HSNCode: data.HSNCode,
          });

          let itempath = data.ImagePath == null ? environment.defaultImageUrl : data.ImagePath;
          this.ImagePath = environment.basedomain + itempath;
          this.ImagePathChange = false;
          this.itemformupdate.get('ItemCode').disable();
          this.itemformupdate.get('MRP').disable();
          this.itemformupdate.get('Margin').disable();
          this.itemformupdate.get('UOMID').disable();
        },
        (err: any) => {
          console.log(err);
        }
      );
  }

  //#region "Insert Item"

  private insertItemForm() {
    this.itemform = this._fb.group({
      ItemName: ['', [Validators.required]],
      ItemCode: ['', [Validators.required],
        this._usernameValidator.existItemCode(this.identity)],
      ItemColor: ['', [Validators.maxLength(20), Validators.pattern("^([a-zA-Z ]+)$")]],
      ItemSize_Storage: ['', [Validators.maxLength(20)]],
      ItemModel_Style: ['', [Validators.maxLength(20)]],
      BrandID: [0, [Validators.required, Validators.min(1)]],
      HSNCode: ['', [Validators.required]],
      EAN_UPCCode: ['', [Validators.pattern("^([a-zA-Z0-9]+)$")]],
      ProductGroupID: [0, [Validators.min(1)]],
      CategoryID: [0, [Validators.required, Validators.min(1)]],
      SubCategoryID: [0, [Validators.required, Validators.min(1)]],
      TaxRate: ['', [Validators.required, Validators.min(0.01), Validators.max(100), Validators.pattern("(100|[0-9]{1,2})(\.[0-9]{1,2})?"),]],
      Margin: ['', [Validators.min(0.01), Validators.max(100), Validators.pattern("(100|[0-9]{1,2})(\.[0-9]{1,2})?"),]],
      MRP: ['', [Validators.required, Validators.min(0.01), Validators.max(10000000), Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")]],
      UOMID: [0, [Validators.min(1)]],
      IsTaxExempted: [0,],
      IsActive: [0,],
      TaxStartDate: ['', [Validators.required]],
      HSNStartDate: ['', [Validators.required]],
    });
  }

  onchangeIsTaxExempted(event: any) {
    if (event.target.checked) {
      this.itemform.get('TaxRate').disable();
      this.itemform.patchValue({
        TaxRate: 0
      });
    } else {
      this.itemform.get('TaxRate').enable();
    }
  }

  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("Itemlist", "ViewEdit")) {
      return;
    }

    // stop here if form is invalid
    if (this.itemform.invalid) {
      return;
    }
    if (this.itemform.pristine) {
      this.alertService.error('Please change the value for any one control to proceed further!');
      return;
    }
    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
    });
    if (this.identity > 0) {
      this.Update();
    }
    else {
      this.Insert();
    }
  }

  Insert() {
    if (this.itemform.controls['TaxStartDate'].value.startDate._d != undefined) {
      this.obj.TaxStartDate = this.itemform.controls['TaxStartDate'].value.startDate._d.toLocaleString();
    } else {
      this.obj.TaxStartDate = this.itemform.controls['TaxStartDate'].value.startDate.toLocaleString();
    }
    if (this.itemform.controls['HSNStartDate'].value.startDate._d != undefined) {
      this.obj.HSNStartDate = this.itemform.controls['HSNStartDate'].value.startDate._d.toLocaleString();
    } else {
      this.obj.HSNStartDate = this.itemform.controls['HSNStartDate'].value.startDate.toLocaleString();
    }

    this.obj.ItemName = this.itemform.controls['ItemName'].value;
    this.obj.ItemCode = this.itemform.controls['ItemCode'].value;
    this.obj.SubCategoryID = this.itemform.controls['SubCategoryID'].value;
    this.obj.UOMID = this.itemform.controls['UOMID'].value;
    this.obj.ProductGroupID = this.itemform.controls['ProductGroupID'].value;

    this.obj.BrandID = this.itemform.controls['BrandID'].value;
    this.obj.TaxRate = this.itemform.controls['TaxRate'].value;
    this.obj.ItemColor = this.itemform.controls['ItemColor'].value;
    this.obj.ItemSize_Storage = this.itemform.controls['ItemSize_Storage'].value;
    this.obj.ItemModel_Style = this.itemform.controls['ItemModel_Style'].value;

    this.obj.MRP = this.itemform.controls['MRP'].value;
    this.obj.HSNCode = this.itemform.controls['HSNCode'].value;
    this.obj.EAN_UPCCode = this.itemform.controls['EAN_UPCCode'].value;
    this.obj.IsTaxExempted = this.itemform.controls['IsTaxExempted'].value;
    this.obj.Margin = this.itemform.controls['Margin'].value;

    this._itemService.addItem(this.obj).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.alertService.success(data.Msg);
          this._router.navigate(['/Itemlist']);
        }
        else {
          this.alertService.error(data.Msg);
          this._router.navigate(['/Itemlist']);
        }
        this.identity = 0;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  //#endregion "Insert Item"

  //#region "Update Item"

  private updateItemForm() {
    this.itemformupdate = this._fb.group({
      ItemName: ['', [Validators.required]],
      ItemCode: ['', [Validators.required],
        this._usernameValidator.existItemCode(this.identity)],
      ItemColor: ['', [Validators.maxLength(20), Validators.pattern("^([a-zA-Z ]+)$")]],
      ItemSize_Storage: ['', [Validators.maxLength(20)]],
      ItemModel_Style: ['', [Validators.maxLength(20)]],
      BrandID: [0, [Validators.required, Validators.min(1)]],
      EAN_UPCCode: ['', [Validators.pattern("^([a-zA-Z0-9]+)$")]],
      ProductGroupID: [0, [Validators.min(1)]],
      CategoryID: [0, [Validators.required, Validators.min(1)]],
      SubCategoryID: [0, [Validators.required, Validators.min(1)]],
      Margin: ['', [Validators.min(0.01), Validators.max(100), Validators.pattern("(100|[0-9]{1,2})(\.[0-9]{1,2})?"),]],
      MRP: ['', [Validators.required, Validators.min(0.01), Validators.max(10000000), Validators.pattern("^[0-9]+(.[0-9]{0,2})?$")]],
      UOMID: [0, [Validators.min(1)]],
      IsActive: [0,],
    });
  }

  SaveDataItem(): void {
    if (this._authorizationGuard.CheckAcess("Itemlist", "ViewEdit")) {
      return;
    }

    // stop here if form is invalid
    if (this.itemformupdate.invalid) {
      return;
    }
    if (this.itemformupdate.pristine) {
      this.alertService.error('Please change the value for any one control to proceed further!');
      return;
    }
    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
    });
    if (this.identity > 0) {
      this.Update();
    }
  }

  Update() {
    this.obj.ItemID = this.identity;
    this.obj.ItemName = this.itemformupdate.controls['ItemName'].value;
    this.obj.ItemCode = this.itemformupdate.controls['ItemCode'].value;
    this.obj.SubCategoryID = this.itemformupdate.controls['SubCategoryID'].value;
    this.obj.UOMID = this.itemformupdate.controls['UOMID'].value;

    this.obj.ProductGroupID = this.itemformupdate.controls['ProductGroupID'].value;
    this.obj.BrandID = this.itemformupdate.controls['BrandID'].value;
    this.obj.ItemColor = this.itemformupdate.controls['ItemColor'].value;
    this.obj.ItemSize_Storage = this.itemformupdate.controls['ItemSize_Storage'].value;
    this.obj.ItemModel_Style = this.itemformupdate.controls['ItemModel_Style'].value;

    this.obj.MRP = this.itemformupdate.controls['MRP'].value;
    this.obj.EAN_UPCCode = this.itemformupdate.controls['EAN_UPCCode'].value;
    this.obj.Margin = this.itemformupdate.controls['Margin'].value;
    this.obj.IsActive = this.itemformupdate.controls['IsActive'].value;

    this._itemService.updateItem(this.obj).subscribe(
      (data) => {
        if (data != null && data == true) {
          this.alertService.success('Item data has been updated successful');
          this._router.navigate(['/Itemlist']);
        }
        else {
          this.alertService.error('Item not saved!');
          this._router.navigate(['/Itemlist']);
        }
        this.identity = 0;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  //#endregion "Update Item"

  //#region "Update Tax"

  private updateTaxForm() {
    this.taxform = this._fb.group({
      TaxRate: ['', [Validators.required, Validators.min(0.01), Validators.max(100), Validators.pattern("(100|[0-9]{1,2})(\.[0-9]{1,2})?"),]],
      IsTaxExempted: [0,],
      TaxStartDate: ['', [Validators.required]],
    });
  }

  onchangeIsTaxExemptedTax(event: any) {
    if (event.target.checked) {
      this.taxform.get('TaxRate').disable();
      this.taxform.patchValue({
        TaxRate: 0
      });
    } else {
      this.taxform.get('TaxRate').enable();
    }
  }

  TaxStartDateUpdated(range) {
    let TaxStartDate: Date = new Date(moment(new Date(range.startDate._d)).format("MM-DD-YYYY HH:mm"));
    this.obj.TaxStartDate = TaxStartDate;
  }

  SaveDataTax(): void {
    if (this._authorizationGuard.CheckAcess("Itemlist", "ViewEdit")) {
      return;
    }

    // stop here if form is invalid
    if (this.taxform.invalid) {
      return;
    }
    if (this.taxform.pristine) {
      this.alertService.error('Please change the value for any one control to proceed further!');
      return;
    }
    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
    });
    if (this.identity > 0) {
      this.UpdateTax();
    }
  }

  UpdateTax() {
    this.objtax.ItemID = this.identity;
    this.objtax.TaxRate = this.taxform.controls['TaxRate'].value;
    this.objtax.IsTaxExempted = this.taxform.controls['IsTaxExempted'].value;
    if (this.taxform.controls['TaxStartDate'].value.startDate._d != undefined) {
      this.objtax.StartDate = this.taxform.controls['TaxStartDate'].value.startDate._d.toLocaleString();
    } else {
      this.objtax.StartDate = this.taxform.controls['TaxStartDate'].value.startDate.toLocaleString();
    }

    this._itemService.taxUpdate(this.objtax).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.alertService.success(data.Msg);
          this.searchById(this.identity)
        }
        else {
          this.alertService.error(data.Msg);
          this.searchById(this.identity)
        }
        this.identity = 0;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  //#endregion "Update Tax"

  //#region "Update HSN"

  private updateHSNForm() {
    this.hsnform = this._fb.group({
      HSNCode: ['', [Validators.required]],
      HSNStartDate: ['', [Validators.required]],
    });
  }

  HSNStartDateUpdated(range) {
    let HSNStartDate: Date = new Date(moment(new Date(range.startDate._d)).format("MM-DD-YYYY HH:mm"));
    this.obj.HSNStartDate = HSNStartDate;
  }

  SaveDataHSN(): void {
    if (this._authorizationGuard.CheckAcess("Itemlist", "ViewEdit")) {
      return;
    }

    // stop here if form is invalid
    if (this.hsnform.invalid) {
      return;
    }
    if (this.hsnform.pristine) {
      this.alertService.error('Please change the value for any one control to proceed further!');
      return;
    }
    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
    });
    if (this.identity > 0) {
      this.UpdateHSN();
    }
  }

  UpdateHSN() {
    this.objhsn.ItemID = this.identity;
    this.objhsn.HSNCode = this.hsnform.controls['HSNCode'].value;
    if (this.hsnform.controls['HSNStartDate'].value.startDate._d != undefined) {
      this.objhsn.StartDate = this.hsnform.controls['HSNStartDate'].value.startDate._d.toLocaleString();
    } else {
      this.objhsn.StartDate = this.hsnform.controls['HSNStartDate'].value.startDate.toLocaleString();
    }

    this._itemService.hsnUpdate(this.objhsn).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.alertService.success(data.Msg);
          this.searchById(this.identity)
        }
        else {
          this.alertService.error(data.Msg);
          this.searchById(this.identity)
        }
        this.identity = 0;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  //#endregion "Update HSN"

  onFileChanged(e: any) {
    this.selectedFile = e.target.files[0];
  }

  onchangeImagePathChange(event: any) {
    if (event.target.checked) {
      this.ImagePathChange = true;
    } else {
      this.ImagePathChange = false;
    }
  }

  uploadFiles() {
    this.obj.ItemID = this.identity;

    if (this.UploadForm.invalid) {
      return;
    }
    var filesizeMB = Math.round(this.selectedFile.size / 1024 / 1024);
    var fileexte = this.selectedFile.name.split('.').pop();
    var allowedmb = parseInt(Apisettings.IMGFiles_Fileszie.toString())
    if (!this.isInArray(Apisettings.IMGFiles_Ext, fileexte)) {
      this.alertService.error("File must be extension with " + Apisettings.IMGFiles_Ext);
      return;
    }
    else if (filesizeMB > allowedmb) {
      this.alertService.error("File size must be less than or equal to " + Apisettings.IMGFiles_Fileszie + " MB.!");
      return;
    }
    //
    this._itemService.updateImage(this.selectedFile, this.obj.ItemID).subscribe(
      (data) => {
        //
        if (data == true) {
          this.alertService.success('Item Image data has been updated successful');
          this._router.navigate(['/Itemlist']);
        }
        else {
          this.alertService.error("Error!:Image not uploaded.");
          this._router.navigate(['/Itemlist']);
        }
      },
      (error: any) => {
        this.alertService.error("Error!:Image not uploaded.");
        //
        this._router.navigate(['/Itemlist']);
      }
    );

  }
  isInArray(array, word) {
    return array.indexOf(word.toLowerCase()) > -1;
  }
}
