export class Picklistheader {
    PicklistID: number;
    PickListNumber: number;
    CompanyDetailID: number;
    OrderID: string;
    LocationID: number;

    InventoryType: string;
    PicklistQty: number;
    PickedQty: number;
    TransferQty: number;
    Status: string;
 
    lstSerialNums : Picklistdetail[];
    lstSummary : Picklistsummary[];

    //login info
    LoginId: number; 
    // Master table values
    LocationName: string;
}  

export class Picklistsummary {
    PicklistSummaryID: number;
    PicklistID: number;
    CompanyDetailID: number;
    ItemID: number;
    WarehouseLocation: string;

    WarehouseRack: string;
    WarehouseBin: number;
    Qty: number;
    ItemCode: string;
    PicklistQty: number;
    
    AvailableQty: number;
    ScanedQty: number; 
} 

export class Picklistdetail {
    JenniferItemSerial: string;
    Flag: boolean;
}

