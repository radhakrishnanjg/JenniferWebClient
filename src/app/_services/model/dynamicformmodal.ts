export class DynamicFormViewModel {
    RequestFormID: number;
    FormType: string;
    FormName: string;
    FormDesignType: string;
    FormID: string;
    Value: string;
    ControlId: string;
    Json: string;
    LoginId: number;

}

export class DynamicFormDropDownViewModel {
    ControlId: string;
    Options: string;
}

export class DynamicFormWorkFlowDetail_Data {
    DisplayOrder: number;
    ActualApprovalEmails: string;
    ActionStatus: string;
    ActionRemarks: string;
    ActionByEmail: string;
    ActionByName: string;
    ActionDate: Date | string;
}

export class DynamicFormWorkFlowDetail {
    DisplayOrder: number;
    NameOfApproval: string;
    ActualApprovalEmails: string;
}

export class DynamicFormColumnViewModel {
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

    AllowedChars: string;
}



export class SeniorMaster {
    SeniorMasterTableID: number;
    DepartmentID: number;
    TableName: string;
    DisplayName: string;
    FieldName: string;
    WhereClause: string;
    IsActive: boolean;
    LoginId: number;
    //other table columns     
    DepartmentName: string;
}

export class Department {
    DepartmentID: number;
    Code: string;
    Name: string;
    IsActive: boolean;
    LoginId: number;
} 
