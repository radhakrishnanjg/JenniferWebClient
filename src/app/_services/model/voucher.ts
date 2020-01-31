export class Voucher {
  VoucherID: number;
  CompanyID: number;
  StateID: number;
  GSTID: string;
  MarketPlaceID: number;
  TaxType: string;
  VoucherType: string;
  TransactionType: string;
  VoucherText: string;
  VoucherName: string;
  IsActive: boolean;

  Action: string;
  LoginId: number;
  //list screen

  StateName: string;
  MarketPlace: number;
}

export class Ledger {

  LedgerID: number;
  LedgerText: string;
  VoucherName: string;
  VoucherID: number;
  CompanyID: number;
  TaxRate: number;
  InterstateLedgerName: string;
  InterstateOutput_InputLedgerName: string;
  LocalLedgerName: string;
  LocalOutput_InputLedgerName1: string;
  LocalOutput_InputLedgerName2: string;
  IsActive: boolean;

  Action: string;
  LoginId: number;
}

export class VoucherGSTID {
  GSTID: string;
  GSTNumber:string;
}

export class LedgerTaxRate {
  TaxRate: number;
}