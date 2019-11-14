export class Gstfinancefileupload {

    lstApprovalStatusViewModel: GSTApprovalStatusViewModel[];

    FileID: number;
    Action: string;
    FileType: string;
    Year: number;
    Month: number;
    MonthName: string;


    CompanyDetailID: number;
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

