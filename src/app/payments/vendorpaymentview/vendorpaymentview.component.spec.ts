import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorpaymentviewComponent } from './vendorpaymentview.component';

describe('VendorpaymentviewComponent', () => {
  let component: VendorpaymentviewComponent;
  let fixture: ComponentFixture<VendorpaymentviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorpaymentviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorpaymentviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
