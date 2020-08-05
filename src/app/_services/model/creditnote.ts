export class CreditNoteHeader {
    CNID: number;
    SalesOrderID: number;
    CNDate: Date;
    CNNumber: string;
    CNType: string;
    CNStatus: string;
    ReferenceDetail: string;
    Reason: string;
    Remarks: string;
    CustomerID: number;
    lstCreditNoteDetail: CreditNoteDetail[] = [] as any;
    LoginId: number;
    CompanyDetailID: number;

    //Master table
    OrderID: string;
    CustomerName: string;
    TotalAmount: number;
    OrderDate: Date;
}

export class CreditNoteDetail {
    CNDetailID: number;
    CNID: number;
    CompanyDetailID: number;
    ItemID: number;
    ItemName: string;
    ItemCode: string;
    Qty: number;
    InvoiceQty: number;
    PendingQty: number;
    TotalAmount: number;
    PendingAmount: number;
    InvoiceTotalAmount: number; 
    UnitPrice: number;
    Reason: string;
}

export class PendingSalesInvoice{
    InvoiceNumber: string;
    SalesOrderID: number;
    InvoiceDate: Date;
    OrderID:  string;
    INTotalAmount: number;
    QTotalAmount: number;
    INQty: number;
    QQty: number;
    OrderDate: Date;
} 

export class Refund{
    RefundID: number;
    CNID: number;
    CompanyDetailID: number;
    RefundNumber:  string;
    RefundMode:  string;
    TransactionNumber:  string;
    TransactionDate: Date;
    RefundAmount: number;
    Remarks:  string;
    CNType: string;
    CNDate: Date;
    TotalAmount: number;
    PendingTotalAmount: number;
    LoginId: number; 

    //Master screen
    CustomerName: string;
    CNNumber: string;
} 

