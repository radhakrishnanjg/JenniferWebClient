export class Gstfinancefileupload {

    lstApprovalStatusViewModel: GSTApprovalStatusViewModel[];

    FileID: number;
    Action: string;
    FileType: string;
    Year: number;
    Month: number;
    MonthName: string;


    CompanyID: number;
    FileName: string;
    FilePath: string;
    UploadedBy: number;
    UploadedByName: string;

    UploadedDate: Date | string;
    NoOfRecords: number;
    ProcessByName: string;
    ProcessDate: Date | string;
    LoginId: number;

    ApprovalStatus: string;
    Remarks: string;
    FileChange: boolean;
    IsEditable: boolean;
    GSTRemarks: string;

    GSTStatus: string; 
}

export class GSTApprovalStatusViewModel {
    Status: string;
    Remarks: string;
    ActionBy: number;
    ActionByName: string;
    CreatedDate: Date | string;
}

export class TallyProcess {
    BatchID: string;
    StoreName: string;
    DateRange : string;
    ProcessedBy : string;
    ProcessedDate : Date;
    ExecutionStatus: string;
    RejectedReason : string;
    // insert time
    TransactionType : string;
    GSTMonth : Date;
    FromDate : Date;
    Todate : Date;
    CompanyID: number; 
    LoginId: number; 
}