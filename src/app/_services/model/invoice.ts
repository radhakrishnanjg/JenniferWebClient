
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
}
