export class PackageHeader {
    PackageHeaderID: number;
    PackageDate: string;
    SellerFormID: number;
    FBAShipmentID: string;
    PackageNumber: string;
    LogisticPartnerID: number;
    CountryID: number;
    //STN 
    STNNumber: string;
    STNDate: Date;
    ShipFrom: number;
    ShipTo: number;
    STNInvoiceStatus: string;
    IsShipmentAvialable: boolean;
    ISPODAvailable: boolean;
    CARPStatus: string;
    BOEStatus: string;
    CheckListStatus: string;
    PODStatus: string;
    FinalStatus: string;
    IsActive: number;
    CreatedBy: number;
    CreatedDate: string;
    LastModifiedBy: number;
    LastModifiedDate: string;
    LoginId: number;
    lstPackageDetail: PackageDetail[] = [] as any;
    lstInvoiceHeader: InvoiceHeader[] = [] as any;
    lstShipment: Shipment[] = [] as any;
    lstCarp: Carp[] = [] as any;
    lstChecklist: Checklist[] = [] as any;
    lstBOE: BOE[] = [] as any;
    lstPackagePod: Pod[] = [] as any;
    lstBOEHistory: BOE[] = [] as any;
    lstCheckListHistory: Checklist[] = [] as any;
    lstSTNInvoiceHistory: STNInvoiceHistory[] = [] as any;
    lstPackageHistory: PackageHistory[] = [] as any;
    lstConsolidatedInvoice: InvoiceDetail[] = [] as any;
    // master table
    BOEID: string;
    CheckListID: string;
    CARPID: number;
    CountryName: string;
    MarketPlaceSellerID: string
    IndianGSTNumber: string;
    ShipFromName: string;
    ShipToName: string;
    AppointmentID: string;
    AppointmentDate: Date;
    ReferenceCatalogues: string;
    NoOfInvoice: number;
    EORName: string;
    LogisticPartner: string;
    Action: string;
    CreatedByName: string;
    Remarks:string;
}

export class PackageDetail {
    PackageDetailID: number;
    PackageHeaderID: number;
    CatalogueDetailID: number;
    MRPInINR: number;
    Qty: number;
    BoxQty: number;
    WeightQty: number;
    LastModifiedBy: number;
    LastModifiedDate: string;
    LoginId: number;

    //catalogue detail
    CatalogueNumber: string;
    ProductName: string;
    MerchantSKU: string;
    ASIN: string;
    HSNCode: string;
    FNSKU: string;
}

export class PackageHistory {
    PackageNumber: string;
    PackageHeaderStatus: string;
    PackageHeaderRemarks: string;
    UpdatedByName: string;
    UpdatedDate: string;
}

export class STNInvoiceHistory {
    PackageNumber: string;
    STNInvoiceStatus: string;
    Remarks: string;
    UpdatedByName: string;
    UpdatedDate: Date;
}

export class InvoiceHeader {
    InvoiceHeaderID: number;
    SellerFormID: number;
    PackageHeaderID: number;
    InvoiceNo: string;
    InvoiceDate: string;
    BuyerOrderNo: string;
    BuyerOrderDate: Date;
    ConsignorID: number;
    ConsigneeID: number;
    Aircraft: string;
    From: string;
    SailingOnOrAbout: string;
    ShippingRemarks: string;
    TermsOfDelivery: string;
    DocketNumber: string;
    ShipmentFilePath1: string;
    ShipmentDate: string;
    ShipmentUpdatedBy: number;
    ShipmentRemarks: string;
    CheckListID: string;
    CheckListDate: string;
    CheckListUpdatedBy: number;
    CheckListFilePath1: string;
    ChecklistStatus: string;
    CheckListRemarks: string;
    BOEID: string;
    BOENumber: string;
    BOEDate: string;
    BOEUpdatedBy: number;
    BOEFilePath1: string;
    BOEStatus: string;
    BOERemarks: string;
    IsActive: boolean;
    lstInvoiceDetail: InvoiceDetail[] = [] as any;

    // Master table
    ConsignorName: string;
    ConsignorAddress: string;
    ConsigneeAddress: string;
    //invoice generation
    Action:string; 
    LoginId: number;
}

export class InvoiceDetail {
    InvoiceDetailID: number;
    InvoiceHeaderID: number;
    CatalogueDetailID: number;
    InvoiceNo: string;
    UnitPerPriceInUSD: number;
    Qty: number;
    //sku  
    TotalUnitValueInUSD: number;
    ProductName: string;
    MerchantSKU: string;
    ASIN: string;
    HSNCode: string;
    FNSKU: string;
}

export class Shipment {
    InvoiceHeaderID: number;
    PackageHeaderID: number;
    InvoiceNo: string;
    DocketNumber: string;
    ShipmentDate: Date;
    ShipmentRemarks: string;
    ShipmentFilePath1: string;

    // Master screen 
    UpdatedByName: string;
    PODStatus: string;
    Action: string;
    LoginId: number;
    UpdatedDate: Date;
    FinalStatus: string;
}

export class Checklist {
    InvoiceHeaderID: number;
    PackageHeaderID: number;
    InvoiceNo: string;
    CheckListID: string;
    CheckListFilePath1: string;
    CheckListRemarks: string;
    CheckListDate: Date;
    ChecklistStatus: string;

    // Master screen 
    UpdatedByName: string;
    UpdatedDate: Date;
    BOEID: string;
    Action: string;
    LoginId: number;
    FinalStatus: string;
}

export class BOE {
    InvoiceHeaderID: number;
    PackageHeaderID: number;
    InvoiceNo: string;
    CheckListID: string;
    BOEID: string;
    BOENumber: string;
    BOEFilePath1: string;
    BOERemarks: string;
    BOEStatus: string;
    BOEDate: Date;
    ChecklistStatus: string;

    // Master screen 
    UpdatedByName: string;
    UpdatedDate: Date;
    Action: string;
    LoginId: number;
    FinalStatus: string;
}


export class Carp {
    CARPID: number;
    PackageHeaderID: number;
    AppointmentID: string;
    AppointmentDate: Date;
    FromTime: string;
    ToTime: string;
    FilePath1: string;
    IsActive: boolean;

    // Master screen
    PackageNumber: string;
    PackageDate: Date;
    FBAShipmentID: string;
    SellerFormID: number;
    CreatedByName: string;
    Action: string;
    LoginId: number;
    UpdatedDate: Date;
    UpdatedByName: string;
    ShipToName: string;
    FinalStatus: string;
}

export class Pod {
    PODID: number;
    PackageHeaderID: number;
    PODDate: Date;
    PODNumber: string;
    FilePath1: string;
    IsActive: boolean;

    // Master screen
    PackageNumber: string;
    PackageDate: Date;
    FBAShipmentID: string;
    SellerFormID: number;
    CreatedByName: string;
    Action: string;
    LoginId: number;
    UpdatedDate: Date;
    UpdatedByName: string;
    EORName: string;
    LogisticPartner: string;
    FinalStatus: string;
}


// #region Privateutility

// export class ShipFrom {
//     CompanyID: number;
//     CompanyName: string;
// }

export class ShipTo {
    ShipToID: number;
    ShipToName: string;
    ShipToAddress: string;
    ShipFromID: number;
    ShipFromName: string;
    ShipFromAddress: string;
}

export class Consignor {
    ConsignorID: number;
    ConsignorName: string;
    ConsignorAddress: string;
    ConsignorBankName: string;
    ConsignorAccountNumber: string;
    ConsigneeID: number;
    ConsigneeName: string;
    ConsigneeAddress: string;
}

// export class Consignee {
//     ConsigneeID: number;
//     ConsigneeName: string;
//     ConsigneeAddress: string;
// }

export class LogisticPartners {
    LogisticPartnerID: number;
    LogisticPartnerName: string;
}

export class CARPFBAShipment {
    PackageHeaderID: number;
    FBAShipmentID: string;
}

export class PODFBAShipment {
    PackageHeaderID: number;
    FBAShipmentID: string;
}

// #endregion