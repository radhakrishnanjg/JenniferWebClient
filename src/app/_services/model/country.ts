export class Country {
    CountryID : number;
    CountryName: string; 
}
export class State {
    StateID : number;
    State: string; 
    //newly added for gst,voucher and ledgers   
    StateCode: string; 
    GSTStateName: string; 
    GSTStateCode : string;
}
export class State1 {
    StateID : number;
    State: string; 
    //newly added for gst,voucher and ledgers  
    StateCode: string; 
    GSTStateName: string; 
    GSTStateCode : string; 
}
export class Dropdown { 
    UserId: number;
    DropdownID: number;
    DropdownType: string;
    DropdownValue: string;
    DropDownDescription: string;
    IsActive: Boolean;
    DisplayOrder: number;
    // who is doing this task
    LoginId: number;
}
