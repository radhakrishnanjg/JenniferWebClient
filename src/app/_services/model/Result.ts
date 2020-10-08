
export class Result {
    Msg: string;
    Flag: boolean;
}


export class ItemLevelStaticData {
    Itemcode: string;
    ItemName: string;
    GrossSales: number;
    NetSales: number;
    GrossProfit: number;
    GPPercentage: number;
    AvgASP: number;
    AvgPurchasePrice: number;
}

export class ProfitLossData {
    StoreName: string;
    OrderID: string;
    SKU: string;


    COGS: number;
    Purchases: number;
    BCD: number;
    SWS: number;
    Sales: number;
    SalesReturns: number;
    GrossProfit: number;
    GrossLoss: number;
    MidTotalLeft: number;
    MidTotalRight: number;
    AmazonExpenses: number;
    FBAExpenses_Left: number;
    AdvertisementOthers_Left: number;
    IORMargin_Left: number;
    PSPMargin_Left: number;
    NetProfit: number;
    NetLoss: number;
    GrandTotalLeft: number;
    GrandTotalRight: number;
    GPLoss_Left: number;
    GPProft_Right: number;
    GP_Per: number;
    GL_Per: number;
    NP_Per: number;
    NL_Per: number;
    Revenue: number;
}


export class ItemWiseProfitLossData {
    StoreName: string;
    CompanyDetailID: number;
    ItemCode: string;
    COGS: number;
    Investment: number;
    Revenue_InclTax: number;
    Revenue_ExclTax: number;
    Exp_InclTax: number;
    Exp_ExclTax: number;
    GrossProfit_Loss: number;
    GP_Per: number;
    NetProfit: number;
    NP_Per: number; 
    MarketPlaceSellerID: string;
    OutrightFlag: number;
}
 