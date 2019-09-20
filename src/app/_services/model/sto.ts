export class Sto {
    STOID: number;
    STONumber: string;
    STODate: Date;
    FromLocationID: number;
    ToLocationID: number;

    OtherReference: string;
    Remarks: string;
    InventoryType: string;
    DiscountApplicable: boolean;
    LocationID: number;
    VendorID: number;

    FromLocation: string;
    ToLocation: string;
    Qty: number;
    TotalAmountInclTax: number;

    CompanyDetailID: number;
    CompanyID: number;
    TaxNature: string
    lstItem: Stodetail[];
    IsShipmentRequired: boolean;
    IsEdit: boolean;

    // who is doing this task
    LoginId: number;
}
export class Stodetail {

    STODetailID: number;
    STOID: number;
    CompanyDetailID: number;
    ItemID: number;
    UOMID: number;

    Units: number;
    Qty: number;
    TaxNature: string;
    ItemRate: number;
    
    DisCountPer: number;
    DiscountValue: number;
     
    DirectCost: number; 
    Rate: number;
    TaxAmount: number;
    TotalAmount: number;

    //master tables 
    ItemCode: string;
    ItemName: string;
    CustomerItemCode: string;
    UOM: string;
    MultiplierValue: number;
    TaxRate: number;
    MRP: number;
    CustomerID: number;
    SalesRateCardID: number;
    DiscountID: number;

}

