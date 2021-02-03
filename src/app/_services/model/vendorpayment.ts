

export class VendorPaymentHeader {
    BillNumber: string;
    PaymentID: number;
    VendorID: number;
    PaymentMode: string;
    TransactionNumber: string;
    PaidDate: Date;
    PaymentDate: Date;
    Remarks: string;
    ReverseId: number;
    //child data
    lstVendorPaymentDetail: VendorPaymentDetail[] = [] as any;
    //owner detail 
    VendorName: string;
    LoginId: number;
    CompanyDetailID: number;
    TotalPaidAmount: number;
    InvoiceNumber: string;
    PendingAmount:number;
    lstVendorPaymentDetailHistory: VendorPaymentDetailHistory[] = [] as any;
}
export class VendorPaymentDetail {
    PaymentDetailID: number;
    PaymentID: number;
    CompanyDetailID: number;
    PaidAmt: number;
    PurchaseID: number;
    InvoiceNumber: string;
    InvoiceDate: Date;
    AgingDays: number;
    PayableAmt: number;
    PendingAmt: number;

} 


export class VendorPaymentDetailHistory { 
    AgingDays: number; 
    InvoiceDate: Date;
    InvoiceNumber: string;
    PayableAmt: number;
    PendingAmt: number;
    PaidAmt: number; 
    ActionBy: string;
    ActionDate: Date;
} 