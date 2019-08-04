import { PurchaseorderModule } from './purchaseorder.module';

describe('PurchaseorderModule', () => {
  let purchaseorderModule: PurchaseorderModule;

  beforeEach(() => {
    purchaseorderModule = new PurchaseorderModule();
  });

  it('should create an instance', () => {
    expect(purchaseorderModule).toBeTruthy();
  });
});
