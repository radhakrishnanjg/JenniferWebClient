import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorwarehouselistComponent } from './vendorwarehouselist.component';

describe('VendorwarehouselistComponent', () => {
  let component: VendorwarehouselistComponent;
  let fixture: ComponentFixture<VendorwarehouselistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorwarehouselistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorwarehouselistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
