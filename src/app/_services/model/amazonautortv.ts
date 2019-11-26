
export class AmazonAutoRTVConfiguration {
    ConfigID: number;
    Lastmodifieddate: Date | string;
    RTVLocationID: number;
    RTVReceivingLocationID: number;
    InventoryType: string;

    FrequencyType: string;
    IsActive: boolean;
    RTVReceivingLocationName: string;
    LastModifiedByName: string;
    RTVLocationName: string;

    LoginId: number;
    CompanyDetailID: number;
}

export class AmazonAutoRTVOrder {
    RTVID: number;
    CreatedDate: Date | string;
    MerchantRemovalOrderID: string;
    SellableQuantity: number;
    UnSellableQuantity: number;

    RemoveFromFCCode: string;
    AddressName: string;
    RecordUploadStatus: string;
    RTVStatus: string;
    TrackingID: string;

    MerchantSKU: string;
    SellerSKU: string;
    Error: string;
    LoginId: number;
    CompanyDetailID: number;
}

export class MWSShipment {
    RemovalOrderID: string;
    RemovalDate: Date;
    TrackingNumber: string;
    ShipmentDate: Date | string;
    Carrier: string;

    ItemCode: string;
    ItemCode2: string;
    InventoryType: string;
    Qty: number;
    InTransitValue: number;

    ShipmentStatus: string;
    Ageing_on_Shipment: number;
}
