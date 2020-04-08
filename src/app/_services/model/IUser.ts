
import { Companydetails } from './company-register';
import { Dropdown } from './country';
export class IUser {
    UserId: number;
    CompanyID: number;
    CompanyDetailID: number;
    FirstName: string;
    LastName: string;
    Email: string;
    Password: string;
    Salt: string;
    UserType: string;
    IsActive: Boolean;

    //custom field added
    AuthToken: string;
    lstUserPermission: Userpermission[]=[] as any;
    lstUserStores: Companydetails[]=[] as any;
    lstmasterscreens: Dropdown[]=[] as any;
    lstApplicationAccess: ApplicationAccess[]=[] as any;
    // who is doing this task
    LoginId: number;
    Flag: boolean;
    IsMailRequired: boolean;
    IsForceChangePwd: boolean;
    ImagePath: string;
    LastLogin: Date;
    ImagePathData: File;
    SellerFormID:number;
}

export class Userpermission {
    LoginId: Number;
    MenuID: Number;
    MenuType: string;
    ParentId: number;
    MenuName: string;
    PageName: string;
    AngularRouteName: string;
    Menucss: string;
    DisplayOrder: number;

    // permission
    Permission: string;
    MenuActionId: number;
    UserId: number
    IsViewEdit: string
    // Menu    
    IsActive: Boolean;
    ApplicationName:string;
}

export class ApplicationAccess {
    UserId: Number;
    ApplicationName: string;
}
export class Userlog {
    Type: string;
    UserId: number;
    IPAddress: string;
    MACAddress: string;
    BrowserInfo: string;
}

export interface IChangepassword {
    OldPassword: string;
    NewPassword: string;
    ConfirmPassword: string;
    UserId: Number;
    CompanyDetailID: Number;
    Email: string;
}
