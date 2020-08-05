export class CustomerReceiptHeader {
    ReceiptID:number;
    BillNumber:string;
    CustomerID:number;
    PaymentMode:string;
    TransactionNumber:string; 
    OrderIDs: string;
    TransactionDate:Date;
    ReceivedDate:Date;
    TotalReceivedAmount:number;
    Remarks:string;
    ReverseId:number;
    //Child data
    lstCustomerReceiptDetail: CustomerReceiptDetail[] = [] as any;
    //Master data
    CustomerType :string ;
    CustomerName:string;
    //login Information
    LoginId: number;
    CompanyDetailID:number; 
}

export class CustomerReceiptDetail {  
    AgingDays: number;
    OrderID: string;
    SalesOrderID:number;
    OrderDate: Date;
    ReceivableAmt: number;
    PendingAmt: number;
    ReceivedAmt: number; 
}
