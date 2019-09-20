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
}
export class AmazonMTR {  
    ReportId: string;
    DownloadPath: string;    
    FileName: string;
    CreatedDate: Date;  
}

