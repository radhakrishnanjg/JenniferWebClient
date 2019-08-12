

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
    AppointmentDate:Date;
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
} export class Poapprovaldetail {
    ApprovalStatus: string;
    Remarks: string;
    ActionBy: string;
    CreatedDate: Date;
}
