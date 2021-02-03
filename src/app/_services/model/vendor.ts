
import { Contact } from './emailtemplate';
export class Vendor {
    VendorID: number;
    VendorName: string;
    VendorAliasName: string;
    Address1: string;
    Address2: string;
    CountryID: number;
    City: string;
    ContactPerson: string;
    GSTNumber: string;
    BankName: string;
    AccountType: string;
    IFSCCode: number;
    StateID: number;
    PostalCode: number;
    ContactNumber: number;
    Email: string;
    BeneficiaryName: string;
    AccountNumber: number;
    IsActive: Boolean;

    CompanyID: number;
    // master table values 
    StateName: string;
    CountryName: string;
    lstContact: Contact[];
    // who is doing this task
    LoginId: number;
    //added on 03 03 2020
    IsEOR: boolean;
    IsEORApprovalRequired: boolean;
    TotalAmount: number;
    TCS_Amount: number;
}
export class Vendorwarehouse {
    VendorWarehouseID: number;
    VendorID: number;
    WarehouseName: string;
    Address1: string;
    Address2: string;
    City: string;
    PostalCode: string;
    StateID: number;
    CountryID: number;
    GSTNumber: string;
    ContactPerson: string;
    ContactNumber: string;
    Email: string;
    IsActive: Boolean;

    CompanyID: number;
    // master table values 
    StateName: string;
    CountryName: string;
    VendorName: string;
    // who is doing this task
    LoginId: number;
    lstContact: Contact[] = [] as any;
}
export class Vendoritem {

    VendorItemID: number;
    VendorItemCode: string;
    CompanyDetailID: number;
    VendorID: number;
    ItemID: number;
    CommercialType: string;

    IsActive: Boolean;
    // master table values 
    VendorName: string;
    ItemCode: string;
    // who is doing this task
    LoginId: number;

}

