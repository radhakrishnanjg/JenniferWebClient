export class Ticket {
    // Support Query
    SupportQueryID: number;
    CompanyDetailID: number;
    ModuleType: string;
    SupportNumber: string;
    Subject: string;
    ReferenceNumber: string;
    LoginId: number;

    // Support Reply
    SupportReplyD: number;
    Query: string;
    ReadFlag: number;
    UserType: string;
    LastModifiedDate:Date; 
    // SupportQueryID:	number;
    // LoginId: number;
} 

export class History { 
    Query: string;
    CreatedDate: Date;
    CreatedByName: string ;
    UserType: string ;
    SupportQueryID: number;
}