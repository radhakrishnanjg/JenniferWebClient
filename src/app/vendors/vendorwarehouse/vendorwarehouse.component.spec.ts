import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorwarehouseComponent } from './vendorwarehouse.component';

describe('VendorwarehouseComponent', () => {
  let component: VendorwarehouseComponent;
  let fixture: ComponentFixture<VendorwarehouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorwarehouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorwarehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
