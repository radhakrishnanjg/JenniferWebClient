 
 export class Emailtemplate {
    EmailTemplateID: number;
    ContactID: number;
    TemplateName: string;
    TemplateSubject: string;
    TemplateBody: string;

    Description: string;
    SP_Name: string;
    EmailTags: string;
    EmailTagContent: string;
    EmailType: string;
    CompanyId: Number; 
    lstContact: Contact[];
    // who is doing this task
    LoginId: Number;
}
export class Contact {
    ContactID: number;
    MarketplaceID: number;
    ContactType: string;
    ContactName: string;
    MobileNumber: string;

    LandphoneNumber: string;
    Email: string;
    Designation: string;
    Department: string;
    Organization: string;
    
    Other1: string;
    Other2: string;
    IsActive: Boolean;

    CompanyId: number;

    // who is doing this task
    LoginId: number;
}
