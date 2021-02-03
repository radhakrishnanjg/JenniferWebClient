export class Picklistheader {
    PicklistID: number;
    PickListNumber: number;
    OrderID: string;
    LocationID: number;

    InventoryType: string;
    PicklistQty: number;
    PickedQty: number;
    TransferQty: number;
    Status: string;

    lstSerialNums: Picklistdetail[];
    lstSummary: Picklistsummary[];

    //login info
    LoginId: number;
    CompanyDetailID: number;
    // Master table values
    LocationName: string;
    InvoiceNumber: string;
    WarehouseLocation: string;
    WarehouseRack: string;
    WarehouseBin: string;
}




export class Picklistsummary {
    PicklistSummaryID: number;
    PicklistID: number;
    CompanyDetailID: number;
    ItemID: number;
    WarehouseLocation: string;

    WarehouseRack: string;
    WarehouseBin: number;
    Qty: number;
    ItemCode: string;
    PicklistQty: number;

    AvailableQty: number;
    ScanedQty: number;
}

export class Picklistdetail {
    JenniferItemSerial: string;
    Flag: boolean;
    WarehouseLocation: string;
    WarehouseRack: string;
    WarehouseBin: string;
    ItemCode: string;
    ItemName: string;
    CustomerItemCode: string;
    ItemSerialNumber: string;
}

export class Picklistview {
    lstSerialNums: Picklistdetail[];
    lstHeader: Picklistheader[];
}

export class SalesInvoiceHeader {
    Seller: string;
    Buyer: string;
    InvoiceNumber: string;
    InvoiceDate: Date;
    DeliveryNote: string;

    DiscountAllowedinDays: number;
    SupplierRef: string;
    OtherRef: string;
    BuyerRef: string;
    Dated: Date;

    DispathDocument: string;
    DeliveryNoteDate: Date;
    CourierName: string;
    City: string;
    TermOfDelovery: string;
    CompanyName: string;
    Remarks: string;
    TaxNature: string;
    TaxRate: number;
    TotalAmount: number;
    TotalAmuntWords: string;
    TotalTaxWords: string;
    TotalAmountRoundtype: string;
    TotalAmountRoundValue: number;
    TaxAmtRoundOff: number;
    lstDetail: SalesInvoiceDetail[];
    lstHSNCode: SalesInvoiceHSNDetail[];
    lsttax: SalesInvoicetaxDetail[];
    TCS_Amount: number;
}

export class SalesInvoiceDetail {
    SLno: number;
    ItemName: string;
    HSNCode: string;
    Qty: number;
    Rate: number;

    Per: string;
    Amount: number;
    IGST: number;
    CGST: number;
    SGST: number;
    TaxNature: string;
}

export class SalesInvoiceHSNDetail {
    HSNCode: string;
    TaxNature: string;
    TaxRate: number;
    IGSTTaxAmount: number;

    CGSTTaxAmount: number;
    SGSTTaxAmount: number;
    TaxableValue: number;
    TaxAmount: number;
}

export class SalesInvoicetaxDetail {
    TaxNature: string;
    TaxRate: number;
    TaxAmount: number;
    TaxState: string;
}

export class StockAudit {
    lstSerialNums: JenniferItemSerials[];
    LoginId: number;
    CompanyDetailID: number;
    JenniferItemSerial: string;
}
export class JenniferItemSerials {
    JenniferItemSerial: string;
}

export class StockAuditReport {
    JenniferItemSerial: string;
    ItemCode: string;
    ItemName: string;
    Status: string;
    Remarks: string;
}

export class StockAuditStatus {
    JenniferItemSerial: string;
    ItemCode: string;
    ItemName: string;
    Action: string;
    ActionBy: string;
    ActionDate: Date;
}
export class StockExchangeHeader {
    CompanyDetailID: number;
    LoginId: number;
    lstSerialNums: JenniferItemSerials[] = [] as any;
}
export class StockExchangeDetail {
    CompanyDetailID: number;
    LocationID: number;
    JenniferItemSerial: string;
    ItemID: number;
    ItemCode: string;
    ItemName: string;
    InventoryType: string;
    NewInventoryType: string;
}