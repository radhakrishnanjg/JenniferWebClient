export class Ticket {
    // Support Query
    SupportQueryID: number;
    CompanyDetailID: number;
    ModuleType: string;
    SupportNumber: string;
    Subject: string;
    ReferenceNumber: string;
    LoginId: number;
    SupportStatus: string;
    IsForwarded: boolean;

    // Support Reply
    SupportReplyD: number;
    Query: string;
    ReadFlag: number;
    UserType: string;
    LastModifiedDate: Date;
    Action:string; 
}

export class History {
    Query: string;
    CreatedDate: Date;
    CreatedByName: string;
    UserType: string;
    SupportQueryID: number;
    SupportStatus: string;
    ModuleType:string;
    TimeLeft: string;
    IsForwarded: boolean;
}

export class SurveyMaster { 
    SurveyMasterID: number;
    AngularRoute: string;
}

export class whichareaofthepaymentsummarydoyounotunderstand { 
    IsActive: boolean;
    Value: string;
}

export class Survey1Answers {
    UserSurveyID: number;
    UserID: number;
    SurveyMasterID: number;
    Doyouunderstandthepaymentsummarycompletely: string;
    whichareaofthepaymentsummarydoyounotunderstand: string;
    whichareaofthepaymentsummarydoyounotunderstandOther: string;
    DoyouthinkthistoolJenniferhashelpedyouunderstandthepaymentsummarybetter: string;
    DoyouthinkthistoolJenniferhashelpedyouunderstandthepaymentsummarybetterOther: string;
    CommentsSection: string;
    LoginId: number; 
}