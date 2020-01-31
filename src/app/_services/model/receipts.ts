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
}
