export class Statement {
    AmazonID: string;
    SellerName: string;
    CompanyDetailID: number;
    AmazonCreditID: number;
    StatementNumber: string;

    ShipmentID: string;
    Investments: number;
    PurchaseCost: number;
    OpeningBalance: number;
    AmazonCredits: number;

    TotalSales: number;
    TotalAmazonExpenses: number;
    JenniferReconciledAmt: number;
    GSTOutFlow: number;
    IORMargin: number;

    PayableAmt: number;
    ClosingBalance: number;
    InvestmentRecoverable: number;
    PayabletoMerchant: number;
    StatementDate: Date;

    ColumnInvestment: number;
    ColumnPurchaseCost: number;
    BalanceInvestment: number;
    PurchaseBalance: number;
    Remaining_Perc: number;

    Recover_Perc: number;
    PaidAmt: number;
    StatementOPBal: number;
    Stateopbalance: number;
    SalesAfterExp: number;

    MPCredits: number;
    Deductions: number;
    Recovered: number;
    CreditDate: Date;
    NetRevenue: number;
}
