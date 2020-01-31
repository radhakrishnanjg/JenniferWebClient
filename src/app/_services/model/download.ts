export class DownloadMaster {
    Download_Master_ID: number;
    Screen_Name: string;
    SP_Name: string;
    P_Count: number;
    Report_Type: string;

    Status: Boolean;
    // who is doing this task
    LoginId: number;
    Filename: string;
    DynamicQuery: string;
    lstDetail: DownloadDetail[];
    MenuID: number;
    UserId: number;
    IsActive: boolean;
    CompanyID:number;
    CompanyDetailID:number;
    ReportDecription:string;
}

export class DownloadDetail {
    Download_Master_ID: number;
    Download_Detail_ID: number;
    TempID: number;
    Display_Name: string;
    P_Name: string;

    Column_Name: string;
    SP_Name: string;
    Text_Type: string;
    Screen_Name: string;

    Status: Boolean;
    // who is doing this task
    LoginId: number;
    ReportDecription:string;
    IsMandatory:boolean;
}

export class DownloadLog {
    Screen_Name: string;
    Startdate: Date;
    EndDate: Date;
    RequestedDate: Date;
    RequestedBy: string;
}
export class AmazonMTR {
    ReportId: string;
    DownloadPath: string;
    FileName: string;
    CreatedDate: Date;
    UploadStatus: string;
}

