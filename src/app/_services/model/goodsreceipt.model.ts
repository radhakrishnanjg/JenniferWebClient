export class GoodsReceipt {
    GRNID: number;
    GRNNumber: string;
    GRNDate: Date;
    POID: number;
    PONumber: number;
    InvoiceID: number;
    InvoiceNumber: string;
    OtherReference: string;
    LocationID: number;
    LocationName: string;
    VehicleNumber: string;
    EwayBillNumber: string;
    VendorID: number;
    VendorName: string;
    InventoryType: string;
    Remarks: string;
    ItemDetails: GoodsReceiptDetail[];
    lstInwards: Goodsinward[];
    TotalReceivedQty: number;
    LoginId: number;
    CompanyDetailID: number;
    ImagePath1: string;
    ImagePath2: string;
    ImagePath3: string;
    ImagePath4: string;
    
    GRNType: string;
    VendorWarehouseID: number;
    TrackingNumber: string;
    GRNStatus:string;
 
}

export class GoodsReceiptDetail {
    GRNDetailID: number;
    GRNID: number;
    CompanyDetailID: number;
    ItemID: number;
    ItemCode: string;
    ItemDescription: string;
    VendorItemCode: string;
    TotalReceivedQty: number = 0;
    InventorySellableQty: number = 0;
    InventoryShortageQty: number = 0;
    InventoryDamageQty: number = 0;
    InventoryOthersQty: number = 0;
    ShortageRemarks: string;
    DamageRemarks: string;
    OthersRemarks: string;
    PDFFilePath: string;
    LastModifiedBy: number;
    //grn creation 
    POQTY: number;
    AvailableQty: number;
    GRNQty: number;
}

export class PONumber {
    POID: number;
    PONumber: string;
    PODate: Date;
    LocationID: number;
    LocationName: string;
    VendorID: number;
    VendorName: string;
    GRNType: string; 
    InventoryType: string; 
}

export class Goodsinward {
    GRNInwardID: number;
    GRNDetailID: number;
    VendorItemSerialType: string;
    VendorItemSerialNumber: string;
    ItemID: number;

    JenniferItemSerial: string;

    //master values
    GRNID: number;
    CompanyDetailID: number;
    GRNNumber: string;
    InventoryType: string;
    ItemName: string;
    ItemCode: string;
    IsDeleteAllowed: boolean;
    // who is doing this task
    LoginId: number;
}
export class Goodsstorage {
    GoodsStorageID: number;
    JenniferItemSerial: string;
    WarehouseLocation: string;
    WarehouseRack: string;
    WarehouseBin: string;
    IsEditable: boolean;

    //master values     
    CompanyDetailID: number;
    // who is doing this task
    LoginId: number;
}

export class Goodsdispute {
    DisputeID: number;
    GRNInwardID: number;
    JenniferItemSerial: string;
    InventoryType: string;
    GRNNumber: string;

    DisputeType: string;
    OtherItemID: string;
    ItemID: number;
    ItemCode: string;
    ItemName: string;

    VideoLink: string;
    Remarks: string;
    Image1: string;
    Image2: string;
    Image3: string;

    Image4: string;
    Image5: string;
    Image6: string;
    Image7: string;
    Image8: string;

    Image9: string;
    Image10: string;
    CompanyDetailID: number;
    LoginId: number;

}

export class Goodsdisputeitems {
    GRNID: string;
    GRNNumber: string;
    InventoryType: string;
    ItemID: string;
    ItemName: string;
}


export class Inventorydetail {
    InventoryEventDetailID: number;
    CompanyID: number;
    CompanyDetailID: number;
    LocationID: number;
    ItemID: number;

    EventDate: Date;
    TransactionType: string;
    SellableQty: number;
    UnsellableQty: number;
    SellableCurrentStock: number;

    UnsellableCurrentStock: number;
    SellableWarehouseQty: number;
    UnSellableWarehouseQty: number;
    ActiveStockRecord: Boolean;
    LoginId: number;

    LocationName: string;
    ItemCode: string;
    ItemName: string;
    BrandID: number;
    BrandName: string;
} 