export class Receipts {
    FileID: number;
    CompanyDetailID: number;
    Filename: string;
    NoOfRecords: number;
    AmountAsPerFile: number;
 
    TotalAmt: number;
    BankReceiptDate: Date;
    TaxRate: number;
    BankUTRNumber: string;
    SearchType: string;

    IsEditable: boolean; 
    LoginId: number; 
    UploadStatus:string;
    BankAccountNumber:string;
}


export class UpcomingReceipts {

    SettlementStartDate: Date;
    SettlementEndDate : Date;
    Amount: number;
    Currency: string;
    Status: string;
    FundTransferStatus: string;
    FundTransferDate : Date;
    AccountNumberEndingwith : string;
    UTRNumber : string;
    BankReceiptDate : string;
    BankAccountNumber:string;
}