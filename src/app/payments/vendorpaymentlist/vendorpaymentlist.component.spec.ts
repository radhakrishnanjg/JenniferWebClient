import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorpaymentlistComponent } from './vendorpaymentlist.component';

describe('VendorpaymentlistComponent', () => {
  let component: VendorpaymentlistComponent;
  let fixture: ComponentFixture<VendorpaymentlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorpaymentlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorpaymentlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
