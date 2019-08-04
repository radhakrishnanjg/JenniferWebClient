export class CompanyRegister {
    CompanyID: number;
    CompanyName: string;
    CompnayAliasName: string;
    EMail: string;
    MobileNumber: string;
    PrimaryAddress1: string;
    PrimaryAddress2: string;
    PrimaryCity: string;
    PrimaryDistrict: string;
    PrimaryStateID: number;
    PrimaryCountryID: number;
    PrimaryPostalCode: number;
    PrimaryGST: string;
    ContactPerson: string;
    ContactNumber: string;
    SecondaryAddress1: string;
    SecondaryAddress2: string;
    SecondaryDistrict: string;
    SecondaryCity: string;
    SecondaryStateID: number;
    SecondaryCountryID: number;
    SecondaryPostalCode: number;
    SecondaryGST: string;
    CompanyLogoPath: File;

    PrimaryStateName: string;
    PrimaryCountryName: string;
    SecondaryStateName: string;
    SecondaryCountryName: string;
    IsAuthorised: Boolean;
    AuthorisedDate: string;
    IsPrimarySecondarySame: Boolean;
 
    // who is doing the action
    LoginId: number;
}
export class Companydetails {
    StoreName:string;
    BusinessLaunchDate:Date;
    MarketPlaceSellerID:string;
    MarketPlaceAPIToken:string;
    MarketplaceID:number;

    CompanyDetailID:number;
    CompanyID:number;
    IsActive:Boolean;    
    LoginId:Number;
    // master tables columns 
    MarketPlace :string
}
 