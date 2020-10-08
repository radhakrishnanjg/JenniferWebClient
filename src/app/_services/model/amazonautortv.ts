
export class AmazonAutoRTVConfiguration {
    ConfigID: number;
    Lastmodifieddate: Date | string;
    RTVLocationID: number;
    RTVReceivingLocationID: number;
    InventoryType: string;

    FrequencyType: string;
    IsActive: boolean;
    RTVReceivingLocationName: string;
    LastModifiedByName: string;
    RTVLocationName: string;

    LoginId: number;
    CompanyDetailID: number;
}

export class AmazonAutoRTVOrder {
    RTVID: number;
    CreatedDate: Date | string;
    MerchantRemovalOrderID: string;
    SellableQuantity: number;
    UnSellableQuantity: number;

    RemoveFromFCCode: string;
    AddressName: string;
    RecordUploadStatus: string;
    RTVStatus: string;
    TrackingID: string;

    MerchantSKU: string;
    SellerSKU: string;
    Error: string;
    LoginId: number;
    CompanyDetailID: number;
    //bulk related 
    CompanyID: number;
    RTVType: string;
    ApprovalStatus: string;
    BatchId: string;
    CustomerWareHouseID: number;
    lstRTVDetail: RTVDetail[] = [] as any;
    lstRTVApproval: RTVApproval[] = [] as any;
    RTVLocationID: number;
    InventoryType: string;
    FrequencyType: string;
    JsonData: string;
    Action: string;
    Remarks: string;
    RTVLocationName: string;
    RTVReceivingLocationName: string;
    IsInvoiceCreated: boolean;
    OrderID: string;
    InvoiceNumber: string;
    SalesInvoiceID: string;
}

export class RTVDetail {
    StoreName: string;
    SKU: string;
    ItemName: string;
    Quantity: number;
    Rate: number;
    TotalValue: number;
}

export class RTVApproval {
    ApprovalStatus: string;
    Remarks: string;
    ActionBy: string;
    ActionDate: Date;
}

export class MWSShipment {
    RemovalOrderID: string;
    RemovalDate: Date;
    TrackingNumber: string;
    ShipmentDate: Date | string;
    Carrier: string;

    ItemCode: string;
    ItemCode2: string;
    InventoryType: string;
    Qty: number;
    InTransitValue: number;

    ShipmentStatus: string;
    Ageing_on_Shipment: number;
}


export class BulkDownloadTemplate {
    CompanyName: string;
    StoreName: string;
    MarketPlaceSellerID: string;
    SKU: string;
    ASIN: string;
    FulFillmentCenterID: string;
    AvailableQty: number;
    LiquidationPricePerUnit_InclOfTax: number;
}
export class ProductTaxCodeMaster {
    ProductTaxCode: string;
    TaxRate: number;
}

export class ProductTaxCode {
    StoreName: string;
    SKU: string;
    ImagePath: string;
    ProductTaxCode: string;
    APIStatus: string;
    CreatedDate: Date;
    RecordUploadStatus: string;
    RecordUpload_StatusUpdated: Date;
    CreatedByName: string;
    LoginId: number;
    CompanyID: number;
    JsonData: string;
    Action: string;
}