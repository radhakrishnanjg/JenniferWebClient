import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthorizationGuard } from '../../_guards/Authorizationguard';
import { ItemService } from '../../_services/service/item.service';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { UsernameValidator } from '../../_validators/username';
import { Brand, Category, SubCategory, UOM, ProductGroup, Item, Apisettings } from '../../_services/model';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  itemform: FormGroup;
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
  panelTitle: string;
  action: boolean;
  identity: number = 0;
  selectedFile: File;
  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private aroute: ActivatedRoute,
    public _spinner: NgxSpinnerService,
    private alertService: ToastrService,
    private _usernameValidator: UsernameValidator,
    private _authorizationGuard: AuthorizationGuard,
    private _itemService: ItemService,
    private _PrivateutilityService: PrivateutilityService,
  ) { }

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

  ngOnInit() {
    this._spinner.show();
    this._PrivateutilityService.getBrands()
      .subscribe(
        (data: Brand[]) => {
          this.lstBrand = data
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
    this._spinner.show();
    this._PrivateutilityService.getUOMs()
      .subscribe(
        (data: UOM[]) => {
          this.lstUOM = data;
          this._spinner.hide();
        },
        (err: any) => {
          console.log(err);
          this._spinner.hide();
        }
      );

    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
      if (this.identity > 0) {
        this.panelTitle = "Edit Item";
        this.action = false;
        this._spinner.show();
        this._itemService.getItem(this.identity)
          .subscribe(
            (data: Item) => {
              var BrandID = data.BrandID.toString();
              var ProductGroupID = data.ProductGroupID.toString();
              var UOMID = data.UOMID.toString();
              var CategoryID = data.CategoryID.toString();
              var SubCategoryID = data.SubCategoryID.toString();
              this._spinner.show();
              this._PrivateutilityService.getCategories(parseInt(ProductGroupID))
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

              this._spinner.show();
              this._PrivateutilityService.getSubCategories(parseInt(CategoryID))
                .subscribe(
                  (statesa: SubCategory[]) => {
                    this.lstSubCategory = statesa;
                    this._spinner.hide();
                  },
                  (err: any) => {
                    console.log(err);
                    this._spinner.hide();
                  }
                );

              this.itemform.patchValue({
                ItemName: data.ItemName,
                ItemCode: data.ItemCode,
                BrandID: BrandID,
                CategoryID: CategoryID,
                SubCategoryID: SubCategoryID,
                UOMID: UOMID,

                TaxRate: data.TaxRate.toString(),
                ItemColor: data.ItemColor,
                ItemSize_Storage: data.ItemSize_Storage,
                ItemModel_Style: data.ItemModel_Style,
                MRP: data.MRP,

                HSNCode: data.HSNCode,
                EAN_UPCCode: data.EAN_UPCCode,
                IsTaxExempted: data.IsTaxExempted,
                Margin: data.Margin,
                ProductGroupID: ProductGroupID,

                IsActive: data.IsActive,
              });

              let itempath = data.ImagePath == null ? environment.defaultImageUrl : data.ImagePath;
              this.ImagePath = environment.basedomain + itempath;
              this.ImagePathChange = false;
              this.itemform.get('ItemCode').disable();
              this.itemform.get('MRP').disable();
              this.itemform.get('Margin').disable();
              this.itemform.get('UOMID').disable();
              this.itemform.get('IsTaxExempted').disable();
              this.itemform.get('TaxRate').disable();
              this.itemform.get('HSNCode').disable();

            },
            (err: any) => {
              this._spinner.hide();
              console.log(err);
            }
          );
      }
      else {
        this.action = true;
        this.panelTitle = "Add New Item";
      }
    });
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
    });

    this.UploadForm = this._fb.group({
      FileData: ['', [Validators.required]],
    });

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

  onchangeUOMID(selectedValue: string) {
    let id = parseInt(selectedValue);

    this.UOMDescription = this.lstUOM.filter(a => a.UOMID == id)[0].Description;

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

    this.obj.IsActive = this.itemform.controls['IsActive'].value;

    this._spinner.show();
    this._itemService.addItem(this.obj).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this._spinner.hide();
          this.alertService.success(data.Msg);
          this._router.navigate(['/Itemlist']);
        }
        else {
          this._spinner.hide();
          this.alertService.error(data.Msg);
          this._router.navigate(['/Itemlist']);
        }
        this.identity = 0;
      },
      (error: any) => {
        this._spinner.hide();
        console.log(error);
      }
    );
  }

  Update() {
    this.obj.ItemID = this.identity;

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

    this.obj.IsActive = this.itemform.controls['IsActive'].value;
    this._spinner.show();
    this._itemService.updateItem(this.obj).subscribe(
      (data) => {
        if (data != null && data == true) {
          this._spinner.hide();
          this.alertService.success('Item data has been updated successful');
          this._router.navigate(['/Itemlist']);
        }
        else {
          this._spinner.hide();
          this.alertService.error('Item not saved!');
          this._router.navigate(['/Itemlist']);
        }
        this.identity = 0;
      },
      (error: any) => {
        this._spinner.hide();
        console.log(error);
      }
    );
  }

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
    this._spinner.show();
    this._itemService.updateImage(this.selectedFile, this.obj.ItemID).subscribe(
      (data) => {
        this._spinner.show();
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
        this._spinner.show();
        this._router.navigate(['/Itemlist']);
      }
    );

  }
  isInArray(array, word) {
    return array.indexOf(word.toLowerCase()) > -1;
  }


}
