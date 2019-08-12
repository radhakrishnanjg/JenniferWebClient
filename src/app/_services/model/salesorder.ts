
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
    SellingPrice: number = 0.00;
    MRP: number = 0.00;
    SalesRateCardID: number;
    ShippingCharges: number = 0.00;

    Discountamt: number = 0.00;
    TotalValue: number = 0.00;
    TaxRate: number;
    TaxAmount: number;
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
    SalesInvoiceID: number;
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
