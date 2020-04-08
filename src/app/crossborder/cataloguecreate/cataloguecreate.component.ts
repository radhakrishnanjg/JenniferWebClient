import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { CatalogueService } from '../../_services/service/crossborder/catalogue.service';
import { CatalogueHeader, CatalogueDetail, Apisettings } from '../../_services/model/crossborder';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { AuthenticationService } from '../../_services/service/authentication.service';
import { MasteruploadService } from '../../_services/service/masterupload.service';

@Component({
  selector: 'app-cataloguecreate',
  templateUrl: './cataloguecreate.component.html',
  styleUrls: ['./cataloguecreate.component.css']
})
export class CataloguecreateComponent implements OnInit {
  lstCatalogueDetail: CatalogueDetail[] = [] as any;
  objHeader: CatalogueHeader = {} as any;
  obj: CatalogueDetail = {} as any;
  catalogueform: FormGroup;
  panelTitle: string;
  action: boolean;
  identity: number = 0;
  dtOptions: DataTables.Settings = {};
  constructor(
    private alertService: ToastrService,
    private _router: Router,
    private _catalogueService: CatalogueService,
    private fb: FormBuilder,
    private _masteruploadService: MasteruploadService,
    private _authorizationGuard: AuthorizationGuard,
    private aroute: ActivatedRoute,
  ) { }

  //#region Validation Start
  formErrors = {
    'ProductName': '',
    'MerchantSKU': '',
    'ASIN': '',
    'ProductDescription': '',
    'DeclareValueInDollar': '',

    'MRPInINR': '',
    'FileData1': '',
  };

  // This object contains all the validation messages for this form
  validationMessages = {

    'ProductName': {
      'required': 'This Field is required.',
    },
    'MerchantSKU': {
      'required': 'This Field is required.',
    },
    'ASIN': {
      'required': 'This Field is required.',
    },
    'ProductDescription': {
      'required': 'This Field is required.',
    },
    'DeclareValueInDollar': {
      'required': 'This Field is required.',
    },

    'MRPInINR': {
      'required': 'This Field is required.',
    },
    'FileData1': {
      'required': 'This Field is required.',
    },
  };

  logValidationErrors(group: FormGroup = this.catalogueform): void {
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
  //#endregion Validation End

  ngOnInit() {
    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
      if (this.identity > 0) {
        this.action = false;
        this._catalogueService.searchById(this.identity)
          .subscribe(
            (data: CatalogueHeader) => {
              this.objHeader = data;
              this.lstCatalogueDetail = data.lstCatalogueDetail;
              this.dtOptions = {
                paging: false,
                scrollY: '400px',
                "language": {
                  "search": 'Filter',
                },
              };
            },
            (err: any) =>
              console.log(err)
          );
      }
      else {
        this.identity = 0;
        this.action = true;
      }
    });

    this.gridIndex = 0;
    this.catalogueform = this.fb.group({
      ProductName: ['', [Validators.required],],
      MerchantSKU: ['', [Validators.required]],
      ASIN: ['', [Validators.required]],
      ProductDescription: ['', [Validators.required]],
      HSNCode: [''],
      DeclareValueInDollar: ['', [Validators.required]],
      MRPInINR: ['', [Validators.required]],
      SellingPriceInINR: [''],
      FileData1: [''],
      FileData5: [''],
      FileData6: [''],
      FileData7: [''],
      ImagePathFlag: [''],
      DocumentPath1Flag: [''],
      DocumentPath2Flag: [''],
      DocumentPath3Flag: [''],
    });
  }

  isInArray(array, word) {
    return array.indexOf(word.toLowerCase()) > -1;
  }

  selectedDegreeFile1: File;
  ImagePath: string = '';
  onFileChangedImagePath(event) {
    this.selectedDegreeFile1 = event.target.files[0]
    if (this.selectedDegreeFile1.name.length > 0) {
      var filesizeMB = Math.round(this.selectedDegreeFile1.size / 1024 / 1024);
      var fileexte = this.selectedDegreeFile1.name.split('.').pop();
      var allowedmb = parseInt(Apisettings.IMGFiles_Fileszie.toString())
      if (!this.isInArray(Apisettings.IMGFiles_Ext, fileexte)) {
        this.alertService.error("File must be extension with " + Apisettings.IMGFiles_Ext);
        return;
      }
      else if (filesizeMB > allowedmb) {
        this.alertService.error("File size must be less than or equal to " + Apisettings.IMGFiles_Fileszie + " MB.!");
        return;
      }
      else {
        let ImagePath: string = '';
        ImagePath = this.catalogueform.controls['FileData1'].value;
        this._masteruploadService.FileSave(this.selectedDegreeFile1, ImagePath).subscribe(
          (data) => {
            if (data != null && data.length > 0) {
              this.ImagePath = data;
            }
            else {
              this.alertService.error("File is not saved.!");
            }
          },
          (error: any) => {
            this.alertService.error("Error!:Image not uploaded.");
          }
        );
      }
    }
  }

  DocumentPath1File: File;
  DocumentPath1: string = '';
  onFileChangedDocumentPath1(event) {
    this.DocumentPath1File = event.target.files[0]
    if (this.DocumentPath1File.name.length > 0) {
      var filesizeMB = Math.round(this.DocumentPath1File.size / 1024 / 1024);
      var fileexte = this.DocumentPath1File.name.split('.').pop();
      var allowedmb = parseInt(Apisettings.CommonFiles_Fileszie.toString())
      if (!this.isInArray(Apisettings.CommonFiles_Ext, fileexte)) {
        this.alertService.error("File must be extension with " + Apisettings.CommonFiles_Ext);
        return;
      }
      else if (filesizeMB > allowedmb) {
        this.alertService.error("File size must be less than or equal to " + Apisettings.CommonFiles_Fileszie + " MB.!");
        return;
      }
      else {
        let DocumentPath1: string = '';
        DocumentPath1 = this.catalogueform.controls['FileData5'].value;
        this._masteruploadService.FileSave(this.DocumentPath1File, DocumentPath1).subscribe(
          (data) => {
            if (data != null && data.length > 0) {
              this.DocumentPath1 = data;
            }
            else {
              this.alertService.error("File is not saved.!");
            }
          },
          (error: any) => {
            this.alertService.error("Error!:Image not uploaded.");
          }
        );
      }
    }
  }

  DocumentPath2File: File;
  DocumentPath2: string = '';
  onFileChangedDocumentPath2(event) {
    this.DocumentPath2File = event.target.files[0]
    if (this.DocumentPath2File.name.length > 0) {
      var filesizeMB = Math.round(this.DocumentPath2File.size / 1024 / 1024);
      var fileexte = this.DocumentPath2File.name.split('.').pop();
      var allowedmb = parseInt(Apisettings.CommonFiles_Fileszie.toString())
      if (!this.isInArray(Apisettings.CommonFiles_Ext, fileexte)) {
        this.alertService.error("File must be extension with " + Apisettings.CommonFiles_Ext);
        return;
      }
      else if (filesizeMB > allowedmb) {
        this.alertService.error("File size must be less than or equal to " + Apisettings.CommonFiles_Fileszie + " MB.!");
        return;
      }
      else {
        let DocumentPath2: string = '';
        DocumentPath2 = this.catalogueform.controls['FileData6'].value;
        this._masteruploadService.FileSave(this.DocumentPath2File, DocumentPath2).subscribe(
          (data) => {
            if (data != null && data.length > 0) {
              this.DocumentPath2 = data;
            }
            else {
              this.alertService.error("File is not saved.!");
            }
          },
          (error: any) => {
            this.alertService.error("Error!:Image not uploaded.");
          }
        );
      }
    }
  }

  DocumentPath3File: File;
  DocumentPath3: string = '';
  onFileChangedDocumentPath3(event) {
    this.DocumentPath3File = event.target.files[0]
    if (this.DocumentPath3File.name.length > 0) {
      var filesizeMB = Math.round(this.DocumentPath3File.size / 1024 / 1024);
      var fileexte = this.DocumentPath3File.name.split('.').pop();
      var allowedmb = parseInt(Apisettings.CommonFiles_Fileszie.toString())
      if (!this.isInArray(Apisettings.CommonFiles_Ext, fileexte)) {
        this.alertService.error("File must be extension with " + Apisettings.CommonFiles_Ext);
        return;
      }
      else if (filesizeMB > allowedmb) {
        this.alertService.error("File size must be less than or equal to " + Apisettings.CommonFiles_Fileszie + " MB.!");
        return;
      }
      else {
        let DocumentPath3: string = '';
        DocumentPath3 = this.catalogueform.controls['FileData7'].value;
        this._masteruploadService.FileSave(this.DocumentPath3File, DocumentPath3).subscribe(
          (data) => {
            if (data != null && data.length > 0) {
              this.DocumentPath3 = data;
            }
            else {
              this.alertService.error("File is not saved.!");
            }
          },
          (error: any) => {
            this.alertService.error("Error!:Image not uploaded.");
          }
        );
      }
    }
  }

  ImagePathFlag: boolean = false;
  onchangeImagePathFlag(event: any) {
    if (event.target.checked) {
      this.ImagePathFlag = true;
    } else {
      this.ImagePathFlag = false;
    }
  }
  DocumentPath1Flag: boolean = false;
  onchangeDocumentPath1Flag(event: any) {
    if (event.target.checked) {
      this.DocumentPath1Flag = true;
    } else {
      this.DocumentPath1Flag = false;
    }
  }
  DocumentPath2Flag: boolean = false;
  onchangeDocumentPath2Flag(event: any) {
    if (event.target.checked) {
      this.DocumentPath2Flag = true;
    } else {
      this.DocumentPath2Flag = false;
    }
  }
  DocumentPath3Flag: boolean = false;
  onchangeDocumentPath3Flag(event: any) {
    if (event.target.checked) {
      this.DocumentPath3Flag = true;
    } else {
      this.DocumentPath3Flag = false;
    }
  }

  onClickAddToList(): void {
    if (this.catalogueform.invalid) {
      return;
    }
    if (this.ImagePath == '') {
      this.alertService.error('Product image is required.!');
      return;
    }
    if (this.identity > 0 && (this.gridIndex == 0)) {
      this.alertService.error('You cannot add new product at this moment.!');
      return;
    }
    else {
      //update
      if (this.gridIndex > 0) {
        if (this.lstCatalogueDetail.filter(a => a.MerchantSKU == this.catalogueform.controls['MerchantSKU'].value
          && a.MerchantSKU != this.oldMerchantSKU).length > 0) {
          this.alertService.error('Merchant SKU already exist in the list.!');
          return;
        }
        else {
          var oldobj = this.lstCatalogueDetail[this.gridIndex - 1];
          oldobj.ProductName = this.catalogueform.controls['ProductName'].value;
          oldobj.MerchantSKU = this.catalogueform.controls['MerchantSKU'].value;
          oldobj.ASIN = this.catalogueform.controls['ASIN'].value;
          oldobj.ProductDescription = this.catalogueform.controls['ProductDescription'].value;
          oldobj.HSNCode = this.catalogueform.controls['HSNCode'].value;
          oldobj.DeclareValueInDollar = this.catalogueform.controls['DeclareValueInDollar'].value;
          oldobj.MRPInINR = this.catalogueform.controls['MRPInINR'].value;
          oldobj.SellingPriceInINR = this.catalogueform.controls['SellingPriceInINR'].value;
          // Selling price is not entered 
          oldobj.SellingPriceInINR = this.catalogueform.controls['SellingPriceInINR'].value == "" ?
            null : this.catalogueform.controls['SellingPriceInINR'].value;
          oldobj.ImagePath = this.ImagePath;
          oldobj.DocumentPath1 = this.DocumentPath1;
          oldobj.DocumentPath2 = this.DocumentPath2;
          oldobj.DocumentPath3 = this.DocumentPath3;
          this.lstCatalogueDetail.splice(this.gridIndex - 1, 1);
          this.lstCatalogueDetail.push(oldobj);
          // this.catalogueform.get('MerchantSKU').enable(); 
          this.catalogueform.reset();
          this.ImagePath = '';
          this.DocumentPath1 = '';
          this.DocumentPath2 = '';
          this.DocumentPath3 = '';
          $('#ProductName').focus();
          this.gridIndex = 0;
          this.oldMerchantSKU = '';
        }
      }

      //insert
      else {
        if (this.lstCatalogueDetail.filter(a => a.MerchantSKU == this.catalogueform.controls['MerchantSKU'].value).length > 0) {
          this.alertService.error('Merchant SKU already exist in the list.!');
          return;
        }
        else {
          this.obj = new CatalogueDetail();
          this.obj.ProductName = this.catalogueform.controls['ProductName'].value;
          this.obj.MerchantSKU = this.catalogueform.controls['MerchantSKU'].value;
          this.obj.ASIN = this.catalogueform.controls['ASIN'].value;
          this.obj.ProductDescription = this.catalogueform.controls['ProductDescription'].value;

          this.obj.HSNCode = this.catalogueform.controls['HSNCode'].value;
          this.obj.DeclareValueInDollar = this.catalogueform.controls['DeclareValueInDollar'].value;
          this.obj.MRPInINR = this.catalogueform.controls['MRPInINR'].value;
          // Selling price is not entered 
          this.obj.SellingPriceInINR = this.catalogueform.controls['SellingPriceInINR'].value == "" ?
            null : this.catalogueform.controls['SellingPriceInINR'].value;

          this.obj.ImagePath = this.ImagePath;
          this.obj.DocumentPath1 = this.DocumentPath1;
          this.obj.DocumentPath2 = this.DocumentPath2;
          this.obj.DocumentPath3 = this.DocumentPath3;
          this.lstCatalogueDetail.push(this.obj);
          this.catalogueform.reset();
          this.ImagePath = '';
          this.DocumentPath1 = '';
          this.DocumentPath2 = '';
          this.DocumentPath3 = '';
          $('#ProductName').focus();
          this.gridIndex = 0;
          this.oldMerchantSKU = '';
        }
      }
    }
  }

  gridIndex: number;
  oldMerchantSKU: string;
  editButtonClick(index) {
    this.gridIndex = index + 1;
    this.oldMerchantSKU = this.lstCatalogueDetail[index].MerchantSKU;
    // this.catalogueform.get('MerchantSKU').disable();
    this.catalogueform.patchValue({
      ProductName: this.lstCatalogueDetail[index].ProductName,
      MerchantSKU: this.lstCatalogueDetail[index].MerchantSKU,
      ASIN: this.lstCatalogueDetail[index].ASIN,
      ProductDescription: this.lstCatalogueDetail[index].ProductDescription,
      HSNCode: this.lstCatalogueDetail[index].HSNCode,

      DeclareValueInDollar: this.lstCatalogueDetail[index].DeclareValueInDollar,
      MRPInINR: this.lstCatalogueDetail[index].MRPInINR,
      SellingPriceInINR: this.lstCatalogueDetail[index].SellingPriceInINR,
    });

    this.ImagePath = this.lstCatalogueDetail[index].ImagePath;
    this.DocumentPath1 = this.lstCatalogueDetail[index].DocumentPath1;
    this.DocumentPath2 = this.lstCatalogueDetail[index].DocumentPath2;
    this.DocumentPath3 = this.lstCatalogueDetail[index].DocumentPath3;

    this.ImagePathFlag = false;
    this.DocumentPath1Flag = false;
    this.DocumentPath2Flag = false;
    this.DocumentPath3Flag = false;
    this.logValidationErrors();
  }

  removeRow(index): void {
    this.lstCatalogueDetail.splice(index, 1);
  }

  DownloadButtonClick(ObjectId: string) {
    if (ObjectId != "") {
      this._masteruploadService.DownloadObjectFile(ObjectId)
        .subscribe(data => {
          this.alertService.success("File downloaded succesfully.!");
          saveAs(data, ObjectId)
        },
          (err) => {
            console.log(err);
          }
        );
    } else {
    }
  }

  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("Cataloguelist", "ViewEdit")) {
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
    this.objHeader.lstCatalogueDetail = this.lstCatalogueDetail;
    this._catalogueService.insert(this.objHeader).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.alertService.success(data.Msg);
        }
        else {
          this.alertService.error(data.Msg);
        }
        this._router.navigate(['/CrossBorder/Cataloguelist']);
        this.identity = 0;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  Update() { 
    this.objHeader.CatalogueID = this.identity;
    this.objHeader.lstCatalogueDetail = this.lstCatalogueDetail;
    this._catalogueService.update(this.objHeader).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.alertService.success(data.Msg);
          this._router.navigate(['/CrossBorder/Cataloguelist']);
        }
        else {
          this.alertService.error(data.Msg);
          this._router.navigate(['/CrossBorder/Cataloguelist']);
        }
        this.identity = 0;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
