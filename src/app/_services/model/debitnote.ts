
 
export class DebitNoteHeader { 
    DNID: number;
    PurchaseID: number;
    LocationID: number;
    DNDate: Date;
    DNNumber: string;

    DNType: string;
    ReferenceDetail: string;
    Remarks: string; 
    //child data
    lstDebitNoteDetail: DebitNoteDetail[] = [] as any;
    InvoiceDate: Date;
    InvoiceNumber: string;
    LocationName: string;
    TotalAmount: number = 0.00;
    //owner detail
    VendorName: string;
    LoginId: number;
    CompanyDetailID: number; 
}

export class DebitNoteDetail {
    InvoiceDate: Date;
    InvoiceNumber: string;
    DNDetailID: number;
    DNID: number;
    CompanyDetailID: number;
    ItemID: number;
    ItemName: string;
    ItemCode: string;

    InvoiceQty: number; //DN 
    PendingQty: number;//DN 
    Qty: number;//DN 
    InvoiceTotalAmount: number; //FDN 
    PendingTotalAmount: number; //FDN 
    TotalAmount: number; //FDN 
    Reason: string; 
}

export class PendingPurchaseInvoice{
    InvoiceNumber: string;
    PurchaseID: number;
    InvoiceDate: Date;
    LocationID: number;
    LocationName: string;  
} 