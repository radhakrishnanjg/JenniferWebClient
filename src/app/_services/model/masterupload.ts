export interface MasterUpload {
    UserProfileID: number;
    FileId: number;
    FileType: string; 
    childCategory: string; 
    DownloadTemplate: string;
    FileName: string;
    FilePath: string;
    Remarks: string;  
    UploadedBy: number;
    UploadedByName: string;  
    UploadedDate: string;  
    Processed: boolean;  
    Rejected: boolean;  
    RejectedReason: string;  
    Error: string;
    _Message: string;  
    _Flag: boolean;   
    FileUploadStatus: boolean;  
    Remarks_UploadStatus: string;   
    LoginId: number;  
    LoanNum_ReceiptNum: string;  
    IsRecord_Error: boolean;  
    CompanyDetailID:number;

    //FileData : File;
}
