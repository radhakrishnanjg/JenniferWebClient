
import { Contact } from './emailtemplate';
export class Customer {
    CustomerID: number;
    CustomerName: string;
    CustomerAliasName: string;
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

    CompanyId: number;
    // master table values 
    StateName: string;
    CountryName: string;
    lstContact: Contact[];

    //iteration 1
    CustomerType :string ;

    // who is doing this task
    LoginId: number;
    TotalAmount: number;
    TCS_Amount: number;
}

export class Customerwarehouse {
    CustomerWarehouseID: number;
    CustomerID: number;
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

    CompanyId: number;
    // master table values 
    CustomerName: string;
    CountryName: string;
    VendorName: string;

    // who is doing this task
    LoginId: number;
}

export class Customeritem { 
    CustomerItemID: number;
    CustomerItemCode: string;
    CompanyDetailID: number;
    CustomerID: number;
    ItemID: number;
    IsActive: Boolean;

     // master table values 
     CustomerName: string;
     ItemCode: string;
     // who is doing this task
    LoginId: number;

}
