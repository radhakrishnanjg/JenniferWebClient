export class RequestForm {
    lstColumnDetail: RequestFormColumnDetail[];
    lstWorkFlowDetail: RequestFormWorkFlowDetail[];

    RequestFormID: number;
    RegisterID: string;
    SystemType: string;
    FormType: string;
    FormName: string;

    FormShortID: string;
    Purpose: string;
    MajorBenefits: string;
    Remarks: string;
    RegisterFormStatus: string;

    FormDesignType: string;
    LoginId: number;

    RequestByName: string;
    DepartmentName: string;
}

export class RequestFormColumnDetail {
    RequestFormColumnDetailID: number;
    RequestFormID: number;
    DisplayOrder: number;
    ControlId: string;
    ControlType: string;

    TypeName: string;
    HTML5InputAttribute: string;
    ControlSize: string;
    Caption: string;
    ExampleValue: string;

    IsMandantory: boolean;
    MandantoryErrorMessage: string;
    MaxLengthValue: number;
    MinValue: number;
    MaxValue: number;

    DropDownType: string;
    HasChild: boolean;
    ParentControlId: string;
    ChildControlId: string;
    TableName: string;

    DisplayName: string;
    FieldName: string;
    WhereClause: string;

    Options: string;
    IsUnique: boolean;
    UniqueErrorMessage: string;
}

export class RequestFormWorkFlowDetail {
    RequestFormWorkFlowDetailID: number;
    RequestFormID: number;
    DisplayOrder: number;
    NameOfApproval: string;
    UserIds: string;
}
 

export class RegularExpValue {
    TypeName: string;
    HTML5InputAttribute: string;
    ValidationExpression: string;
    ExampleValue: string;
}

export class SeniorMasterTable {
    TableName: string;
    DisplayName: string;
    FieldName: string;
}

export class Users {
    UserID: number;
    FullName: string;
    Email: string;
} 
export class JsonModal { 
    Json: string; 
} 

