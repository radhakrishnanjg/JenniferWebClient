
import { Contact } from './emailtemplate';
export class Location {
    LocationID: number;
    CompanyID: number;
    LocationName: string;
    LocaitonAliasName: string;
    Address1: string;
    Address2: string;
    City: string;
    PostalCode: string;
    StateID: number;
    CountryID: number;
    GSTNumber: string;
    ContactPerson: string;
    ContactNumber: string;
    IsActive: boolean;
    Email: string;
    //login info
    LoginId: number;
    // Master table values
    StateName: string;
    CountryName: string;
    lstContact: Contact[];
    IsInvoicing: boolean;
    TaxNature: string;
    CustomerID: number;

    FromLocationID:number; 
    ToLocationID:number;
}
