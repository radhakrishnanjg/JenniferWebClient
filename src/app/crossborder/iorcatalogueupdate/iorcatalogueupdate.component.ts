import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { CatalogueDetail, CatalogueHeader, Dropdown, IORCatalogueStatus, IOR_Status } from '../../_services/model/crossborder';
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
  'BCD': new FormControl(dataItem.BCD, [Validators.required, Validators.min(1), Validators.max(100)]),
  'SWS': new FormControl(dataItem.SWS, [Validators.required, Validators.min(1), Validators.max(100)]),
  'IGST': new FormControl(dataItem.IGST, [Validators.required, Validators.min(1), Validators.max(100)]),
  'Others': new FormControl(dataItem.Others),
  'Custom_Remarks': new FormControl(dataItem.Custom_Remarks),
  'IOR_Status': new FormControl(dataItem.IOR_Status, [Validators.required]),
});

@Component({
  selector: 'app-iorcatalogueupdate',
  templateUrl: './iorcatalogueupdate.component.html',
  styleUrls: ['./iorcatalogueupdate.component.css']
})
export class IORCatalogueupdateComponent implements OnInit {
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
      'IOR_Status': ''
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
              this.ReloadIORCatalogueStatus();
              this.customerform.patchValue({
                IOR_CatalogueStatus: data.IOR_CatalogueStatus,
              });
            },
            (err: any) =>
              console.log(err)
          );
      }
    });

    this.LoadIOR_Status();
    this.customerform = this.fb.group({
      IOR_CatalogueStatus: ['', [Validators.required]],
      Remarks: ['', [Validators.required]],
    });
  }

  lstIOR_Status: Dropdown[] = [] as any;
  LoadIOR_Status() {
    this._jsonPrivateUtilityService.getvalues('IORProductStatus')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstIOR_Status = data;
        },
        (err: any) => {
          console.log(err);
        }
      );
  }
  IOR_CatalogueStatus: string;
  lstIOR_CatalogueStatus: IORCatalogueStatus[] = [] as any;
  ReloadIORCatalogueStatus() {
    let lst: IOR_Status[] = [] as any;
    this.gridData.forEach(element => {
      let obj: IOR_Status = {} as any;
      obj.IOR_Status = element.IOR_Status;
      lst.push(obj);
    });
    this.IOR_CatalogueStatus = '';
    this._catalogueService.IORGetCatalogueStatus(lst)
      .subscribe(
        (data: IORCatalogueStatus[]) => {
          this.lstIOR_CatalogueStatus = data;

        },
        (err: any) =>
          console.log(err)
      );
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
    this.obj.IOR_Status = item.IOR_Status;
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
    this.ReloadIORCatalogueStatus();
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
    if (orderItem.IOR_Status == null || orderItem.IOR_Status == "") {
      return "IOR Status field required";
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

    if (this._authorizationGuard.CheckAcess("IORCataloguelist", "ViewEdit")) {
      return;
    }
    // stop here if form is invalid
    if (this.customerform.invalid) {
      return;
    }

    this.objHeader.Seller_CatalogueStatus = this.IOR_CatalogueStatus;
    this.objHeader.Custom_CatalogueStatus = this.IOR_CatalogueStatus;
    this.objHeader.IOR_CatalogueStatus = this.IOR_CatalogueStatus;
    this.objHeader.EOR_CatalogueStatus = 'UnderReview';
    this.objHeader.Remarks = this.Remarks;
    this.objHeader.lstCatalogueDetail = this.gridData;
    this.objHeader.lstCatalogueHistory = [];
    if (this.objHeader.lstCatalogueDetail == null || this.objHeader.lstCatalogueDetail.length == 0) {
      this.alertService.error('Please add product details!');
      return;
    }
    if (this.objHeader.lstCatalogueDetail.length > 0 &&
      (this.objHeader.lstCatalogueDetail.filter(a => a.IOR_Status == null || a.IOR_Status == "")).length > 0) {
      this.alertService.error('Please update product status for all the products!');
      return;
    }
    if (this.objHeader.Remarks == null || this.objHeader.Remarks == "") {
      this.alertService.error('Please enter catalogue remarks!');
      return;
    }
    this._catalogueService.IORAction(this.objHeader).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.alertService.success(data.Msg);
        }
        else {
          this.alertService.error(data.Msg);
        }
        this.router.navigate(['/CrossBorder/IORCataloguelist']);
        this.identity = 0;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
