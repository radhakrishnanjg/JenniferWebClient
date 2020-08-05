export class MobileMaster {
  JenniferMobileMasterID: number;
  BankName: string;
  AccountType: string;
  IFSC: string;
  AccountName: string;
  AccountNumber: string;
  IndianGSTNumber: string;
  GSTState: number;
  IndianMobileNumber: string;
  SellerFormID: number;
  IsActive: boolean;
  IsOTPSent: boolean;
  OTPSentDate: Date;  
  IsAssigned:boolean;
  AssignedDetailDate: Date;
  MarketPlaceSellerID: string;
  ApprovalStatus: string;
  StoreName: string;
  Email: string;
  RKSellerID: string;
  Action: string;
  LoginId: number;
  StateName:string;
  AssignStatus: string;

  // Action - O: SellerFormID,IsOTPSent,OTPSentDate

  // Action - D: JenniferMobileMasterID 

  // Action - I: BankName,AccountType,IFSC,AccountName,AccountNumber
  //,IndianGSTNumber,GSTState,IndianMobileNumber,SellerFormID

  // Action - U:  SellerFormID,AssignedDetailDate,JenniferMobileMasterID
} 

// export class SellerRegistration { 
//   SellerFormID: number;
//   RKSellerID: string;
//   CompanyName: string;
// }

export class IORPartners {
  CompanyID: number;
  CompanyName: string;
}

export class EORPartners {
  VendorId: number;
  VendorName: string;
}


