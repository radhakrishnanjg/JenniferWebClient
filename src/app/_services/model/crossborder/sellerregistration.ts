export class SellerRegistration {
    SellerFormID: number;
    RKSellerID: string;
    CompanyName: string;
    CompanyPhoneNumberCountryCode: string;
    CompanyPhoneNumber: string;
    CountryID: number;
    CompanyAddress: string;
    BusinessLicense: string;
    ContactPersonName: string;
    Email: string;
    MobileNumberCountryCode: string;
    MobileNumber: string;
    WechatID: string;
    IORPartnerID: number;
    IORPartner: string;
    PSP: string;
    PSPAccountNumber: string;
    VendorID: number;
    LogisticsPartner: string;
    NoofSKUs: number;
    ApprovalStatus: string;
    ApprovalRemarks: string;
    IndianGSTNumber: string;
    GSTState: number;
    IndianMobileNumber: string;
    AssignedDetailDate: string;
    IsOTPSent: boolean;
    OTPSentDate: string;
    MarketPlaceID: number;
    StoreName: string;
    MarketPlaceSellerID: string;
    MarketPlaceAPIToken: string;
    BusinessLaunchDate: string;
    IsActive: boolean;
    LoginId: number;
    LastModifiedDate: string;
    Action: string;
    CreatedDate: string;
    VendorName: string;
    MarketPlace: string;
    IsMobileRequested: boolean;
    MobileRequestedDate: Date;
    StateName:string;
    // Action - MU: MarketPlaceID,StoreName,MarketPlaceSellerID,MarketPlaceAPIToken,BusinessLaunchDate,SellerFormID

    // Action - MR: IsMobileRequested,MobileRequestedDate 

    // Action - A: ApprovalStatus,ApprovalRemarks,SellerFormID 

    // Action - D: SellerFormID 

    // Action - I: CompanyName,CompanyPhoneNumberCountryCode,CompanyPhoneNumber,CompanyAddress, 
    //BusinessLicense,ContactPersonName,Email,MobileNumberCountryCode,MobileNumber,
    //WechatID,IORPartnerID,PSP,PSPAccountNumber,VendorID,
    //LogisticsPartner,NoofSKUs,ApprovalStatus

    // Action - U:  CompanyName,CompanyPhoneNumberCountryCode,CompanyPhoneNumber,CompanyAddress, 
    //BusinessLicense,ContactPersonName,Email,MobileNumberCountryCode,MobileNumber,
    //WechatID,IORPartnerID,PSP,PSPAccountNumber,VendorID,
    //LogisticsPartner,NoofSKUs
}


