import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendoritemlistComponent } from './vendoritemlist.component';

describe('VendoritemlistComponent', () => {
  let component: VendoritemlistComponent;
  let fixture: ComponentFixture<VendoritemlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendoritemlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendoritemlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
