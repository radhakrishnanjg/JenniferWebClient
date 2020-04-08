
// import { Invoiceitem } from './invoiceitem';

export class Invoice {
    PurchaseID: number;
    CompanyDetailID: number;
    InvoiceDate: Date;
    InvoiceNumber: string;
    VendorWarehouseID: number;

    LocationID: number;
    POID: number;
    Remarks: string;
    InstrumentID: string;

    // master table values 
    PONumber: string;
    LocationName: string;
    VendorID: number;
    VendorName: string;
    WarehouseName: string;
    lstItem: Invoiceitem[];
    IsEditable: boolean;
    ISBOE:boolean;
    CurrencyType: string; 
    CurrencyValue: number; 
    // who is doing this task
    LoginId: number;

}
export class Invoiceitem {
    PurchaseInvItemID: number;
    PurchaseID: number;
    CompanyDetailID: number;
    ItemID: number;
    Qty: number;

    TaxNature: string;
    OriginalRate: number;
    Rate: number;
    TaxRate: number;
    TaxAmount: number;
    TotalTaxAmount: number;

    DirectCost: number;
    TotalAmount: number;
    MRP: number;
    // master table values 
    POID: number;
    ItemCode: string;
    VendorItemCode: string;

    //reference for the calculation
    POQty: number;
    AvailableQty: number; 
    CurrencyType: string; 
    CurrencyValue: number; 
}


export class BOEHeader {

    BOEID: number;
    CompanyDetailId: number;
    PurchaseID: number;
    BOENumber: string;
    BOEDate: Date;

    PortCode: string;
    ReferenceDetail: string;
    LoginId: number; 
    //addtion columns 
    TotalAmount:number;
    IsEditable:boolean;
    
    lstDetail: BOEDetail[];
    //master table 
    PONumber: string ;
    InvoiceNumber: string ;
    InvoiceDate: Date
    LocationName:string ;
    WarehouseName:string ;
    PIValue:number;
}

export class BOEDetail {
    BOEDetailsID: number;
    BOEID: number;
    ItemID: number;
    HSNCode: string;
    HSNCodeGST:string;

    DutyType: string;
    IsGSTApplicable: number;
    DutyPercentage: number;
    DutyAmount: number;
    IGSTRate: number;

    IGSTValue: number;
    TotalValue: number;
    SumTotalValue: number;

    IsView:boolean=true;
}