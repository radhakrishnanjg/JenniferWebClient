
import { Brand, Category, SubCategory, ProductGroup } from "./Category";

export class Salesorder {
    SalesOrderID: number;
    FileID: number;
    CompanyDetailID: number;
    OrderID: string;
    OrderDate: any;

    LastUpdatedDate: any;
    OrderStatus: string;
    CustomerWarehouseID: number;
    IsBillTo_SameAs_ShipTo: boolean;

    CompanyID: number;
    lstItem: SalesorderItem[] = [] as any;
    lstItemUnsellable: unsellqty[] = [] as any;
    MultiplierValue: number = 1;

    ItemStatus: string;

    PaymentTermsID: number;
    DeliveryNote: string;
    BuyerOrderNo: string;
    DispatchThrough: string;

    TermsOfDelivery: string;
    InventoryType: string;

    TransactionType: string;


    Remarks: string;
    LoginId: number;

    //Master Tables
    CustomerID: number;
    CustomerName: string;
    WarehouseName: string;
    ShipTo: string;
    BilledTo: string;
    TotalAmount: number = 0.00;
    ApprovalStatus: string;
    ActionBy: string;
    ActionDate: Date;
    DiscountAllowedinDays: number;
    DiscountAllowedinDaysDesc: string;
    IsDispute: boolean;
}

export class PaymentTermType {
    PaymentTermsID: number;
    DiscountAllowedinDays: number;
    DiscountAllowedinDaysDesc: string;
}

export class SalesorderItem {
    ItemID: number;
    ItemCode: string;
    ItemName: string;
    CustomerItemCode: string;
    UOMID: number;
    DiscountID: number;
    Units: number = 0;
    MultiplierValue: number = 1;
    Qty: number = 0;
    ItemRate: number = 0.00;
    MRP: number = 0.00;
    SalesRateCardID: number;
    ShippingCharges: number = 0.00;

    Discountamt: number = 0.00;
    TotalValue: number = 0.00;
    TaxRate: number;
    TaxAmount: number;
    OtherItem: string;
    ActualItemRate: number;
    AvailableQty: number;
    DisputeType: string;
    JenniferItemSerial: string;
    Add_DiscRK: number;
    Add_DiscAmazon: number;
    TaxableValue: number;
}

export class SalesorderunsellableQty {
    lstBrand: Brand[] = [] as any;
    lstProductGroup: ProductGroup[] = [] as any;
    lstCategory: Category[] = [] as any;
    lstSubCategory: SubCategory[] = [] as any;
    lstunsellqty: unsellqty[] = [] as any;
}

export class unsellqty {
    LocationID: number;
    ItemID: number;
    SellingPrice: number;
    AvailableQty: number;
    Qty: number;


    LocationName: string;
    BrandName: string;
    ProductGroupName: string;
    CategoryName: string;
    SubCategoryName: string;
    ItemCode: string;
    TaxRate: number;
    MRP: number;
    ItemName: string;
    CustomerItemCode: string;

    DiscountID: number;
    LiquidationPercent: number;
    LiquidationRate: number;
    LiquidationValue: number;
    IsSellingPriceValueLess: Boolean;
}

export class Salesratecard {
    SalesRateCardID: number;
    CompanyDetailID: number;
    ItemID: number;
    InventoryType: string;
    SellingPrice: number;

    StartDate: Date;
    EndDate: Date;
    DeactivateDate: Date;
    IsActive: Boolean

    // task
    Msg: string;
    Flag: Boolean;
    LoginId: number;
    //Master Tables 
    ItemCode: string;

    ItemIds: number[];
}

export class EventManager {
    EventManagerID: number;
    CompanyDetailID: number;
    ItemID: number;
    StartDate: Date;
    EndDate: Date;
    DeactivateDate: Date;
    IsActive: Boolean;
    MarketplaceID: number;
    MarketPlace: string;
    IsExpense: Boolean;
    Expense: number;
    LoginId: number;
    //Master Tables 
    ItemCode: string;
    ItemIds: number[];
    StoreName: string;
}

export class Commission {
    StartDate: Date;
    EndDate: Date;
    DeactivateDate: Date;
    IsActive: Boolean;
    StoreName: string;
    CommissionPer: number;
    FixedCharges: number;
    CommissionMethod: string;
    CommissionType: string;
    SubscriptionType: string;
    //Master Tables 
    LoginId: number;
    CompanyDetailID: number;
}
export class SalesShipment {
    ShipmentOutwardID: number;
    SalesShipmentID: string;
    SalesInvoiceID: number;
    ShipmentID: string;
    InvoiceNumber: string;
    CourierID: number;
    CourierName: string;
    CourierTrackingID: string;
    AirwayBillNumber: string;
    CompanyDetailID: number;
    CompanyID: number;
    Weight: number;
    UOMID: number;
    UOM: string;
    OutwardID: string;
    GSTEwayBillNumber: string;
    LoginId: number;
}

export class InvoiceNumber {
    InvoiceNumber: string;
}
export class Shipmentoutward {
    ShipmentOutwardID: number;
    CompanyDetailID: number;
    SalesShipmentID: string;
    SalesInvoiceID: number;
    CourierName: string;

    CourierTrackingID: string;
    AirwayBillNumber: string;
    Weight: number;
    UOMID: number;
    OutwardID: string;

    GSTEwayBillNumber: string;
    IsEditable: boolean;
    // who is doing this task
    LoginId: number;
}


export class FinancialAdjustment {
    SysID: number;
    AdjustmentDate: Date;
    AdjustmentType: string;
    AdjustmentDescription: string;
    AdjustmentAmount: number;
    StatementNumber: string;
    CompanyDetailID: number;
    // own infor
    StoreName: string;
    LoginId: number;
    Action: string;
}

export class DutyDepositLedgerHeader {
    DutyDepositLedgerID: number;
    FBAShipmentID: string;
    DepositDate: Date;
    DepositAmount: number;
    CurrencyType: string;
    Remarks: string;
    ReimbursementAmount: number;
    BalanceAmount: number;
    CompanyDetailID: number;
    ReimbursementDate: Date;
    lstReimbursementDetail: DutyDepositLedgerDetail[] = [] as any;
    // own infor
    StoreName: string;
    LoginId: number;
    Action: string;
}

export class DutyDepositLedgerDetail {
    SysID: number;
    DutyDepositLedgerID: number;
    ReimbursementAmount: number;
    ReimbursementDate: Date;
    Remarks: string;
    ActionBy: string;
    ActionDate: Date;
    CompanyDetailID: number;
    // own infor
    StoreName: string;
    LoginId: number;
}