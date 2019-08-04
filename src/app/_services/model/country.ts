export class Country {
    CountryID : number;
    CountryName: string; 
}
export class State {
    StateId : number;
    State: string; 
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
