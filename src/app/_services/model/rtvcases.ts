export class RTVCaseHeader {

    lstTrans: RTVCaseHeader[];
    lstImages: RTVCaseImage[];
    lstHistory: RTVDetailHistory[];
    TempID: number;
    RTVID: number;
    TrackingID: string;
    RemovalOrderID: string;
    DisputeType: string;

    Qty: number;
    SellingValue: number;
    ParentCaseId: string;
    AmazonCaseId: string;
    ReimbursementValue: number;

    NewReimbursementValue: number;
    CurrentStatus: string;
    Remarks: string;
    CompanyDetailID: number;
    LoginId: number;

    AssignTo: number;
    AssignToName: string;
    AssignedByName: string;
    AssignedDate: Date;
    TransferFrom: number;

    TransferFromName: string;
    TransferTo: number;
    TransferToName: string;
    TransferByName: string;
    TransferredDate: Date;

    FinalHtml: string;
    IsActive: boolean;


}

export class RTVDetailHistory {
    Status: string;
    Remarks: string;
    ActionBy: string;
    CreatedDate: Date;
    ReimbursementValue: number;
}

export class RTVCaseTransferDetail {

    RTVID: number;
    Status: string;
    Remarks: string;
    TransferFrom: number;
    TransferFromName: string;

    TransferTo: number;
    TransferToName: string;
    TransferByName: string;
    TransferredDate: Date;

}

export class RTVCaseImage {

    RTVID: number;
    FilePath: string;

}
export class RTVAmazonCaseID {
    RTVID: number;
    AmazonCaseId: string;

}

export class RTVUsers {
    UserId: number;
    FullName: string;



}