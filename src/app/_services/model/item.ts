

export class Item {
    ItemID: number;
    CompanyDetailID: number;
    ItemName: string;
    ItemCode: string;
    BrandID: number;
    CategoryID: number;
    SubCategoryID: number;
    UOMID: number;
    TaxRate: number;
    ItemColor: string;
    ItemSize_Storage: string;
    ItemModel_Style: string;
    MRP: number;
    HSNCode: string;
    IsActive: Boolean;
    EAN_UPCCode: string;
    IsTaxExempted: Boolean;
    Margin: number;
    ProductGroupID: number;
    ImagePath:string;
    LoginId: number; 
    Type: string;
    VendorItemCode: string;
    CustomerItemCode: string; 
    GRNNumber: string; 
    GRNID: number; 
    InventoryType: string; 
    GRNInwardID: number; 
    TaxStartDate: Date;
    HSNStartDate: Date;
    lstItemTaxDetail: Itemtaxdetail[];
    lstItemHSNDetail: Itemhsndetail[];
}

export class Itemtaxdetail {
    ItemTaxDetailID: number;
    CompanyDetailID: number;
    ItemID: number;
    IsTaxExempted: Boolean;
    TaxRate: number;
    StartDate: Date;
    EndDate: Date; 
    LoginId: number; 
}

export class Itemhsndetail {
    ItemHSNDetailID: number;
    CompanyDetailID: number;
    ItemID: number;
    HSNCode: string; 
    StartDate: Date;
    EndDate: Date; 
    LoginId: number; 
}

export class Discount {
    DiscountID: number;
    CompanyDetailID: number;
    CustomerID: number;
    TransactionType: string;
    InventoryType: string;
    ItemID: number;
    StartDate: Date;
    EndDate: Date;
    MarketPlaceContribution: number;
    StoreContribution: number;
    OtherContribution: number;
    TotalDiscountPer: number;
    DeactivateDate: Date;
    IsActive:Boolean

    // task
    Msg: string;
    Flag: Boolean;
    LoginId: number;
    //Master Tables 
    ItemCode: string;

    ItemIds:number[];
}
export class Marketplacefee {
    MarketPlaceFeeId: number;
    CompanyDetailID: number;
    ItemID: number;
    ExpenseCharge: number;
    ExpenseGSTTax: number;
    StartDate: Date;
    EndDate: Date;
    IsActive: Boolean;
    DeactivateDate: Date;
    Msg: string;
    Flag: Boolean;

    // task
    LoginId: number;
    //Master Tables
    MarketPlace: string;
    ItemCode: string;
}
