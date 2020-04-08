import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { CatalogueDetail, CatalogueHeader, Dropdown } from '../../_services/model/crossborder';
import { CatalogueService } from '../../_services/service/crossborder/catalogue.service';
import { JsonPrivateUtilityService } from '../../_services/service/crossborder/jsonprivateutility.service';
import { MasteruploadService } from '../../_services/service/masterupload.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
const createFormGroup = dataItem => new FormGroup({
  'ProductName': new FormControl(dataItem.ProductName),
  'MerchantSKU': new FormControl(dataItem.MerchantSKU),
  'ASIN': new FormControl(dataItem.ASIN),
  'HSNCode': new FormControl(dataItem.HSNCode),
  'ProductDescription': new FormControl(dataItem.ProductDescription),
  'DeclareValueInDollar': new FormControl(dataItem.DeclareValueInDollar),
  'MRPInINR': new FormControl(dataItem.MRPInINR),
  'SellingPriceInINR': new FormControl(dataItem.SellingPriceInINR),
  'ImagePath': new FormControl(dataItem.ImagePath),
  'DocumentPath1': new FormControl(dataItem.DocumentPath1),
  'DocumentPath2': new FormControl(dataItem.DocumentPath2),
  'DocumentPath3': new FormControl(dataItem.DocumentPath3),
  'CTH_HSN': new FormControl(dataItem.CTH_HSN, [Validators.required]),
  'BCD': new FormControl(dataItem.BCD),
  'SWS': new FormControl(dataItem.SWS),
  'IGST': new FormControl(dataItem.IGST),
  'Others': new FormControl(dataItem.Others),
  'Custom_Remarks': new FormControl(dataItem.Custom_Remarks),
  'Custom_Status': new FormControl(dataItem.Custom_Status, [Validators.required]),
});

@Component({
  selector: 'app-customcatalogueupdate',
  templateUrl: './customcatalogueupdate.component.html',
  styleUrls: ['./customcatalogueupdate.component.css']
})
export class CustomcatalogueupdateComponent implements OnInit {
  objHeader: CatalogueHeader = {} as any;
  lstCatalogueDetail: CatalogueDetail[] = [] as any;
  panelTitle: string;
  obj: CatalogueDetail = {} as any;
  action: boolean;
  identity: number = 0;
  statusList: Dropdown[];
  customCatalogueForm: FormGroup;

  selectedRowIndex: number = -1;
  selectedDeleteId: number;
  deleteColumn: string;
  dtOptions: DataTables.Settings = {};

  //KendoUI Grid
  public gridData: any[];
  public itemFormGroup: FormGroup;
  private editedRowIndex: number;

  constructor(
    private alertService: ToastrService,
    private aroute: ActivatedRoute,
    private _catalogueService: CatalogueService,
    private _authorizationGuard: AuthorizationGuard,
    private _masteruploadService: MasteruploadService,
    private _jsonPrivateUtilityService: JsonPrivateUtilityService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.objHeader.lstCatalogueDetail = [];
  }

  ngOnInit() {
    this.getStatus();

    this.itemFormGroup = createFormGroup({
      'ProductName': '',
      'MerchantSKU': '',
      'ASIN': '',
      'HSNCode': '',
      'ProductDescription': '',
      'DeclareValueInDollar': 0,
      'MRPInINR': 0,
      'SellingPriceInINR': 0,
      'ImagePath': '',
      'DocumentPath1': '',
      'DocumentPath2': '',
      'DocumentPath3': '',
      'CTH_HSN': '',
      'BCD': 0,
      'SWS': 0,
      'IGST': 0,
      'Others': 0,
      'Custom_Remarks': '',
      'Custom_Status': ''
    });

    this.aroute.paramMap.subscribe(params => {
      this.identity = +params.get('id');
      if (this.identity > 0) {
        this._catalogueService.CustomSearchById(this.identity)
          .subscribe(
            (data: CatalogueHeader) => {
              this.objHeader = data;
              this.gridData = this.objHeader.lstCatalogueDetail;
              this.lstCatalogueDetail = data.lstCatalogueDetail;
            },
            (err: any) =>
              console.log(err)
          );
      }
    });

    this.customerform = this.fb.group({
      Remarks: ['', [Validators.required]],
    });
  }

  // Get Status
  public getStatus(): void {
    this._jsonPrivateUtilityService.getvalues('CustomCatalogueStatus').subscribe(
      (res) => {
        this.statusList = res;
      }, (err) => {
        console.log(err);
      });
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

  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);
    this.itemFormGroup = createFormGroup(dataItem);
    this.selectedRowIndex = rowIndex;
    sender.editRow(rowIndex, this.itemFormGroup);
  }

  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, formGroup, isNew }): void {
    const item = formGroup.value;
    this.obj.ProductName = item.ProductName;
    this.obj.MerchantSKU = item.MerchantSKU;
    this.obj.ASIN = item.ASIN;
    this.obj.HSNCode = item.HSNCode;
    this.obj.ProductDescription = item.ProductDescription;
    this.obj.DeclareValueInDollar = item.DeclareValueInDollar;
    this.obj.MRPInINR = item.MRPInINR;
    this.obj.SellingPriceInINR = item.SellingPriceInINR;
    this.obj.ImagePath = item.ImagePath;
    this.obj.DocumentPath1 = item.DocumentPath1;
    this.obj.DocumentPath2 = item.DocumentPath2;
    this.obj.DocumentPath3 = item.DocumentPath3;
    this.obj.CTH_HSN = item.CTH_HSN;
    this.obj.BCD = item.BCD;
    this.obj.SWS = item.SWS;
    this.obj.IGST = item.IGST;
    this.obj.Others = item.Others;
    this.obj.Custom_Remarks = item.Custom_Remarks;
    this.obj.Custom_Status = item.Custom_Status;
    let errorMessage = this.validateItem(this.obj);
    if (errorMessage != null) {
      this.alertService.error(errorMessage);
      return;
    };

    let selectedItem = this.objHeader.lstCatalogueDetail[rowIndex];
    Object.assign(
      this.objHeader.lstCatalogueDetail.find(({ MerchantSKU }) => MerchantSKU === selectedItem.MerchantSKU),
      this.obj
    );

    this.obj = new CatalogueDetail();
    sender.closeRow(rowIndex);
  }

  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.itemFormGroup = undefined;
    this.obj = new CatalogueDetail();
  }

  private validateItem(orderItem: CatalogueDetail): string {
    debugger
    if (orderItem.CTH_HSN == null || orderItem.CTH_HSN == "") {
      return "CTH HSN field required";
    }
    if (orderItem.Custom_Status == null || orderItem.Custom_Status == "") {
      return "Custom Status field required";
    }
    return null;
  }

  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith'
  };

  customerform: FormGroup;
  Remarks: string;
  SaveData(): void {
    // if (this._authorizationGuard.CheckAcess("Customerlist", "ViewEdit")) {
    //   return;
    // }

    // stop here if form is invalid
    if (this.customerform.invalid) {
      return;
    }
    this.objHeader.Remarks = this.Remarks;
    this.objHeader.lstCatalogueDetail = this.gridData;
    this.objHeader.lstCatalogueHistory = [];
    if (this.objHeader.lstCatalogueDetail == null || this.objHeader.lstCatalogueDetail.length == 0) {
      this.alertService.error('Please add product details!');
      return;
    }
    if (this.objHeader.lstCatalogueDetail.length > 0 &&
      (this.objHeader.lstCatalogueDetail.filter(a => a.CTH_HSN == null || a.CTH_HSN == "")).length > 0) {
      this.alertService.error('Please update CTH HSN for all the products!');
      return;
    }
    if (this.objHeader.lstCatalogueDetail.length > 0 &&
      (this.objHeader.lstCatalogueDetail.filter(a => a.Custom_Status == null || a.Custom_Status == "")).length > 0) {
      this.alertService.error('Please update product status for all the products!');
      return;
    }
    if (this.objHeader.Remarks == null || this.objHeader.Remarks == "") {
      this.alertService.error('Please enter catalogue remarks!');
      return;
    }
    debugger
    this._catalogueService.CustomAction(this.objHeader).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.alertService.success(data.Msg);
        }
        else {
          this.alertService.error(data.Msg);
        }
        this.router.navigate(['/CrossBorder/Customcataloguelist']);
        this.identity = 0;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
