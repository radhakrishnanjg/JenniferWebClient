export class CatalogueHeader {
    CatalogueID: number;
    SellerFormID: number;
    CatalogueNumber: string;
    CatalogueDate: Date;

    lstCatalogueDetail: CatalogueDetail[] = [] as any;
    lstCatalogueHistory: CatalogueHistory[] = [] as any;
    Action: string;
    LastModifiedDate: Date;
    LoginId: number;

    //IOR
    MarketPlaceSellerID: string;
    NoOfItem: number;
    CatalogueDetailID: number;
    RKSellerID: string;
    Remarks: string;

    Seller_CatalogueStatus: string;
    Custom_CatalogueStatus: string;
    IOR_CatalogueStatus: string;
    EOR_CatalogueStatus: string;
}

export class CatalogueDetail {
    CatalogueDetailID: number;
    CatalogueID: number;
    ProductName: string;
    MerchantSKU: string;
    ASIN: string;

    ProductDescription: string;
    HSNCode: string;
    DeclareValueInDollar: number = 0.00;
    MRPInINR: number = 0.00;
    SellingPriceInINR: number = 0.00;

    ImagePath: string;
    DocumentPath1: string;
    DocumentPath2: string;
    DocumentPath3: string;
    CTH_HSN: string;

    BCD: number = 0.00;
    SWS: number = 0.00;
    IGST: number = 0.00;
    Others: string;
    Custom_Remarks: string;

    Custom_Status: string;
    IOR_Status: string;
    EOR_Status: string;
    LoginId: number;
}

export class CatalogueHistory {
    CatalogueHistoryID: number;
    CatalogueID: number;
    CatalogueStatus: string;
    Remarks: string;
    LoginId: number;
    LastModifiedByName: string;
    LastModifiedDate: Date;
}

export class IOR_Status {
    IOR_Status: string;
}

export class IORCatalogueStatus {
    IOR_CatalogueStatus: string;
}