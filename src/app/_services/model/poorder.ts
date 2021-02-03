

export class Poorder {
    POID: number;
    PONumber: string;
    PODate: Date;
    PODeliveryDate: Date;
    IsEventPurchase: boolean;
    IsShipmentRequired: boolean;

    OtherReference: string;
    AgainstReference: string;
    PaymentReference: string;
    LocationID: number;
    VendorID: number;

    ApprovalStatus: string;
    Remarks: string;
    lstItem: Poorderitem[];
    lstApproval: Poapprovaldetail[];

    //master values     
    CompanyDetailID: number;
    CompanyID: number;
    LocationName: string;
    VendorName: string;
    POApprovalID: number;
    // who is doing this task
    LoginId: number;
    IsPOClosed: boolean;
    BulkString: string;
    FilePath: string;
    CurrencyType: string;
    VendorWarehouseID:number;
}
export class Poorderitem {

    POID: number;
    CompanyDetailID: number;
    PODetailsID: number;
    ItemID: number;
    ItemCode: string;
    UOMID: number;
    CaseSize: number;
    CasePack: number; // MultiplierValue
    MultiplierValue: number = 1;
    Qty: number = 0;
    Rate: number = 0.00;
    TaxRate: number = 0.00;
    DirectCost: number = 0.00;
    TaxAmount: number = 0.00;
    TotalAmount: number = 0.00;
    VendorItemCode: string;
    //
    ItemName: string;
    //shipment
    POQty: number;
    AvailableQty: number;
    ShipmentQty: number;

    SlNo: number;
    VendorItem: string;
    Total: number;
}

export class Poshipment {
    ShipmentID: number;
    ShipmentNumber: string;
    ShipmentName: string;
    CompanyDetailID: number;
    CompanyID: Number;
    POID: number;
    CarpID: string;
    Appointment: Date;
    AppointmentDate: Date;
    AttachedFileNames: string;
    Remarks: string;
    IsMailSent: Boolean;
    ShipmentStatus: string;


    // master tables
    PONumber: string;
    LocationID: number;
    LocationName: string;
    OtherReference: string;
    PODate: Date;
    lstItem: Poorderitem[];

    // who is doing this task
    LoginId: number;
    ShipmentType: string;
}


export class Poapprovaldetail {
    ApprovalStatus: string;
    Remarks: string;
    ActionBy: string;
    CreatedDate: Date;
}


export class Poprint {
    lstItem: Poorderitem[];

    ShipToName: string;
    ShipToAddress: string;
    ShipToCity: string;
    ShipToState: string;
    ShipToPostalCode: string;

    ShipToCountry: string;
    ShipToContactNumber: string;
    ShipToGSTNumber: string;
    BilledToName: string;
    BilledToAddress: string;

    BilledToCity: string;
    BilledToState: string;
    BilledToPostalCode: string;
    BilledToCountry: string;
    BilledToContactNumber: string;

    BilledToGSTNumber: string;
    VendorName: string;
    PODate: Date | string;
    OtherRefNum: string;
    CustomerWHCode1: string;

    CustomerWHCode2: string;
    PONumber: string;
    CustomerShipmentID: string;
    CustomerType: string;
    AmountInWords: string;

    TermsOfCondition1: string;
    TermsOfCondition2: string;
    TermsOfCondition3: string;
    TermsOfCondition4: string;
    TermsOfCondition5: string;

    TermsOfCondition6: string;
    CurrencyType: string;
    TCS: string;
}

export class PoMFI {
    POnumber: string;
    PODate: Date | string;
    ShipmentDate: Date | string;
    ShipmentNumber: string;
    ItemCode: string;

    ItemName: number;
    ShippedQty: number;
    ReceivedQty: number;
    DiffQty: number;
    DiffValue: number;

    Ageing: number;
    //Newly added
    CompanyDetailID: number;
    LoginId: number;
    CaseID: number;
}

export class MFICaseHeader {
    PONumber: string;
    PODate: Date;
    ShipmentDate: Date;
    ShipmentNumber: string;
    ShippedQty: number;
    ReceivedQty: number;
    DiffQty: number;
    DiffValue: number;
    FNSKU: string;

    Ageing: number;
    //Newly added
    Location:string; 
    InwardDate: Date;
    Owner:string
    lstCaseDetail: MFICaseDetail[] = [] as any; 
    sku:string;
    CaseId:string;
}

export class MFICaseDetail {

    ShipmentDate: Date;
    ShipmentNumber: string;
    CaseId: string;
    Status: string;
    Resolution: string;
    OveragedShipment: string;
    Quantity: number;
    RMSID: string;
    ValueOfRMS: number;
    Remarks: string; 
    
    CreatedDate: Date;
    CompanyDetailID: number;
    LoginId: number;
}