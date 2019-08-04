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
    IsShipmentRequired:boolean;

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
    IGSTRate: number;

    CGSTRate: number;
    SGSTRate: number;
    UTGSTRate: number;
    DiscountValue: number;
    IGSTAmount: number;

    CGSTAmount: number;
    SGSTAmount: number;
    UTGSTAmount: number;
    DirectCost: number;
    TotalTaxAmount: number;

    TotalAmountExclTax: number;
    TotalAmountInclTax: number;
    Rate: number;
    TaxAmount: number;
    TotalAmount: number;

    //master tables 
    ItemCode: string;
    ItemName:string ;
    CustomerItemCode:string;
    UOM: string;
    MultiplierValue: number; 
    TaxRate: number;
    MRP:number;
    CustomerID:number;

}

